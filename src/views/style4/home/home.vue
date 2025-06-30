<template>
  <div>
    <el-container class="layout-container-demo" style="height:100%;overflow:hidden;" v-loading="loading"
      element-loading-background="#f6f6f654">
      <el-header>
        <div ref="topheii">
          <div class="el-header-top">
            <div class="header-left">
              <div class="time-info">时间: {{ nowedate }} 总监: {{ UserInfo.account }}</div>
              <div class="logo">{{ UserInfo.title }}<span style="font-size: 12px;">总监</span></div>
            </div>
            <div class="header-right">
              <div class="game_herad">
                <div class="game_herad_mueu">
                  <div class="game_herad_mueu_navB" v-for="(items, index) in home_data.GameList">
                    <div v-if="index < 6" class="game_herad_mueu_nav"
                      :class="index === home_data.game_index ? 'isActive' : ''" @click="changeLotteryId(items, index)">
                      <span>
                        {{ items.name }}
                      </span>
                    </div>
                  </div>
                  <div class="game_herad_mueu_navB" v-if="home_data.GameList.length >= 6">
                    <div class="game_herad_mueu_nav iconnav">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          更多游戏
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
                  </div>
                </div>
              </div>
              <div class="header-spacer"></div>
              <div class="nav-tabs">
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'jiankong' }"
                  @click="switchWindow('jiankong')">观察台</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'kongpan' }"
                  @click="switchWindow('kongpan')">外围</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'jszd' }" @click="switchWindow('jszd')">
                  彩盘监控</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'report' }"
                  @click="switchWindow('report')">风险监控</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'lottery' }"
                  @click="switchWindow('lottery')">开奖记录</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'member' }"
                  @click="switchWindow('member')">订单查询</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'rule' }" @click="switchWindow('rule')">日报
                </div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'userinfopage' }"
                  @click="switchWindow('userinfopage')">
                  月报</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'bhuser' }"
                  @click="switchWindow('bhuser')">分类报表</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'person' }"
                  @click="switchWindow('person')">用户管理</div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'passwords' }"
                  @click="switchWindow('passwords')">系统设置
                </div>
                <div class="nav-tab" :class="{ 'active-tab': currentView === 'userinfos' }"
                  @click="switchWindow('userinfos')">个人中心
                </div>
                <div class="nav-tab" @click="LoginOut()">游戏说明</div>
                <div class="nav-tab logout-tab" @click="LoginOut()">退出</div>
              </div>
              <div class="marquee-container">
                <div class="marquee-content">
                  【2025-06-26】已于06-26
                  19:23:37注销会员:[qqq777,qqq888,]新澳门⑥合第2025178期部分订单号:1498582,1498581,1498580,1498579,1498578,1498577,1498576,1498575,1498574,1498573,1498572,1498571,1498570,1498569,1498568,1498567,1498566,1498565,1498564,1498563,1498562,1498561,1498560！【2025-06-25】已于06-25
                  14:12:07还原会员【kk11】新澳门⑥合第2025176期全部订单！ 【2025-06-25】已于06-25
                  14:11:34注销会员【kk11】新澳门⑥合第2025176期全部订单！【2025-06-20】已于06-20
                  00:05:40注销会员:[cc55]新澳门⑥合第2025172期部分订单号:1498307！ 【2025-06-19】已于06-19
                  23:37:40注销会员:[qq10]新澳门⑥合第2025170期部分订单号:1498249！
                  【2025-06-19】已于06-19 20:15:00注销会员【dx0003】新澳门⑥合第2025170期全部订单！【2025-06-17】已于06-17
                  17:39:49注销会员:[ww33,]新澳门⑥合第2025169期部分订单号:1498179,1498178,1498177！ 【2025-06-17】已于06-17
                  17:06:43注销会员:[aa111,]新澳门⑥合第2025169期部分订单号:1498172！ 【2025-06-17】已于06-17
                  17:05:48注销会员【dx0001】新澳门⑥合第2025169期全部订单！【2025-06-17】已于06-17
                  17:04:30注销会员:[dx0001]新澳门⑥合第2025169期部分订单号:1498147！
                  【2025-06-17】已于06-17 17:03:07注销会员【dx0001】新澳门⑥合第2025169期全部订单！ 【2025-06-17】已于06-17
                  16:57:04注销会员【dx0001】新澳门⑥合第2025169期全部订单！【2025-06-17】已于06-17
                  15:47:43注销会员:[ww33]新澳门⑥合第2025169期部分订单号:1498130！
                  【2025-06-16】已于06-16 17:01:10注销代理【cc1】新澳门⑥合第2025168期部分订单！
                </div>
                <div class="marquee-content">
                  【2025-06-26】已于06-26
                  19:23:37注销会员:[qqq777,qqq888,]新澳门⑥合第2025178期部分订单号:1498582,1498581,1498580,1498579,1498578,1498577,1498576,1498575,1498574,1498573,1498572,1498571,1498570,1498569,1498568,1498567,1498566,1498565,1498564,1498563,1498562,1498561,1498560！【2025-06-25】已于06-25
                  14:12:07还原会员【kk11】新澳门⑥合第2025176期全部订单！ 【2025-06-25】已于06-25
                  14:11:34注销会员【kk11】新澳门⑥合第2025176期全部订单！【2025-06-20】已于06-20
                  00:05:40注销会员:[cc55]新澳门⑥合第2025172期部分订单号:1498307！ 【2025-06-19】已于06-19
                  23:37:40注销会员:[qq10]新澳门⑥合第2025170期部分订单号:1498249！
                  【2025-06-19】已于06-19 20:15:00注销会员【dx0003】新澳门⑥合第2025170期全部订单！【2025-06-17】已于06-17
                  17:39:49注销会员:[ww33,]新澳门⑥合第2025169期部分订单号:1498179,1498178,1498177！ 【2025-06-17】已于06-17
                  17:06:43注销会员:[aa111,]新澳门⑥合第2025169期部分订单号:1498172！ 【2025-06-17】已于06-17
                  17:05:48注销会员【dx0001】新澳门⑥合第2025169期全部订单！【2025-06-17】已于06-17
                  17:04:30注销会员:[dx0001]新澳门⑥合第2025169期部分订单号:1498147！
                  【2025-06-17】已于06-17 17:03:07注销会员【dx0001】新澳门⑥合第2025169期全部订单！ 【2025-06-17】已于06-17
                  16:57:04注销会员【dx0001】新澳门⑥合第2025169期全部订单！【2025-06-17】已于06-17
                  15:47:43注销会员:[ww33]新澳门⑥合第2025169期部分订单号:1498130！
                  【2025-06-16】已于06-16 17:01:10注销代理【cc1】新澳门⑥合第2025168期部分订单！
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
          <tbody>
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
          </tbody>
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
  height: 120px;
  padding: 0px;
}

