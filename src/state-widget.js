import Rx from 'rx';
import createElement from 'virtual-dom/create-element';

class StateWidget {
  /*
   * generateState :: () -> state
   * render :: state -> vdom-node
   * destroy :: state -> void
   */
  constructor (generateState, render, destroy) {
    this.type = "Widget";
    this.generateState = generateState;
    this.render = render;
    this._destroy = destroy;
    this.state = null;
  }

  init() {
    this.state = this.generateState();
    return createElement(this.render(this.state));
  }

  update(previousWidget, domNode) {
    this.state = previousWidget.state;
    return null;
  }

  destroy(domNode) {
    this._destroy(this.state);
  }

}

module.exports = StateWidget;
