from PIL import Image, ImageChops
import numpy as np
import argparse
import cv2
import math
import operator

class ImageEditor:
	def __init__(self):
		self.HISTOGRAM_THRESSHOLD = 1000
		self.HISTOGRAM_COUNTER_THRESSHOLD = 15
		
	# retrieve Structural Similarity Index (SSIM)
	'''
	def get_ssim(self, filename_a, filename_b):
		image_a = cv2.imread(filename_a)
		image_b = cv2.imread(filename_b)
		
		gray_a = cv2.cvtColor(image_a, cv2.COLOR_BGR2GRAY)
		gray_b = cv2.cvtColor(image_b, cv2.COLOR_BGR2GRAY)
		
		(score, diff) = compare_ssim(gray_a, gray_b, full=True)
		print('SSIM: {}'.format(score))
		return score
	'''
	# check if images are equal
	def are_equal(self, image_a, image_b):
		histogram_a = image_a.histogram()
		histogram_b = image_b.histogram()
		print('{} {}'.format(len(histogram_a), len(histogram_b)))
		counter = 0
		for i in range(0, len(histogram_a)):
			if math.fabs(histogram_a[i] - histogram_b[i]) > self.HISTOGRAM_THRESSHOLD:
				counter = counter + 1
		print(counter)
		if counter > self.HISTOGRAM_COUNTER_THRESSHOLD:
			return False
		return True
				
		
	def rms_diff(self, image_a, image_b):
		diff = ImageChops.difference(image_a, image_b)
		h = diff.histogram()
		sq= (value*(idx**2) for idx, value in enumerate(h))
		sum_of_squares = sum(sq)
		rms = math.sqrt(sum_of_squares / float(image_a.size[0] * image_a.size[1]))
		print rms
		return rms
	
	# open image, crop and save
	def crop_center(self, image, offset):
		w, h = image.size
		min_dim = min(w, h)
		crop = min_dim // 2
		startx = w//2 - (crop//2)
		starty = h//2 - (crop//2)
		area = (startx + offset, starty + offset, startx + crop - offset, starty + crop - offset)
		image = image.crop(area)
		return image
		
	def crop_center_np(self, image, offset):
		h, w = image.shape[:2]
		min_dim = min(w, h)
		crop = min_dim // 2
		startx = w//2 - (crop//2)
		starty = h//2 - (crop//2)
		area = (startx + 75, starty + 75, startx + crop - 75, starty + crop - 75)
		image = image[area[1]:area[3], area[0]:area[2]]
		return image
		
		
	def saveImage(self, image, filename):
		image.save(filename)
			
	# Convert RGB -> BGR and image to opencv image
	def convert_to_opencv(self, image):
		r, g, b = np.array(image).T
		opencv_image = np.array([b, g, r]).transpose()
		return opencv_image
	
	# Resize image
	def resize_down_to_1600_max_dim(self, image):
		h, w = image.shape[:2]
		if (h < 1600 and w < 1600):
			return image_cget
		
		new_size = (1600 * w // h, 1600) if (h > w) else (1600, 1600 * h // w)
		return cv2.resize(image, new_size, interpolation = cv2.INTER_LINEAR)
		
	def resize_to_square(self, image, dim):
		h, w = image.shape[:2]
		return cv2.resize(image, (dim, dim), interpolation = cv2.INTER_LINEAR)

	# Update orientation of image
	def update_orientation(self, image):
		exif_orientation_tag = 0x0112
		if hasattr(image, '_getexif'):
			exif = image._getexif()
			if (exif != None and exif_orientation_tag in exif):
				orientation = exif.get(exif_orientation_tag, 1)
				# orientation is 1 based, shift to zero based and flip/transpose based on 0-based values
				orientation -= 1
				if orientation >= 4:
					image = image.transpose(Image.TRANSPOSE)
				if orientation == 2 or orientation == 3 or orientation == 6 or orientation == 7:
					image = image.transpose(Image.FLIP_TOP_BOTTOM)
				if orientation == 1 or orientation == 2 or orientation == 5 or orientation == 6:
					image = image.transpose(Image.FLIP_LEFT_RIGHT)
		return image
		

if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('-f', '--first', required=True, help='the first image')
	parser.add_argument('-s', '--second', required=True, help='the second image')
	args = parser.parse_args()

	editor = ImageEditor()
	editor.are_equal(args.first, args.second)
	
	editor.rms_diff(args.first, args.second)
