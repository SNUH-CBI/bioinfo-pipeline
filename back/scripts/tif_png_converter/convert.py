import os
import argparse
from PIL import Image


def recursive(directory):
    for root, subdirs, files in os.walk(directory):
        for file in files:
            # split file name
            file_name = '.'.join(file.split('.')[:-1])
            file_extension = file.split('.')[-1].lower()

            if file_extension == 'tif' or file_extension == 'tiff':
                # file directories
                input_file = root + '/' + file
                file_png = root + '/' + file_name + '.png'

                print(input_file)
                image = Image.open(input_file)

                # save png
                output_file = image.convert('RGB')
                output_file.save(file_png, 'PNG', quality=100)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', type=str, required=True)
    args = parser.parse_args()

    recursive(args.dir)
