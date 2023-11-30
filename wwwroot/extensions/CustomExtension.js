import { BaseExtension } from './BaseExtension.js'
import { CustomPanel } from './CustomPanel.js'
import { initTreeBoq } from '../boq.js'
import { initChart, updateChart } from '../charts.js'
import {
  getLeafNodesAsync,
  getCategoriesDataToChartAsync,
  getWallsLocationLineAsync,
} from '../utils.js'

class CustomExtension extends BaseExtension {
  constructor(viewer, options) {
    super(viewer, options)
    this._viewer = viewer
    this._panel = null
    this._panelLocationLine = null
    this._button = null
    this._button2 = null
    this._chartCategories = null
    this._chartLocations = null
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
      'dashboard-panel',
      'Dashboard',
      { divid: 'locationLineChart', divid2: 'categoriesChart', isChart: true }
    )
    this._button = this.createToolbarButton(
      'custom-button',
      'https://img.icons8.com/small/32/phone.png',
      'Custom Panel'
    )
    this._button2 = this.createToolbarButton(
      'chart-button',
      'https://img.icons8.com/small/32/brick-wall.png',
      'Open Dashboard'
    )
    this._button.onClick = () => {
      this._panel.setVisible(!this._panel.isVisible())
      initTreeBoq('#customdiv', this._viewer)
    }
    this._button2.onClick = async () => {
      this._panelLocationLine.setVisible(!this._panelLocationLine.isVisible())
      const dbIds = await getLeafNodesAsync(this._viewer)
      const dataCategories = await getCategoriesDataToChartAsync(
        this._viewer,
        dbIds
      )
      const dataLocations = await getWallsLocationLineAsync(this._viewer, dbIds)
      this._chartLocations = await initChart(
        'locationLineChart',
        this._viewer,
        dataLocations
      )
      this._chartCategories = await initChart(
        'categoriesChart',
        this._viewer,
        dataCategories
      )
    }
  }

  async onModelLoaded() {
    const dbIds = await getLeafNodesAsync(this._viewer)
    const dataCategories = await getCategoriesDataToChartAsync(
      this._viewer,
      dbIds
    )
    const dataLocations = await getWallsLocationLineAsync(this._viewer, dbIds)
    updateChart(this._chartCategories, dataCategories)
    updateChart(this._chartLocations, dataLocations)
  }

  async onIsolationChanged(model, dbIds) {
    const dataCategories = await getCategoriesDataToChartAsync(
      this._viewer,
      dbIds
    )
    const dataLocations = await getWallsLocationLineAsync(this._viewer, dbIds)
    updateChart(this._chartCategories, dataCategories)
    updateChart(this._chartLocations, dataLocations)
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  'CustomExtension',
  CustomExtension
)
