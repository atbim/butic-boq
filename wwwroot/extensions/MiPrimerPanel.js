export class MiPrimerPanel extends Autodesk.Viewing.UI.PropertyPanel {
  constructor(extension, id, title) {
    super(extension.viewer.container, id, title)
    this.extension = extension
  }

  update(properties, issues) {
    this.removeAllProperties()
    for (const property of properties) {
      this.addProperty(property.name, property.value, property.category)
    }
    for (const issue of issues) {
      this.addProperty(issue.name, issue.value, issue.category)
    }
  }
}
