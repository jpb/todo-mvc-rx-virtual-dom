var _ = require('lodash'),
    Immutable = require('seamless-immutable'),
    TodoItem = require('./todo-item');

class TodoList {
  constructor(emit, eventBus) {
    this.emit = emit;
    this.eventBus = eventBus;
  }


  toggelAll(completed) {
    this.emit({
      action: 'toggelAll',
      completed: completed
    });
  }

  todoList(show, activeItems, completedItems, allItems) {
    let todos;

    switch(show) {
      case 'active':
        todos = activeItems;
        break;
      case 'completed':
        todos = completedItems;
        break;
      case 'all':
      default:
        todos = allItems;
        break;
    }

    if(todos.length > 0) {
      let todoItems = _.map(todos, (item) => {
        let todoItem = new TodoItem(this.emit, this.eventBus);
        return todoItem.render(item);
      });
      return (
        <section class="main">
          <input class="toggle-all"
            type="checkbox"
            checked={ completedItems.length === allItems.length ? true : undefined }
            ev-click={ (ev) => { this.toggelAll(completedItems.length !== allItems.length) }}
          />
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            { todoItems }
          </ul>
        </section>
      );
    } else {
      return [];
    }
  }

  create(ev) {
    if(ev.keyCode == 13) {
      this.emit({
        action: 'create',
        text: ev.target.value
      });
      ev.target.value = '';
    }
  }

  clearButton() {
    return (
      <button class="clear-completed"
        ev-click={ (ev) => { this.emit({action: 'clearCompleted'}); }}>
        Clear completed
      </button>
    );
  }

  render(opts) {
    let activeItems = _.filter(_.toPairs(opts.todos), ([id, item]) => { return !item.completed; }),
        completedItems = _.filter(_.toPairs(opts.todos), ([id, item]) => { return item.completed; }),
        allItems = _.toPairs(opts.todos);

    return (
      <div>
        <section class="todoapp">
          <header class="header">
            <h1>todos</h1>
            <input class="new-todo"
              ev-keyup={ (ev) => { return this.create(ev); } }
              placeholder="What needs to be completed?" />
          </header>
          { this.todoList(opts.show, activeItems, completedItems, allItems) }
          <footer class="footer">
            <span class="todo-count"><strong>{ activeItems.length }</strong> item{ activeItems.length != 1 ? 's' : '' } left</span>
            <ul class="filters">
              <li>
                <a class={ opts.show === 'all' ? 'selected' : '' }
                  href="#/"
                  ev-click={ (ev) => { this.emit({action: 'show', show: 'all'}) } }>All</a>
              </li>
              <li>
                <a class={ opts.show === 'active' ? 'selected' : '' }
                  href="#/active"
                  ev-click={ (ev) => { this.emit({action: 'show', show: 'active'}) } }>Active</a>
              </li>
              <li>
                <a class={ opts.show === 'completed' ? 'selected' : '' }
                  href="#/completed"
                  ev-click={ (ev) => { this.emit({action: 'show', show: 'completed'}) } }>Completed</a>
              </li>
            </ul>
            { completedItems.length > 0 ? this.clearButton() : '' }
          </footer>
        </section>
        <footer class="info">
          <p>Double-click to edit a todo</p>
          <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
          <p>Created by <a href="http://github.com/jpb">you</a></p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
      </div>
    );
  }
}

module.exports = TodoList;
