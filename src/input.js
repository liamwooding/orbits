class InputController {
  constructor () {
    this._keys = {}

    document.addEventListener('keydown', e => {
      this._keys[e.key] = true
    })

    document.addEventListener('keyup', e => {
      this._keys[e.key] = false
    })
  }

  get keys () {
    return this._keys
  }
}

export let Input = new InputController()