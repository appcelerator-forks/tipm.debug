;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Main definitions.
 */

require.mains = {};

/**
 * Define a main.
 */

require.main = function(name, path){
  require.mains[name] = path;
};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if ('/' == path.charAt(0)) path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  if (require.mains[path]) {
    paths = [path + '/' + require.mains[path]];
  }

  for (var i = 0, len = paths.length; i < len; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) {
      return path;
    }
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0, len = path.length; i < len; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var root = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(root, path);
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("tipm-console/index.js", function(exports, require, module){



var globalCtx = (function(){ return this; })();

// reset the global console object

globalCtx.console = {};

var reset = '\u001b[0G\u001b[2K\u001b[0G';

/**
 * [log description]
 * @return {[type]} [description]
 */

globalCtx.console.log = function(){
  var args  = Array.prototype.slice.call(arguments,0);
  args.unshift(reset);

  Function.prototype.apply.call(Ti.API.info, console, args);
};

/**
 * [debug description]
 * @return {[type]} [description]
 */

globalCtx.console.debug = function(){
  var args  = Array.prototype.slice.call(arguments,0);
  args.unshift(reset);

  Function.prototype.apply.call(Ti.API.debug, console, args);
};

/**
 * [error description]
 * @return {[type]} [description]
 */

globalCtx.console.error = function(){
  var args  = Array.prototype.slice.call(arguments,0);
  args.unshift(reset);

  Function.prototype.apply.call(Ti.API.error, console, args);
};

/**
 * [trace description]
 * @return {[type]} [description]
 */

globalCtx.console.trace = function(){
  var args  = Array.prototype.slice.call(arguments,0);
  args.unshift(reset);

  Function.prototype.apply.call(Ti.API.trace, console, args);
};

/**
 * [warn description]
 * @return {[type]} [description]
 */

globalCtx.console.warn = function(){
  var args  = Array.prototype.slice.call(arguments,0);
  args.unshift(reset);

  Function.prototype.apply.call(Ti.API.warn, console, args);
};

});
require.register("debug/index.js", function(exports, require, module){

// patch the global console
// to default strip formatting

require("tipm-console");

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Colors.
 */

var colors = [6, 2, 3, 4, 5, 1];

/**
 * Previous debug() call.
 */

var prev = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function color() {
  return colors[prevColor++ % colors.length];
}

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) { return function(){}; }

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date();
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    var c = color();

    fmt = coerce(fmt);

    var curr = new Date();
    var ms = curr - (prev[name] || curr);
    prev[name] = curr;

    fmt = '  \u001b[9' + c + 'm' + name + ' '
      + '\u001b[3' + c + 'm\u001b[90m'
      + fmt + '\u001b[3' + c + 'm'
      + ' +' + debug.humanize(ms) + '\u001b[0m';

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    console.log && Function.prototype.apply.call(console.log, console, arguments);
  };
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) { return (ms / hour).toFixed(1) + 'h'; }
  if (ms >= min) { return (ms / min).toFixed(1) + 'm'; }
  if (ms >= sec) { return (ms / sec | 0) + 's'; }
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) { return val.stack || val.message; }
  return val;
}

/**
 * check if the global `DEBUG` var is set
 */

(function(){
  (this.DEBUG || '')
    .split(/[\s,]+/)
    .forEach(function(name){
      name = name.replace('*', '.*?');
      if (name[0] === '-') {
        debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
      } else {
        debug.names.push(new RegExp('^' + name + '$'));
      }
    });
})();

});if (typeof exports == "object") {
  module.exports = require("debug");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("debug"); });
} else {
  this["debug"] = require("debug");
}})();