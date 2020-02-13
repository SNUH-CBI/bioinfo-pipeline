import os
import argparse
import json


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', type=str, required=True)
    args = parser.parse_args()

    # files in directory
    for file_name in os.listdir(args.dir):
        if (file_name.startswith('all_DEGs_') and file_name.endswith('.csv')) or ((file_name.startswith('all') or file_name.startswith('sig')) and file_name.endswith('.txt')):
            file_dir = os.path.abspath(args.dir)
            file_path = os.path.join(file_dir, file_name)

            print('Extracting... ' + file_path)

            # extract csv, txt files
            file = open(file_path)

            num_lines = 0
            for line in file:
                if line != '':
                    num_lines += 1
            num_lines -= 1  # first line is column names

            file.close()

            result = {'line': num_lines}

            # save to json file
            file_json = open(file_path + '.metadata.json', 'w', encoding='utf-8')

            json.dump(result, file_json, indent=4, ensure_ascii=False)

            file_json.close()

    print('Done!')


if __name__ == '__main__':
    main()
