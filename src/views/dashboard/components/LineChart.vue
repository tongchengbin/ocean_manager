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
        // 在重绘前等待一下，确保 DOM 已经更新
        setTimeout(() => {
          this.chart.resize();
          
          // 如果有数据，重新设置选项以优化显示
          if (this.data && this.data.x_data) {
            this.setOptions(this.data);
          }
        }, 100);
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
            // 强制间隔显示日期标签，彻底解决挂压问题
            interval: function(index, value) {
              const dataLength = xData.length;
              
              // 根据屏幕宽度和数据量计算最佳间隔
              let screenWidth = window.innerWidth;
              // 估算每个标签的平均宽度（像素）
              const avgLabelWidth = isMobileScreen ? 40 : (isSmallScreen ? 60 : 80);
              // 图表区域宽度估算（根据容器宽度减去边距）
              const chartWidth = screenWidth * 0.8; // 假设图表占据屏幕宽度的80%
              // 计算能显示的标签数量
              const maxLabels = Math.floor(chartWidth / avgLabelWidth);
              // 计算间隔
              const interval = Math.ceil(dataLength / maxLabels);
              
              // 始终显示首尾两个点
              if (index === 0 || index === dataLength - 1) {
                return true;
              }
              
              // 其他点根据间隔显示
              return index % interval === 0;
            },
            // 日期标签始终旋转45度，确保不会重叠
            rotate: 45,
            // 移动设备使用更小的字体
            fontSize: isMobileScreen ? 9 : (isSmallScreen ? 10 : 12),
            // 标签间距
            margin: 8,
            // 标签格式化
            formatter: function(value) {
              // 如果是日期格式，采用更简洁的显示方式
              if (value.includes('-')) {
                const parts = value.split('-');
                if (parts.length === 3) {
                  // 对于大屏幕，可以显示月-日
                  if (!isMobileScreen && !isSmallScreen) {
                    return parts[1] + '-' + parts[2];
                  }
                  // 对于小屏幕，只显示日期
                  else {
                    return parts[2];
                  }
                }
              }
              return value;
            },
            // 添加颜色和背景，增强可读性
            color: '#666',
            // 添加文本阴影增强可读性
            textShadowColor: '#fff',
            textShadowBlur: 2
          }
        },
        grid: {
          left: isMobileScreen ? 10 : (isSmallScreen ? 15 : 20),
          right: isMobileScreen ? 15 : (isSmallScreen ? 20 : 30),
          // 增加底部空间，为日期标签提供更多空间
          bottom: isMobileScreen ? 40 : (isSmallScreen ? 45 : 50),
          top: isMobileScreen ? 30 : (isSmallScreen ? 35 : 40),
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10],
          formatter: function(params) {
            // 获取当前点的日期
            const date = params[0].axisValue;
            let formattedDate = date;
            
            // 如果是日期格式，保留完整日期
            if (date.includes('-')) {
              formattedDate = date; // 在tooltip中显示完整日期
            }
            
            let result = '<div style="font-size:12px;font-weight:bold;margin-bottom:5px;">' + formattedDate + '</div>';
            
            // 添加每个系列的数据
            params.forEach(param => {
              const color = param.color;
              const seriesName = param.seriesName;
              const value = param.value;
              const marker = '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:' + color + '"></span>';
              
              result += '<div style="font-size:12px;margin:3px 0;">' + marker + seriesName + ': ' + value + '</div>';
            });
            
            return result;
          }
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
      // 如果已经有图表实例，先销毁
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
      
      // 创建新的图表实例
      this.chart = markRaw(echarts.init(this.$el, 'macarons'));
      
      // 添加窗口大小变化时自动调整图表大小
      window.addEventListener('resize', this.__resizeHandler);
      
      // 如果有数据，设置选项
      if (this.data && this.data.x_data) {
        // 等待一下确保 DOM 已经准备好
        setTimeout(() => {
          this.setOptions(this.data);
        }, 50);
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