.el-header-top {
  position: relative;
  background: #8a6e29;
  color: #fff;
  display: flex;
  justify-content: space-between;
  height: 120px;
  padding: 0px !important;
}

.header-left {
  display: flex;
  flex-direction: column;
  width: 15%;
  padding-left: 10px;
}

.header-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 85%;
  padding-right: 10px;
  height: 100%;
}

.header-spacer {
  flex-grow: 1;
}

.status-info {
  font-size: 12px;
  color: #fff;
  text-align: right;
  padding: 5px 0;
}

.logo {
  letter-spacing: 5px;
  min-width: 200px;
  overflow: hidden;
  font-size: 30px;
  font-family: "lato", sans-serif;
  font-weight: 900;
  text-shadow: 2px -1px #0c3352d4, 3px -4px #0c3352eb, 4px -3px #0c3352eb;
  margin-bottom: 5px;
}

.time-info {
  font-size: 12px;
  padding: 5px 0;
  text-align: left;
}

.nav-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: 5px;
}

.nav-tab {
  padding: 5px 10px;
  background-color: #5f4c1c;
  color: #fff;
  margin: 0 2px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 3px 3px 0 0;
  border: 1px solid #8a6e29;
  border-bottom: none;
}

.nav-tab:hover {
  background-color: #d1b464;
  color: #000;
}

.active-tab {
  background-color: #d1b464;
  color: #000;
  font-weight: bold;
}

.logout-tab {
  background-color: #8a3e29;
}

.game_herad {
  margin-top: 5px;
}

.game_herad_mueu {
  display: flex;
  flex-wrap: wrap;
}

.game_herad_mueu_navB {
  margin-right: 5px;
}

.game_herad_mueu_nav {
  padding: 5px 10px;
  background-color: #5f4c1c;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  border-radius: 5px;
}

.game_herad_mueu_nav:hover,
.isActive {
  background-color: #d1b464;
  color: #000;
}

.iconnav {
  display: flex;
  align-items: center;
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

.game-result-container {
  background: #5f4c1c;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #d1b464;
}

.game-result-issue {
  font-weight: bold;
  margin-right: 15px;
  color: #fff;
}

.game-result-numbers {
  display: flex;
  align-items: center;
}

.result-ball {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3px;
  font-weight: bold;
}

.ball-red {
  background-color: #e94c4c;
}

.ball-blue {
  background-color: #3c78d8;
}

.ball-green {
  background-color: #6aa84f;
}

.result-animal {
  font-size: 12px;
  text-align: center;
  color: #fff;
}

.plus-sign {
  margin: 0 5px;
  color: #fff;
  font-weight: bold;
}

.marquee-container {
  overflow: hidden;
  width: 100%;
  height: 20px;
  position: relative;
  margin-bottom: 5px;
}

.marquee-content {
  position: absolute;
  top: 0;
  white-space: nowrap;
  color: #fff;
  font-size: 12px;
  will-change: transform;
  animation: marquee-scroll 240s linear infinite;
}

.marquee-content:nth-child(2) {
  animation-delay: -120s;
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
  color: #ffeb3b;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(-100%);
  }
}
</style>