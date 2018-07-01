import tensorflow as tf
import os
from PIL import Image
import numpy as np
import cv2
from pathlib import Path
import Camera
import argparse
import config
import time
import ImageEditor
#import matplotlib.pyplot as plt

class Classifier:
	def __init__(self, graph_filename, labels_filename):
		self.graph_filename = graph_filename
		self.labels_filename = labels_filename	
		self.output_layer = 'loss:0'
		self.input_node = 'Placeholder:0'
		self.labels = []
		
		graph_def = tf.GraphDef()
		with tf.gfile.FastGFile(self.graph_filename, 'rb') as f:
			graph_def.ParseFromString(f.read())
			tf.import_graph_def(graph_def, name='')
		
		with open(self.labels_filename, 'rt') as lf:
			for l in lf:
				self.labels.append(l.strip())
		
	def take_training_picture(self, category):
		# read category's counter
		counter = 0
		with open(config.BASE_PATH + 'training/' + category + '.txt', 'r') as f:
			counter = int(f.readline())
							
		# build the path and filename
		filename = '%04d' % counter
		filename = category + filename + '.jpg'
		fullpath = config.BASE_PATH + 'training/' + category + '/' + filename
		print('Saving to {}'.format(fullpath))
		
		# take picture
		camera = Camera.Camera()
		camera.CaptureImage(fullpath)
		
		time.sleep(0.5)
		
		# open image and crop the center
		image = Image.open(fullpath)
		image = editor.crop_center(image, 75)
		editor.saveImage(image, fullpath)
		
		# increase category's counter
		counter = counter + 1
		with open(config.BASE_PATH + 'training/' + category + '.txt', 'w') as f:
			f.write(str(counter))
			
	def classify(self, image_filename):
		editor = ImageEditor.ImageEditor()
		image = Image.open(image_filename)
		image = editor.update_orientation(image)
		image = editor.convert_to_opencv(image)
		image = editor.resize_down_to_1600_max_dim(image)
		image = editor.crop_center_np(image, 75)
		image = editor.resize_to_square(image, 227)
		
		with tf.Session() as session:
			prob_tensor = session.graph.get_tensor_by_name(self.output_layer)
			predictions, = session.run(prob_tensor, {self.input_node: [image]})
			highest_probability_index = np.argmax(predictions)
			print('Classified: ' + self.labels[highest_probability_index]) 
			label_index = 0
			for p in predictions:
				truncated_probability = np.float64(round(p,8))
				print(self.labels[label_index], truncated_probability)
				label_index += 1
			
			return self.labels[highest_probability_index]
			
if __name__ == '__main__':
	parser = argparse.ArgumentParser(description='Classifier')
	parser.add_argument('-t', '--train', choices=['glass', 'metal', 'plastic', 'other'], default='glass', help='take training picture of category')
	parser.add_argument('-c', '--classify', action='store_true', help='take picture and classify')
	args = parser.parse_args()
	
	
	classifier = Classifier(config.GRAPH_FILENAME, config.LABELS_FILENAME)
	if args.classify:
		camera = Camera.Camera()
		camera.CaptureImage('/home/pi/Apps/smart-bin/classify.jpg')
		time.sleep(0.5)
		classifier.classify('/home/pi/Apps/smart-bin/classify.jpg')
	else:
		classifier.take_training_picture(args.train)
		
		
