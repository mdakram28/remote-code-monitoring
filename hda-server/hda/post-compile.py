import sys
import os
import json
from pprint import pprint
from shutil import move, copyfile

def get_source_path(sourceFile):
	abspath = os.path.abspath(sourceFile)
	return os.path.split(abspath)

args = sys.argv[1:]
if len(args) == 0:
	print("Empty arguments supplied")
	exit(1)
args = " ".join(args)
args = args[:args.index(' -')].split()

source_files = []
source_path = get_source_path(args[0])[0]

for file_path in args:
	path, file = get_source_path(file_path)
	source_files.append(file)

for file in source_files:
	gcno_file = file[:file.rindex('.')] + ".gcno"
	move(gcno_file, os.path.join(source_path, 'cov_files', gcno_file))