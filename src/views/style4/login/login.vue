<template>
  <div class="bg">
    <div class="tit">{{ name }}</div>

    <form id="loginForm" class="login-container" @submit.prevent="submitForm">
      <div class="form-header">
        <div>管理员登入</div>
      </div>
      <div class="form-content">
        <div class="form-item">
          <label>账号：</label>
          <input type="text" v-model="loginForm.Account" autocomplete="off" class="tb">
        </div>
        <div class="form-item">
          <label>密码：</label>
          <input type="password" v-model="loginForm.Password" autocomplete="off" class="tb">
        </div>
        <div class="form-item captcha-item" v-if="captchas.b64s">
          <label>验证码：</label>
          <input ref="inputField" type="text" v-model="loginForm.Answer" autocomplete="off" class="tb" maxlength="4">
          <img :src="captchas.b64s" alt="验证码" class="tb1" @click="getcode()">
        </div>
        <div class="form-item button-container">
          <button type="button" @click="submitForm">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>


<script>
import { ref, onMounted, onUnmounted } from 'vue';
export default {
  props: {
    captcha: {
      type: Object,
      required: true
    },
    LoginData: Object,
  },
  data() {
    return {
      alerton: false,
      name: '测试',
      loginForm: {
        'Account': '',
        'Password': '',
        'Answer': '',
        'Id': '',
        'Color': 0
      },
      captchas: {},
      loading: false
    }
  },
  created() {
    this.captchas = this.captcha
    this.loginForm.Id = this.captchas.id
    this.loginForm.Color = parseInt(this.captchas.color)
    this.isShow = true
  },
  watch: {
    enteron: {
      handler(newVal, oldVal) {
        if (!this.alerton) {
          this.submitForm()
        } else {
          this.alerton = false
        }
      },
      deep: false
    }
  },
  setup() {
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
    onMounted(() => {
      document.addEventListener("keyup", enterKey);
    });

    onUnmounted(() => {
      document.removeEventListener("keyup", enterKey)
    });
    return { enteron }
  },
  beforeCreate() {

  },
  mounted() {
    // Focus on account input on load
    setTimeout(() => {
      const accountInput = document.querySelector('input[type="text"]');
      if (accountInput) {
        accountInput.focus();
      }
    }, 100);
  },
  methods: {
    submitForm() {
      // Simple validation
      if (!this.loginForm.Account) {
        this.alerton = true;
        alert('请输入账号');
        return false;
      }
      if (!this.loginForm.Password) {
        this.alerton = true;
        alert('请输入密码');
        return false;
      }
      if (!this.loginForm.Answer && this.captchas.b64s) {
        this.alerton = true;
        alert('请输入验证码');
        return false;
      }

      this.authentication();
    },
    authentication() {
      this.loading = true
      this.loginForm.Color = 1
      this.$request.postData('/login', this.loginForm).then(response => {
        this.loading = false
        if (response.code == 200) {
          response.data.title = this.captchas.webname
          this.$store.commit('setToken', response.data.token)
          this.$store.commit('setUserName', this.loginForm.Account)
          this.$store.commit('setRule', response.data.rule)
          this.$store.commit('setAuthority', response.data.authority.split(','))
          this.$store.commit('setUserInfo', response.data)
          if (!response.data.isfirst) {
            alert('登录成功，请先修改登录密码');
            this.goindex('modifypasswor')
          } else {
            this.alerton = true
            alert(response.msg);
            this.goindex('welcome')
          }
        } else {
          if (this.$refs.inputField) {
            this.$refs.inputField.focus();
          }
          this.alerton = true
          alert(response.msg);
        }
      }).catch(error => {
        this.loading = false
        alert('网络请求错误');
      });
      this.getcode()
    },
    goindex(view) {
      var value = this.$store.state.value
      view = view + String(value)
      this.$emit('switchWindow', view)
    },
    getcode() {
      this.$request.postData('/getcaptcha', { WebCode: this.LoginData.WebCode, EnterUrl: this.LoginData.EnterUrl, www: this.LoginData.LocalUrl, Cid: this.LoginData.Cid }).then(response => {
        if (response.code == 200) {
          this.captchas = response.data;
          this.loginForm.Id = response.data.id;
          this.loginForm.Color = parseInt(response.data.color)
        } else {
          alert(response.msg);
        }
      }).catch(error => {
        // Handle error
      });
    }
  }
}
</script>
<style>
.bg {
  width: 1200px;
  height: 616px;
  background: url(../../../assets/style4/images/bg.jpg);
  margin: 10px auto;
  border: #091731 solid 3px;
  position: relative;
}

.tit {
  position: relative;
  font-size: 36px;
  left: 810px;
  top: 130px;
  width: 100px;
  color: #fff;
  font-weight: bold;
}

.login-container {
  position: relative;
  line-height: 2.5;
  width: 300px;
  text-align: center;
  left: 715px;
  top: 162px;
  border-radius: 5px;
}

.form-header {
  text-align: center;
}

.form-header div {
  color: white;
  font-size: 16px;
  margin: 0;
  padding: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-item label {
  color: #fff;
  font-size: 12px;
  width: 60px;
  text-align: right;
  margin-right: 5px;
}

.tb {
  border: #1357C6 solid 1px;
  width: 150px;
  padding: 1px 2px;
  background-color: #fff;
  font-size: 12px;
}

.tb1 {
  border: #666 dotted 2px;
  text-align: center;
  font-size: 20px;
  background: #eee;
  color: blue;
  padding: 4px 0;
  font-weight: bold;
  width: 100px;
  height: 22px;
  cursor: pointer;
}

.captcha-item {
  position: relative;
  display: flex;
  align-items: center;
}

.captcha-item .tb {
  width: 80px;
}

.captcha-item .tb1 {
  margin-left: 10px;
}

.button-container {
  margin-top: 10px;
}

button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  padding: 5px 15px;
  border-radius: 3px;
  cursor: pointer;
  width: 80px;
}

button:hover {
  background-color: #e0e0e0;
}
</style>