var Rx = require('rx'),
    Immutable = require('seamless-immutable'),
    RxWidget = require('./rx-widget'),
    TodoList = require('./todo-list'),
    genId = require('./gen-id');

require('todomvc-app-css/index.css');

class Todo {
  constructor(container) {
    this.container = container;
    this.eventBus = new Rx.Subject();
    this.recording = null;
    this.state = null;
    this.stateSnapshot = null;
  }

  startRecording() {
    let start = new Date();
    this.eventBus.takeWhile((event) => {
      return event.action !== 'stopRecording';
    }).map((event) => {
      return event.set('_recordingDelay', new Date() - start);
    }).toArray().subscribe(
      (recording) => { this.recording = Immutable(recording).asMutable({deep: true}); },
      (error) => { console.error('[Recording]', error); },
      () => { console.debug('[Recording] done'); }
    );
  }

  stopRecording() {
    this.emit({ action: 'stopRecording' });
    return this.recording;
  }

  playRecording(recording0, options0) {
    let options = _.merge({realTime: true, speed: 1}, options0),
        recording;

    if(options.realTime) {
      recording = Rx.Observable.from(recording0).flatMap((event) => {
        return Rx.Observable.just(Immutable(event).without('_recordingDelay'))
          .delay(event._recordingDelay / options.speed);
      });
    } else {
      recording = Rx.Observable.from(recording0);
    }

    recording.subscribe(
      (event) => { this.eventBus.onNext(event); },
      (error) => { console.error('[Playback]', error); },
      () => { console.debug('[Playback] done'); }
    );
  }

  currentState() {
    this.emit({action: 'stateSnapshot'});
    return this.stateSnapshot.asMutable();
  }

  replaceState(state) {
    this.emit({action: 'replaceState', state: state});
  }

  emit(event) {
    return this.eventBus.onNext(Immutable(event));
  }

  init() {
    let initial = Immutable({
          show: 'all',
          todos: {}
        });

    this.state = this.eventBus.scan((acc, event) => {
      switch(event.action) {
      case 'create':
        return acc.setIn(['todos', genId()], {
          text: event.text,
          editing: false,
          completed: false
        });
      case 'edit':
        return acc.setIn(['todos', event.id, 'editing'], true);
      case 'unedit':
        return acc.setIn(['todos', event.id, 'editing'], false);
      case 'save':
        return acc.setIn(['todos', event.id, 'editing'], false)
          .setIn(['todos', event.id, 'text'], event.text);
      case 'uncomplete':
        return acc.setIn(['todos', event.id, 'completed'], false);
      case 'complete':
        return acc.setIn(['todos', event.id, 'completed'], true);
      case 'destroy':
        return acc.setIn(['todos'], acc.todos.without([event.id]));
      case 'clearCompleted':
        let removeIds = _.flatMap(_.toPairs(acc.todos), ([id, todo]) => {
          if(todo.completed) {
            return [id];
          } else {
            return [];
          }
        });
        return acc.setIn(['todos'], acc.todos.without(removeIds));
      case 'toggelAll':
        return acc.setIn(['todos'], Immutable(_.toPairs(acc.todos)).map(([id, todo]) => {
          return [id, todo.set('completed', event.completed)];
        }).asObject());
      case 'show':
        return acc.setIn(['show'], event.show);
      case 'stateSnapshot':
        this.stateSnapshot = acc;
        return acc;
      case 'replaceState':
        return event.state;
      default:
        return acc;
      }
    }, initial);

    // if debug
    this.eventBus.subscribe((e) => { console.debug('[Commands]', e); },
                            (e) => { console.error('[Commands]', e); },
                            () => { console.debug('[Commands]', 'Completed'); });

    this.state.subscribe((e) => { console.debug('[View]', e); },
                              (e) => { console.error('[View]', e); },
                              () => { console.debug('[View]', 'Completed'); });

    let root = new TodoList((e) => { return this.emit(e); }, this.state),
        widget = new RxWidget(this.state, (opts) => { return root.render(opts); }, initial);

    this.container.appendChild(widget.init());
  }
}

module.exports = Todo;
