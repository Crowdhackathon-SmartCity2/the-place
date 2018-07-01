import RPi.GPIO as GPIO
import time

class Ranger:
	# Constructor
	def __init__(self, trigger, echo):
		#GPIO.setmode(GPIO.BCM)
		self.trigger = trigger
		self.echo = echo
		# Setup GPIOs
		GPIO.setup(self.trigger, GPIO.OUT)
		GPIO.setup(self.echo, GPIO.IN)
	
	# Measure distance in cm
	def Measure(self):
		# Waiting for sensor to settle
		GPIO.output(self.trigger, False)
		time.sleep(2)
		GPIO.output(self.trigger, True)
		time.sleep(0.00001)
		GPIO.output(self.trigger, False)

		# Emit pulses and read times
		while GPIO.input(self.echo)==0:
		  pulse_start = time.time()

		while GPIO.input(self.echo)==1:
		  pulse_end = time.time()
		
		# Calculate time difference
		pulse_duration = pulse_end - pulse_start
		
		# Calculate distance
		distance = pulse_duration * 17150
		
		# Convert to cm
		distance = round(distance, 2)
		
		# Return distance in cm
		return distance
