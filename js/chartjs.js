const extend = (object, value) => {
  for (var key in value) "object" != typeof value[key] ? object[key] = value[key] : extend(object[key], value[key])
}

const add = (element) => {
  var data = element.data("add")
  var chart = $(element.data("target")).data("chart")

  if (element.is(":checked")) {
    function addRecursive(chart, data) {
      for (var o in data) Array.isArray(data[o]) ? data[o].forEach(function(a) {
        chart[o].push(a)
      }) : addRecursive(chart[o], data[o])
    }
    addRecursive(chart, data)
  } 
  else {
    function removeRecursive(chart, data) {
      for (var o in data) Array.isArray(data[o]) ? data[o].forEach(function(a) {
        chart[o].pop()
      }) : removeRecursive(chart[o], data[o])
    }
    removeRecursive(chart, data)
  }

  chart.update()
}

const update = (element) => {
  var data = element.data("update")
  var chart = $(element.data("target")).data("chart")
  
  extend(chart, data)

  if (void 0 !== element.data("prefix") || void 0 !== element.data("suffix")) {
    let prefix = element.data("prefix") ? element.data("prefix") : ""
    let suffix = element.data("suffix") ? element.data("suffix") : ""

    if (chart.options.scales !== undefined) {
      chart.options.scales.yAxes[0].ticks.callback = function(a) {
        if (!(a % 10)) return prefix + a + suffix
      }
    }

    chart.options.tooltips.callbacks.label = function(a, e) {
      var t = e.datasets[a.datasetIndex].label || "",
          o = a.yLabel || e.datasets[0].data[a.index],
          r = "";
      return 1 < e.datasets.length && (r += '<span class="popover-body-label mr-auto">' + t + "</span>"), r += '<span class="popover-body-value">' + prefix + o + suffix + "</span>"
    }
  }

  chart.update()
}

const globalSettings = {
  responsive: true,
  maintainAspectRatio: false,
  defaultColor: settings.charts.defaultColor,
  defaultFontColor: settings.charts.defaultFontColor,
  defaultFontFamily: settings.charts.defaultFontFamily,
  defaultFontSize: settings.charts.defaultFontSize,
  layout: {
    padding: 0
  },
  legend: {
    display: false,
    position: "bottom",
    labels: {
      usePointStyle: true,
      padding: 16
    }
  },
  elements: {
    point: {
      radius: 0,
      backgroundColor: settings.colors.primary[500]
    },
    line: {
      tension: .4,
      borderWidth: 3,
      borderColor: settings.colors.primary[500],
      backgroundColor: settings.colors.transparent,
      borderCapStyle: "rounded"
    },
    rectangle: {
      backgroundColor: settings.colors.primary[500]
    },
    arc: {
      backgroundColor: settings.colors.primary[500],
      borderColor: settings.colors.white,
      borderWidth: 4
    }
  },
  legendCallback: function(a) {
    var o = a.data,
        r = "";
    var td = a.options.elements.line.borderColor;
    return o.datasets.forEach(function(a, e) {
      var l = o.datasets[e].label;
      var t = o.datasets[e].borderColor || td;
      r += '<span class="chart-legend-item">', r += '<i class="chart-legend-indicator" style="background-color: ' + t + '"></i>', r += l, r += "</span>"
    }), r
  },
  tooltips: {
    enabled: !1,
    mode: "index",
    intersect: !1,
    custom: function(r) {
      var a = $("#chart-tooltip");
      if (a.length || (a = $('<div id="chart-tooltip" class="popover bs-popover-top" role="tooltip"></div>'), $("body").append(a)), 0 !== r.opacity) {
        if (r.body) {
          var e = r.title || [],
              l = r.body.map(function(a) {
                return a.lines
              }),
              n = "";
          n += '<div class="arrow"></div>', e.forEach(function(a) {
              n += '<h3 class="popover-header text-center">' + a + "</h3>"
          }), l.forEach(function(a, e) {
              var t = '<span class="popover-body-indicator" style="background-color: ' + r.labelColors[e].backgroundColor + '"></span>',
                  o = 1 < l.length ? "justify-content-left" : "justify-content-center";
              n += '<div class="popover-body d-flex align-items-center ' + o + '">' + t + a + "</div>"
          }), a.html(n)
        }
        var t = $(this._chart.canvas),
            o = (t.outerWidth(), t.outerHeight(), t.offset().top),
            s = t.offset().left,
            i = a.outerWidth(),
            c = a.outerHeight(),
            d = o + r.caretY - c - 16,
            u = s + r.caretX - i / 2;
          
        a.css({
          top: d + "px",
          left: u + "px",
          display: "block"
        })

      } else a.css("display", "none")
    },
    callbacks: {
      title: function(a, e) {
        return e.labels[a[0].index]
      },
      label: function(a, e) {
        var t = e.datasets[a.datasetIndex].label || "",
            o = a.yLabel,
            r = "";
        return 1 < e.datasets.length && (r += '<span class="popover-body-label mr-auto">' + t + "</span>"), r += '<span class="popover-body-value">' + o + "</span>"
      }
    }
  }
}

