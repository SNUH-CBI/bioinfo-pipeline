import os
import argparse
from bs4 import BeautifulSoup


def main(directory):
    for root, subdirs, files in os.walk(directory):
        for file in files:
            if file == 'qualimapReport.html':
                file_dir = root + '/' + file

                file_read = open(file_dir, 'r', encoding='utf8')
                content = file_read.read()
                file_read.close()

                bs = BeautifulSoup(content, 'html.parser')

                for div in bs.find_all("div", {'class': 'sidebar'}):
                    div.decompose()

                result = str(bs)

                file_write = open(file_dir, 'w', encoding='utf8')
                file_write.write(result)
                file_write.close()

                print(file_dir)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', type=str, required=True)
    args = parser.parse_args()

    main(args.dir)
