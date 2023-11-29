export class CustomPanel extends Autodesk.Viewing.UI.DockingPanel {
  constructor(viewer, container, id, title, options) {
    super(container, id, title, options)
    this.init()
  }

  init() {
    // the style of the docking panel
    // use this built-in style to support Themes on Viewer 4+
    this.container.classList.add('docking-panel-container-solid-color-a')
    this.container.style.top = '10px'
    this.container.style.left = '10px'
    this.container.style.width = 'auto'
    this.container.style.height = 'auto'
    this.container.style.resize = 'auto'

    // this is where we should place the content of our panel
    var div = document.createElement('div')
    div.style.margin = '20px'
    if (this.options.isChart) {
      div.innerHTML = `
        <canvas id="${this.options.divid}"></canvas>`
    } else {
      div.id = this.options.divid
    }
    this.container.appendChild(div)
    // and may also append child elements...
  }
}
