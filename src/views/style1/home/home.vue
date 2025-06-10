<template>
  <div>
    <el-container class="layout-container-demo" style="height:100%;overflow:hidden;" v-loading="loading"
      element-loading-background="#f6f6f654">
      <el-header>
        <div ref="topheii">
          <div class="el-header-top">
            <div class="logo">{{ UserInfo.title }}<span style="font-size: 12px;">总监</span></div>
            <div class="el-header-min-box">
              <div class="el-header-action-box" style="height: 30px;">
                <div class="el-header-action-box-list" v-for="item in menuData">
                  <span v-if="item.action.length == 1" :class="item.action.includes(currentView) ? 'isaction-nav' : ''"
                    @click="switchWindow(item.action[0])">{{ item.name }}</span>
                  <el-dropdown trigger="click" :popper-append-to-body="false" v-else>
                    <span class="el-dropdown-link" :class="item.action.includes(currentView) ? 'isaction-nav' : ''">
                      {{ item.name }}
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu :popper-append-to-body="false">
                        <el-dropdown-item v-for="items in item.data" @click="switchWindow(items.sview)">{{ items.name
                        }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <div class="el-header-action-box-list">
                  <span :class="['result'].includes(currentView) ? 'isaction-nav' : ''"
                    @click="switchWindow('result')">开奖结果</span>
                </div>
                <div class="el-header-action-box-list">
                  <el-dropdown trigger="click" :popper-append-to-body="false">
                    <span class="el-dropdown-link"
                      :class="['person', 'passwords', 'rule'].includes(currentView) ? 'isaction-nav' : ''">
                      个人资料
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu :popper-append-to-body="false">
                        <el-dropdown-item @click="switchWindow('userinfos')">{{ UserInfo.account }}</el-dropdown-item>
                        <el-dropdown-item @click="switchWindow('person')">操作日志</el-dropdown-item>
                        <el-dropdown-item @click="switchWindow('passwords')">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="switchWindow('rule')">游戏规则</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <div class="el-header-action-box-list">
                  <span @click="LoginOut()">退出登录</span>
                </div>
              </div>
              <div class="game_info_r_top"
                v-if="home_data.result && home_data.result.Issue && home_data.result != '' && UserInfo.items">
                <div class="game_info_r_top_result_box" v-if="isshowresult">
                  <div class="game_info_r_qishu">
                    <span>{{ home_data.result.Issue }} 期</span>
                  </div>
                  <div class="game_info_r_result">
                    <span v-for="item in 6">
                      <div class="result_num"
                        :class="UserInfo.items[home_data.result['Ball' + item]].NumberBs == 66 ? 'ball_red' : UserInfo.items[home_data.result['Ball' + item]].NumberBs == 67 ? 'ball_blue' : UserInfo.items[home_data.result['Ball' + item]].NumberBs == 68 ? 'ball_green' : ''">
                        <span>{{ UserInfo.items[home_data.result['Ball' + item]].PlayNumber }}</span>
                      </div>
                      <div>{{ sxData[home_data.result['NumberSx' + item]] }}</div>
                    </span>
                    <span>
                      <div>+</div>
                    </span>
                    <span>
                      <div class="result_num"
                        :class="UserInfo.items[home_data.result['Ball7']].NumberBs == 66 ? 'ball_red' : UserInfo.items[home_data.result['Ball7']].NumberBs == 67 ? 'ball_blue' : UserInfo.items[home_data.result['Ball7']].NumberBs == 68 ? 'ball_green' : ''">
                        <span>{{ UserInfo.items[home_data.result['Ball7']].PlayNumber }}</span>
                      </div>
                      <div>{{ sxData[home_data.result['NumberSx7']] }}</div>
                    </span>
                  </div>
                </div>
                <div class="top_userinfo" style="display: none;">
                  <!-- <div style="width: 185px;overflow: hidden;">
                      <span>当前时间:</span>
                      <span>{{nowedate}}</span>
                    </div>
                    <el-divider direction="vertical"></el-divider> -->
                  <div>
                    <span>{{ UserInfo.account }} ({{ MemberType[UserInfo.type] }}<span v-if="UserInfo.son">
                        子账号</span>)</span>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div>
                    <span style="cursor: pointer" @click="switchWindow('person')"
                      :class="currentView === 'passwords' ? 'isaction-nav' : ''">操作日志</span>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div>
                    <span style="cursor: pointer" @click="switchWindow('passwords')"
                      :class="currentView === 'passwords' ? 'isaction-nav' : ''">密码修改</span>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div>
                    <span style="cursor: pointer" @click="LoginOut()">登出</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="game_herad">
            <div class="game_herad_mueu">
              <div class="game_herad_mueu_navB" v-for="(items, index) in home_data.GameList">
                <div v-if="index < 6" class="game_herad_mueu_nav"
                  :class="index === home_data.game_index ? 'isActive' : ''" @click="changeLotteryId(items, index)">
                  <span>
                    {{ items.name }}
                  </span>
                </div>
                <div v-if="index < 6" class="game_herad_mueu_nav_linel"></div>
                <div v-if="index < 6" class="game_herad_mueu_nav_liner"></div>
              </div>
              <div class="game_herad_mueu_navB" v-if="home_data.GameList.length >= 6">
                <div class="game_herad_mueu_nav iconnav">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      更多游戏顶部
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <span v-for="(items, index) in home_data.GameList">
                          <el-dropdown-item v-if="index >= 6" @click="changeLotteryId(items, index)">{{ items.name
                          }}</el-dropdown-item>
                        </span>

                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>

                </div>
                <div class="game_herad_mueu_nav_linel"></div>
                <div class="game_herad_mueu_nav_liner"></div>
              </div>
              <div class="game_herad_mueu_navB" @click="gamesortkey++, gamesort = true">
                <div class="game_herad_mueu_nav iconnav">
                  <el-icon>
                    <Setting />
                  </el-icon>
                  设置
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-header>
      <el-main style="overflow:hidden;">
        <div class="main-boxbody" :style="{ 'height': clientHeight + 'px' }">
          <component :style="{ 'height': clientHeight + 'px' }" :clientHeight1="clientHeight1"
            :clientHeight2="clientHeight2" :is="currentView" :UserInfo="UserInfo" :home_data="home_data"
            :noticelist="noticelist" :key="componentKey" :MemberType='MemberType' @operatePassO="operatePassO">
          </component>
        </div>
      </el-main>
    </el-container>
    <div class="notice-container" @click="dialognotice = true">
      <div class="notice-wrapper">
        <div class="notice-content">
          <span v-for="(item, index) in noticelist">&nbsp;&nbsp;{{ index + 1 }}、{{ item.message }}</span>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialognotice" title="" width="800">
      <div class="titlem bodynav dialog-padding">
        系统消息
      </div>
      <el-table border :data="noticelist" height="450px" style="width: 100%" :header-cell-class-name="'trheader'"
        :cell-style="cellStyle">
        <el-table-column prop="date" label="时间" width="155" />
        <el-table-column prop="message" label="内容" />
      </el-table>
    </el-dialog>
    <el-dialog :show-close="false" v-model="operatePassBox" title="" :before-close="handleClose" width="800">
      <div class="titlem bodynav">
        安全验证
      </div>
      <el-form ref="operate" :model="operatePasstxt" label-width="0px" class="custom-form-style" @submit.native.prevent>
        <table border="1" class="el-form-table">
          <tr>
            <td class="el-form-table-label">操作密码</td>
            <td class="el-form-table-tr">
              <el-form-item label="">
                <el-input v-model="operatePasstxt" placeholder="请输入操作密码" style="width: 150px;"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="el-form-table-label"></td>
            <td colspan="3" class="el-form-table-footer">
              <span class="game_box_topbtn" @click="operatePass()">验证操作密码</span>
            </td>
          </tr>
        </table>
      </el-form>
    </el-dialog>
    <el-dialog v-model="gamesort" title="" width="500" style="padding-bottom: 10px !important;">
      <div class="titlem bodynav dialog-padding">
        游戏排序<span style="font-size: 12px;color:red;margin-left:20px;">*按住<el-icon class="el-icon_btn"
            style="margin-right:0px;">
            <Rank />
          </el-icon>可拖拽游戏切换排序</span>
      </div>
      <component :id="gamesortkey" is="GameSort" @setgamesort="gamesort = false" :GameList="home_data.GameList"
        @changeLotteryId="changeLotteryId">

      </component>
    </el-dialog>
  </div>
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';
export default {
  data() {
    return {
      gamesortkey: 1,
      gamesort: false,
      Authority: "",
      UserInfo: '',
      currentView: '',
      home_data: {
        'game_index': 0,
        'GameList': [],
        'result': ''
      },
      operatePassBox: false,
      operatePasstxt: '',
      componentKey: 0,
      loading: false,
      nowheight: false,
      nowheight1: false,
      dialognotice: false,
      noticelist: [],
      MemberType: ['集团', '总监', '一级代理', '二级代理', '三级代理', '四级代理', '五级代理', '六级代理', '七级代理', '八级代理', '九级代理', '会员'],
      sxData: {
        '69': '鼠',
        '70': '牛',
        '71': '虎',
        '72': '兔',
        '73': '龙',
        '74': '蛇',
        '75': '马',
        '76': '羊',
        '77': '猴',
        '78': '鸡',
        '79': '狗',
        '80': '猪',
      },
      menuData: [
        { 'name': '彩盘监控', 'action': ['jiankong'], 'data': [{ 'name': '彩盘监控', 'sview': 'jiankong' }] },
        { 'name': '控盘操作', 'action': ['kongpan'], 'data': [{ 'name': '控盘操作', 'sview': 'kongpan' }] },
        { 'name': '即时注单', 'jszd': ['kongpan'], 'data': [{ 'name': '即时注单', 'sview': 'jszd' }] },
        { 'name': '即时注单', 'action': ['jszd'], 'data': [{ 'name': '即时注单', 'sview': 'jszd' }] },
        { 'name': '报表查询', 'action': ['report'], 'data': [{ 'name': '报表查询', 'sview': 'report' }] },
        // {'name':'开盘设置','action':['lottery'],'data':[{'name':'开盘设置','sview':'lottery'}]},
        { 'name': '账号管理', 'action': ['member', 'son', 'bhuser'], 'data': [{ 'name': '账号管理', 'sview': 'member' }, { 'name': '子账管理', 'sview': 'son' }, { 'name': '补货账号', 'sview': 'bhuser' }] },
        { 'name': '系统设置', 'action': ['lottery', 'odds', 'backs', 'autodrops', 'notice'], 'data': [{ 'name': '开盘设置', 'sview': 'lottery' }, { 'name': '赔率设置', 'sview': 'odds' }, { 'name': '退水设置', 'sview': 'backs' }, { 'name': '自动降水', 'sview': 'autodrops' }, { 'name': '通知公告', 'sview': 'notice' }] }
      ],
      clientHeight: 0,
      clientHeight1: 0,//监控控盘中表格高度
      clientHeight2: 0,
      alerton: false,
      isshowresult: false
    }
  },
  created() {
    this.currentView = 'indexpage'
    this.UserName = this.$store.state.UserName
    this.UserInfo = this.$store.state.UserInfo
    this.Authority = this.$store.state.Authority
    var a = []
    for (let key in this.menuData) {
      var s = { 'name': this.menuData[key].name, 'action': [], 'data': [] }
      for (let key1 in this.menuData[key].action) {
        if (this.Authority.includes(this.menuData[key].action[key1])) {
          s.action.push(this.menuData[key].action[key1])
          s.data.push(this.menuData[key].data[key1])
        }
      }
      if (s.action.length > 0) {
        a.push(s)
      }
    }
    this.menuData = a
    document.title = this.UserName + '-' + this.MemberType[this.UserInfo.type] + '-' + this.UserInfo.title
    this.getlettery()
    this.getmainheight()

  },
  mounted() {
    //window.addEventListener("resize", this.bodyScale, false);
    // const windowInnerHeight = window.innerHeight 
    // const maintopDiv1 = this.$refs.topheii
    // const aaaaa=this.getBoxHeight(maintopDiv1)
    // const bbbbb=this.getBoxPadding(maintopDiv1)
    // const topheight=aaaaa+bbbbb
    // this.nowheight=topheight
    // this.nowheight=this.nowheight/windowInnerHeight
    // this.nowheight1=(1-this.nowheight)*100-2    
    this.getmainheight()
    window.addEventListener('resize', () => {
      this.getmainheight()

    })
  },
  setup() {
    //回车键绑定 
    const enteron = ref(false);
    function enterKey() {
      const code = event.keyCode
        ? event.keyCode
        : event.which
          ? event.which
          : event.charCode;
      if (code == 13) {
        enteron.value = !enteron.value
      }
    }

    const val = ref('');
    const count = ref(10);
    const resget = ref(0);
    const nowedate = ref('')
    let timerId = null;
    function greet(val) {
      clearInterval(timerId);
      startCountdown(val)
    }
    const startCountdown = (val) => {
      count.value = val
      timerId = setInterval(() => {
        nowedate.value = new Date().toLocaleString()
        if (resget.value > 0) { resget.value-- }
        count.value--;
        if (count.value < 0) {
          count.value = val;
        }
      }, 1000);
    };
    onMounted(() => {
      document.addEventListener("keyup", enterKey)
      greet(count.value)

    });
    onUnmounted(() => {
      document.removeEventListener("keyup", enterKey)
      if (timerId) {
        clearInterval(timerId);
      }

    });

    return { enteron, nowedate, resget, count, greet };
  },
  watch: {
    enteron: {
      handler(newVal, oldVal) {
        if (!this.alerton) {
          if (this.operatePassBox) { this.operatePass() }
        } else {
          this.alerton = false
        }
      },
      deep: false
    },
    count: {
      handler(newVal, oldVal) {
        if (newVal == 0) {
          if (!this.showerro) {
            this.shoeerromsg = ''
            this.getlettery()
          }

        }
      },
      deep: true
    },
    '$store.state.OperatePassState': {
      handler(newVal, oldVal) {
        if (newVal == true) {
          this.operatePassBox = true
        }
      },
      deep: true
    },
    enteron: {
      handler(newVal, oldVal) {
        if (this.operatePassBox) {
          this.operatePass()
        }
      },
      deep: false
    }
  },
  methods: {
    getmainheight() {
      this.clientHeight = document.body.clientHeight
      const maintopDiv1 = this.$refs.topheii
      const aaaaa = this.getBoxHeight(maintopDiv1)
      this.clientHeight = this.clientHeight - aaaaa
      this.clientHeight2 = this.clientHeight - 115
      this.clientHeight1 = this.clientHeight - 173
    },
    handleClose(done) {
      return
    },
    operatePassO() {
      this.operatePassBox = true
    },
    operatePass() {
      if (this.operatePasstxt == '') {
        this.$message.error('请输入操作码');
        return
      }
      this.$request.postData('/setpassword', { password: this.operatePasstxt }).then(response => {
        if (response.code == 200) {
          this.operatePasstxt = ''
          this.$store.commit('setOperatePassState', false)
          this.operatePassBox = false
          this.$message({
            message: '验证通过,可以继续操作',
            type: 'success'
          });
        } else {
          this.$message.error(response.msg)
        }
      }).catch(error => {
        console.log("error")
      });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return { 'white-space': 'normal !important' };
    },
    getBoxHeight(box) {
      if (!box) return 0
      const styles = window.getComputedStyle(box)
      const height = parseFloat(styles.height)
      const marginTop = parseFloat(styles.marginTop)
      const marginBottom = parseFloat(styles.marginBottom)
      return height + marginTop + marginBottom
    },
    getBoxPadding(box) {
      if (!box) return 0
      const styles = window.getComputedStyle(box)
      const paddingTop = parseFloat(styles.paddingTop)
      const paddingBottom = parseFloat(styles.paddingBottom)
      return paddingTop + paddingBottom
    },
    screenChange() {
      window.addEventListener('resize', this.getMaxTableHeight, true)
    },
    switchWindow(view) {
      this.loadingchange()
      this.currentView = view;
      this.componentKey++
    },
    doSomethingBeforeMount() {
      if (!this.$store.state.UserName || !this.$store.state.value || !this.$store.state.token || !this.$store.state.Authority) {
        window.location.reload()
        return
      }
    },
    getlettery() {
      this.greet(10)
      this.$request.postData('/home', {}).then(response => {
        if (response.code == 200) {
          var lotterydata = response.data.lottery
          lotterydata.sort((a, b) => a.sort - b.sort)
          if (this.home_data.GameList.length == lotterydata.length) {
            for (let key in this.home_data.GameList) {
              var a = lotterydata.filter(item => item.lottery_id === this.home_data.GameList[key].lottery_id)
              if (a.length == 1) {
                for (let key1 in a[0]) {
                  if (key1 != 'id' && key1 != 'lottery_id' && key1 != 'name' && key1 != 'sort') {
                    if (this.home_data.GameList[key][key1] != a[0][key1]) {
                      this.home_data.GameList[key][key1] = a[0][key1]
                    }
                  }
                }
              }
            }
          } else {
            this.home_data.GameList = lotterydata
          }

          this.$store.commit('setHomeData', this.home_data)

          var lotteryresult = response.data.lotteryresult
          var r = lotteryresult.filter(item => item.LotteryId === this.home_data.GameList[this.home_data.game_index].lottery_id)
          if (JSON.stringify(this.home_data.result) != JSON.stringify(r[0])) this.home_data.result = r[0];
          if (JSON.stringify(this.noticelist) != JSON.stringify(response.data.notice)) {
            this.noticelist = response.data.notice

          }
          this.isshowresult = true
        }
      }).catch(error => {
        console.log("error")
      });
    },
    loadingchange() {
      this.loading = true
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    changeLotteryId(item, index) {
      this.isshowresult = false
      this.loadingchange()
      this.home_data.game_index = index
      this.$store.commit('setHomeData', this.home_data)
      this.componentKey++
      if (this.count > 2 && this.count < 10) {
        this.getlettery()
      }
    },
    LoginOut() {
      window.location.reload()
    }
  },
  components: {
    indexpage: defineAsyncComponent(() => import('../index.vue')),
    son: defineAsyncComponent(() => import('../son/index.vue')),
    odds: defineAsyncComponent(() => import('../settings/oddset.vue')),
    backs: defineAsyncComponent(() => import('../settings/dsset.vue')),
    autodrops: defineAsyncComponent(() => import('../settings/autodrops.vue')),
    member: defineAsyncComponent(() => import('../member/index.vue')),
    kongpan: defineAsyncComponent(() => import('../psc/index.vue')),
    httpset: defineAsyncComponent(() => import('../settings/httpset.vue')),
    lottery: defineAsyncComponent(() => import('../lottery/index.vue')),
    result: defineAsyncComponent(() => import('../lottery/result.vue')),
    report: defineAsyncComponent(() => import('../report/index.vue')),
    notice: defineAsyncComponent(() => import('../notice/index.vue')),
    jiankong: defineAsyncComponent(() => import('../monitor/index.vue')),
    rule: defineAsyncComponent(() => import('../rule/index.vue')),
    userinfopage: defineAsyncComponent(() => import('../userinfo/index.vue')),
    bhuser: defineAsyncComponent(() => import('../bhmember/index.vue')),
    jszd: defineAsyncComponent(() => import('../jszd/index.vue')),
    passwords: defineAsyncComponent(() => import('../userinfo/password.vue')),
    GameSort: defineAsyncComponent(() => import('../../../components/GameSort.vue')),
    person: defineAsyncComponent(() => import('../userinfo/index.vue')),
    userinfos: defineAsyncComponent(() => import('../userinfo/info.vue')),
  }
}
</script>
<style scoped>
.el-dropdown {
  margin-top: 2px;
  color: #9dd0e9;
}

.el-header {
  height: 100px;
  padding: 0px;
}

.el-header-top {
  position: relative;
  background: linear-gradient(#1358a5, #1358a5, #0c4b8e, #0a3e78);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center
}

.el-header-top {
  height: 60px;
  padding: 0px !important;
}

.logo {
  letter-spacing: 8px;
  min-width: 240px;
  width: 240px;
  overflow: hidden;
  font-size: 40px;
  font-family: "lato", sans-serif;
  font-weight: 900;
  text-shadow: 2px -1px #0c3352d4, 3px -4px #0c3352eb, 4px -3px #0c3352eb;
}

.el-header-min-box {
  min-height: 58px;
  width: 100%;
  line-height: 30px;
  display: flex;
  align-items: flex-start;
}

.el-header-action-box {
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
  align-items: center;
}

.el-header-action-box-list {
  font-weight: bold;
  font-size: 15px;
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: linear-gradient(#18457b, #002c5a);
  border-radius: 0 0 6px 6px;
  min-width: 80px;
  text-align: center;
  color: #fff;
  margin: 0 2px;
}

.el-header-action-box-list:hover {
  color: #FFEB3B;
}

.isaction-nav {
  color: #FFEB3B;
}

.el-header-action-box-list-line {
  width: 60px;
  width: 0px;
  height: 10px;
  margin: 0px;
  background-color: #9dd0e9;
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.toolbar {
  width: 120px;
  align-items: start !important;
}

.notice-container {
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  border-top: 1px solid #c9c9c9;
  background: #f3f3f3;
  font-weight: 600;
  z-index: 999;
}

.notice-wrapper {
  display: inline-block;
  animation: scroll-left 30s linear infinite;
}

.notice-wrapper:hover {
  animation-play-state: paused;
}

@keyframes scroll-left {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(-100%);
  }
}

.notice-content {
  display: inline-block;
  padding-left: 10px;
  color: #000;
}

.notice-content:hover {
  color: #FFC107;
}
</style>