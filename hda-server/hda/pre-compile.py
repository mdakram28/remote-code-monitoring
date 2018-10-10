import sys
import os
import json
from pprint import pprint

script_path = (os.path.dirname(os.path.realpath(__file__)))

def get_source_path(sourceFile):
	abspath = os.path.abspath(sourceFile)
	return os.path.split(abspath)

def get_sources_json_path():
	return os.path.join(script_path, "sources.json")

args = sys.argv[1:]

if len(args) == 0:
	print("Empty arguments supplied")
	exit(1)

args = " ".join(args)
args = args[:args.index(' -')].split()

source_path, source_file = get_source_path(args[0])
source_files = []

for file_path in args:
	path, file = get_source_path(file_path)
	source_files.append(file)

print("Source path  : "+ source_path)
print("Source files : "+ str(source_files))
print("sources.json : "+get_sources_json_path())

data = {}
try:
	with open(get_sources_json_path()) as f:
		data = json.load(f)
		if source_path in data:
			data[source_path].extend(source_files)
			data[source_path] = list(set(data[source_path]))
		else:
			data[source_path] = source_files
except:
	print("Error reading sources.json")
	data[source_path] = source_files

print(json.dumps(data, sort_keys=True, indent=4))
print("----------------------------------------")
with open(get_sources_json_path(), 'w+') as outfile:
	json.dump(data, outfile)

cov_files_path = os.path.join(source_path, 'cov_files')
if not os.path.exists(cov_files_path):
	os.makedirs(cov_files_path)