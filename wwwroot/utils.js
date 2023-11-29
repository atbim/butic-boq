export const getLeafNodesAsync = (viewer) => {
  return new Promise((resolve) => {
    viewer.model.getObjectTree((tree) => {
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

export const getCategoriesDataToChartAsync = (viewer, dbIds) => {
  return new Promise((resolve, reject) => {
    viewer.model.getBulkProperties(
      dbIds,
      ['Category'],
      (res) => {
        let data = new Map()
        for (const item of res) {
          const category = item.properties[0].displayValue
          // 1) tengo que comprobar si en map existe mi category actual
          if (data.has(category)) {
            // 2) si existe le vamos a añadir al array de value el dbId
            data.get(category).push(item.dbId)
          } else {
            // 3) si NO existe vamos a crear un nuevo item en Map con el key Category y value un array con el dbId
            data.set(category, [item.dbId])
          }
        }
        resolve(data)
      },
      (err) => reject(err)
    )
  })
}

export const getWallsLocationLineAsync = (viewer, dbIds) => {
  return new Promise((resolve, reject) => {
    viewer.model.getBulkProperties(
      dbIds,
      ['Category', 'Location Line'],
      (res) => {
        let data = new Map()
        for (const item of res) {
          const category = item.properties.find(
            (x) => x.displayName === 'Category'
          ).displayValue
          if (category === 'Revit Walls') {
            const locationLine = item.properties.find(
              (x) => x.displayName === 'Location Line'
            ).displayValue
            if (data.has(locationLine)) {
              data.get(locationLine).push(item.dbId)
            } else {
              data.set(locationLine, [item.dbId])
            }
          }
        }
        console.log('locationLines: ', data)
        resolve(data)
      },
      (err) => reject(err)
    )
  })
}

export const hslaStringToRgb = (hslaString) => {
  // Extract values from the HSLA string using a regular expression
  const match = hslaString.match(
    /hsla\(\s*(\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\s*\)/
  )

  if (!match) {
    throw new Error('Invalid HSLA string format')
  }

  // Extracted values
  const h = parseInt(match[1], 10)
  const s = parseFloat(match[2]) / 100
  const l = parseFloat(match[3]) / 100
  const a = parseFloat(match[4])

  // Convert HSLA to RGBA using the previously defined function
  return hslaToRgb(h, s, l, a)
}

const hslaToRgb = (h, s, l, a) => {
  // Ensure hue is between 0 and 360
  h = (h + 360) % 360

  // Normalize saturation and lightness to be between 0 and 1
  s = Math.max(0, Math.min(1, s))
  l = Math.max(0, Math.min(1, l))

  // Formula to convert HSLA to RGBA
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r, g, b
  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  // Convert to 8-bit values
  r = Math.round((r + m))
  g = Math.round((g + m))
  b = Math.round((b + m))

  return new THREE.Vector4(r, g, b, a)
}