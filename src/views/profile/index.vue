<template>
  <div class="page-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>About Me</span>
            </div>
            <div class="user-profile">
              <div class="box-center">
              </div>
              <div class="box-center">
                <el-avatar
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
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
import Activity from './components/Activity.vue'
import Timeline from './components/Timeline.vue'
import Account from './components/Account.vue'
import RestPass from "@/views/profile/components/RestPass.vue";
import UserCard from "@/views/profile/components/UserCard.vue";
import {http} from "@/utils/http";

export default {
  name: 'Profile',
  components: {RestPass, UserCard, Activity, Timeline, Account },
  data() {
    return {
      user:{
        username:'',
        role_name:'',
      },
      activeTab: 'sec'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      http.get("/api/admin/userinfo").then(res=>{
        this.user = res.data
        console.log(this.user)
      })
    }
  }
}
</script>

<style scoped>
.box-center{
  text-align: center;
}
</style>
