import time
import sys
import os
import config
import motor
import Ranger
import PN532
import Camera
import Classifier
import IoTHubClient
import ImageEditor
from PIL import Image
import RPi.GPIO as GPIO
import threading
from multiprocessing.pool import ThreadPool

IMAGE_COUNTER = 0

try:	
	# Setup GPIO globally
	GPIO.setmode(GPIO.BCM)
	GPIO.setwarnings(False)
	
	#Setup PIR
	GPIO.setup(config.PIR_PIN, GPIO.IN)
	
	# Setup Motors
	hMotor = motor.Motor(config.MOTORS_HORIZONTAL_ADDRESS, 1, 0.5, 0.005)
	vMotor = motor.Motor(config.MOTORS_VERTICAL_ADDRESS, 1, 0.5, 0.03)
	
	# Setup Ranger
	#ranger = Ranger.Ranger(config.RANGER_TRIGGER, config.RANGER_ECHO)
	
	# Setup Camera
	camera = Camera.Camera()
	
	# Setup Classifier
	classifier = Classifier.Classifier(config.GRAPH_FILENAME, config.LABELS_FILENAME)
	
	# Setup PN532
	pn532 = PN532.PN532(config.PN532_CS, config.PN532_MISO, config.PN532_MOSI, config.PN532_SCLK)
	
	# Setup IotHub Client
	client = IoTHubClient.IoTHubClient(config.IOTHUB_CONNECTION_STRING)
	
	# Setup Image Editor
	editor = ImageEditor.ImageEditor()
	
	garbages = {
		'glass': 0,
		'metal': 0,
		'plastic': 0,
		'other': 0
	}
	
	pool = None
	
	def vertical_front_position():
		hMotor.HoldPosition()
		time.sleep(0.1)
		vMotor.MoveDeg(-180)
		time.sleep(0.2)
		vMotor.HoldPosition()

		
	def vertical_back_position():
		hMotor.HoldPosition()
		time.sleep(0.1)
		vMotor.MoveDeg(180)
		time.sleep(0.2)
		vMotor.HoldPosition()

		
	def horizontal_throw_left():
		vMotor.HoldPosition()
		time.sleep(0.1)
		hMotor.MoveDeg(160)
		time.sleep(0.1)
		hMotor.HoldPosition()
		time.sleep(0.1)
		hMotor.MoveDeg(-160)
		time.sleep(0.1)
		hMotor.HoldPosition()
		
	def horizontal_throw_right():
		vMotor.HoldPosition()
		time.sleep(0.1)
		hMotor.MoveDeg(-150)
		time.sleep(0.1)
		hMotor.HoldPosition()
		time.sleep(0.1)
		hMotor.MoveDeg(150)
		time.sleep(0.1)
		hMotor.HoldPosition()
		
	def throw_glass():
		horizontal_throw_left()
		
	def throw_other():
		vertical_back_position()
		horizontal_throw_right()
		vertical_front_position()
		
	def throw_metal():
		vertical_back_position()
		horizontal_throw_left()
		vertical_front_position()
	
	def throw_plastic():
		horizontal_throw_right()
		
	def throw(category):
		if category == 'metal':
			throw_metal()
		elif category == 'plastic':
			throw_plastic()
		elif category == 'glass':
			throw_glass()
		else:
			throw_other()
		
	def motors_power_off():
		vMotor.PowerOff()
		hMotor.PowerOff()
	
	def motion_detected(channel):
		global IMAGE_COUNTER
		print('Motion Detected')
		
		# Disable motion detection
		GPIO.remove_event_detect(config.PIR_PIN)
		
		time.sleep(1)
		image_filename = '/home/pi/Desktop/image' + str(IMAGE_COUNTER) + '.jpg'
		camera.CaptureImage(image_filename)
		time.sleep(0.5)
		result = classifier.classify(image_filename)
		print(result)
		
		IMAGE_COUNTER = IMAGE_COUNTER + 1
		
		time.sleep(0.5)
		throw_metal()
		time.sleep(0.5)
		motors_power_off()
		
		#distance = ranger.Measure()
		#print(distance)
		
		data = pn532.ReadCard(config.PN532_CARD_KEY, 4)
		#data = "Hello World"
		print(data)
		
		print('"{0}"'.format(data))
		
		message = config.IOTHUB_MESSAGE_TEMPLATE.format("crowdhackathon-raspberry", str(data))
		print(message)
		client.SendGarbages(message)
		time.sleep(0.5)
		
	def WaitForAuthentication():
		global garbages
		count = 1
		userId = pn532.ReadCard(config.PN532_CARD_KEY, 4)
		print('{} {} {}'.format(count, userId, garbages))
		while userId is None or (garbages['glass'] + garbages['metal'] + garbages['plastic'] + garbages['other'] == 0):
			count = count + 1
			print('{} {} {}'.format(count, userId, garbages))
			if count > 3:
				return None
			userId = pn532.ReadCard(config.PN532_CARD_KEY, 4)
		message = config.IOTHUB_MESSAGE_TEMPLATE.format(config.DEVICE_ID, str(userId), garbages['glass'], garbages['metal'], garbages['plastic'], garbages['other'])
		print(message)
		client.SendGarbages(message)
		garbages = {
			'glass': 0,
			'metal': 0,
			'plastic': 0,
			'other': 0
		}
		return userId
		
	vMotor.HoldPosition()
	hMotor.HoldPosition()
	pool = ThreadPool(processes=1)
	if os.path.isfile('./classify/base.jpg'):
		os.remove('./classify/base.jpg')
	while 1:
		async_result = pool.apply_async(WaitForAuthentication, ())
		return_val = async_result.get()
		if os.path.isfile('./classify/base.jpg'):
			base_image = Image.open('./classify/base.jpg')
			camera.CaptureImage('./classify/current.jpg')
			time.sleep(0.1)
			current_image = Image.open('./classify/current.jpg')
			current_image = editor.crop_center(current_image, 50)
			if not editor.are_equal(base_image, current_image):
				print('DIFFERENT')
				camera.CaptureImage('./classify/current.jpg')
				time.sleep(0.1)
				category = classifier.classify('./classify/current.jpg')
				garbages[category] = garbages[category] + 1
				print(category)
				throw(category)
				time.sleep(0.5)
				'''
				os.remove('./classify/base.jpg')
				camera.CaptureImage('./classify/base.jpg')
				base_image = Image.open('./classify/base.jpg')
				base_image = editor.crop_center(base_image, 75)
				editor.saveImage(base_image, './classify/base.jpg')
				'''
				continue
		else:
			camera.CaptureImage('./classify/base.jpg')
			time.sleep(0.5)
			base_image = Image.open('./classify/base.jpg')
			base_image = editor.crop_center(base_image, 50)
			editor.saveImage(base_image, './classify/base.jpg')
			time.sleep(0.5)
			continue
		time.sleep(2)
	
except KeyboardInterrupt:
    # CTRL+C exit, turn of the drives
    vMotor.PowerOff()
    hMotor.PowerOff()
    camera.FlashOff()
    GPIO.cleanup()
    if pool is not None:
		pool.terminate()
    print 'Terminated'


