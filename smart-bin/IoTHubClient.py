import iothub_client as iot
import config
import time

class IoTHubClient:
	def __init__(self, connection_string):
		self.client = iot.IoTHubClient(connection_string, iot.IoTHubTransportProvider.MQTT)
		print(self.client)
		self.client.set_option("product_info", "HappyPath_RaspberryPi-Python")
		# set the time until a message times out
		#self.client.set_option("messageTimeout", MESSAGE_TIMEOUT)
		self.client.set_option("logtrace", 0)
		self.client.set_message_callback(self.receive_message_callback, 0)
		#self.client.set_device_twin_callback(device_twin_callback, TWIN_CONTEXT)
		#self.client.set_device_method_callback(device_method_callback, METHOD_CONTEXT)
	
	def send_confirmation_callback(self, message, result, userContext):
		print "Confirmation[%d] received for message with result = %s" % (userContext, result)

	def receive_message_callback(self, message, counter):
		buffer = message.get_bytearray()
		size = len(buffer)
		print "Received Message"
		print "    Data: <<<%s>>> & Size=%d" % (buffer[:size], size)
		return iot.IoTHubMessageDispositionResult.ACCEPTED
	
	def SendGarbages(self, data):
		message = iot.IoTHubMessage(data)
		self.client.send_event_async(message, self.send_confirmation_callback, 0)
		

if __name__ == '__main__':
	client = IoTHubClient(config.IOTHUB_CONNECTION_STRING)
	message = config.IOTHUB_MESSAGE_TEMPLATE.format("crowdhackathon-raspberry", 'ID-1')
	client.SendGarbages(message)
	time.sleep(5)


