<template>
  <div class="main-boxdiv" v-loading="loading">
    <div class="titlem bodynav mb4_top">
      <span>当前彩种</span>
      <span>
        <select v-model="lottery_id" @change="getbh()" style="height:24px">
          <option v-for="(item, index) in GameList" :label="item.name" :value="parseInt(item.lottery_id)" />
        </select>
      </span>
    </div>
    <div class="game_box_top game_box_top_nav"
      style="margin-right: 0px;border-left:1px solid #b9c2cb;border-right:1px solid #b9c2cb;line-height: 25px; ">
      <div style="justify-content: center !important;
    align-items: center !important;
    line-height: 20px;
    display: flex; ">

        <span>
          <select v-model="PostData.Moneytype" style="height:24px">
            <option label="全部" :value="true" />
            <option label="单项目" :value="false" />
          </select>
          &nbsp;
        </span>
        <span>快速金额&nbsp;</span>
        <span>
          <input v-model="PostData.money" class="Odds_input" type="number" /> &nbsp;
        </span>
        <span>快速赔率&nbsp;</span>
        <span>
          <input v-model="PostData.Num" class="Odds_input" type="number" /> &nbsp;
        </span>
        <span>快速填入&nbsp;</span>
        <span>
          <el-radio v-model="PostData.type" :label="true">启动自动降赔</el-radio>
          <el-radio v-model="PostData.type" :label="false">停用自动降赔</el-radio>
        </span>
        <el-button type="primary" @click="updatesave()" style="margin-left: 10px;">保存降赔设置</el-button>
        <el-button type="primary" @click="resdata()">重置输入</el-button>
      </div>
    </div>

    <div style="display:flex;justify-content: space-between;">
      <el-table border :header-cell-class-name="'trheader'" height="100%" style="width: 100%;" show-footer
        v-for="(item, index) in editBhdata" :data="item" :style="{ 'margin-left': index > 0 ? '-1px' : '0' }">

        <el-table-column label="项目">
          <template #default="{ row, $index }">
            <span @click="getmoney(index, $index)">
              {{ getname(row) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="投注金额">
          <template #default="{ row, $index }">
            <span @click="getmoney(index, $index)">
              <input v-model="row.Money" class="Odds_input" type="number" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="下降赔率">
          <template #default="{ row, $index }">
            <span @click="getNum(index, $index)">
              <input v-model="row.Num" class="Odds_input" type="number" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="自动降赔" width="100">
          <template #default="{ row }">
            <span>
              <select v-model="row.State"
                :style="{ 'background-color': row.State ? '#fef5a2 !important' : '#ffffff !important' }">
                <option :value="true">启动</option>
                <option :value="false">关闭</option>
              </select>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="main-boxdiv-bottom"></div>

  </div>
</template>


<script>
export default {
  props: {
    clientHeight2: {
      type: Number
    },
    home_data: {
      type: Object
    },
    UserInfo: {
      type: Object
    },
  },
  data() {
    return {
      lottery_id: 1,
      GameList: [],
      editData: [],
      page: 1,
      total: 0,
      logtable: [],
      size: 50,
      PostData: {
        'type': '',
        'Moneytype': false,
        'money': '',
        'TableData': []
      },
      editBhdata: [

      ],
      memberdata: '',
      authoritydata: this.$store.state.Authoritydata
    }
  },
  created() {
    this.lottery_id = this.home_data.GameList[this.home_data.game_index].lottery_id
    this.GameList = JSON.parse(JSON.stringify(this.home_data.GameList))
    this.getbh()
  },
  watch: {
    'PostData.type': {
      handler(newVal, oldVal) {
        this.changestate()
      },
      deep: true
    },
    'PostData.money': {
      handler(newVal, oldVal) {
        this.changemoney()
      },
      deep: true
    },
    'PostData.Num': {
      handler(newVal, oldVal) {
        this.changeNum()
      },
      deep: true
    },
  },
  methods: {
    handleSizeChangelog(size) {
      this.size = size
    },
    handleCurrentChangelog(newPage) {
      this.page = newPage
      this.logs()
    },
    getbh() {
      this.loading = true
      this.$request.postData('/odds/finddrop', { 'lottery_id': this.lottery_id }).then(response => {
        if (response.code == 200) {
          var a = JSON.parse(JSON.stringify(response.data.data))
          a.sort(function (a1, b1) {
            return a1.PlayType - b1.PlayType;
          });
          this.PostData.TableData = a
          this.editBhdata = []
          for (var i = 1; i < 5; i++) {
            var aas = this.getBhTable(i)
            this.editBhdata.push(aas)
          }
        } else {
          this.$message.error(response.msg);
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message.error('网络请求错误');
      });
    },

    getBhTable(item) {
      // var n=item==1 ? 25:item==2 ? 52:item==3 ? 79:106
      // var n1=item==1 ? 0:item==2 ? 25:item==3 ? 52:79
      var n = item == 1 ? 27 : item == 2 ? 54 : item == 3 ? 81 : 106
      var n1 = item == 1 ? 0 : item == 2 ? 27 : item == 3 ? 54 : 81
      var a = []
      var b = JSON.parse(JSON.stringify(this.PostData.TableData))
      for (var i = 0; i < b.length; i++) {
        if (i >= n1 && i < n) {
          a.push(b[i])
        }
      }
      return a
    },
    getname(row) {
      var a = [3, 4, 7, 10, 11, 16, 17, 23, 24, 25]
      if (a.includes(parseInt(row.PlayGroup))) {
        return row.GroupName + row.PlayName
      }
      return row.PlayName
    },
    changestate() {
      for (var i = 0; i < this.editBhdata.length; i++) {
        for (var i1 = 0; i1 < this.editBhdata[i].length; i1++) {
          this.editBhdata[i][i1].State = this.PostData.type ? true : false
        }
      }
    },
    changemoney() {
      if (this.PostData.Moneytype) {
        for (var i = 0; i < this.editBhdata.length; i++) {
          for (var i1 = 0; i1 < this.editBhdata[i].length; i1++) {
            this.editBhdata[i][i1].Money = this.PostData.money
          }
        }
      }
    },
    changeNum() {
      if (this.PostData.Moneytype) {
        for (var i = 0; i < this.editBhdata.length; i++) {
          for (var i1 = 0; i1 < this.editBhdata[i].length; i1++) {
            this.editBhdata[i][i1].Num = this.PostData.Num
          }
        }
      }
    },
    getmoney(index, index1) {
      if (!this.PostData.Moneytype && this.PostData.money != '') {
        this.editBhdata[index][index1].Money = this.PostData.money
      }
    },
    getNumy(index, index1) {
      if (!this.PostData.Moneytype && this.PostData.Num != '') {
        this.editBhdata[index][index1].Num = this.PostData.Num
      }
    },
    updatesave() {
      var a = JSON.parse(JSON.stringify(this.editBhdata))
      var c = a[0].concat(a[1])
      c = c.concat(a[2])
      c = c.concat(a[3])
      c.sort(function (a1, b1) {
        return a1.PlayType - b1.PlayType;
      });
      var d = JSON.parse(JSON.stringify(this.PostData.TableData))
      d.sort(function (a1, b1) {
        return a1.PlayType - b1.PlayType;
      });
      if (JSON.stringify(c) != JSON.stringify(d)) {
        var e = []
        for (var i = 0; i < c.length; i++) {
          for (var i1 = 0; i1 < d.length; i1++) {
            if (c[i].PlayGroup == d[i].PlayGroup && c[i].PlayType == d[i].PlayType && c[i].GroupName == d[i].GroupName && c[i].PlayName == d[i].PlayName) {
              if (c[i].Money != d[i].Money || c[i].State != d[i].State || c[i].Num != d[i].Num) {
                c[i].Money = parseFloat(c[i].Money)
                c[i].Num = parseFloat(c[i].Num)
                e.push(c[i])
              }
              break
            }
          }
        }
        if (e.length > 0) {
          this.bhsave(e)
        }
      }
    },
    bhsave(e) {
      this.$request.postData('/odds/editdrop', { lottery_id: this.lottery_id, b_data: e }).then(response => {
        this.loading = false
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.loading = false
        this.$message.error('网络请求错误');
      });
    },
    resdata() {
      this.editBhdata = []
      for (var i = 1; i < 5; i++) {
        var aas = this.getBhTable(i)
        this.editBhdata.push(aas)
      }
      this.PostData.type = ''
      this.PostData.money = ''
    }
  }
}
</script>