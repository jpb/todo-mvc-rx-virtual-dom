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
  }

  emit(event) {
    return this.eventBus.onNext(Immutable(event));
  }

  init() {

    let initial = Immutable({
          show: 'all',
          todos: {}
        }),
        viewEvents = this.eventBus.scan((acc, event) => {
          var result = null;
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
          default:
            return acc;
          }
        }, initial);

    // if debug
    this.eventBus.subscribe((e) => { console.debug('[Commands]', e); },
                            (e) => { console.error('[Commands]', e); },
                            () => { console.debug('[Commands]', 'Completed'); });

    viewEvents.subscribe((e) => { console.debug('[View]', e); },
                         (e) => { console.error('[View]', e); },
                         () => { console.debug('[View]', 'Completed'); });

    let root = new TodoList((e) => { return this.emit(e); }, viewEvents),
        widget = new RxWidget(viewEvents, (opts) => { return root.render(opts); }, initial);

    this.container.appendChild(widget.init());
  }
}

module.exports = Todo;
