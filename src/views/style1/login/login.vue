<template>
  <div class="login full-screen-div">
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
        <el-input  ref="inputField" class="" type="text" :validate-event="true" v-model="loginForm.Answer" autocomplete="off" prefix-icon="CircleCheck" maxlength="5" placeholder="请输入验证码"></el-input>
        <img :src="captchas.b64s" alt="Base64 Image" style="height:40px;width:100px;" @click="getcode()" class="el-input el-code-img">      
      </el-form-item>       
      <el-form-item> 
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
      </el-form-item>
      
    </el-form>
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
      LoginData:Object,
    },           
    data() {
      return {
        alerton:false,
        name: '总监登录', 
        loginForm: {
          'Account': '',
          'Password': '',
          'Answer': '',
          'Id':'',
          'Color':0
        },
        rules: {
          Account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 12, message: '账号长度在 3 到 5 个字符', trigger: 'blur' }
          ], 
          Password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '账号长度在 6 到 16 个字符', trigger: 'blur' }
          ], 
          Answer: [
            { required: true, message: '请输入验证码', trigger: 'blur'},
            { min: 4, max: 4, message: '验证码长度为 4 个字符', trigger: 'blur' }
          ],                             
        },
        captchas:{},
        loading: false       
      }
    },
    created(){
      this.captchas=this.captcha
      this.loginForm.Id=this.captchas.id
      this.loginForm.Color=parseInt(this.captchas.color)
      this.isShow=true
    },
    watch:{
      enteron: {
          handler(newVal, oldVal) {
            if(!this.alerton){
               this.submitForm('loginForm')
            }else{
              this.alerton=false
            }          
          },
          deep: false
        }
    },
    setup() {     
        const enteron= ref(false);
        function enterKey() {
          const code = event.keyCode
                        ? event.keyCode
                        : event.which
                            ? event.which
                            : event.charCode;
                    if (code == 13) {
                      enteron.value=!enteron.value
                    }
          }              
          onMounted(() => {
            document.addEventListener("keyup", enterKey);
          });
      
          onUnmounted(() => {
            document.removeEventListener("keyup", enterKey)
          });
          return {enteron}            
    }, 
    beforeCreate(){

    },
    mounted() {
      
    }, 
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.authentication()
          } else {
            this.alerton=true
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
        this.$request.postData('/login',this.loginForm).then(response => {
          this.loading=false
          if(response.code==200){
            response.data.title=this.captchas.webname
            this.$store.commit('setToken',response.data.token)
            this.$store.commit('setUserName',this.loginForm.Account)
            this.$store.commit('setRule',response.data.rule)
            this.$store.commit('setAuthority',response.data.authority.split(','))
            this.$store.commit('setUserInfo',response.data)
            if(!response.data.isfirst){
              this.$message({
                message: '登录成功，请先修改登录密码',
                type: 'success'
              });              
              this.goindex('modifypasswor')
            }else{
              this.alerton=true
              this.$message({
              message: response.msg,
              type: 'success'
            });              
              this.goindex('welcome')
            }
          }else{
            this.$refs.inputField.focus();
            this.alerton=true
            this.$message.error(response.msg);
          }
        }).catch(error => {
          this.loading=false
          this.$message.error('网络请求错误');
        }); 
        this.getcode()       
      },
      goindex(view){
        var value = this.$store.state.value
        view=view+String(value)
        this.$emit('switchWindow',view)
      },
      getcode(){
        this.$request.postData('/getcaptcha',{WebCode:this.LoginData.WebCode,EnterUrl:this.LoginData.EnterUrl,www:this.LoginData.LocalUrl,Cid:this.LoginData.Cid}).then(response => {
          if(response.code==200){
            this.captchas=response.data;
            this.loginForm.Id=response.data.id;
            this.loginForm.Color=parseInt(response.data.color)
          }else{
            this.$message.error(response.msg);
          }
        }).catch(error => {
            //this.$message.error(response.msg);
        });        
      }      
    }
  }
  </script>
<style>
.full-screen-div {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%; 
  height: 100%;
  background: #1e68a3;
}
.login .el-form {
  width: 300px;
  margin: 10px auto 10px auto;
  padding: 20px;
  border-radius: 10px;  
  background-color: #0000001a !important;
}
.login .grid-content {
  font-size: 16px;
  margin-top:10% !important;
  width: 300px;
  min-height: 36px;
  margin: 0 auto;
  color: white;
}
.login .el-loading-mask {
  background-color: #0000001a !important;
  border-radius: 10px; 
}
.login .el-code-img{
  background: rgb(255, 255, 255);
    display: flex;
    position: absolute;
    width: 85px;
    right: 1px;
}
.login .el-form-item__content{
  justify-content: center !important;  
}
.login .el-input__wrapper{
  padding: 6px 11px !important; 
}
.login .el-input__inner{
  font-weight: 600 !important; 
  font-size: 14px !important; 
}
.login .el-form-item {
  margin-bottom: 10px !important; 
  border-bottom: 0px !important; 
  padding: 5px;
}
.login .el-form-item__error{
  top: 36px !important;
  left: 0 !important; 
}
.login button{
  width: 100%;
  line-height: 30px !important; 
  height: 42px !important; 
  border-radius: 2px;
}
.login .el-button--primary{
  font-weight: 600 !important;
}
.login .el-form-item__error {
  color: var(--el-color-danger);
  font-size: 12px;
  left: 220px;
  line-height: 30px;
  padding-top: 0;
  position: absolute;
  top: 0;
}
</style>