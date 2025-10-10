<template>
  <el-row class="panel-group" :gutter="responsive.gutter">
    <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../assets/images/home/visits.png" alt=""/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日用户</div>
          <CountTo ref="myCount" :start-val="0" :end-val="state.ip_cnt" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <img src="../../../assets/images/home/registered.png" alt=""/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日注册</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="state.today_register" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <img src="../../../assets/images/home/question.png" alt=""/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">题库</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="state.challenges_cnt" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <img src="../../../assets/images/home/qa.png" alt=""/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日挑战</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="state.today_create_cnt" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {CountTo} from 'vue3-count-to'
import backTop from "@/assets/svg/back_top.svg?component";
export default {
  props: {
    state: {
      type: Object,
      default: function (){
        return {
          ip_cnt: 0,
          req_count: 0,
          today_create_cnt: 0,
          today_register: 0,
          user_cnt: 0,
          challenges_cnt: 0
        }
      }
    }
  },
  data() {
    return {
      responsive: {
        gutter: 40,
        screenWidth: window.innerWidth
      }
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  created() {
  },
  components: {
    CountTo,
    backTop
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleResize() {
      this.responsive.screenWidth = window.innerWidth;
      
      // 根据屏幕宽度调整间距
      if (this.responsive.screenWidth < 480) {
        this.responsive.gutter = 10;
      } else if (this.responsive.screenWidth < 768) {
        this.responsive.gutter = 20;
      } else {
        this.responsive.gutter = 40;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    height: 124px;
    background: #FFFFFF;
    border-radius: 10px;
    img{
      width:60px;
      height: 60px;
      display: inline-block;
    }
    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 768px) {
  .panel-group {
    margin-top: 12px;
    
    .card-panel-col {
      margin-bottom: 20px;
    }
    
    .card-panel {
      height: 110px;
      
      .card-panel-icon-wrapper {
        margin: 10px 0 0 10px;
        padding: 12px;
        
        img {
          width: 50px;
          height: 50px;
        }
      }
      
      .card-panel-description {
        margin: 20px;
        
        .card-panel-text {
          font-size: 14px;
        }
        
        .card-panel-num {
          font-size: 18px;
        }
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: block;
    float: none;
    margin: 0 auto;
    padding-top: 10px;
    text-align: center;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    margin: 0 auto !important;
    padding: 10px;
    text-align: center;
    
    img {
      display: block;
      margin: 0 auto !important;
      width: 40px;
      height: 40px;
    }
  }
  
  .card-panel {
    height: auto !important;
    padding: 10px 0;
  }
}

@media (max-width: 480px) {
  .panel-group {
    margin-top: 8px;
    
    .card-panel-col {
      margin-bottom: 10px;
    }
  }
}
</style>
