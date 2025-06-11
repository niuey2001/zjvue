<template>
  <el-container class="layout-container-demo" style="height:100%;overflow:hidden;display:flex;flex-direction:column;"
    v-loading="loading" element-loading-background="#f6f6f654">
    <el-header>
      <div class="banner-top">
        <div class="logo">
          <img src="@/assets/style3/images/logo.png" alt="壹号系统" width="24" height="24" style="border-radius: 4px;" />
          <span class="logo-text">壹号系统</span>
        </div>
        <div class="user-info">
          <div class="color-blocks">
            <div class="color-block blue" :class="{ 'checked': backgroundColor === '#2196f3' }"
              @click="changeBackgroundColor('#2196f3')"></div>
            <div class="color-block green" :class="{ 'checked': backgroundColor === '#4caf50' }"
              @click="changeBackgroundColor('#4caf50')"></div>
            <div class="color-block yellow" :class="{ 'checked': backgroundColor === '#3d1f0d' }"
              @click="changeBackgroundColor('#3d1f0d')"></div>
            <div class="color-block darkblue" :class="{ 'checked': backgroundColor === '#0d5095' }"
              @click="changeBackgroundColor('#0d5095')"></div>
            <div class="color-block red" :class="{ 'checked': backgroundColor === '#7d92bd' }"
              @click="changeBackgroundColor('#7d92bd')"></div>



          </div>
          <span class="divider">|</span>

          <span class="online-status">在线 1/0</span>
          <span class="divider">|</span>

          <!-- 用户名和下拉菜单 -->
          <div class="user-dropdown" ref="dropdownRef">
            <div class="username" @click.stop="toggleUserDropdown">
              <span>{{ UserName }}</span>
              <i class="dropdown-icon"></i>
            </div>
            <div class="dropdown-menu" v-show="showUserDropdown">
              <div class="dropdown-item" @click="changePassword">修改密码</div>
              <div class="dropdown-item" @click="LoginOut()">退出</div>
            </div>
          </div>
        </div>
      </div>
      <nav class="banner-tabs">
        <div v-for="item in menuData" :key="item.name" class="tab-item"
          :class="{ active: item.action.includes(currentView) }">
          <span v-if="item.action.length == 1" @click="switchWindow(item.action[0])">{{ item.name }}</span>
          <el-dropdown trigger="click" :popper-append-to-body="false" v-else>
            <span class="el-dropdown-link" :class="item.action.includes(currentView) ? 'isaction-nav' : ''">
              {{ item.name }}
            </span>
            <template #dropdown>
              <el-dropdown-menu :popper-append-to-body="false" :style="{ backgroundColor: backgroundColor }">
                <el-dropdown-item v-for="items in item.data" @click="switchWindow(items.sview)">{{ items.name
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="tab-item" :class="{ active: ['result'].includes(currentView) }">
          <span @click="switchWindow('result')">开奖历史</span>
        </div>
        <!-- <div class="tab-item" :class="{ active: ['userinfos', 'person', 'passwords', 'rule'].includes(currentView) }">
          <el-dropdown trigger="click" :popper-append-to-body="false">
            <span class="el-dropdown-link"
              :class="['person', 'passwords', 'rule'].includes(currentView) ? 'isaction-nav' : ''">
              个人资料
            </span>
            <template #dropdown>
              <el-dropdown-menu :popper-append-to-body="false" :style="{ backgroundColor: backgroundColor }">
                <el-dropdown-item @click="switchWindow('userinfos')">{{ UserInfo.account }}</el-dropdown-item>
                <el-dropdown-item @click="switchWindow('person')">操作日志</el-dropdown-item>
                <el-dropdown-item @click="switchWindow('passwords')">修改密码</el-dropdown-item>
                <el-dropdown-item @click="switchWindow('rule')">游戏规则</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div> -->
        <div class="tab-item">
          <span @click="openWin">开奖网</span>
        </div>
      </nav>
      <div ref="topheii">
        <div class="game_herad_mueu">
          <div class="game-tab-container">
            <div class="game-tab" v-for="(items, index) in home_data.GameList.slice(0, 6)" :key="items.lottery_id"
              :class="{ 'active': index === home_data.game_index }" @click="changeLotteryId(items, index)">
              <div class="tab-content">
                <div class="tab-name">{{ items.name }}</div>
                <div class="tab-count">0</div>
              </div>
            </div>

            <div class="game-tab more-games" v-if="home_data.GameList.length >= 6">
              <el-dropdown>
                <div class="tab-content">
                  <div class="tab-name">更多游戏</div>
                  <div class="tab-count">0</div>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="(items, index) in home_data.GameList" v-if="index >= 6"
                      :key="items.lottery_id" @click="changeLotteryId(items, index)">
                      {{ items.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- <div class="game-tab settings" @click="gamesortkey++, gamesort = true">
                <div class="tab-content">
                  <div class="tab-name">
                    <el-icon>
                      <Setting />
                    </el-icon>
                    设置
                  </div>
                </div>
              </div> -->
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
    </el-header>
    <el-main style="overflow:hidden;flex:1;">
      <div class="main-boxbody" :style="{ 'height': clientHeight + 'px' }">
        <component :style="{ 'height': clientHeight + 'px' }" :clientHeight1="clientHeight1"
          :clientHeight2="clientHeight2" :is="currentView" :UserInfo="UserInfo" :home_data="home_data"
          :noticelist="noticelist" :key="componentKey" :MemberType='MemberType' @operatePassO="operatePassO">
        </component>
      </div>
    </el-main>
  </el-container>
  <Footer ref="footerRef" :messages="noticelist" :footerImage="footerImage" />
  <!-- <div class="notice-container" @click="dialognotice = true">
      <div class="notice-wrapper">
        <div class="notice-content">
          <span v-for="(item, index) in noticelist">&nbsp;&nbsp;{{ index + 1 }}、{{ item.message }}</span>
        </div>
      </div>
    </div> -->


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
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  data() {
    return {
      showUserDropdown: false,
      gamesortkey: 1,
      gamesort: false,
      Authority: "",
      UserInfo: '',
      currentView: '',
      backgroundColor: 'transparent', // Default background color
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
        { 'name': '首页', 'action': ['indexpage'], 'data': [{ 'name': '首页', 'sview': 'indexpage' }] },
        // { 'name': '即时注单', 'action': ['jiankong'], 'data': [{ 'name': '即时注单', 'sview': 'jiankong' }] },
        { 'name': '即时注单', 'action': ['kongpan'], 'data': [{ 'name': '控盘操作', 'sview': 'kongpan' }] },
        // { 'name': '即时注单', 'jszd': ['kongpan'], 'data': [{ 'name': '即时注单', 'sview': 'jszd' }] },
        // { 'name': '即时注单', 'action': ['jszd'], 'data': [{ 'name': '即时注单', 'sview': 'jszd' }] },
        { 'name': '用户管理', 'action': ['member', 'son', 'bhuser'], 'data': [{ 'name': '用户管理', 'sview': 'member' }, { 'name': '子账管理', 'sview': 'son' }, { 'name': '补货账号', 'sview': 'bhuser' }] },

        { 'name': '报表查询', 'action': ['report'], 'data': [{ 'name': '报表查询', 'sview': 'report' }] },
        // {'name':'开盘设置','action':['lottery'],'data':[{'name':'开盘设置','sview':'lottery'}]},
        { 'name': '内部管理', 'action': ['lottery', 'odds', 'backs', 'autodrops', 'notice'], 'data': [{ 'name': '开盘设置', 'sview': 'lottery' }, { 'name': '赔率设置', 'sview': 'odds' }, { 'name': '退水设置', 'sview': 'backs' }, { 'name': '自动降水', 'sview': 'autodrops' }, { 'name': '通知公告', 'sview': 'notice' }] }
      ],
      clientHeight: 0,
      clientHeight1: 0,//监控控盘中表格高度
      clientHeight2: 0,
      alerton: false,
      isshowresult: false
    }
  },
  computed: {
    backgroundColorhalf() {
      return this.backgroundColor + '80';
    },
    footerImage() {
      if (this.backgroundColor == '#2196f3') {
        return 'data:image/png;base64,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'
      }
      else if (this.backgroundColor == '#4caf50') {
        return 'data:image/png;base64,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'
      }
      else if (this.backgroundColor == '#3d1f0d') {
        return 'data:image/png;base64,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'
      }
      else if (this.backgroundColor == '#0d5095') {
        return 'data:image/png;base64,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'
      }
      else if (this.backgroundColor == '#7d92bd') {
        return 'data:image/png;base64,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'
      }
    }
  },
  created() {
    this.currentView = 'indexpage'
    this.UserName = this.$store.state.UserName
    this.UserInfo = this.$store.state.UserInfo
    this.Authority = this.$store.state.Authority

    // Load saved background color from localStorage if available
    const savedColor = localStorage.getItem('backgroundColor') || '#2196f3';
    if (savedColor) {
      this.backgroundColor = savedColor;
    }

    var a = []
    for (let key in this.menuData) {
      var s = { 'name': this.menuData[key].name, 'action': [], 'data': [] }
      for (let key1 in this.menuData[key].action) {

        if (this.Authority.includes(this.menuData[key].action[key1]) || this.menuData[key].name == '首页') {
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
    document.addEventListener('click', this.closeDropdownOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
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
    openWin() {
      window.open('https://1kai.food/', '_blank')
    },
    changePassword() {
      this.showUserDropdown = false
      this.switchWindow('passwords')
    },
    getmainheight() {
      this.clientHeight = document.body.clientHeight
      const maintopDiv1 = this.$refs.topheii
      const aaaaa = this.getBoxHeight(maintopDiv1)
      this.clientHeight = this.clientHeight - aaaaa
      this.clientHeight2 = this.clientHeight - 115
      this.clientHeight1 = this.clientHeight - 173
    },

    toggleUserDropdown() {
      this.showUserDropdown = !this.showUserDropdown
    },

    // 打开站内消息
    openStationMessage() {
      if (this.$refs.footerRef) {
        this.$refs.footerRef?.toggleStationMessage?.();
      }
    },

    // 打开更多弹窗
    openMorePopup() {
      if (this.$refs.footerRef) {
        this.$refs.footerRef?.toggleMorePopup?.();
      }
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
    },
    closeDropdownOnClickOutside(event) {
      if (this.showUserDropdown) {
        if (!this.$refs.dropdownRef || !this.$refs.dropdownRef.contains(event.target)) {
          this.showUserDropdown = false;
        }
      }
    },
    changeBackgroundColor(color) {
      this.backgroundColor = color;
      // Store the selected color in localStorage to persist across page refreshes
      localStorage.setItem('backgroundColor', color);
    },
  },
  components: {
    Footer: defineAsyncComponent(() => import('./footer.vue')),
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
  /* color: #9dd0e9; */
}

.el-dropdown span:hover {
  color: #fff !important;
  background-color: rgba(0, 120, 215, 0.05);
}

.el-header {
  height: 125px;
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

/* .logo {
  letter-spacing: 8px;
  min-width: 240px;
  width: 240px;
  overflow: hidden;
  font-size: 40px;
  font-family: "lato", sans-serif;
  font-weight: 900;
  text-shadow: 2px -1px #0c3352d4, 3px -4px #0c3352eb, 4px -3px #0c3352eb;
} */

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
  color: #555;
  font-weight: bold;
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

.banner-container {
  width: 100%;
  font-family: "Microsoft YaHei", Arial, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.banner-top {
  height: 40px;
  background-color: v-bind(backgroundColor);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;
  letter-spacing: 1px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.divider {
  margin: 0 8px;
  color: white;
}

.color-blocks {
  display: flex;
  align-items: center;
}

.color-block {
  width: 16px;
  height: 16px;
  margin-left: 3px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: transform 0.2s;
}

.color-block:hover {
  transform: scale(1.1);
}

.color-block.active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px white;
}

.color-block.checked {
  background-color: transparent;
  position: relative;
}

.color-block.checked::before {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
}

.color-block.yellow {
  background-color: #3d1f0d;
}

.color-block.red {
  background-color: #7d92bd;
}

.color-block.darkblue {
  background-color: #0d5095;
}

.color-block.blue {
  background-color: #2196f3;
}

.color-block.green {
  background-color: #4caf50;
}

.banner-tabs {
  background-color: v-bind(backgroundColorhalf);
  display: flex;
  height: 35px;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e0e0e0;
  justify-content: center;
}

.tab-item {
  border-left: 1px solid #cdd4e5;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  color: #555;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  position: relative;
  background-color: #fff;
}

.tab-item:hover {
  color: #fff;
  /* background-image: linear-gradient(180deg, #36afff, #1594f5); */
  background-color: v-bind(backgroundColor)
}

.tab-item.active {
  color: #fff;
  font-weight: bold;
  background-color: v-bind(backgroundColor);
  /* background-image: linear-gradient(180deg, #36afff, #1594f5); */
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--active-color);
}

/* 用户下拉菜单样式 */
.user-dropdown {
  position: relative;
}

.username {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 0;
  color: white;
  font-weight: bold;
}

.username:hover {
  background-color: #0077e6;
}

.dropdown-icon {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 6px;
  vertical-align: middle;
  border-top: 4px solid white;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 120px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 0;
  z-index: 1000;
  border: 1px solid #ddd;
}

.dropdown-item {
  padding: 8px 15px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item:first-child {
  border-bottom: 1px solid #eee;
}

.icon {
  display: none;
  /* 隐藏图标 */
}

@media (max-width: 768px) {
  .tab-item {
    padding: 0 15px;
    font-size: 13px;
  }

  .user-info {
    gap: 10px;
  }
}

.game-tab-container {
  display: flex;
  /* background-color: #f6f6f6; */
  /* border-bottom: 1px solid #e0e0e0; */
  /* height: 40px; */
  overflow: hidden;
}

.game-tab {
  min-width: 120px;
  height: 100%;
  position: relative;
  cursor: pointer;
  /* border-right: 1px solid #e0e0e0; */
  transition: background-color 0.3s;
}

.game-tab:hover {
  background-color: transparent;
}

.game-tab.active {
  background-color: transparent;
  border-bottom: 2px solid #1e90ff;
  font-weight: bold;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px 15px;
}

.tab-name {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tab-count {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.game-tab.more-games .el-dropdown {
  height: 100%;
  width: 100%;
}

.game-tab.settings {
  width: 80px;
}

.el-dropdown-link {
  cursor: pointer;
  /* color: #333; */
  display: inline-flex;
  align-items: center;
}

/* 站内消息按钮样式 */
.message-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  cursor: pointer;
  position: relative;
}

.icon-message {
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.message-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>