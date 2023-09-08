<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel"  @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../assets/images/home/visits.png"  alt=""/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日用户</div>
          <CountTo ref="myCount"  :start-val="0"  :end-val="state.ip_cnt"  :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <img src="../../../assets/images/home/registered.png"  alt=""/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日注册</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="state.today_register" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <img src="../../../assets/images/home/question.png"  alt=""/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">题库</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="state.challenges_cnt" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <img src="../../../assets/images/home/qa.png"  alt=""/>
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
    }
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

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    svg {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
