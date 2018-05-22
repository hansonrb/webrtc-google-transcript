// var streams = require('memory-streams');
// var reader = new streams.ReadableStream('');
// reader.pipe(process.stdout);
//
// for (var i = 0; i < 1000; i++) {
//   reader.append('random string\n');
// }


var streams = require('memory-streams');
var writer = new streams.WritableStream();
var fs = require('fs');

writer = fs.createWriteStream('./test.wav');
const record = require('node-record-lpcm16');

record
  .start({
    sampleRateHertz: 16000,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
  })
  .on('error', console.error)
  .pipe(writer);
//
// console.log(writer.toString('hex'));
