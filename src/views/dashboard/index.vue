<template>
  <div class="dashboard-container">
    <panel-group :state="data" @handleSetLineChartData="handleSetLineChartData"></panel-group>
    <el-row class="chart-container">
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
      console.log(type)
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

<style lang="scss" scoped>
.dashboard-container {
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  
  .chart-container {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }
}

@media screen and (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
    
    .chart-container {
      padding: 10px 10px 0;
      margin-bottom: 20px;
    }
  }
}

@media screen and (max-width: 480px) {
  .dashboard-container {
    padding: 5px;
    
    .chart-container {
      padding: 8px 8px 0;
      margin-bottom: 16px;
    }
  }
}
</style>
