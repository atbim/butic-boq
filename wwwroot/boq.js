import { getLeafNodesAsync } from "./utils.js"

let _viewer
const parameter = 'Assembly Code'
let totalAmountHtml

const getData = async (url) => {
  const res = await fetch(url)
  const json = await res.json()
  return json.data
}

const getItemsAsync = async () => {
  const dbIds = await getLeafNodesAsync(_viewer)
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
  const dbIds = await getLeafNodesAsync(_viewer)
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

const getQuantityFromItemAsync = async (dbIds, parameter) => {
  return new Promise((resolve, reject) => {
    _viewer.model.getBulkProperties(
      dbIds,
      [parameter],
      (res) => {
        let quantity = 0.0
        for (const item of res) {
          quantity += item.properties[0].displayValue
        }
        resolve(quantity)
      },
      (err) => reject(err)
    )
  })
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

const getTotalAmountAsync = async () => {
  // 1) Llamar al servidor para que me devuelva todas las partidas mediante fetch
  const res = await fetch('/api/items')
  const json = await res.json()
  const items = json.data

  // 2) Hacer un foreach o for para recorrer todas las partidas
  let totalAmount = 0.0
  for (const item of items) {
    // 3) Calcular el quantity de la partida y sumarlo en una variable
    const dbIds = await getDbIdsFromItemAsync(item.code)
    const quantity =
      item.parameter === 'Count'
        ? dbIds.length
        : await getQuantityFromItemAsync(dbIds, item.parameter)
    totalAmount += quantity * item.price
  }

  // 4) Escribir el sumatorio total, primero en consola y luego en un div dentro de mi sidebar
  totalAmountHtml.textContent = `El importe total son: ${totalAmount.toFixed(
    2
  )} €`
}

export const initTreeBoq = (selector, viewer) => {
  _viewer = viewer
  totalAmountHtml = document.getElementById('totalAmount')
  totalAmountHtml.textContent = 'Calculando Importe total...'
  setTimeout(() => {
    getTotalAmountAsync()
  }, 5000)
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
        const data = await getData(`/api/items/${node.id}`)
        if (data) {
          const quantity =
            data.parameter === 'Count'
              ? dbIds.length
              : await getQuantityFromItemAsync(dbIds, data.parameter)

          const amount = quantity * data.price
          console.log('amount: ', amount)
        } else {
          console.log(
            'La partida seleccionada no está registrada en la Base de Precios.'
          )
        }
        _viewer.isolate(dbIds)
        _viewer.fitToView(dbIds)
        break
    }
  })
  return new InspireTreeDOM(tree, { target: selector })
}
