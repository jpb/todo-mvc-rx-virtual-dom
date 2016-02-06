import StateWidget from './state-widget';

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
        emit = (action) =>
          (ev) => { this.emit({action: action, id: id})},
        input = new StateWidget(
          // generateState
          () => {
            console.debug('[Input state] generate state', item.text);
            let subject = new Rx.Subject(),
                subscription = subject.debounce(200).subscribe(
                  save,
                  (e) => console.error(e),
                  () => console.debug('[Input state] Completed', item.text)
                );
            return { subject: subject, subscription: subscription };
          },
          // render
          (state) => (<input class="edit"
                        value={ item.text }
                        autofocus={ item.editing ? true : undefined }
                        ev-blur={ emit('unedit') }
                        ev-keyup={ (ev) => state.subject.onNext(ev) } />),
          // destroy
          (state) => {
            console.debug('[Input state] destroy', item.text);
            state.subject.onCompleted();
            state.subscription.dispose();
          });

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
        { input }
      </li>
    )
  }

}

module.exports = TodoItem;
