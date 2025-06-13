<template>
  <el-form ref="adduser" :model="adduser" :rules="rules" label-width="80px" class="custom-form-style"
    v-loading="loadingadd">
    <el-form-item label="账号" prop="account">
      <el-input style="width:220px;" v-model="adduser.account" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input style="width:220px;" v-model="adduser.name" placeholder="请输入姓名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input style="width:220px;" type="password" v-model="adduser.password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('adduser', adduser)">确认添加</el-button>
      <el-button @click="resetForm('adduser')">重置</el-button>
    </el-form-item>
  </el-form>
</template>


<script>
export default {
  props: {
    componentsPoPdata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loadingadd: false,
      adduser: {
        id: '',
        account: '',
        name: '',
        password: '',
        type: 1
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'change' },
          { min: 3, max: 12, message: '账号长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/,
            message: '6-16个字符，需包含字母和数字',
            trigger: ['blur', 'change']
          }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ]
      },
    }
  },
  created() {
    this.adduser = { id: parseInt(this.componentsPoPdata.nowmember.id), account: '', name: '', password: '', type: this.componentsPoPdata.ctype }
  },
  methods: {
    onSubmit(val, data) {
      this.$refs[val].validate((valid) => {
        if (valid) {
          this.postdata(val, data)
        } else {
          this.$message.error('请正确填写参数');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.adduser.account = ''
      this.adduser.password = ''
      this.adduser.name = ''
    },
    postdata(val, data) {
      this.loadingadd = true
      this.$request.postData('/member/add', data).then(response => {
        this.loadingadd = false
        if (response.code == 200) {
          this.componentsPoPdata.editfrist = true
          this.$emit('getdata')
          this.$emit('opencomponentsBox', 'editCom', this.componentsPoPdata.ctype, response.data.newuid)
          this.$message({
            message: response.msg,
            type: 'success'
          });

        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.loadingadd = false
        this.$message.error('网络请求错误');
      });
    },
  }
}
</script>
