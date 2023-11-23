const getJSON = async (url) => {
  const resp = await fetch(url)
  if (!resp.ok) {
    alert('Could not load tree data. See console for more details.')
    console.error(await resp.text())
    return []
  }
  return resp.json()
}

const createTreeNode = (id, text, icon, children = false) => {
  return { id, text, children, itree: { icon } }
}

const getHubs = async () => {
  const hubs = await getJSON('/api/hubs')
  return hubs.map((hub) =>
    createTreeNode(`hub|${hub.id}`, hub.attributes.name, 'icon-hub', true)
  )
}

const getProjects = async (hubId) => {
  const projects = await getJSON(`/api/hubs/${hubId}/projects`)
  return projects.map((project) =>
    createTreeNode(
      `project|${hubId}|${project.id}`,
      project.attributes.name,
      'icon-project',
      true
    )
  )
}

const getContents = async (hubId, projectId, folderId = null) => {
  const contents = await getJSON(
    `/api/hubs/${hubId}/projects/${projectId}/contents` +
      (folderId ? `?folder_id=${folderId}` : '')
  )
  return contents.map((item) => {
    if (item.type === 'folders') {
      return createTreeNode(
        `folder|${hubId}|${projectId}|${item.id}`,
        item.attributes.displayName,
        'icon-my-folder',
        true
      )
    } else {
      return createTreeNode(
        `item|${hubId}|${projectId}|${item.id}`,
        item.attributes.displayName,
        'icon-item',
        true
      )
    }
  })
}

const getVersions = async (hubId, projectId, itemId) => {
  const versions = await getJSON(
    `/api/hubs/${hubId}/projects/${projectId}/contents/${itemId}/versions`
  )
  return versions.map((version) =>
    createTreeNode(
      `version|${version.id}`,
      version.attributes.createTime,
      'icon-version'
    )
  )
}

const getItemTip = async (hubId, projectId, itemId) => {
  const url = `/api/hubs/${hubId}/projects/${projectId}/contents/${itemId}/tip`
  const version = await getJSON(url)
  return version
}

const getIssues = async (project) => {
  const containerId = project.split('.')[1]
  const url = `api/issues/${containerId}`
  const issues = await getJSON(url)
  console.log('issues: ', issues)
}

export const initTree = (selector, onSelectionChanged) => {
  // See http://inspire-tree.com
  const tree = new InspireTree({
    data: function (node) {
      if (!node || !node.id) {
        return getHubs()
      } else {
        const datos = node.id.split('|')
        switch (datos[0]) {
          case 'hub':
            return getProjects(datos[1])
          case 'project':
            return getContents(datos[1], datos[2])
          case 'folder':
            return getContents(datos[1], datos[2], datos[3])
          case 'item':
            return getVersions(datos[1], datos[2], datos[3])
          default:
            return []
        }
      }
    },
  })
  tree.on('node.click', async (event, node) => {
    event.preventTreeDefault()
    const datos = node.id.split('|')
    if (datos[0] === 'version') {
      console.log('datos: ', datos)
      onSelectionChanged(datos[1])
    } else if (datos[0] === 'project') {
      getIssues(datos[2])
    } else if (datos[0] === 'item') {
      const version = await getItemTip(datos[1], datos[2], datos[3])
      onSelectionChanged(version)
      console.log(version)
    }
  })
  return new InspireTreeDOM(tree, { target: selector })
}
