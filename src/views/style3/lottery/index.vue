<template>
  <div class="main-boxdiv" style="width: 800px;">
    <el-form v-if="editGame != ''" :model="editGame" label-width="150px" class="el-form-table">
      <el-form-item label="彩种：">
        <el-select v-model="lottery_id" @change="getGameIndex" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in GameList" :key="item.lottery_id" :label="item.name"
            :value="parseFloat(item.lottery_id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="彩种开关：">
        <el-switch v-model="editGame.self_state"></el-switch>
      </el-form-item>
      <el-form-item label="当前期号：">
        <el-input v-model="editGame.issue" disabled></el-input>
      </el-form-item>
      <el-form-item label="本期日期：">
        <el-input v-model="editGame.date" disabled></el-input>
      </el-form-item>
      <el-form-item label="开奖时间：">
        <el-input v-model="editGame.kj_time" disabled></el-input>
      </el-form-item>
      <el-form-item label="开盘时间：">
        <el-time-picker v-model="timedata.open_time" :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
          :clearable="false" placeholder="请选择开盘时间" style="width: 100%" />
      </el-form-item>
      <el-form-item label="特码封盘时间：">
        <el-time-picker v-model="timedata.end_time" :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
          :clearable="false" placeholder="请选择特码封盘时间" style="width: 100%" />
      </el-form-item>
      <el-form-item label="非特码封盘时间：">
        <el-time-picker v-model="timedata.end_time_f" :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
          :clearable="false" placeholder="请选择非特码封盘时间" style="width: 100%" />
      </el-form-item>
      <el-form-item label="是否自动收单：">
        <el-switch v-model="editGame.auto_open"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
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
      lottery_id: ''
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
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.$message.error('网络请求错误');
      });
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