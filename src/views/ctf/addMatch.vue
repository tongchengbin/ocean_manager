<template>
  <el-main v-loading="loading">
    <div class="add">
      <el-form label-width="120px">
        <el-form-item label="赛事名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="举办方" required>
          <el-input v-model="form.organize"></el-input>
        </el-form-item>
        <el-form-item label="是否需要报名" required>
          <el-switch
            v-model="form.need_register">
          </el-switch>
        </el-form-item>
        <el-form-item label="组队形式" required>
          <el-select v-model="form.player">
            <el-option
              v-for="item in playerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="赛事类型" required>
          <el-select v-model="form.match_type">
            <el-option
              v-for="item in matchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="比赛地点" required>
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="官网">
          <el-input v-model="form.website"></el-input>
        </el-form-item>
        <el-form-item label="比赛时间">
          <el-date-picker
            v-model="tmpTime"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button class="footer-btn" type="primary" @click="handleSubmit">提交</el-button>
        <el-button class="footer-btn" type="info" @click="back">返回</el-button>
      </div>

    </div>
  </el-main>
</template>

<script>
import request from '@/api/public'

export default {
  name: 'Account',
  filters: {},
  data() {
    return {
      loading: false,
      add: false,
      rid: null,
      playerOptions: [
        {value: 1, label: "组队"},
        {value: 2, label: "个人"}
      ],
      matchOptions: [
        {value: 1, label: "解题赛"},
        {value: 2, label: "攻防赛"},
        {value: 3, label: "真实赛"}
      ],
      tmpTime: null,
      form: {
        need_register: null,
        name: null,
        start_time: null,
        end_time: null,
        match_type: null,
        address: null,
        player: null,
        organize: null,
        website: null,
      },
    }
  },
  computed: {},
  created() {
    this.rid = this.$route.query.id
    if (this.rid) {
      this.add = true;
      this.getDetail()
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    getDetail() {
      this.loading = true;
      request.get(`/api/manager/ctf/match/${this.rid}/`).then(res => {
        this.form.name = res.name;
        this.form.need_register = res.need_register;
        this.tmpTime = [res.start_time, res.end_time];
        this.form.match_type = res.match_type;
        this.form.address = res.address;
        this.form.player = res.player;
        this.form.organize = res.organize;
        this.form.website = res.website;
        this.loading = false;
      })

    },
    handleSubmit() {
      if (!this.tmpTime) {
        this.$message({message: "请选择比赛时间", type: "error"})
        return
      }
      this.form.start_time = this.tmpTime[0];
      this.form.end_time = this.tmpTime[1];
      if (this.add) {
        request.put(`/api/manager/ctf/match/${this.rid}/`, this.form).then(res => {
          this.$message({message: "修改成功", type: "success"})
          this.$router.push('/match/list')

        }).catch(err => {
          this.$message({message: err.response.data, type: "error"})
        })
      } else {
        request.post('/api/manager/ctf/match/', this.form).then(res => {
          this.$message({message: "添加成功", type: "success"})
          this.$router.push('/match/list')

        }).catch(err => {
          this.$message({message: err.response.data, type: "error"})
        })
      }

    }
  }
}
</script>
<style scoped>
.form-footer {
  text-align: center;
}

.form-footer .footer-btn {
  margin: 10px;
}

</style>
