<template>
  <div class="container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>About me</span>
            </div>
            <div class="user-profile">

              <div class="box-center">
                <pan-thumb image="https://wxins.oss-cn-shenzhen.aliyuncs.com/avatar.jpg" :height="'100px'" :width="'100px'" :hoverable="true">
                  <div>Hello</div>
                  {{ user.username }}
                </pan-thumb>
              </div>
              <div class="box-center">
                <div class="user-name text-center">{{ user.username }}</div>
                <div class="user-role text-center text-muted">{{ user.role_name }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card >
            <el-tabs v-model="activeTab">
              <el-tab-pane label="账户信息" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="安全" name="sec">
                <rest-pass :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import PanThumb from '@/components/PanThumb'
import RestPass from "@/views/profile/components/RestPass";

export default {
  name: 'Profile',
  components: {RestPass, UserCard, Activity, Timeline, Account,PanThumb },
  data() {
    return {
      activeTab: 'sec'
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      console.log(this.user)
    }
  }
}
</script>

<style scoped>
.box-center{
  text-align: center;
}
</style>
