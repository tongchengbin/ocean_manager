<template>
  <div class="container">
    <div ref="main1" class="box"></div>
  </div>
</template>
<script>
// echarts 按需引入
let echarts = require("echarts/lib/echarts");
export default {
  name: "",
  components: {},
  mounted() {
    this.initChart();
  },
  data() {
    return {};
  },
  methods: {
    initChart() {
      let myChart3 = echarts.init(this.$refs.main1);
      myChart3.setOption({
        title: {text: '局部全部引入'},
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    },
  }
};
</script>
<style scoped>
.container {
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
}

.box {
  width: 300px;
  height: 300px;
  border: 2px solid #000;
}
</style>
