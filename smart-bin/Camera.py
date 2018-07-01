from picamera import PiCamera
from time import sleep
from brightpi import *
import os

class Camera:
	def __init__(self):
		self.camera = PiCamera()
		self.flash = BrightPi()
		self.leds = (1, 2, 3, 4)
		self.flash.reset()
	
	def CaptureImage(self, path):
		self.flash.set_led_on_off(self.leds, 1)
		self.camera.start_preview()
		sleep(2)
		self.camera.capture(path)
		self.camera.stop_preview()
		self.flash.set_led_on_off(self.leds, 0)

	def FlashOff(self):
		self.flash.set_led_on_off(self.leds, 0)
