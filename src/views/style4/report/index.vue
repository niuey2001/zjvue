<template>
  <div class="main-boxdiv reportbox" v-loading="loading">
    <div v-if="!showreport" style="margin:5px auto;width:800px;">
      <div class="titlem bodynav">
        报表查询
      </div>
      <table border="1" class="el-form-table">
        <tbody>
          <tr>
            <td class="el-form-table-label">彩种</td>
            <td class="el-form-table-tr">
              <span class="mb-4">
                <select v-model="selectid" @change="handleCheckedCitiesChanges">
                  <option :value="0">
                    全部彩种
                  </option>
                  <option v-for="items in home_data.GameList" :value="parseInt(items.lottery_id)">
                    {{ items.name }}
                  </option>
                </select>
              </span>
            </td>
          </tr>

          <tr>
            <td class="el-form-table-label">时间范围</td>
            <td class="el-form-table-tr">
              <span class="mb-4 report_from">
                <span>
                  <el-date-picker v-model="selectData.action_time" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width:120px;height: 25px;" placeholder="选择日期">
                  </el-date-picker>
                </span>
                <span>-</span>
                <span>
                  <el-date-picker v-model="selectData.end_time" type="date" :clearable="false" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width:120px;height: 25px;" placeholder="选择日期">
                  </el-date-picker>
                </span>
                <button :class="datetype == 1 ? 'ischoose' : ''" @click="datetype = 1, getDateTimes()">今日</button>
                <button :class="datetype == 2 ? 'ischoose' : ''" @click="datetype = 2, getDateTimes()">昨日</button>
                <button :class="datetype == 3 ? 'ischoose' : ''" @click="datetype = 3, getDateTimes()">本周</button>
                <button :class="datetype == 4 ? 'ischoose' : ''" @click="datetype = 4, getDateTimes()">上周</button>
                <button :class="datetype == 5 ? 'ischoose' : ''" @click="datetype = 5, getDateTimes()">本月</button>
                <button :class="datetype == 6 ? 'ischoose' : ''" @click="datetype = 6, getDateTimes()">上月</button>
              </span>
            </td>
          </tr>
          <tr>
            <td class="el-form-table-label">查询类型</td>
            <td class="el-form-table-tr">
              <span class="mb-4">
                <select v-model="selectData.report_type">
                  <option :value="parseInt(1)">报表明细</option>
                  <option :value="parseInt(2)">玩法分类</option>
                  <option :value="parseInt(3)">彩种分类</option>
                  <option :value="parseInt(4)">日期分类</option>
                </select>
              </span>
            </td>
          </tr>
          <tr>
            <td class="el-form-table-label">结算状态</td>
            <td class="el-form-table-tr">
              <span class="mb-4">
                <select v-model="selectData.is_settle">
                  <option :value="true">已结算</option>
                  <option :value="false">未结算</option>
                </select>
              </span>
            </td>
          </tr>

          <tr>
            <td class="el-form-table-label"></td>
            <td class="el-form-table-tr el-form-table-footer">
              <span class="mb-4">
                <el-button type="primary" size="small" @click="showreport = true, getdata()">查 询 报 表</el-button>
              </span>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showreport">
      <div class="mb-4 mb4_top" style="line-height:20px;">
        <span>
          <span>{{ MemberType[nowmember.Type] }}: {{ nowmember.Account }} ({{ nowmember.Name }})</span>
          <span v-if="selectData.type == 1">直属会员</span>
        </span>
        <span style="font-weight: normal;">
          彩种选择
        </span>
        <span>
          <select v-model="selectid" @change="handleCheckedCitiesChanges">
            <option :value="0">
              全部彩种
            </option>
            <option v-for="items in home_data.GameList" :value="parseInt(items.lottery_id)">
              {{ items.name }}
            </option>
          </select>
          <!-- <el-select v-model="selectData.lottery_id"   
              multiple
              :clearable="false"
              collapse-tags
              no-data-text="请选择彩种"
              popper-class="custom-header"
              :max-collapse-tags="2"
              style="line-height:20px;"
              @change="handleCheckedCitiesChange"
              >
                <template #header>
                  <el-checkbox
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange"
                  >
                    全部彩种
                  </el-checkbox>
                </template>
