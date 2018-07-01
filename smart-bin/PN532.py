import Adafruit_PN532 as PN
import binascii
import sys

class PN532:
	def __init__(self, CS, MISO, MOSI, SCLK):
		# Create and initialize an instance of the PN532 class.
		self.pn532 = PN.PN532(cs=CS, sclk=SCLK, mosi=MOSI, miso=MISO)
		self.pn532.begin()

		# Get the firmware version from the chip and print(it out.)
		ic, ver, rev, support = self.pn532.get_firmware_version()
		print('Found PN532 with firmware version: {0}.{1}'.format(ver, rev))

		# Configure PN532 to communicate with MiFare cards.
		self.pn532.SAM_configuration()


	def ReadCard(self, key, block):
		print('Waiting for SMART card...')
		uid = self.pn532.read_passive_target()
		if uid is None:
			return None

		print('Found card with UID: 0x{0}'.format(binascii.hexlify(uid)))

		# Authenticate block
		if not self.pn532.mifare_classic_authenticate_block(uid, block, PN.MIFARE_CMD_AUTH_B, key):
			print('Failed to authenticate with card!')
			return None

		# Read block data        
		data = self.pn532.mifare_classic_read_block(block)
		if data is None:
			print('Failed to read data from card!')
			return None
			
		return data
	
	def WriteCard(self, key, block, mydata):
		print('Place the card to be written on the PN532...')
		uid = self.pn532.read_passive_target()
		while uid is None:
			uid = self.pn532.read_passive_target()

		print('Found card with UID: 0x{0}'.format(binascii.hexlify(uid)))
		print('Writing card (DO NOT REMOVE CARD FROM PN532)...')

		# Authenticate block
		if not self.pn532.mifare_classic_authenticate_block(uid, block, PN.MIFARE_CMD_AUTH_B, key):
			print('Error! Failed to authenticate block {0}.'.format(block))
			return False

		# Prepare the data
		data = bytearray(16)
		data[0:len(mydata)] = mydata#.encode('UTF-8')

		# Write the card.
		if not self.pn532.mifare_classic_write_block(block, data):
			print('Error! Failed to write to the card.')
			return False
		print('Wrote card successfully! You may now remove the card from the PN532.')
		return True

'''
if __name__ == '__main__':
	import config
	pn = PN532(8, 9, 10, 11)
	pn.WriteCard(config.PN532_CARD_KEY, 4, 'ID-0001')
'''
	





