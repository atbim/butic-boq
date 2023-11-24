let _viewer
const parameter = 'Assembly Code'

const getLeafNodesAsync = () => {
  return new Promise((resolve) => {
    _viewer.model.getObjectTree((tree) => {
      let leaves = []
      tree.enumNodeChildren(
        tree.getRootId(),
        (dbId) => {
          if (tree.getChildCount(dbId) === 0) {
            leaves.push(dbId)
          }
        },
        true
      )
      resolve(leaves)
    })
  })
}

const getItemsAsync = async () => {
  const dbIds = await getLeafNodesAsync()
  return new Promise((resolve, reject) => {
    _viewer.model.getBulkProperties(
      dbIds,
      [parameter],
      (instances) => {
        let items = new Set()
        for (const intance of instances) {
          items.add(intance.properties[0].displayValue)
        }
        resolve(items)
      },
      (err) => reject(err)
    )
  })
}

const getDbIdsFromItemAsync = async (itemId) => {
  const dbIds = await getLeafNodesAsync()
  return new Promise((resolve, reject) => {
    _viewer.model.getBulkProperties(
      dbIds,
      [parameter],
      (res) => {
        let dbIds = []
        for (const item of res) {
          if (item.properties[0].displayValue === itemId) {
            dbIds.push(item.dbId)
          }
        }
        resolve(dbIds)
      },
      (err) => reject(err)
    )
  })
}

const getGroupItemsAsync = async () => {
  const items = await getItemsAsync()
  let groupItems = new Set()
  for (const item of items) {
    groupItems.add(item.charAt(0))
  }
  return Array.from(groupItems)
    .filter((x) => x !== '')
    .sort()
}

const getCapitulos = async () => {
  // MUY IMPORTANTE que la función sea
  const groupItems = await getGroupItemsAsync()
  return groupItems.map((gi) => {
    return {
      type: 'capitulo',
      id: gi,
      text: `Capitulo ${gi}`,
      children: true,
    }
  })
}

const getPartidas = async (id) => {
  // MUY IMPORTANTE que la función sea asyncrona
  const rawItems = await getItemsAsync()
  const items = Array.from(rawItems).filter((x) => x.startsWith(id))

  return items.map((item) => {
    return {
      type: 'partida',
      id: item,
      text: item,
    }
  })
}

export const initTreeBoq = (selector, viewer) => {
  _viewer = viewer
  // See http://inspire-tree.com
  const tree = new InspireTree({
    data: (node) => {
      if (!node) {
        return getCapitulos()
      } else {
        return getPartidas(node.id)
      }
    },
  })
  tree.on('node.click', async (event, node) => {
    event.preventTreeDefault()
    switch (node.type) {
      case 'capitulo':
        console.log('he clicado en un capitulo')
        break
      case 'partida':
        const dbIds = await getDbIdsFromItemAsync(node.id)
        _viewer.isolate(dbIds)
        _viewer.fitToView(dbIds)
        break
    }
  })
  return new InspireTreeDOM(tree, { target: selector })
}