<el-option v-for="items in home_data.GameList" :key="items.name" :label="items.name"
  :value="parseInt(items.lottery_id)">
</el-option>
</el-select> -->
        </span>
        <span style="font-weight: normal;">
          查询类型
        </span>
        <span>
          <select v-model="selectData.report_type" @change="changereportType()">
            <option :value="parseInt(1)">报表明细</option>
            <option :value="parseInt(2)">玩法分类</option>
            <option :value="parseInt(3)">彩种分类</option>
            <option :value="parseInt(4)">日期分类</option>
          </select>
        </span>
        <span style="font-weight: normal;" v-if="sendname != ''">
          分类条件
        </span>
        <span v-if="sendname != ''">
          {{ sendname }}
        </span>
        <span style="font-weight: normal;">
          状态
        </span>
        <span>
          <select v-model="selectData.is_settle" style="width: 80px" @change="getdata()">
            <option label="已结算" :value="true" />
            <option label="未结算" :value="false" />
          </select>
        </span>
        <span>
          <select v-model="datetype" style="width: 80px" @change="getDateTime()">
            <option label="今日" :value="parseInt(1)" />
            <option label="昨日" :value="parseInt(2)" />
            <option label="本周" :value="parseInt(3)" />
            <option label="上周" :value="parseInt(4)" />
            <option label="本月" :value="parseInt(5)" />
            <option label="上月" :value="parseInt(6)" />
          </select>
        </span>
        <span style="font-weight: normal;">开始时间</span>
        <span>
          <el-date-picker v-model="selectData.action_time" type="date" :clearable="false" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" style="width:120px;height: 25px;" placeholder="选择日期">
          </el-date-picker>
        </span>
        <span style="font-weight: normal;">结束时间</span>
        <span>
          <el-date-picker v-model="selectData.end_time" type="date" :clearable="false" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" style="width:120px;height: 25px;" placeholder="选择日期">
          </el-date-picker>
        </span>
        <span>
          <span class="topbtn" @click="sendname = '', selectData.PlayGroup = 0, getdata()">查 询 报 表</span>
        </span>
        <span style="position: fixed;right: -6px;">
          <span class="topbtn" v-if="nowmember != '' && nowmember.top_id != 0" @click="goback()">返回</span>
        </span>
      </div>
      <el-table border :data="tableData" :height="[tableheight]" style="width: 100%;" tooltip-effect="dark" show-summary
        :summary-method="getSummaries" :header-cell-style="headerCellStylereptot" :cell-style="reprotlistCellStyle"
        :header-cell-class-name="'trheader'" @row-click="handleRowClick">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column :label="getheadertitle()" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="selectData.report_type == 2"
              @click="sendname = getPlayGroup(row), selectData.PlayGroup = row.PlayGroup, selectData.report_type = 1, getdata()">
              {{ getPlayGroup(row) }}
            </span>
            <span v-if="selectData.report_type == 3"
              @click="sendname = '', selectData.PlayGroup = 0, selectData.lottery_id = [parseInt(row.LotteryId)], selectData.report_type = 1, getdata()">
              {{ getLotteryName(row) }}
            </span>
            <span v-if="selectData.report_type == 4"
              @click="sendname = '', selectData.PlayGroup = 0, selectData.report_type = 1, selectData.action_time = convertToLocalDate(row.Date), selectData.end_time = convertToLocalDate(row.Date), getdata()">
              {{ convertToLocalDate(row.Date) }}
            </span>
            <span v-if="selectData.report_type == 1" @click="checkdown(row)">{{ row.Account }}<span
                v-if="row.Account != '直属会员' && row.Account != '补货'">({{ row.Name }})</span></span>
          </template>
        </el-table-column>
        <el-table-column prop="Num" label="笔数" />
        <el-table-column prop="BetMoney" label="下注总额" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.Type == 2 ? '' : row.BetMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ValidBetMoney" label="有效金额" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.Type == 2 ? '' : row.ValidBetMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Ty" label="退佣" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.Type == 2 ? '' : parseFloat(row.Ty.toFixed(2)) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Yk" label="会员盈亏" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.Type == 2 ? '' : parseFloat(row.Yk.toFixed(2)) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="MemberType[nowmember.Type + 1]"
          v-if="nowmember.Type > 1 && nowmember.Type < 10 && selectData.type == 0" show-overflow-tooltip>
          <el-table-column prop="Downzcje" :label="'金额'" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.Type != 0 ? '' : parseFloat(row.Downzcje.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Downzcty" label="退佣" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.Type != 0 ? '' : parseFloat(row.Downzcty.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Downzcyk" label="盈亏" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.Type != 0 ? '' : parseFloat(row.Downzcyk.toFixed(2)) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="MemberType[nowmember.Type]">
          <el-table-column label="占成" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.Type != 2">{{ parseFloat(((row.Zcje / row.BetMoney) * 100).toFixed(2)) }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="Zcje" label="占成金额" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Zcje.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Zcty" label="退佣" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Zcty.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Zcyk" label="占成盈亏" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Zcyk.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Zy" label="赚佣" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Zy.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Zp" label="赚赔" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Zp.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Zyk" label="总盈亏" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Zyk.toFixed(2)) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="MemberType[nowmember.Type - 1]" v-if="jt">
          <el-table-column prop="Topzcje" :label="MemberType[nowmember.Type - 1] + '金额'" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Topzcje.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Topzcty" label="退佣" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Topzcty.toFixed(2)) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Topzcyk" label="盈亏" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ parseFloat(row.Topzcyk.toFixed(2)) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div style="width:100%;height:160px;margin-top:5px;display: none;">
        <div class="report_total">
          <div>
            {{ MemberType[nowmember.Type] }}: {{parseFloat((tableData.reduce((sum, item) => sum + item.Zyk,
              0)).toFixed(2))}}
          </div>
          <div v-if="jt">
            {{ MemberType[nowmember.Type - 1] }}: {{parseFloat((tableData.reduce((sum, item) => sum + item.Topzcyk,
              0)).toFixed(2))}}
          </div>
        </div>
      </div>

    </div>
    <el-dialog v-model="showDetail" title="" class="dssetCom-dialog" width="850">
      <div class="titlem bodynav dialog-padding">
        {{ dialogtxt }}
      </div>
      <component :is="'detail'" :key="dskey" :home_data="home_data" :DetailData="DetailData" :loginmember="loginmember"
        :MemberType="MemberType"></component>
    </el-dialog>

    <div class="main-boxdiv-bottom"></div>
  </div>
