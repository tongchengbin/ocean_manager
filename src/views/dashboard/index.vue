<template>
  <div class="container">
    <panel-group :state="data" @handleSetLineChartData="handleSetLineChartData"></panel-group>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="lineChartData" :data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import {http} from "@/utils/http";
import PanelGroup from "@/views/dashboard/components/PanelGroup.vue";
import LineChart from '@/views/dashboard/components/LineChart.vue'



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
      http.get('/api/admin/index/state').then(res=>{
        this.data = res.data
        let { req_data } = res.data
        this.lineChartData = req_data;
      })
    },
    handleSetLineChartData(type) {
    }
  },
  components: {
    PanelGroup,LineChart
  },
  created() {
    this.getData()
  }
}
</script>
