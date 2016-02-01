# Todo MVC Rx vitual-dom

## Event Stream Recording and Playback

```
// window.app
app.startRecording();

// Interact with UI ...

var recording = app.stopRecording();

app.playRecording(recording);

app.playRecording(recording, {realtime: false}); // Play recorded events immediately

app.playRecording(recording, {speed: 2}); // Play recording at 2x speed
```
