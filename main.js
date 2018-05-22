try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported.');
}

var constraints = window.constraints = {
  audio: true,
  video: false
};

$(document).ready(() => {
  console.log('document.ready');

  const button = $("button#control");

  button.click(() => {
    if (button.text() === 'Start') {
      console.log('Start Recording, API calls');

      navigator.mediaDevices.getUserMedia(constraints).
          then(handleSuccess).catch(handleError);

      button.text('Stop').addClass('stop').removeClass('start');
    } else {
      if (window.script) {
        window.script.onaudioprocess = function() {};
      }
      if (window.socket) {
        window.socket.readyState && window.socket.send('end');
        window.socket.readyState && window.socket.close();
      }

      button.text('Start').removeClass('stop').addClass('start');
    }
  })
});

function handleSuccess(stream) {
  // var socket = new WebSocket("wss://cloudspeech.goog/ws");
  var socket = new WebSocket("ws://localhost:12345/");

  socket.binaryType = "arraybuffer";
  socket.onopen = function() {
    // socket.send(JSON.stringify({
    //   format: "LINEAR16",
    //   language: 'en-US',
    //   punctuation: true,
    //   rate: 44100
    // }));

    socket.send('start');
  }

  var audioTracks = stream.getAudioTracks();

  stream.oninactive = function() {
    console.log('Stream ended');
  };

  window.stream = stream; // make variable available to browser console
  // audio.srcObject = stream;

  var script = window.audioContext.createScriptProcessor(4096, 1, 1);

  script.onaudioprocess = function(event) {
    var input = event.inputBuffer.getChannelData(0) || new Float32Array(4096);

    for (var idx = input.length, newData = new Int16Array(idx); idx--;)
      newData[idx] = 32767 * Math.min(1, input[idx]);

    if (socket.readyState === 1) {
      // console.log(newData);
      // socket.send(newData.buffer);
      socket.send(newData);
    }
  }

  socket.onmessage = function(b) {
    const data = JSON.parse(b.data);
    // console.log(data);

    if (data.isFinal) {
      $(".output-final").append(
        "<p>" + data.text + "</p>"
      );
    } else {
      $(".output").text(data.text);
    }
  };

  var mic = window.audioContext.createMediaStreamSource(stream);
  mic.connect(script);
  script.connect(window.audioContext.destination);

  window.socket = socket;
  window.script = script;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}
