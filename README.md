mic-to-buffer
==================

Lets you record from the mic in the browser, then get an AudioBuffer of that recording.

Installation
------------

    npm install mic-to-buffer

Usage
-----

    import micToBuffer from 'mic-to-buffer';

    var stopRecordingFn;

    // When the user clicks a button to start recording,
    // call micToBuffer.
    function onRecordAudioClick() {
      micToBuffer({ onEnded: save, onError: handleError, onRecordingStart });
    }

    // Save the stopRecording callback for later.
    function onRecordingStart(stopRecording) {
      stopRecordingFn = stopRecording;
    }

    // When the user clicks a button to stop recording,
    // call this callback.
    function onStopRecordingClick() {
      stopRecordingFn();
    }

    // Do something with the buffer, like creating a
    // blob that can be used in an <audio> element.
    function save(audioBuffer) {
      console.log('hey', audioBuffer);
      blob = new Blob([toWav(audioBuffer)]);
    }

License
-------

The MIT License (MIT)

Copyright (c) 2020 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
