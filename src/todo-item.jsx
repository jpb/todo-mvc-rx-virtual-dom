class TodoItem {
  constructor(emit, eventBus) {
    this.emit = emit;
    this.eventBus = eventBus;
  }

  cssClass(item) {
    if (item.completed === true) {
      return 'completed';
    } else if (item.editing === true) {
      return 'editing';
    } else {
      return '';
    }
  }

  render([id, item]) {
    let cssClass = this.cssClass(item),
        save = (ev) => {
          if(ev.keyCode == 13) {
            this.emit({
              id: id,
              action: 'save',
              text: ev.target.value
            });
          }
        },
        emit = (action) => { return (ev) => { this.emit({action: action, id: id})}};
    return (
      <li class={ cssClass }>
        <div class="view">
          <input class="toggle"
            type="checkbox"
            ev-click={ emit(item.completed ? 'uncomplete' : 'complete') }
            checked={ item.completed ? true : undefined } />
          <label ev-dblclick={ emit('edit') }>{ item.text }</label>
          <button class="destroy" ev-click={ emit('destroy') }></button>
        </div>
        <input class="edit"
          value={ item.text }
          ev-keyup={ save }
          ev-blur={ emit('unedit') }
          autofocus={ item.editing ? true : undefined }/>
      </li>
    )
  }

}

module.exports = TodoItem;
