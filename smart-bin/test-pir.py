import time
import RPi.GPIO as GPIO
import config

# Setup GPIO globally
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(config.PIR_PIN, GPIO.IN)


def motion_detected(channel):
		global IMAGE_COUNTER
		print('Motion Detected')
		
		# Disable motion detection
		GPIO.remove_event_detect(config.PIR_PIN)
		time.sleep(2)
		print('Listening for motion')
		GPIO.add_event_detect(config.PIR_PIN, GPIO.RISING, callback=motion_detected)


print('Listening for motion...')
GPIO.add_event_detect(config.PIR_PIN, GPIO.RISING, callback=motion_detected)
while 1:
	time.sleep(100)
