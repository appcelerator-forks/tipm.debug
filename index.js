
// patch the global console
// to default strip formatting

require('tipm-console');

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
