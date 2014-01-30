
# debug

  tiny node.js debugging utility modeled after node core's debugging technique.

## Installation

  Install with [component(1)](http://component.io):

    $ component install tipm/debug

## Usage

 With `debug` you simply invoke the exported function to generate your debug function, passing it a name which will determine if a noop function is returned, or a decorated `console.log`, so all of the `console` format string goodies you're used to work fine. A unique color is selected per-function for visibility.
 
Example _app.js_:

// enable debug loggers

DEBUG='http worker';

```js
var debug = require('debug')('http')
  , name = 'My App';

// fake app

debug('booting %s', name);

setInterval(function(){
  debug('debug is working');
}, 1000);

// fake worker of some kind

require('./worker');
```

Example _worker.js_:

```js
var debug = require('debug')('worker');

setInterval(function(){
  debug('doing some work');
}, 1000);
```

 The __DEBUG__ global variable set in your `app.js` is then used to enable these based on space or comma-delimited names. Here are some examples:

  ![debug http and worker](http://f.cl.ly/items/18471z1H402O24072r1J/Screenshot.png)

  ![debug worker](http://f.cl.ly/items/1X413v1a3M0d3C2c1E0i/Screenshot.png)

## Millisecond diff

  When actively developing an application it can be useful to see when the time spent between one `debug()` call and the next. Suppose for example you invoke `debug()` before requesting a resource, and after as well, the "+NNNms" will show you how much time was spent between calls.

  ![](http://f.cl.ly/items/2i3h1d3t121M2Z1A3Q0N/Screenshot.png)

  ![](http://f.cl.ly/items/112H3i0e0o0P0a2Q2r11/Screenshot.png)
  
## Conventions

 If you're using this in one or more of your libraries, you _should_ use the name of your library so that developers may toggle debugging as desired without guessing names. If you have more than one debuggers you _should_ prefix them with your library name and use ":" to separate features. For example "bodyParser" from Connect would then be "connect:bodyParser". 

## Wildcards

  The "*" character may be used as a wildcard. Suppose for example your library has debuggers named "connect:bodyParser", "connect:compress", "connect:session", instead of listing all three with `DEBUG='connect:bodyParser,connect.compress,connect:session'`, you may simply do `DEBUG='connect:*'`, or to run everything using this module simply use `DEBUG='*'`.

  You can also exclude specific debuggers by prefixing them with a "-" character.  For example, `DEBUG='* -connect:*'` would include all debuggers except those starting with "connect:".


## Credits

  Based on [TJ Holowaychuk's](https://github.com/visionmedia) [debug](https://github.com/visionmedia/debug)

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.