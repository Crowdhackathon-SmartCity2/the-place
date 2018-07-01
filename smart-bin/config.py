# General
BASE_PATH = '/home/pi/Apps/smart-bin/'
DEVICE_ID = 'crowdhackathon-raspberry'

# Motors
MOTORS_VERTICAL_ADDRESS = 0x0B
MOTORS_HORIZONTAL_ADDRESS = 0x0A

# Rangers
RANGER_TRIGGER = 23
RANGER_ECHO = 24

# PIR
PIR_PIN = 17

# Adafruit PN532
PN532_CS   = 8
PN532_MISO = 9
PN532_MOSI = 10
PN532_SCLK = 11
PN532_CARD_KEY = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]

# IoT Hub
IOTHUB_CONNECTION_STRING = 'HostName=crowdhackathon-iot-hub.azure-devices.net;DeviceId=crowdhackathon-raspberry;SharedAccessKey=54aZ5TkO/BSyjcwWkmEpGzeZih0Zjns5HRfpJI1Tf78='
IOTHUB_MESSAGE_TEMPLATE = '{{"deviceId": "{0}","userId": "{1}", "glass": "{2}", "metal": "{3}", "plastic": "{4}", "other": "{5}"}}'

# Classifier
GRAPH_FILENAME = '/home/pi/Apps/smart-bin/model.pb'
LABELS_FILENAME = '/home/pi/Apps/smart-bin/labels.txt'

