<template>
  <div ref="lineChart" :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
let echarts = require('echarts')
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize&&window) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    if(sidebarElm!==undefined){
      sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)
    }

    this.chart.dispose()
    this.chart = null
  },
  // watch: {
  //   chartData: {
  //     deep: true,
  //     handler(val) {
  //       this.setOptions(val)
  //     }
  //   }
  // },
  methods: {
    setOptions(charData) {
      let xData = charData.x_data
      let options = {
        xAxis: {
          data: xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: []
        },
        series: []
      }
      let lineStyle=["#FF005A","#40c9c6",'#FF9C6E']
      for(let l=0;l<charData.lines.length;l++){
        options.legend.data.push(charData.lines[l].label)
        options.series.push({
          name: charData.lines[l].label, itemStyle: {
            normal: {
              color: lineStyle[l],
              lineStyle: {
                color: lineStyle[l],
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: charData.lines[l].data,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        })
      }
      console.log(options)
      this.chart.setOption(options)
    },
    initChart() {
      console.log("cha",this.chartData)
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
