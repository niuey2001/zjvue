<template>
  <div>
    <component v-if="currentView != '' && captcha != ''" :is="currentView" :key="currentView" :captcha="captcha"
      :LoginData="LoginData" @switchWindow="switchWindow" v-loading="loading"></component>
    <div v-else>
      <div v-if="showerro" @click="resget()" class="showerro_box" v-loading="loading">网络连接失败,请稍后重试或点击重新加载<el-icon>
          <Refresh />
        </el-icon></div>
      <div v-else class="showerro_box" v-loading="loading"><el-icon>
          <Loading />
        </el-icon>加载中……</div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
export default {
  data() {
    return {
      loading: true,
      currentView: '',
      WebCode: '',
      captcha: '',
      showerro: false,
      clientWidth: document.documentElement.clientWidth,
      zoomValue: 1,
      LoginData: {
        WebCode: '',
        Cid: '',
        EnterUrl: '',
        LocalUrl: ''
      },
    }
  },
  created() {
    this.$request.setBaseURL('http://52.69.62.116:2345')
    // const protocol = window.location.protocol;
    // const host = window.location.host;
    // const currentUrl = `${protocol}//${host}`; 
    // this.$request.setBaseURL(currentUrl )   
    this.bodyScale()

  },
  components: {
    home1: defineAsyncComponent(() => import('./views/style1/home/home.vue')),
    home2: defineAsyncComponent(() => import('./views/style2/home/home.vue')),
    home3: defineAsyncComponent(() => import('./views/style3/home/home.vue')),
    login1: defineAsyncComponent(() => import('./views/style1/login/login.vue')),
    login2: defineAsyncComponent(() => import('./views/style2/login/login.vue')),
    login3: defineAsyncComponent(() => import('./views/style3/login/login.vue')),
    modifypasswor1: defineAsyncComponent(() => import('./views/style1/login/modifypasswor.vue')),
    modifypasswor2: defineAsyncComponent(() => import('./views/style2/login/modifypasswor.vue')),
    modifypasswor3: defineAsyncComponent(() => import('./views/style3/login/modifypasswor.vue')),
    welcome1: defineAsyncComponent(() => import('./views/style1/login/welcome.vue')),
    welcome2: defineAsyncComponent(() => import('./views/style2/login/welcome.vue')),
    welcome3: defineAsyncComponent(() => import('./views/style3/login/welcome.vue')),
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const param1 = params.get('code');
    const param2 = params.get('u');
    const param3 = params.get('cid');
    if (!param1 || param1 == '' || !param2 || param2 == '' || !param3 || param3 == '') {
      window.location.replace('https://www.baidu.com')
      return
    }
    this.LoginData.Cid = param3
    this.LoginData.EnterUrl = param2
    this.LoginData.WebCode = param1
    this.getstyle()
    window.addEventListener('resize', () => {
      this.clientWidth = document.documentElement.clientWidth
      this.bodyScale()

    })
  },
  methods: {
    resget() {
      const params = new URLSearchParams(window.location.search);
      const param1 = params.get('code');
      const param2 = params.get('u');
      const param3 = params.get('cid');
      if (!param1 || param1 == '' || !param2 || param2 == '' || !param3 || param3 == '') {
        return
      }
      this.LoginData.Cid = param3
      this.LoginData.EnterUrl = param2
      this.LoginData.WebCode = param1
      this.getstyle()
      window.addEventListener('resize', () => {
        this.clientWidth = document.documentElement.clientWidth
        this.bodyScale()

      })
    },
    bodyScale() {
      // var deviceWidth = document.documentElement.clientWidth;
      // var scale = deviceWidth / 1600; 
      // document.documentElement.style.zoom =scale ; 
      const baseSize = 1600
      if (this.clientWidth < 1900) {
        this.zoomValue = (this.clientWidth / baseSize).toFixed(2)
      } else {
        this.zoomValue = 1
      }
      document.body.style.zoom = this.zoomValue //echarts 
      // // 处理缩放导致canvas定位异常 
      document.styleSheets[document.styleSheets.length - 1].insertRule('canvas {zoom: ' + 1 / this.zoomValue + '}')
      document.styleSheets[document.styleSheets.length - 1].insertRule('canvas {transform: scale(' + this.zoomValue + ')}')
      document.styleSheets[document.styleSheets.length - 1].insertRule('canvas {transform-origin: 0 0}')
    },
    switchWindow(view) {
      this.currentView = view;
    },
    getstyle() {
      var local = document.URL
      var a = local.split("?")
      this.LoginData.LocalUrl = a[0]
      if (this.LoginData.Cid == '') {
        this.showerro = true
      }
      this.loading = true
      this.$request.postData('/getcaptcha', { WebCode: this.LoginData.WebCode, EnterUrl: this.LoginData.EnterUrl, www: this.LoginData.LocalUrl, cid: this.LoginData.Cid }).then(response => {
        if (response.code == 200) {
          this.showerro = false
          this.captcha = response.data
          var value = response.data.color
          this.$store.commit('setValue', value)
          import(`@/assets/style${value}/home.css`)
          this.currentView = 'login' + value
        } else if (response.code == 5001) {
          window.location.replace('https://www.baidu.com')
        } else {
          this.$message.error(response.msg);
        }
        this.loading = false
      }).catch(error => {
        this.showerro = true
        this.loading = false
        this.$message.error('网络错误，请稍后重试~');
      });
    }
  }

}
</script>
<style>
.showerro_box {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
}

body {
  position: relative !important;
}
</style>