const doughnutSettings = {
  cutoutPercentage: 83,
  tooltips: {
    callbacks: {
      title: function(a, e) {
        return e.labels[a[0].index]
      },
      label: function(a, e) {
        var t = "";
        return t += '<span class="popover-body-value">' + e.datasets[0].data[a.index] + "</span>"
      }
    }
  },
  legendCallback: function(a) {
    var o = a.data,
        r = "";
    return o.labels.forEach(function(a, e) {
      var t = o.datasets[0].backgroundColor[e];
      r += '<span class="chart-legend-item">', r += '<i class="chart-legend-indicator" style="background-color: ' + t + '"></i>', r += a, r += "</span>"
    }), r
  }
}

const dot = (str, obj) => str.split('.').reduce((o,i)=>o[i], obj)

const applyColors = (el) => {
  const chart = $(el).data('chart')

  const lineBorderColor = (el.getAttribute('data-chart-line-border-color') || '').split(',').filter(v => !!v)
  const lineBorderOpacity = new String(el.getAttribute('data-chart-line-border-opacity') || '1').split(',').filter(v => !!v)
  const lineBackgroundColor = (el.getAttribute('data-chart-line-background-color') || '').split(',').filter(v => !!v)
  const lineBackgroundOpacity = new String(el.getAttribute('data-chart-line-background-opacity') || '1').split(',').filter(v => !!v)

  lineBorderColor.forEach((color, index) => {
    let opacity = lineBorderOpacity[index]
    if (color.indexOf(';') !== -1) {
      color = color.split(';')
      opacity = lineBorderOpacity[0].split(';')
      chart.data.datasets[0].borderColor = []
      color.forEach((color, index) => {
        if (color.indexOf('.') !== -1) {
          color = dot(color, settings.colors)
        }
        else {
          color = hexToRGB(settings.colors.plain[color], opacity[index])
        }
        chart.data.datasets[0].borderColor.push(color)
      })
    }
    else {
      if (color.indexOf('.') !== -1) {
        color = dot(color, settings.colors)
      }
      else {
        color = hexToRGB(settings.colors.plain[color], opacity)
      }
      chart.data.datasets[index].borderColor = color
    }
  })

  lineBackgroundColor.forEach((color, index) => {
    let opacity = lineBackgroundOpacity[index]
    if (color.indexOf(';') !== -1) {
      color = color.split(';')
      opacity = lineBackgroundOpacity[0].split(';')
      chart.data.datasets[0].backgroundColor = []
      color.forEach((color, index) => {
        if (color.indexOf('.') !== -1) {
          color = dot(color, settings.colors)
        }
        else {
          color = hexToRGB(settings.colors.plain[color], opacity[index])
        }
        chart.data.datasets[0].backgroundColor.push(color)
      })
    }
    else {
      if (color.indexOf('.') !== -1) {
        color = dot(color, settings.colors)
      }
      else {
        color = hexToRGB(settings.colors.plain[color], opacity)
      }
      chart.data.datasets[index].backgroundColor = color
    }
  })

  chart.update({ duration: 0 })

  if ($(el).data('chart-legend')) {
    document.querySelector($(el).data('chart-legend')).innerHTML = chart.generateLegend()
  }
}

