#!/bin/bash


if which nodejs >/dev/null; then
	echo "Nodejs and NPM already installed"
else
    echo "nodejs does not exist"
	sudo apt-get update
	sudo apt-get install nodejs npm
fi

cd hda
npm install
sudo npm install create-react-app -g

cd ../hda-server
npm install
cd ../

if which compile >/dev/null; then
	echo "HDA already installed"
else
	echo "Installing HDA ..."
	sudo ln -s hda-server/hda/compile /bin/compile
	sudo ln -s hda-server/hda/compile-arm /bin/compile-arm
	echo "{}" > hda-server/hda/sources.json
fi
