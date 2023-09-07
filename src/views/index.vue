<template>
  <div class="container">
    <panel-group :state="data" @handleSetLineChartData="handleSetLineChartData"></panel-group>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="lineChartData.x_data" :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from "@/api/public";
import PanelGroup from "./components/PanelGroup";
import LineChart from './components/LineChart'



export default {
  name: 'Dashboard',
  data() {
    return {
      data:{
        ip_cnt:0,
        req_count:0,
        today_create_cnt:0,
        today_register:0,
        user_cnt:0,
        challenges_cnt:0
      },
      lineChartData: {}
    }
  },
  methods:{
    getData(){
      request.get('/api/admin/index/state').then(res=>{
        this.data = res.data
        this.lineChartData = res.data.req_data;
      })
    },
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ])
  },
  components: {
    PanelGroup,LineChart
  },
  created() {
    this.getData()
    window.__this = this
  }
}
</script>
