# Mendix Simple React Widget - Hello World

A simple Mendix 7 widget using React and Webpack (based on the MendixLabs [Range Slider](https://github.com/mendixlabs/range-slider) widget.

## Features
* Simple widget containing a single React component that takes a string.

## Dependencies
Mendix 7.4

## How Do I Use It?
Place the widget in the context of an object that has a string attribute.

Set the widgets 'Message attribute' to the context objects string attribute.

Run your project and see the string value displayed on screen.

## Messing Around With The Code
Prerequisite: Install git, node package manager and webpack CLI

To clone via git.

    > git clone https://github.com/t-fitz/mendix-dnbSimpleReactWidget.git

... or download the project using the 'Clone or download' button.

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

The entry point for the code is `src\components\HelloWorld.ts`.

To set up the development environment, run:

    > npm install

To build a dev-friendly version run:

    > npm run build-dev

To automatically compile the widget while developing:

    > npm run build-watch

To build a minified production version run:

    > npm run build-prod

Code will be built in the `dist` folder. 
* A widget `.mpk` file gets placed in a folder relating to the version number in the `package.json` (eg. 0.0.1). 
* The transpiled Typescript code gets built into the `build` folder