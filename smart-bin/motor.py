import time
import ThunderBorg

class Motor:
	# Constructor
	def __init__(self, i2cAddress, maxPower, holdingPower, stepDelay):			
		# Order for stepping when moving
		self.sequence = [
			[+maxPower, +maxPower],
			[+maxPower, -maxPower],
			[-maxPower, -maxPower],
			[-maxPower, +maxPower]]
		
		# Order for stepping when holding
		self.sequenceHold = [
				[+holdingPower, +holdingPower],
				[+holdingPower, -holdingPower],
				[-holdingPower, -holdingPower],
				[-holdingPower, +holdingPower]] 
		
		# Init motor
		self.motor = ThunderBorg.ThunderBorg()
		self.motor.i2cAddress = i2cAddress
		self.motor.Init()
		
		# Exit if motor initialization failed
		if not self.motor.foundChip:
			boards = ThunderBorg.ScanForThunderBorg()
			if len(boards) == 0:
				print 'No ThunderBorg found, check you are attached :)'
			else:
				print 'No ThunderBorg at address %02X, but we did find boards:' % (self.motor.i2cAddress)
				for board in boards:
					print '    %02X (%d)' % (board, board)
				print 'If you need to change the IC address change the setup line so it is correct, e.g.'
				print 'TB.i2cAddress = 0x%02X' % (boards[0])
			sys.exit(-1)
		 
		 # Init rest variables
		self.degPerStep = 1.8
		self.stepDelay = stepDelay
		self.step = -1
		
	# Function to move X steps
	def MoveSteps(self, count):
		# Choose direction based on sign (+/-)
		if count < 0:
			dir = -1
			count *= -1
		else:
			dir = 1
		
		# Loop through the steps
		while count > 0:
			# Set a starting position if this is the first move
			if self.step == -1:
				drive = self.sequence[-1]
				self.motor.SetMotor1(drive[0])
				self.motor.SetMotor2(drive[1])
				self.step = 0
			else:
				self.step += dir

			# Wrap step when we reach the end of the sequence
			if self.step < 0:
				self.step = len(self.sequence) - 1
			elif self.step >= len(self.sequence):
				self.step = 0

			# For this step set the required drive values
			if self.step < len(self.sequence):
				drive = self.sequence[self.step]
				self.motor.SetMotor1(drive[0])
				self.motor.SetMotor2(drive[1])
			time.sleep(self.stepDelay)
			#print MainTB.GetDriveFault1()
			#print MainTB.GetDriveFault2()
			count -= 1

			
	# Function to switch to holding power
	def HoldPosition(self):
		# For the current step set the required holding drive values
		if self.step < len(self.sequence):
			drive = self.sequenceHold[self.step]
			self.motor.SetMotor1(drive[0])
			self.motor.SetMotor2(drive[1])
	
	# Function to move based on an angular distance
	def MoveDeg(self, angle):
		count = int(angle / float(self.degPerStep))
		self.MoveSteps(count)
		self.HoldPosition()
		
	def PowerOff(self):
		self.motor.MotorsOff()
