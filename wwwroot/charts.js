import {
  getLeafNodesAsync,
  getCategoriesDataToChartAsync,
  getWallsLocationLineAsync,
  hslaStringToRgb,
} from './utils.js'

export const initChart = async (selector, viewer) => {
  const dbIds = await getLeafNodesAsync(viewer)
  //const data = await getCategoriesDataToChartAsync(viewer, dbIds)
  const data = await getWallsLocationLineAsync(viewer, dbIds)
  const ctx = document.getElementById(selector)

  const labels = Array.from(data.keys())
  const values = labels.map((val) => data.get(val).length)
  const backgroundColor = values.map(
    (val, index) =>
      `hsla(${Math.round(index * (360 / values.length))}, 50%, 50%, 0.5)`
  )
  const borderColor = values.map(
    (val, index) =>
      `hsla(${Math.round(index * (360 / values.length))}, 70%, 50%, 0.7)`
  )

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '# of Instances',
          data: values,
          borderWidth: 3,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      onClick: (e, items) => {
        if (items[0]) {
          const index = items[0].index
          const category = labels[index]
          const _dbIds = data.get(category)
          viewer.isolate(_dbIds)
          viewer.fitToView(_dbIds)
          const hslaColor = backgroundColor[index]
          for (const dbId of _dbIds) {
            viewer.setThemingColor(dbId, hslaStringToRgb(hslaColor))
          }
        } else {
          viewer.isolate([])
          viewer.fitToView([])
        }
      },
    },
  })
}
