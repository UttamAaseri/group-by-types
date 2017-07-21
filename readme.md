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
		inputDir : "/var/www/files",
		outputDir : "/var/www/public",
		removeOriginal : false //false by deault
}

//Be careful when using removeOriginal option, it will delete original files if set to true
//Output directory should exists
 
groupByTypes(opt);

```

