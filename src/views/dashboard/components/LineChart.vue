<template>
  <div ref="lineChart" :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import * as echarts from 'echarts';
import { markRaw } from 'vue'
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
    data: {
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
    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    if (sidebarElm) {
      sidebarElm.addEventListener('transitionend', this.__resizeHandler)
    }
    
    // 添加窗口大小变化监听
    if (this.autoResize && window) {
      window.addEventListener('resize', this.__resizeHandler)
    }
  },
  beforeUnmount() {
    if (!this.chart) {
      return
    }
    if (this.autoResize && window) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    if (sidebarElm !== undefined) {
      sidebarElm.removeEventListener('transitionend', this.__resizeHandler)
    }

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        if(val){
          this.setOptions(val)
        }
      }
    }
  },
  methods: {
    __resizeHandler() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    setOptions(charData) {
      let xData = charData.x_data
      // 根据屏幕宽度调整配置
      const isSmallScreen = window.innerWidth < 768;
      const isMobileScreen = window.innerWidth < 480;
      
      let options = {
        xAxis: {
          data: xData,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: isMobileScreen ? 'auto' : 0,
            rotate: isMobileScreen ? 30 : 0,
            fontSize: isMobileScreen ? 10 : 12
          }
        },
        grid: {
          left: isMobileScreen ? 5 : (isSmallScreen ? 8 : 10),
          right: isMobileScreen ? 10 : (isSmallScreen ? 15 : 20),
          bottom: isMobileScreen ? 20 : (isSmallScreen ? 25 : 30),
          top: isMobileScreen ? 20 : (isSmallScreen ? 25 : 30),
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
          data: [],
          textStyle: {
            fontSize: isMobileScreen ? 10 : 12
          },
          itemWidth: isMobileScreen ? 10 : 14,
          itemHeight: isMobileScreen ? 10 : 14,
          itemGap: isMobileScreen ? 5 : 10,
          padding: isMobileScreen ? 5 : 10
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
      this.chart = markRaw(echarts.init(this.$el, 'macarons'))
      if(this.data.x_data){
        this.setOptions(this.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 350px;
}

@media screen and (max-width: 768px) {
  .chart {
    height: 300px;
  }
}

@media screen and (max-width: 480px) {
  .chart {
    height: 250px;
  }
}
</style>
