# HoneyWell Software Assistant
![alt text](logo.png)
<br/>
<br/>
The assistant has three modules or subparts:<br/>
* React Web Application
* Backend Server(Built on Nodejs)
* "logger.h" header file

The Softwares Required for running the assistant on your machine are 
* Nodejs
* React

### Installation of Node 

```sh
$ sudo apt-get update
$ sudo apt-get install nodejs

```
If the package in the repositories suits your needs, this is all you need to do to get set up with Node.js. In most cases, you'll also want to also install npm, which is the Node.js package manager. You can do this by typing:

```sh
$ sudo apt-get install npm

```
### Installing React Framework on the machine
<br/>

#### Quick Overview

```sh
npm  install create-react-app //For linux based systems

```

*([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))*

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.<br>
When you’re ready to deploy to production, create a minified bundle with `npm run build`.

<p align='center'>
<img src='https://cdn.rawgit.com/facebook/create-react-app/27b42ac/screencast.svg' width='600' alt='npm start'>
</p>

#### Get Started Immediately

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code

#### Running the Assistant

**You’ll need to have Node >= 6 on your local development machine** (but it’s not required on the server). You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to easily switch Node versions between different projects.



Change the directory to go inside assistant project, you can run some built-in commands which are mentioned below to run the project

#### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

<p align='center'>
<img src='https://cdn.rawgit.com/marionebl/create-react-app/9f62826/screencast-error.svg' width='600' alt='Build errors'>
</p>


