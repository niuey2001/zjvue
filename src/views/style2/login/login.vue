<template>
  <div class="full-screen-div">
  <el-row>
    <el-col justify="center">
      <div class="grid-content">
        <h1>{{name}}</h1>
      </div>
    </el-col>
  </el-row>
  <el-form ref="loginForm" :model="loginForm" :rules="rules" label-position="left" label-width="0px" v-loading="loading">
    
    <el-form-item label=""  prop="Account" required>
      <el-input type="text"  v-model="loginForm.Account" autocomplete="true" prefix-icon="User" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label=""  prop="Password">
      <el-input type="password" v-model="loginForm.Password" autocomplete="off" prefix-icon="Lock" placeholder="请输入密码" show-password></el-input>
    </el-form-item>
    <el-form-item label=""  prop="Answer">
      <el-input  ref="inputField" class="" type="text" validate-event="true" v-model="loginForm.Answer" autocomplete="off" prefix-icon="CircleCheck" maxlength="5" placeholder="请输入验证码"></el-input>
      <img :src="codeBase64" alt="Base64 Image" @click="getcode()" class="el-input el-code-img"> 
      
    </el-form-item>    
    
    <el-form-item> 
      <el-button type="primary" @click="submitForm('loginForm')">登录111</el-button>
      <el-button @click="resetForm('loginForm')">重置</el-button>
      <el-button @click="goindex()">index</el-button>
    </el-form-item>
    
  </el-form>
</div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        name: 'M6总控登录', // 初始化为空字符串
        codeBase64:'',
        loginForm: {
          'Account': '',
          'Password': '',
          'Answer': '',
          'Id':''
        },
        rules: {
          Account: [
            { required: true, message: '请输入账号', trigger: 'change' },
            { min: 3, max: 12, message: '账号长度在 3 到 5 个字符', trigger: 'change' }
          ], 
          Password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 6, max: 16, message: '账号长度在 6 到 16 个字符', trigger: 'change' }
          ], 
          Answer: [
            { required: true, message: '请输入验证码', trigger: 'change'},
            { min: 5, max: 5, message: '验证码长度为 5 个字符', trigger: 'change' }
          ],                             
        },
        loading: false       
      }
    },
    created(){
      this.getcode()
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.authentication()
          } else {
            this.$message.error('请正确填写参数');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      authentication() {
        this.loading=true
        this.$request.postData('api/login',this.loginForm).then(response => {
          this.loading=false
          if(response.code==200){
            this.$message({
              message: response.msg,
              type: 'success'
            });
            this.$store.commit('setToken',response.data.token)
            this.$store.commit('setUserName',this.loginForm.Account)
            var Authority= response.data.user.Authority.split(',')
            this.$store.commit('setAuthority',Authority)

            if(!response.data.user.IsFirst){
              this.$emit('child-event','modifypasswor')
            }else{
              this.$emit('child-event','welcome')
            }
          }else{
            this.$refs.inputField.focus();
            this.$message.error(response.msg);
          }
        }).catch(error => {
          this.loading=false
          this.$message.error('网络请求错误');
        }); 
        this.getcode()       
      },
      goindex(){
        this.$emit('child-event','home')
      },
      getcode(){
        this.$request.postData('api/getcaptcha',{}).then(response => {
          if(response.code==200){
            this.codeBase64=response.data.b64s;
            this.loginForm.Id=response.data.id;
          }else{
            this.$message.error(response.msg);
          }
        }).catch(error => {
            this.$message.error(response.msg);
        });        
      }      
    }
  }
  </script>
<style scoped>
.full-screen-div {
  position: fixed; /* 使div固定位置 */
  top: 0;
  left: 0;
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  background: #1e68a3;
}
.el-form {
  width: 300px;
  margin: 10px auto 10px auto;
  padding: 20px;
  border-radius: 10px;  
  background-color: #0000001a !important;
}
.grid-content {
  width: 300px;
  min-height: 36px;
  margin: 0 auto;
  color: white;
}
.el-loading-mask {
  background-color: #0000001a !important;
  border-radius: 10px; 
}
.el-code-img{
  background: rgb(255, 255, 255);
    display: flex;
    position: absolute;
    width: 85px;
    right: 1px;
}
</style>