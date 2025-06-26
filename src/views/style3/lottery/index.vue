<template>
  <div class="lottery-settings-container">
    <el-card v-if="editGame != ''" class="lottery-settings-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h3>彩种设置</h3>
        </div>
      </template>
      <el-form :model="editGame" label-width="150px" size="default" label-position="left">
        <div class="form-section">
          <h4 class="section-title">基本信息</h4>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="彩种：">
                <el-select v-model="lottery_id" @change="getGameIndex" placeholder="请选择" class="full-width">
                  <el-option v-for="item in GameList" :key="item.lottery_id" :label="item.name"
                    :value="parseFloat(item.lottery_id)" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="彩种开关：">
                <el-switch v-model="editGame.self_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否自动收单：">
                <el-switch v-model="editGame.auto_open" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <h4 class="section-title">期号信息</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="当前期号：">
                <el-input v-model="editGame.issue" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本期日期：">
                <el-input v-model="editGame.date" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <h4 class="section-title">时间设置</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开奖时间：">
                <el-input v-model="editGame.kj_time" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开盘时间：">
                <el-time-picker v-model="timedata.open_time"
                  :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }" :clearable="false" placeholder="请选择开盘时间"
                  class="full-width" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="特码封盘时间：">
                <el-time-picker v-model="timedata.end_time" :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
                  :clearable="false" placeholder="请选择特码封盘时间" class="full-width" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="非特码封盘时间：">
                <el-time-picker v-model="timedata.end_time_f"
                  :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }" :clearable="false"
                  placeholder="请选择非特码封盘时间" class="full-width" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-actions">
          <el-button type="primary" @click="onSubmit" icon="Check">保存设置</el-button>
          <el-button @click="resetForm" icon="Refresh">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <div v-else class="empty-state">
      <el-empty description="暂无彩种数据"></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    home_data: {
      type: Object
    },
  },
  data() {
    return {
      timedata: { 'open_time': '', 'end_time': '', 'end_time_f': '' },
      GameList: [],
      editGame: '',
      lottery_id: '',
      formOriginal: null
    }
  },
  created() {
    var a = JSON.parse(JSON.stringify(this.home_data.GameList[this.home_data.game_index]))
    this.lottery_id = a.lottery_id
    this.getOpen()
  },
  methods: {
    onSubmit() {
      for (let key in this.timedata) {
        this.editGame[key] = this.getTimeComponents(this.timedata[key])
      }

      this.$request.postData('/lottery/edit', this.editGame).then(response => {
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          // 保存成功后更新原始表单数据
          this.formOriginal = JSON.parse(JSON.stringify(this.editGame));
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.$message.error('网络请求错误');
      });
    },
    resetForm() {
      // 如果有原始数据，重置为原始数据
      if (this.formOriginal) {
        this.editGame = JSON.parse(JSON.stringify(this.formOriginal));
        this.getGameIndex();
      } else {
        // 否则重新获取数据
        this.getOpen();
      }
    },
    getTimeComponents(time) {
      const now = time;
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    headerCellStyle({ rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return { 'background-color': '#f6f6f6', 'color': '#002686' };
      }
    },
    getOpen() {
      this.$request.postData('/lottery/find', {}).then(response => {
        if (response.code == 200) {
          var lotterydata = response.data.data
          lotterydata.sort((a, b) => a.sort - b.sort)
          this.GameList = lotterydata
          this.getGameIndex()
          // 保存原始表单数据用于重置
          this.formOriginal = JSON.parse(JSON.stringify(this.editGame));
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.$message.error('网络请求错误');
      });
    },
    getGameIndex() {
      for (var i = 0; i < this.GameList.length; i++) {
        if (this.lottery_id == this.GameList[i].lottery_id) {
          this.editGame = this.GameList[i]
        }
      }
      var dates = this.editGame.date.split('-')
      var open_time = this.editGame.open_time.split(':')
      var end_time = this.editGame.end_time.split(':')
      var end_time_f = this.editGame.end_time_f.split(':')
      this.timedata.open_time = new Date(dates[0], dates[1], dates[2], open_time[0], open_time[1], open_time[2])
      this.timedata.end_time = new Date(dates[0], dates[1], dates[2], end_time[0], end_time[1], end_time[2])
      this.timedata.end_time_f = new Date(dates[0], dates[1], dates[2], end_time_f[0], end_time_f[1], end_time_f[2])
    }
  }
}
</script>

<style scoped>
.lottery-settings-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.lottery-settings-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.section-title {
  font-size: 16px;
  color: #606266;
  margin: 0 0 16px 0;
  padding-left: 8px;
  border-left: 3px solid #409EFF;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.form-actions .el-button {
  min-width: 120px;
  margin: 0 12px;
}

.form-actions .el-button .el-icon {
  margin-right: 4px;
}

.full-width {
  width: 100%;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

@media screen and (max-width: 768px) {
  .lottery-settings-container {
    padding: 10px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    margin: 5px 0;
  }
}
</style>