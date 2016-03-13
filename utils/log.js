import log4js from 'log4js'

function getLineAndFile(offset) {
  var stack = new Error().stack.split('\n');
  var line = stack[(offset || 1) + 1].split(':');
  var file = line[0].substr(line[0].lastIndexOf('(')+1);
  file = file.substr(file.lastIndexOf(' ')+1);
  file = file.substr(file.lastIndexOf('/')+1);
  return {
    file: file,
    line: parseInt(line[line.length - 2], 10)
  };
}

const $depth = 11;
log4js.configure({
  appenders: [{
    category: "console",
    type: "console",
    layout: {
      type: "pattern",
      pattern: "%[[%d{ISO8601}] (%x{line}) %p -%] %m",
      tokens: {
        line: function() {
          // The caller:
          var obj = getLineAndFile(10);
          return obj.file+', '+obj.line;
          // return ''
        }
      }
    }
  }, {
    category: "czf",
    type: "file",
    filename: "./czf.log",
    maxLogSize: 1024000
  }]
});

const log = log4js.getLogger('console');

log.__defineGetter__('__LINE__', function() {
  return getLineAndFile(2).line;
});
log.__defineGetter__('__FILE__', function() {
  return getLineAndFile(2).file;
});

log.setLevel('TRACE');

export default log