</template>

<script>
import { defineAsyncComponent, h } from 'vue';
export default {
  components: {
    detail: defineAsyncComponent(() => import('./detail.vue')),
  },
  props: {
    clientHeight2: {
      type: Number,
      required: true
    },
    home_data: {
      type: Object
    },
  },
  data() {
    return {
      showreport: false,
      dskey: 0,
      nowtype: 1,
      datetype: 1,
      nowmember: '',
      loginmember: '',
      tableData: [],
      showtable: true,
      MemberType: ['集团', '总监', '一级代理', '二级代理', '三级代理', '四级代理', '五级代理', '六级代理', '七级代理', '八级代理', '九级代理', '会员'],
      loading: false,
      selectid: 0,
      selectData: {
        id: 0,
        lottery_id: [],
        type: 0,//0，1，2 
        is_settle: true,// true 
        action_time: '',
        end_time: '',
        report_type: 1,
        PlayGroup: 0
      },
      sendname: '',
      alllottery_id: [],
      isIndeterminate: false,
      checkAll: false,
      jt: false,
      showDetail: false,
      dialogtxt: '',
      DetailData: {
        id: 0,
        lottery_id: [],
        type: 0,//0，1，2 
        is_settle: false,// true
        action_time: '',
        end_time: '',
        PlayGroup: 0,
        State: true
      },
      Playdata: '',
      Groupdata: '',
      tableheight: ''
    }
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        if (this.tableData.length > 15) {
          this.tableheight = this.clientHeight2 + 45
          this.tableheight = this.tableheight + "px"
        } else {
          this.tableheight = 'auto'
        }
      },
      deep: false
    },
  },
  created() {
    var a = this.$store.state.UserInfo
    this.Playdata = this.$store.state.Playdata
    this.Groupdata = this.$store.state.Groupdata
    this.nowtype = a.type
    for (let key in this.home_data.GameList) {
      this.alllottery_id.push(parseInt(this.home_data.GameList[key].lottery_id))
      this.selectData.lottery_id.push(parseInt(this.home_data.GameList[key].lottery_id))
    }
    this.getDateTime()
    this.checkAll = true
    this.getdata()
  },
  methods: {
    getPlayGroup(row) {
      var a = ''
      a = this.Groupdata.filter(item => item.id === parseInt(row.PlayGroup))
      return a.length > 0 ? a[0].name : '-'
    },
    getLotteryName(row) {
      var a = this.home_data.GameList.filter(item => item.lottery_id === parseInt(row.LotteryId))
      return a.length > 0 ? a[0].name : '-'
    },
    getheadertitle() {
      var a = ""
      if (this.selectData.report_type == 1) {
        a = this.selectData.type == 0 ? this.MemberType[this.nowmember.Type + 1] : '会员账号'
      }
      if (this.selectData.report_type > 1) {
        a = this.selectData.report_type == 2 ? "项目" : this.selectData.report_type == 3 ? "彩种" : "日期"
      }
      return a
    },
    // handleCheckAllChange(val) {
    //   this.selectData.lottery_id = val ? this.alllottery_id : [];
    //   this.isIndeterminate = false;
    //   this.getdata()
    // },
    // handleCheckedCitiesChange() {
    //   let checkedCount = this.selectData.lottery_id.length;
    //   this.checkAll = checkedCount === this.alllottery_id.length;
    //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.alllottery_id.length;
    //   if(this.selectData.report_type==1){
    //     this.selectData.PlayGroup=0
    //     this.sendname=''
    //   }
    //   this.getdata()
    // },
    handleCheckedCitiesChanges() {
      if (this.selectid == 0) {
        this.selectData.lottery_id = this.alllottery_id
      } else {
        this.selectData.lottery_id = []
        this.selectData.lottery_id.push(this.selectid)
      }
      if (this.showreport) {
        if (this.selectData.report_type == 1) {
          this.selectData.PlayGroup = 0
          this.sendname = ''
        }
        this.getdata()
      }
    },
    changereportType() {
      this.selectData.PlayGroup = 0
      this.sendname = ''
      this.getdata()
    },
    getdata() {
      this.loading = true
      this.tableData = []
      this.$request.postData('/report/reportday', this.selectData).then(response => {
        this.loading = false
        if (response.code == 200) {
          if (response.data.data != null) {
            this.tableData = response.data.data
            this.jt = response.data.jt

          }
          this.nowmember = response.data.member
          if (this.loginmember == '') {
            this.loginmember = response.data.member
          }
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.loading = false
        this.$message.error('网络请求错误');
      });
    },
    checkdown(row) {
      if (row.Type != 0) {

        if (row.IsDetail || row.Type == 2) {
          if (row.Type == 1) {
            this.DetailData = {
              id: row.id,
              lottery_id: this.selectData.lottery_id,
              type: 1,
              is_settle: this.selectData.is_settle,// true
              action_time: this.selectData.action_time,
              end_time: this.selectData.end_time,
              page: 1,
              state: true,
              PlayGroup: this.selectData.PlayGroup
            }
          }
          if (row.Type == 2) {
            this.DetailData = {
              id: this.nowmember.id,
              lottery_id: this.selectData.lottery_id,
              type: 2,
              is_settle: this.selectData.is_settle,// true 
              action_time: this.selectData.action_time,
              end_time: this.selectData.end_time,
              page: 1,
              state: true,
              PlayGroup: this.selectData.PlayGroup
            }
          }
          this.DetailData.State = true
          this.dskey++
          this.dialogtxt = row.IsDetail == true ? '订单明细-' + row.Account : row.Type == 2 ? '补货明细-' + this.nowmember.Account : '订单明细'
          this.showDetail = true
          return
        }
        this.selectData.type = row.Type
        this.getdata()
      } else {
        this.nowmember.top_id = this.nowmember.id
        this.nowmember.id = row.id
        this.nowmember.Account = row.Account
        this.nowmember.Name = row.Name
        this.nowmember.Type = this.nowmember.Type + 1
        this.selectData.id = row.id
        this.loading = true
        this.getdata()
      }
    },
    goback() {
      if (this.selectData.type != 0) {
        if (this.showDetail) {
          this.showDetail = false
        } else {
          this.selectData.type = 0
        }
      } else {
        this.nowmember.id = this.nowmember.top_id
        this.nowmember.Account = '-'
        this.nowmember.Name = '-'
        this.nowmember.Type = this.nowmember.Type - 1
        this.selectData.id = this.nowmember.top_id
      }
      this.loading = true
      this.getdata()
    },
    headerCellStyle({ rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return { 'background-color': '#f6f6f6 !important' };
      }
    },
    headerCellStylereptot({ row, column, rowIndex, columnIndex }) {
      if (this.nowmember.Type > 1 && this.selectData.type == 0) {
        var a = [0, 1, 2]
        var b = [3, 4, 5, 6, 7, 8, 9]
        if (columnIndex == 7 && column.level == 1) {
          return { 'background-color': '#3dd99d !important' };
        }
        if (a.includes(columnIndex) && column.level == 2) {
          return { 'background-color': '#3dd99d !important' };
        }
        if (columnIndex == 8 && column.level == 1) {
          return { 'background-color': '#cb4949 !important' };
        }
        if (b.includes(columnIndex) && column.level == 2) {
          return { 'background-color': '#cb4949 !important' };
        }
      }
      if (this.nowmember.Type == 1 || this.selectData.type != 0) {
        var a = [0, 1, 2, 3, 4, 5, 6]
        if (columnIndex == 7 && column.level == 1) {
          return { 'background-color': '#cb4949 !important' };
        }
        if (a.includes(columnIndex) && column.level == 2) {
          return { 'background-color': '#cb4949 !important' };
        }
      }
    },
    reprotlistCellStyle({ row, column, rowIndex, columnIndex }) {
      var a = ['Downzcty', 'Downzcyk', 'Topzcty', 'Topzcyk', 'Ty', 'Yk', 'Zcty', 'Zcyk', 'Zyk']
      if (a.includes(column.property)) {
        if (row[column.property] < 0) {
          return { 'color': 'red' }
        }
      }
      return ''
    },
    handleRowClick(row, column, event) {
      if (this.selectData.report_type == 2) {
        this.sendname = getPlayGroup(row)
        this.selectData.PlayGroup = row.PlayGroup
        this.selectData.report_type = 1
        this.getdata()
      }
      if (this.selectData.report_type == 3) {
        this.sendname = ''
        this.selectData.PlayGroup = 0
        this.selectData.lottery_id = [parseInt(row.LotteryId)]
        this.selectData.report_type = 1
        this.getdata()
      }
      if (this.selectData.report_type == 4) {
        this.sendname = ''
        this.selectData.PlayGroup = 0
        this.selectData.report_type = 1
        this.selectData.action_time = convertToLocalDate(row.Date)
        this.selectData.end_time = convertToLocalDate(row.Date)
        this.getdata()
      }
      if (this.selectData.report_type == 1) {
        this.checkdown(row)
      }
    },
    getDateTime() {
      var type = this.datetype
      var now = new Date();
      var nowDayOfWeek = now.getDay();
      var nowDay = now.getDate();
      var nowMonth = now.getMonth();
      var nowYear = now.getYear();
      nowYear += (nowYear < 2000) ? 1900 : 0;
      var lastMonthDate = new Date();
      lastMonthDate.setDate(1);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      var lastYear = lastMonthDate.getYear();
      var lastMonth = lastMonthDate.getMonth();
      if (type == 1) {
        var getCurrentDate = new Date(nowYear, nowMonth, nowDay)
        this.selectData.action_time = this.formatDate(getCurrentDate)
        this.selectData.end_time = this.formatDate(getCurrentDate)
      }
      if (type == 2) {
        var getCurrentDate = new Date(nowYear, nowMonth, nowDay - 1)
        this.selectData.action_time = this.formatDate(getCurrentDate)
        this.selectData.end_time = this.formatDate(getCurrentDate)
      }
      if (type == 3) {
        nowDayOfWeek = nowDayOfWeek === 0 ? 6 : nowDayOfWeek - 1;
        var getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
        this.selectData.action_time = this.formatDate(getWeekStartDate)
        var getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
        this.selectData.end_time = this.formatDate(getWeekEndDate)
      }
      if (type == 4) {
        nowDayOfWeek = nowDayOfWeek === 0 ? 6 : nowDayOfWeek - 1;
        var getUpWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7)
        this.selectData.action_time = this.formatDate(getUpWeekStartDate)
        var getUpWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek - 7))
        this.selectData.end_time = this.formatDate(getUpWeekEndDate)
      }
      if (type == 5) {
        var getMonthStartDate = new Date(nowYear, nowMonth, 1)
        this.selectData.action_time = this.formatDate(getMonthStartDate)
        var getMonthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowYear, nowMonth))
        this.selectData.end_time = this.formatDate(getMonthEndDate)
      }
      if (type == 6) {
        var getLastMonthStartDate = new Date(nowYear, lastMonth, 1)
        this.selectData.action_time = this.formatDate(getLastMonthStartDate)
        var getLastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(nowYear, lastMonth))
        this.selectData.end_time = this.formatDate(getLastMonthEndDate)
      }
      this.getdata()
    },
    getDateTimes() {
      var type = this.datetype
      var now = new Date();
      var nowDayOfWeek = now.getDay();
      var nowDay = now.getDate();
      var nowMonth = now.getMonth();
      var nowYear = now.getYear();
      nowYear += (nowYear < 2000) ? 1900 : 0;
      var lastMonthDate = new Date();
      lastMonthDate.setDate(1);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      var lastYear = lastMonthDate.getYear();
      var lastMonth = lastMonthDate.getMonth();
      if (type == 1) {
        var getCurrentDate = new Date(nowYear, nowMonth, nowDay)
        this.selectData.action_time = this.formatDate(getCurrentDate)
        this.selectData.end_time = this.formatDate(getCurrentDate)
      }
      if (type == 2) {
        var getCurrentDate = new Date(nowYear, nowMonth, nowDay - 1)
        this.selectData.action_time = this.formatDate(getCurrentDate)
        this.selectData.end_time = this.formatDate(getCurrentDate)
      }
      if (type == 3) {
        nowDayOfWeek = nowDayOfWeek === 0 ? 6 : nowDayOfWeek - 1;
        var getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
        this.selectData.action_time = this.formatDate(getWeekStartDate)
        var getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
        this.selectData.end_time = this.formatDate(getWeekEndDate)
      }
      if (type == 4) {
        nowDayOfWeek = nowDayOfWeek === 0 ? 6 : nowDayOfWeek - 1;
        var getUpWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7)
        this.selectData.action_time = this.formatDate(getUpWeekStartDate)
        var getUpWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek - 7))
        this.selectData.end_time = this.formatDate(getUpWeekEndDate)
      }
      if (type == 5) {
        var getMonthStartDate = new Date(nowYear, nowMonth, 1)
        this.selectData.action_time = this.formatDate(getMonthStartDate)
        var getMonthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowYear, nowMonth))
        this.selectData.end_time = this.formatDate(getMonthEndDate)
      }
      if (type == 6) {
        var getLastMonthStartDate = new Date(nowYear, lastMonth, 1)
        this.selectData.action_time = this.formatDate(getLastMonthStartDate)
        var getLastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(nowYear, lastMonth))
        this.selectData.end_time = this.formatDate(getLastMonthEndDate)
      }
    },
    formatDate(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return (myyear + "-" + mymonth + "-" + myweekday);
    },
    getMonthDays(nowYear, myMonth) {
      var monthStartDate = new Date(nowYear, myMonth, 1);
      var monthEndDate = new Date(nowYear, myMonth + 1, 1);
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
    },
    convertToLocalDate(isoString) {
      const date = new Date(isoString);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = parseFloat(sums[index].toFixed(2));
          // 修改点：负数显示红色
          if (sums[index] < 0) {
            sums[index] = h('span', { style: { color: 'red' } }, sums[index]);
          }
        } else {
          sums[index] = '';
        }
      });
      return sums;
    }
  }

}
</script>
<style scoped>
.el-table .cell {
  text-align: left;
}
</style>