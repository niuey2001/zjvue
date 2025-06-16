<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧数据图表插图 -->
      <div class="login-left">
        <img src="@/assets/style3/images/login-pic.png" alt="数据分析" class="login-image" />
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="login-form-container">
          <div class="login-title">
            <img src="@/assets/style3/images/login.png" alt="管理登录" class="title-image" />
          </div>

          <!-- 错误提示 -->
          <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>

          <div class="form-group">
            <input type="text" v-model="loginForm.Account" class="login-input" placeholder="请输入账号">
            <span class="input-icon user-icon"></span>
          </div>

          <div class="form-group">
            <input type="password" v-model="loginForm.Password" class="login-input" placeholder="请输入密码">
            <span class="input-icon password-icon"></span>
          </div>

          <div class="form-group captcha-group">
            <input ref="inputField" type="text" v-model="loginForm.Answer" class="login-input captcha-input"
              placeholder="请输入验证码">
            <span class="input-icon captcha-icon"></span>
            <img :src="captchas.b64s" alt="验证码" class="captcha-image" @click="refreshCaptcha" title="点击刷新验证码">
          </div>

          <button class="login-button" @click="handleLogin" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </div>
    </div>

    <div class="browser-tips">
      为了更好的使用体验，我们推荐使用Google、UC、Safari、火狐浏览器，以获得最佳的使用体验
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import request from '@/untils/request'
import { ElMessage } from 'element-plus' // Element Plus
import { useStore } from 'vuex'
const store = useStore()
const inputField = ref(null)
const errorMsg = ref('')
const emit = defineEmits(['switchWindow'])

const props = defineProps({
  captcha: {
    type: Object,
    required: true
  },
  LoginData: Object,
})

// 表单数据
const loginForm = reactive({
  Account: '',
  Password: '',
  Answer: '',
  Id: '',
  Color: 3
})
const alerton = ref(false)
const loading = ref(false)
const captchas = ref({})
captchas.value = props.captcha
loginForm.Id = props.captcha.id
loginForm.Color = parseInt(props.captcha.color)
const enteron = ref(false);
const enterKey = () => {
  const code = event.keyCode
  if (code == 13) {
    enteron.value = !enteron.value
  }
}
onMounted(() => {
  document.addEventListener("keyup", enterKey);
});

onUnmounted(() => {
  document.removeEventListener("keyup", enterKey)
});
watch(enteron, (newVal, oldVal) => {
  if (!alerton.value) {
    handleLogin()
  } else {
    alerton.value = false
  }
})



// 刷新验证码
const refreshCaptcha = () => {
  request.postData('/getcaptcha', { WebCode: props.LoginData.WebCode, EnterUrl: props.LoginData.EnterUrl, www: props.LoginData.LocalUrl, Cid: props.LoginData.Cid }).then(response => {
    console.log(props.LoginData)
    if (response.code == 200) {
      captchas.value = response.data;
      loginForm.Id = response.data.id;
      loginForm.Color = parseInt(response.data.color)
    } else {
      ElMessage.error(response.msg);
    }
  }).catch(error => {
    ElMessage.error('网络请求错误');
  });
}

// 表单验证
const validateForm = () => {
  if (!loginForm.Account) {
    errorMsg.value = '请输入用户名'
    return false
  }
  if (!loginForm.Password) {
    errorMsg.value = '请输入密码'
    return false
  }
  if (!loginForm.Answer) {
    errorMsg.value = '请输入验证码'
    return false
  }
  return true
}

const goindex = (view) => {
  var value = store.state.value
  view = view + String(value)
  emit('switchWindow', view)
}

// 登录处理
const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMsg.value = ''
  loginForm.Color = 1
  request.postData('/login', loginForm).then(response => {
    loading.value = false
    if (response.code == 200) {
      response.data.title = captchas.value.webname
      store.commit('setToken', response.data.token)
      store.commit('setUserName', loginForm.Account)
      store.commit('setRule', response.data.rule)
      store.commit('setAuthority', response.data.authority.split(','))
      store.commit('setUserInfo', response.data)
      if (!response.data.isfirst) {
        ElMessage({
          message: '登录成功，请先修改登录密码',
          type: 'success'
        });
        goindex('modifypasswor')
      } else {
        alerton.value = true
        ElMessage({
          message: response.msg,
          type: 'success'
        });
        goindex('home')
      }
    } else {
      inputField.value.focus();
      alerton.value = true
      ElMessage.error(response.msg);
    }
  }).catch(error => {
    loading.value = false
    ElMessage.error('网络请求错误');
  });
  refreshCaptcha()

}
</script>


<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('@/assets/style3/images/login-bg.png') no-repeat center center #00a651;
  background-position: 50% 70%;
  position: relative;
  gap: 20px
}

.login-bot-img {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1050px;
  height: 520px;
  margin: 0;
  overflow: hidden;
  background-color: white;
  position: relative;
  z-index: 10;
}

.login-left {
  width: 50%;
  background-color: #00a651;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
}

.login-right {
  width: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form-container {
  width: 80%;
  max-width: 360px;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
}

.title-image {
  height: 40px;
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  text-align: center;
  margin-bottom: 15px;
  padding: 8px;
  background-color: #fff2f0;
  border-radius: 4px;
  border: 1px solid #ffccc7;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.login-input {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  padding: 0 20px 0 50px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.login-input:focus {
  border-color: #00a651;
  outline: none;
}

.input-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
}

.user-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaa'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

.password-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaa'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'/%3E%3C/svg%3E");
}

.captcha-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaa'%3E%3Cpath d='M12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z'/%3E%3C/svg%3E");
}

.captcha-group {
  display: flex;
  align-items: center;
}

.captcha-input {
  width: calc(100% - 120px);
}

.captcha-image {
  width: 110px;
  height: 44px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.login-button {
  width: 100%;
  height: 50px;
  background-color: #00a651;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  background-color: #008d45;
}

.login-button:disabled {
  background-color: #83c9a7;
  cursor: not-allowed;
}

.browser-tips {
  width: 100%;
  text-align: center;
  color: #dfd0d0;
  font-size: 14px;
  /* position: absolute; */
  bottom: 20px;
  left: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .login-container {
    height: auto;
    flex-direction: column;
  }

  .login-left {
    width: 100%;
    height: 200px;
  }

  .login-right {
    width: 100%;
    padding: 30px 0;
  }
}
</style>