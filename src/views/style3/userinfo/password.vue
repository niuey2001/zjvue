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
      </el-form-item>
    </el-form>
  </div>
  <!-- <div class="full-screen-div1">
            <el-row>
              <el-col justify="center">
                <div class="grid-content">
                  <h1>密码修改</h1>
                </div>
              </el-col>
            </el-row>
            <el-form ref="modifyForm" :model="modifyForm" :rules="rules" label-position="left" label-width="0px" v-loading="loading">
    
              <el-form-item label="" required>
                <el-input type="text"  :value="UserName" autocomplete="true" prefix-icon="User" disabled></el-input>
              </el-form-item>
              <el-form-item label=""  prop="OldPassword">
                <el-input type="password" v-model="modifyForm.OldPassword" autocomplete="off" prefix-icon="Lock" placeholder="请输入旧密码" show-password></el-input>
              </el-form-item>
              <el-form-item label=""  prop="NewPassword">
                <el-input type="password" v-model="modifyForm.NewPassword" autocomplete="off" prefix-icon="Lock" placeholder="请输入新密码" show-password></el-input>
              </el-form-item>              
              <el-form-item label=""  prop="ConfirmPassword">
                <el-input type="password" v-model="modifyForm.ConfirmPassword" autocomplete="off" prefix-icon="Lock" placeholder="确认新密码" show-password></el-input>
              </el-form-item>       
              <el-form-item> 
                <el-button type="primary" @click="submitForm('modifyForm')">确认修改</el-button>
                <el-button @click="resetForm('modifyForm')">重置</el-button>
                <el-button @click="returnForm('modifyForm')">取消</el-button>
              </el-form-item>
              
            </el-form>
  </div> -->

</template>


<script>
import { useTransitionFallthroughEmits } from 'element-plus';

export default {
  data() {
    return {
      tabtext: "密码修改",
      UserName: '',
      modifyForm: {
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: ''
      },
      rules: {
        OldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'change' },
          { min: 6, max: 16, message: '旧密码长度在 6 到 16 个字符之间', trigger: 'change' }
        ],
        NewPassword: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          // { min: 6, max: 16, message: '新密码长度在 6 到 16 个字符之间', trigger: 'change' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/,
            message: '6-16个字符，需包含字母和数字',
            trigger: ['blur', 'change']
          }
        ],
        ConfirmPassword: [
          { required: true, message: '确认新密码', trigger: 'change' },
          { min: 6, max: 16, message: '新密码长度在 6 到 16 个字符之间', trigger: 'change' }
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
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.loading = false
        this.$message.error(response.msg);
      });
    }

  }
}
</script>
<style scoped>
.el-form-table .el-input__inner {
  font-weight: unset !important;
}
</style>
