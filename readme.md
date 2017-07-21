# group-by-types

> Group files into folders by their extension type


## Install

```
$ npm install --save group-by-types
```

## Usage

```js
var groupByTypes = require('group-by-types');

var opt = {
	inputDir: "/var/www/files",
	outputDir: "/var/www/public", //default to inputDir
	removeOriginal: false         //false by deault
}

//Be careful when using removeOriginal option, it will delete original files if set to true
//Output directory should exists
//Skips directories in inputDir


groupByTypes(opt, (err, success) => {
	if (err) console.log(err);
	else console.log(success);
});

//Callback is optional
groupByTypes(opt)

```

