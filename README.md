# atom-flags

A script for modifing the web-preferences(or chrome://flags) of your atom-editor via commandline.


## Why I need atom-flags?

As is well known, atom-editor cannot modify any flags option in all released versions. But there must be a lot of developers want to trim some options to ensure that atom can work better. For instance, if I intend to enable the MacType (a font-beautify plugin under Windows), I have to disable the `direct-write` option so that MacType can works normally.


## How does it works?

Developed by node.js via ES6/Babel and working at command line.
It was based on [atom/asar](https://github.com/atom/asar) project. First, extract the core asar file of atom to a temporary directory. Then modifing the web-preferences options in `/src/browser/atom-window.js` according to the user's command. Finally, it will repack a new asar file and overwrite the origin file. (A buckup made at the same time)


## Usage

```sh
// Install git/node/npm first
git clone https://github.com/wspl/atom-flags.git
cd atom-flags
npm install
npm install -g babel-cli
npm install babel-preset-es2015
babel-node --presets es2015 ./lib/main.js
```


In General, it will search the atom editor automatically for Windows users. If you are linux or OS X user, you should use the command "locate <path-to-app.asar>".


#### get \<key\>
Get a value by flag name.

#### set \<key\> \<value\>
Set the value of flag or create a new flag with value.

#### del \<key\>
Remove a flag.

#### list
Show all flags.

#### locate \<path-to-app.asar\>
Set a new location of `app.asar` file.

#### save
Save the `app.asar`.


## License

Apache-2.0
