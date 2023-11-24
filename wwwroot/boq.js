let _viewer

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
        _viewer.model.getBulkProperties(dbIds, ['Código de montaje'], instances => {
            let items = new Set()
            for (const intance of instances) {
                items.add(intance.properties[0].displayValue)
            }
            resolve(items)
        }, err => reject(err))
    })
}

const getCapitulos = async () => {
    // MUY IMPORTANTE que la función sea
    const test = await getItemsAsync()
    console.log('test: ', test)
  const capitulos = [
    { type: 'capitulo', id: 1, text: 'Capitulo 1', children: true },
    { type: 'capitulo', id: 2, text: 'Capitulo 2', children: true },
    { type: 'capitulo', id: 3, text: 'Capitulo 3', children: true },
    { type: 'capitulo', id: 4, text: 'Capitulo 4', children: true },
  ]
  return capitulos
}

const getPartidas = async (id) => {
  // MUY IMPORTANTE que la función sea asyncrona
  const partidas = [
    { type: 'partida', text: `Partida ${id}.1` },
    { type: 'partida', text: `Partida ${id}.2` },
    { type: 'partida', text: `Partida ${id}.3` },
  ]
  return partidas
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
        console.log('he clicade un una partida')
        break
    }
  })
  return new InspireTreeDOM(tree, { target: selector })
}