const create = (id, type = 'line', options = {}, data = {}) => {
  var el = $(id)
  
  const prefix = el.data('chart-prefix') || ''
  const suffix = el.data('chart-suffix') || ''
  const points = el.data('chart-points')
  const hideAxes = el.data('chart-hide-axes')

  if (hideAxes) {
    options = Chart.helpers.merge({
      scales: {
        yAxes: [{
          display: false
        }],
        xAxes: [{
          display: false
        }]
      }
    }, options)
  }

  if (type === 'area') {
    type = 'line'
    options = Chart.helpers.merge({
      elements: {
        line: {
          fill: 'start'
        }
      }
    }, options)
  }

  if (points) {
    options = Chart.helpers.merge({
      elements: {
        point: {
          pointStyle: 'circle',
          radius: 4,
          hoverRadius: 5,
          backgroundColor: settings.colors.white,
          borderColor: settings.colors.primary[500],
          borderWidth: 2
        }
      }
    }, options)
  }

  if (type === 'radar') {
    options = Chart.helpers.merge({
      scale: {
        ticks: {
          display: false,
          beginAtZero: true,
          maxTicksLimit: 4
        },
        pointLabels: {
          fontSize: settings.charts.defaultFontSize
        }
      }
    }, options)
  }

  if (type === 'roundedBar') {
    options = Chart.helpers.merge({
      barRoundness: 1.2
    }, options)
  }

  if (type === 'doughnut' || type === 'radar') {
    options = Chart.helpers.merge({
      scales: {
        yAxes: {
          gridLines: {
            zeroLineWidth: 0
          }
        }
      }
    }, options)
  }

  if (prefix.length || suffix.length) {
    options = Chart.helpers.merge({
      scales: {
        yAxes: [{
          ticks: {
            callback: function(a) {
              if (!(a % 10))
                return `${prefix}${a}${suffix}`
            }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function(a, e) {
            var t = e.datasets[a.datasetIndex].label || "",
                o = a.yLabel,
                r = "";

            if (type === 'doughnut') {
              o = e.datasets[0].data[a.index]
            }
            return 1 < e.datasets.length && (r += '<span class="popover-body-label mr-auto">' + t + "</span>"), r += `<span class="popover-body-value">${prefix}${o}${suffix}</span>`
          }
        }
      }
    }, options)
  }

  var chart = new Chart(el, {
    type: type,
    options: options,
    data: data
  })
  el.data('chart', chart)
  if (el.data('chart-legend')) {
    document.querySelector(el.data('chart-legend'))
      .innerHTML = chart.generateLegend()
  }

  applyColors(document.querySelector(id))
}

const init = () => {
  extend(Chart, {
    defaults: {
      global: globalSettings,
      doughnut: doughnutSettings
    }
  })

  Chart.scaleService.updateScaleDefaults("linear", {
    gridLines: {
      borderDash: [2],
      borderDashOffset: [2],
      color: settings.charts.gridLinesColor,
      drawBorder: false,
      drawTicks: false,
      lineWidth: settings.charts.lineWidth,
      zeroLineWidth: settings.charts.zeroLineWidth,
      zeroLineColor: settings.charts.zeroLineColor,
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: [2]
    },
    angleLines: {
      color: settings.charts.angleLinesColor
    },
    ticks: {
      beginAtZero: !0,
      padding: 10,
      callback: function(a) {
        if (!(a % 10)) return a
      }
    }
  })

  Chart.scaleService.updateScaleDefaults("category", {
    gridLines: {
      drawBorder: !1,
      drawOnChartArea: !1,
      drawTicks: !1
    },
    ticks: {
      padding: 20
    },
    maxBarThickness: 10
  })

  $('[data-toggle="chart"]').on({
    change: function() {
      var el = $(this)
      if (el.is("[data-add]")) {
        add(el)
      }
    },
    click: function() {
      var el = $(this)
      if (el.is("[data-update]")) {
        update(el)
      }
    }
  })
}

export const hexToRGB = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")"
  }
}

const Charts = {
  settings,
  init,
  add,
  update,
  create,
  applyColors,
  hexToRGB
}

if (window !== undefined) {
  window.Charts = Charts

  Charts.init()

  const observer = new MutationObserver((mutations) => { 
    mutations.forEach(mutation => applyColors(mutation.target))
   })

  var nodes = document.querySelectorAll('.chart canvas')
  nodes.forEach(node => {
    observer.observe(node, { 
      attributes: true, 
      attributeOldValue: false, 
      attributeFilter: [
        'data-chart-line-border-color', 
        'data-chart-line-border-opacity',
        'data-chart-line-background-color', 
        'data-chart-line-background-opacity'
      ]
    })
  })
}