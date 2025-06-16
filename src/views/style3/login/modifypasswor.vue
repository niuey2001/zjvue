<template>
  <div class="main-boxdiv" style="width: 400px;padding-top:3px;">
    <div class="titlem bodynav">
      密码修改
    </div>
    <el-form ref="modifyForm" :model="modifyForm" :rules="rules" label-width="100px" style="margin-top: 20px;">
      <el-form-item label="账号">
        <el-input style="width:240px;" v-model="UserName" disabled></el-input>
      </el-form-item>

      <el-form-item label="旧密码" prop="OldPassword">
        <el-input type="password" style="width:240px;" v-model="modifyForm.OldPassword" placeholder="请输入旧密码"></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="NewPassword">
        <el-input type="password" style="width:240px;" v-model="modifyForm.NewPassword" placeholder="请输入新密码"></el-input>
      </el-form-item>

      <el-form-item label="确认新密码" prop="ConfirmPassword">
        <el-input type="password" style="width:240px;" v-model="modifyForm.ConfirmPassword"
          placeholder="请再次输入密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('modifyForm')">确认修改</el-button>
        <el-button @click="resetForm('modifyForm')">重置</el-button>
        <el-button   @click="returnForm('modifyForm')">取消</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

 

<script>
import { useTransitionFallthroughEmits } from 'element-plus';

export default {
  props: ['token', 'UserName'],
  data() {
    return {
      tabtext: "首次登录",
      UserName: '',
      modifyForm: {
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: ''
      },
      rules: {
        OldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'change' },
          { min: 6, max: 16, message: '旧密码长度在 6 到 16 个字符', trigger: 'change' }
        ],
        NewPassword: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/,
            message: '6-16个字符，需包含字母和数字',
            trigger: ['blur', 'change']
          }
        ],
        ConfirmPassword: [
          { required: true, message: '确认密码', trigger: 'change' },
          { min: 6, max: 16, message: '二次输入密码长度在 6 到 16 个字符', trigger: 'change' }
        ],
      },
      loading: false
    }
  },
  created() {
    this.UserName = this.$store.state.UserName
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.authentication()
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    authentication() {
      this.loading = true
      this.$request.postData('/changepassword', this.modifyForm).then(response => {
        this.loading = false
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          var value = this.$store.state.value
          var view = 'home' + String(value)
          this.$emit('switchWindow', view)
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(response.msg);
      });
    },
    returnForm() {
      var value = this.$store.state.value
      var view = 'login' + String(value)
      this.$emit('switchWindow', view)
    }

  }
}
</script>
<style>
.full-screen-div1 {
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
  margin-top: 10% !important;
  width: 300px;
  min-height: 36px;
  margin: 0 auto;
  color: white;
}

.login .el-loading-mask {
  background-color: #0000001a !important;
  border-radius: 10px;
}

.login .el-form-item__content {
  justify-content: center !important;
}

.login .el-input__wrapper {
  padding: 6px 11px !important;
}

.login .el-input__inner {
  font-weight: 600 !important;
  font-size: 14px !important;
}

.login .footerch button {
  width: 30%;
}
</style>