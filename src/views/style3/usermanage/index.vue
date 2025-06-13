<template>
  <el-container class="layout-container-demo" style="height:100%;overflow:hidden;display:flex;flex-direction:column;"
    v-loading="loading" element-loading-background="#f6f6f654">
    <nav class="banner-tabs">
      <div v-for="item in menuData" :key="item.name" class="tab-item" :class="{ active: item.sview == currentView }">
        <span @click="switchWindow(item.sview)">{{ item.name }}</span>
      </div>
    </nav>
    <el-main style="overflow:hidden;flex:1;">
      <div class="main-boxbody" :style="{ 'height': clientHeight + 'px' }">
        <component :style="{ 'height': clientHeight + 'px' }" :clientHeight1="clientHeight1"
          :clientHeight2="clientHeight2" :is="currentView" :UserInfo="UserInfo" :home_data="home_data"
          :noticelist="noticelist" :key="componentKey" :MemberType='MemberType' @operatePassO="operatePassO">
        </component>
      </div>
    </el-main>
  </el-container>

</template>
<script>
import { defineAsyncComponent } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  props: {
    home_data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      Authority: "",
      UserInfo: '',
      currentView: '',
      backgroundColor: 'transparent', // Default background color
      loading: false,
      nowheight: false,
      nowheight1: false,
      dialognotice: false,
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
        { 'name': '用户管理', 'sview': 'member' }, { 'name': '子账管理', 'sview': 'son' }, { 'name': '补货账号', 'sview': 'bhuser' }
      ],
      clientHeight: 0,
      clientHeight1: 0,//监控控盘中表格高度
      clientHeight2: 0,
      alerton: false,
    }
  },

  created() {
    this.currentView = 'member'
    this.UserName = this.$store.state.UserName
    this.UserInfo = this.$store.state.UserInfo
    this.Authority = this.$store.state.Authority
    this.backgroundColor = this.$store.state.backgroundColor;

    var a = []
    for (let key in this.menuData) {

      if (this.Authority.includes(this.menuData[key].sview)) {
        a.push(this.menuData[key])

      }
    }

    this.menuData = a
    this.getmainheight()

  },
  mounted() {

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

    '$store.state.backgroundColor': {
      handler(newVal, oldVal) {
        this.backgroundColor = newVal
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

    loadingchange() {
      this.loading = true
      setTimeout(() => {
        this.loading = false;
      }, 1000);
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
  height: 75px;
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
  background-color: #eef0f8;
  display: flex;
  height: 35px;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e0e0e0;
  justify-content: flex-start;
}

.tab-item {
  /* border-left: 1px solid #cdd4e5; */
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
  /* background-color: #fff; */
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