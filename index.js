var ep = require('errorback-promise');
var ContextKeeper = require('audio-context-singleton');

async function micToBuffer({
  onRecordingStart,
  onEnded,
  onError,
  maxSeconds = 60
}) {
  if (!navigator.mediaDevices) {
    callNextTick(
      onError,
      new Error('Recording is not supported in this browser.')
    );
    return;
  }

  var contextKeeper = ContextKeeper();

  var result = await ep(contextKeeper.getNewContext);
  if (result.error) {
    callNextTick(onError, result.error);
    return;
  }
  var audioCtx = result.values[0];

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(useStream)
    .catch(onError);

  function useStream(audioStream) {
    var recordingBuffer = new AudioBuffer({
      length: maxSeconds * audioCtx.sampleRate,
      numberOfChannels: 1,
      sampleRate: audioCtx.sampleRate
    });
    var recordingBufferLength = 0;

    var recorder = audioCtx.createScriptProcessor(4096, 1, 1);
    recorder.onaudioprocess = saveChunk;
    let source = audioCtx.createMediaStreamSource(audioStream);
    source.connect(recorder);
    // If you create a ScriptProcessorNode with no
    // destination, it will never get audioprocess events.
    recorder.connect(audioCtx.destination);
    callNextTick(onRecordingStart, stopRecording);

    function stopRecording() {
      callNextTick(sendBuffer);
    }

    function saveChunk(e) {
      var channelData = new Float32Array(e.inputBuffer.length);
      e.inputBuffer.copyFromChannel(channelData, 0, 0);
      recordingBuffer.copyToChannel(channelData, 0, recordingBufferLength);
      recordingBufferLength += channelData.length;
    }

    function sendBuffer() {
      onEnded(copyAudioBuffer(recordingBuffer, recordingBufferLength));
    }

    function copyAudioBuffer(src, length) {
      var dest = new AudioBuffer({
        length,
        numberOfChannels: 1,
        sampleRate: src.sampleRate
      });

      var pcmData = src.getChannelData(0).slice(0, length);

      dest.copyToChannel(pcmData, 0, 0);
      return dest;
    }
  }
}

function callNextTick() {
  var args = Array.prototype.slice.call(arguments, 1);
  var fn = arguments[0];
  setTimeout(makeCall, 0);

  function makeCall() {
    fn.apply(fn, args);
  }
}

module.exports = micToBuffer;
