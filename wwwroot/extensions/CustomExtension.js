import { BaseExtension } from './BaseExtension.js'
import { CustomPanel } from './CustomPanel.js'
import { initTreeBoq } from '../boq.js'

class CustomExtension extends BaseExtension {
  constructor(viewer, options) {
    super(viewer, options)
    this._viewer = viewer
    this._panel = null
    this._button = null
  }

  load() {
    super.load()
    console.log('CustomExtension loaded.')
    return true
  }

  unload() {
    super.unload()
    if (this._button) {
      this.removeToolbarButton(this._button)
      this._button = null
    }
    console.log('CustomExtension unloaded.')
    return true
  }

  onToolbarCreated() {
    this._panel = new CustomPanel(
      this._viewer,
      this._viewer.container,
      'customPanel',
      'Custom Panel'
    )
    this._button = this.createToolbarButton(
      'custom-button',
      'https://img.icons8.com/small/32/phone.png',
      'Custom Panel'
    )
    this._button.onClick = () => {
      this._panel.setVisible(!this._panel.isVisible())
      initTreeBoq('#customdiv', this._viewer)
    }
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  'CustomExtension',
  CustomExtension
)
