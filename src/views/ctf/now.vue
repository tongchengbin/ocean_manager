<template>
  <div class="app-container">
    <aside>当前赛事:<span
      style="margin-left: 20px;font-weight: 600;color: #20a0ff;font-size: 18px;">{{ captureName }}</span></aside>
    <aside v-if="form.id" style="background-color: #ffffff">
      <el-steps :active="active" finish-status="success">
        <el-step title="未开启(选手不可见)"></el-step>
        <el-step title="待开始"></el-step>
        <el-step title="正在进行中"></el-step>
      </el-steps>
      <div class="step-btn">
        <el-button v-if="active===1" size="small" type="primary" @click="openCapture">开启比赛</el-button>
        <el-button v-if="active===2" size="small" type="primary" @click="closeCapture">关闭比赛</el-button>
        <el-button v-if="active===2" size="small" type="primary" @click="startCapture">开始比赛</el-button>
        <el-button v-if="active===3" size="small" type="primary" @click="finishCapture">结束比赛(存档)</el-button>
      </div>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <div>
          <el-form>
            <el-form label-width="120px">
              <el-form-item label="赛事名称" required>
                <el-input v-model="form.name"></el-input>
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
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="规则">
        <div>
          <el-form>
            <el-form label-width="120px">
              <el-form-item label="赛事介绍" required>
                <el-input v-model="ruleForm.desc" :rows="3" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="赛事规则" required>
                <el-input v-model="ruleForm.rules" :rows="4" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="注意事项" required>
                <el-input v-model="ruleForm.matters" :rows="4" type="textarea"></el-input>
              </el-form-item>

            </el-form>
            <div class="form-footer">
              <el-button class="footer-btn" type="primary" @click="handleSubmit">提交</el-button>
              <el-button class="footer-btn" type="info" @click="back">返回</el-button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from "@/api/public";

export default {
  name: 'Icons',
  data() {
    return {
      active: 1,
      playerOptions: [
        {value: 1, label: "组队"},
        {value: 2, label: "个人"}
      ],
      loading: false,
      tmpTime: null,
      captureName: null,
      ruleForm: {
        desc: null,
        rules: null,
        matters: null
      },
      form: {
        name: null,
        start_time: null,
        end_time: null,
        player: null,
      },
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    back() {
      this.$router.back();
    },
    getDetail() {
      this.loading = true;
      request.get(`/api/manager/ctf/capture/now/`).then(res => {
        this.loading = false;
        if (res.id) {
          let status = res.status;
          if (status === 10) {
            this.active = 1
          } else if (status === 20) {
            this.active = 2
          } else if (status === 30) {
            this.active = 3
          } else if (status === 40) {
            this.active = 4
          }
          this.form.id = res.id;
          this.captureName = res.name;
          this.form.name = res.name;
          this.tmpTime = [res.start_time, res.end_time];
          this.form.player = res.player;
        } else {
          this.$alert("当前没有任何赛事,赶紧添加比赛吧!")
        }

      })

    },
    openCapture() {
      //  开启比赛
      request.post(`/api/manager/ctf/capture/open/`, this.form).then(res => {
        this.$message({message: "比赛已开启", type: "success"})
        this.getDetail()
      }).catch(err => {
        this.$message({message: err.response.data, type: "error"})
      })
    },
    closeCapture() {
      //  开启比赛
      request.post(`/api/manager/ctf/capture/close/`, this.form).then(res => {
        this.$message({message: "比赛已关闭", type: "success"})
        this.getDetail()
      }).catch(err => {
        this.$message({message: err.response.data, type: "error"})
      })
    },
    startCapture() {
      //  开启比赛
      request.post(`/api/manager/ctf/capture/start/`, this.form).then(res => {
        this.$message({message: "比赛已开始", type: "success"})
        this.getDetail()
      }).catch(err => {
        this.$message({message: err.response.data, type: "error"})
      })
    },
    finishCapture() {
      //  开启比赛
      request.post(`/api/manager/ctf/capture/finish/`, this.form).then(res => {
        this.$message({message: "比赛已结束", type: "success"})
        this.getDetail()
      }).catch(err => {
        this.$message({message: err.response.data, type: "error"})
      })
    },
    handleSubmit() {
      if (!this.tmpTime) {
        this.$message({message: "请选择比赛时间", type: "error"})
        return
      }
      this.form.start_time = this.tmpTime[0];
      this.form.end_time = this.tmpTime[1];
      request.post(`/api/manager/ctf/capture/base/`, this.form).then(res => {
        this.$message({message: "提交成功", type: "success"})
        this.getDetail()
      }).catch(err => {
        this.$message({message: err.response.data, type: "error"})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-footer {
  text-align: center;
}

.form-footer .footer-btn {
  margin: 10px;
}

.step-btn {
  margin-top: 10px;
  margin-left: -20px;
  text-align: center;
}
</style>
