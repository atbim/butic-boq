import { BaseExtension } from './BaseExtension.js'
import { CustomPanel } from './CustomPanel.js'
import { initTreeBoq } from '../boq.js'
import { initChart } from '../charts.js'

class CustomExtension extends BaseExtension {
  constructor(viewer, options) {
    super(viewer, options)
    this._viewer = viewer
    this._panel = null
    this._panelLocationLine = null
    this._button = null
    this._button2 = null
  }

  load() {
    super.load()
    console.log('CustomExtension loaded.')
    return true
  }

  unload() {
    // TODO: Borrar los paneles
    super.unload()
    if (this._button) {
      this.removeToolbarButton(this._button)
      this._button = null
    }
    if (this._button2) {
      this.removeToolbarButton(this._button2)
      this._button2 = null
    }
    console.log('CustomExtension unloaded.')
    return true
  }

  onToolbarCreated() {
    this._panel = new CustomPanel(
      this._viewer,
      this._viewer.container,
      'customPanel',
      'Custom Panel',
      { divid: 'customdiv' }
    )
    this._panelLocationLine = new CustomPanel(
      this._viewer,
      this._viewer.container,
      'locationLinePanel',
      'Location Line Panel',
      { divid: 'locationLineChart', isChart: true }
    )
    this._button = this.createToolbarButton(
      'custom-button',
      'https://img.icons8.com/small/32/phone.png',
      'Custom Panel'
    )
    this._button2 = this.createToolbarButton(
      'chart-button',
      'https://img.icons8.com/small/32/brick-wall.png',
      'Location Line Panel'
    )
    this._button.onClick = () => {
      this._panel.setVisible(!this._panel.isVisible())
      initTreeBoq('#customdiv', this._viewer)
    }
    this._button2.onClick = () => {
      this._panelLocationLine.setVisible(!this._panelLocationLine.isVisible())
      initChart('locationLineChart', this._viewer)
    }
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  'CustomExtension',
  CustomExtension
)
