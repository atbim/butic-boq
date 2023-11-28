import { BaseExtension } from './BaseExtension.js'
import { MiPrimerPanel } from './MiPrimerPanel.js'

const ISSUES_PROPERTIES = [
  'Assembly Code',
  'Length',
  'Area',
  'Volume',
  'Type Name',
]

class MiPrimeraExtension extends BaseExtension {
  constructor(viewer, options) {
    super(viewer, options)
    this._viewer = viewer
    this._panel = null
    this._button = null
  }

  load() {
    super.load()
    console.log('MiPrimeraExtension loaded.')
    return true
  }

  unload() {
    super.load()
    if (this._button) {
      this.removeToolbarButton(this._button)
      this._button = null
    }
    if (this._panel) {
      this._panel.setVisible(false)
      this._panel.uninitialize()
      this._panel = null
    }
    console.log('MiPrimeraExtension unloaded.')
    return true
  }

  onToolbarCreated() {
    this._panel = new MiPrimerPanel(this, 'issues-panel', 'Mi Primer Panel')
    this._button = this.createToolbarButton(
      'issues-button',
      'https://img.icons8.com/small/32/brief.png',
      'Issues Panel'
    )
    this._button.onClick = () => {
      this._panel.setVisible(!this._panel.isVisible())
    }
  }

  async onSelectionChanged(model, dbIds) {
    if (dbIds.length === 1) {
      const properties = await this.getPropertiesAsync(model, dbIds[0])
      const issues = await this.getIssuesAsync(dbIds[0])
      this._panel.update(properties, issues)
    } else {
      this._panel.update([], [])
    }
  }

  getIssuesAsync(dbId) {
    return new Promise(async (resolve) => {
      const res = await fetch(`/api/issues/mongo/${dbId}`)
      const json = await res.json()
      let issues = []
      for (const issue of json.data) {
        issues.push({
          category: 'Incidencias',
          name: issue.name,
          value: issue.status,
        })
      }
      resolve(issues)
    })
  }

  getPropertiesAsync(model, dbId) {
    return new Promise((resolve, reject) => {
      model.getBulkProperties(
        [dbId],
        ISSUES_PROPERTIES,
        (res) => {
          let properties = []
          for (const property of res[0].properties) {
            properties.push({
              category: 'Datos',
              name: property.displayName,
              value: property.displayValue,
            })
          }
          resolve(properties)
        },
        (err) => reject(err)
      )
    })
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  'MiPrimeraExtension',
  MiPrimeraExtension
)
