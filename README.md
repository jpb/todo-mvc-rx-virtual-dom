# Todo MVC Rx vitual-dom

## Development

1. `npm start`
2. Go to: [localhost:8080](http://localhost:8080)

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

## State Snapshotting

```
// Interact with UI ...

// window.app
var state = app.currentState();

// `JSON.stringify(state)` and copy `state` to another tab (or refresh the current tab)

app.replaceState(state);
```
