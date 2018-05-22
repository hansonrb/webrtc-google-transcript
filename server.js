const WebSocket = require('ws');
const Speech = require('@google-cloud/speech');
const fs = require('fs');
const streams = require('memory-streams');
const util = require('util');
const tempfile = 'temp/stream.wav';

let wsInstance = null;

const request = {
  config: {
    encoding: 'LINEAR16',
    // sampleRateHertz: 16000,
    sampleRateHertz: 44100,
    languageCode: 'en-US',
    // enableWordTimeOffsets: true,
    enableAutomaticPunctuation: true,
    model: 'default',
  },
  interimResults: true, // If you want interim results, set this to true
  verbose: true,
};

const client = new Speech.SpeechClient();

const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {
    if (data.results && data.results[0]) {
      wsInstance &&
        wsInstance.send(
          JSON.stringify({
            isFinal: data.results[0].isFinal,
            text: data.results[0].alternatives[0].transcript,
          })
        );
    }
  });

console.log('Connected to google cloud speech api and ready to accept stream');

// var reader = fs.createReadStream('./test.wav');
// reader.pipe(recognizeStream);

var reader = new streams.ReadableStream('');
// var writer = fs.createWriteStream('./test2.wav');
// reader.pipe(writer);

// --- socket ---
const wss = new WebSocket.Server({ port: 12345 });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    if (message === 'start') {
      reader.pipe(recognizeStream);
      // reader.pipe(process.stdout);
      console.log('streaming into google');
    } else if (message === 'end') {
      console.log('\n\n\n======================\nstop');
    } else {
      // const buf = Buffer.from(message);
      // console.log(util.inspect(message));
      reader.append(message);
    }
  });

  wsInstance = ws; // ws.send('something');
});
console.log('WebSocket is ready to accept audio streaming');
