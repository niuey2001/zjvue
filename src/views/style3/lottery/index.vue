<template>
  <div class="main-boxdiv" style="width: 800px;">
    <div class="titlem bodynav">
      开盘设置 &nbsp;
    </div>
    <table border="1" class="el-form-table" v-if="editGame != ''">
      <tbody>
        <tr>
          <td class="el-form-table-label">彩种</td>
          <td class="el-form-table-tr">
            <select v-model="lottery_id" @change="getGameIndex()" style="height: 26px;" laceholder="请选择">
              <option v-for="item in GameList" :key="item.lottery_id" :label="item.name"
                :value="parseFloat(item.lottery_id)">
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">彩种开关</td>
          <td class="el-form-table-tr">
            <el-switch v-model="editGame.self_state"></el-switch>
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">当前期号</td>
          <td class="el-form-table-tr">
            {{ editGame.issue }}
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">本期日期</td>
          <td class="el-form-table-tr">
            {{ editGame.date }}
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">开奖时间</td>
          <td class="el-form-table-tr">
            {{ editGame.kj_time }}
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">开盘时间</td>
          <td class="el-form-table-tr">
            <el-time-picker v-model="timedata.open_time" :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }" :clearable="false" placeholder="请选择开盘时间">
            </el-time-picker>

          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">特码封盘时间</td>
          <td class="el-form-table-tr">
            <el-time-picker v-model="timedata.end_time" :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }" :clearable="false" placeholder="请选择特码封盘时间">
            </el-time-picker>
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">非特码封盘时间</td>
          <td class="el-form-table-tr">
            <el-time-picker v-model="timedata.end_time_f" :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }" :clearable="false" placeholder="请选择非特码封盘时间">
            </el-time-picker>
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label">是否自动收单</td>
          <td class="el-form-table-tr">
            <el-switch v-model="editGame.auto_open"></el-switch>
          </td>
        </tr>
        <tr>
          <td class="el-form-table-label"></td>
          <td class="el-form-table-tr el-form-table-footer">
            <span class="game_box_topbtn" @click="onSubmit()">保存设置</span>
          </td>
        </tr>
      </tbody>
    </table>
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