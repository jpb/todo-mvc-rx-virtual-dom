diff          = require 'virtual-dom/diff'
patch         = require 'virtual-dom/patch'
createElement = require 'virtual-dom/create-element'

createPatcher = (render) ->
  calculatePatches = (acc, newState) ->
    newTree = render newState

    state   : newState,
    vTree   : newTree,
    patches : diff acc.vTree, newTree

class RxWidget
  constructor: (source, render, initialState) ->
    @seed = vTree: render initialState
    @_patchObs = source.scan createPatcher(render), @seed

  init: ->
    domNode = createElement @seed.vTree # mutates
    @_patcherSubscription = @_patchObs
      .pluck 'patches'
      .subscribe (patches) -> patch(domNode, patches)
    domNode

  destroy: -> @_patcherSubscription.dispose() if @_patcherSubscription

module.exports = RxWidget
