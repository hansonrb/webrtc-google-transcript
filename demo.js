/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

// Put variables in global scope to make them available to the browser console.
// var audio = document.querySelector('audio');
var button = document.querySelector('button');

// console.log(button);
// button.addEventListener('click', function() {
//   button.value = 'Stop';
// });

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

function handleSuccess(stream) {

  // var socket = new WebSocket("wss://cloudspeech.goog/ws");

  socket.binaryType = "arraybuffer";
  socket.onopen = function() {
    socket.send(JSON.stringify({
      format: "LINEAR16",
      language: 'en-US',
      punctuation: true,
      rate: 44100
    }));
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

    if (socket.readyState) {
      socket.send(newData.buffer);
    }
  }

  socket.onmessage = function(b) {
      const data = JSON.parse(b.data);
      console.log(data)
      // b.isFinal ? a.transcripts[0].results ? (a.set("transcripts.0.tempResult", null), a.push("transcripts.0.results", b.text)) : a.setResults_([b.text]) : (a.resultsReady = !0, a.set("transcripts.0.isEnabled", !0), a.set("transcripts.0.tempResult", b.text))
  };

  var mic = window.audioContext.createMediaStreamSource(stream);
  mic.connect(script);
  script.connect(window.audioContext.destination);
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
