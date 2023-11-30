import { hslaStringToRgb } from './utils.js'

const prepareDataToChart = (data) => {
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

  return {
    labels: labels,
    values: values,
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    borderWidth: 3
  }
}

export const updateChart = async (chart, data) => {
  const pd = prepareDataToChart(data)

  chart.data.labels = pd.labels
  chart.data.datasets[0].data = pd.values
  chart.data.datasets[0].borderColor = pd.borderColor
  chart.data.datasets[0].backgroundColor = pd.backgroundColor
  chart.update()
}

export const initChart = async (selector, viewer, data) => {
  const ctx = document.getElementById(selector)

  const pd = prepareDataToChart(data)

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: pd.labels,
      datasets: [
        {
          label: '# of Instances',
          data: pd.values,
          borderWidth: pd.borderWidth,
          borderColor: pd.borderColor,
          backgroundColor: pd.backgroundColor,
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
