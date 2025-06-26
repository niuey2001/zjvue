<template>
  <div class="main-boxdiv">
    <div class="mb-4">
      <span class="game_box_topbtn" @click="adduseropen">添加子账号</span>
    </div>
    <el-dialog v-model="dialogFormVisible" title="" width="800">
      <div class="titlem bodynav dialog-padding">
        添加子账号
      </div>
      <el-form ref="adduser" :model="adduser" :rules="rules" label-width="0px" class="custom-form-style"
        v-loading="loadingadd">
        <table border="1" class="el-form-table">
          <tbody>
            <tr>
              <td class="el-form-table-label">账号</td>
              <td>
                <el-form-item label="" prop="account">
                  <el-input v-model="adduser.account" placeholder="请输入用户名"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">名称</td>
              <td>
                <el-form-item label="">
                  <el-input v-model="adduser.name" placeholder="请输入名称"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">密码</td>
              <td>
                <el-form-item label="" prop="password">
                  <el-input type="password" v-model="adduser.password" placeholder="请输入密码"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">操作密码</td>
              <td>
                <el-form-item label="" prop="operationpass">
                  <el-input type="password" v-model="adduser.operationpass" placeholder="请输入密码" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">权限</td>
              <td class="el-form-table-tr">
                <el-form-item label="" required>
                  <el-checkbox style="width: 100%;height: 20px;" :indeterminate="isIndeterminate" v-model="checkAll"
                    @change="handleCheckAllChange">全选</el-checkbox>
                  <el-checkbox-group v-model="authority" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="items in authoritydata" :label="items.value" :key="items.name"
                      :value="items.value">{{ items.name }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </td>
            </tr>
            <!-- <tr>
          <td class="el-form-table-label">样式选择</td>
          <td>        
            <el-form-item label="">
              <select v-model="adduser.color" laceholder="请选择样式">
                <option v-for="item in 6" :key="item" :label="'样式'+item" :value="parseFloat(item)">1</option>
              </select>
            </el-form-item>  
        </td>
        </tr>   -->
            <tr>
              <td class="el-form-table-label">IP白名单</td>
              <td>
                <el-form-item label="">
                  <el-input type="textarea" v-model="adduser.ip" placeholder="多个用逗号分隔"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label"></td>
              <td class="el-form-table-footer">
                <span class="game_box_topbtn" @click="onSubmit('adduser', adduser)">确认添加</span>
                <span class="game_box_topbtn" @click="resetForm('adduser')">重置</span>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </el-dialog>
    <el-dialog v-model="dialogFormVisible2" title="" width="800">
      <div class="titlem bodynav dialog-padding">
        编辑子账号
      </div>
      <el-form ref="edit" :model="editdata" :rules="editrules" label-width="0px" class="custom-form-style"
        v-loading="loadingadd">
        <table border="1" class="el-form-table">
          <tbody>
            <tr>
              <td class="el-form-table-label">账号</td>
              <td>
                <el-form-item label="">
                  {{ editdata.account }}
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">名称</td>
              <td>
                <el-form-item label="">
                  <el-input v-model="editdata.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">密码</td>
              <td>
                <el-form-item label="" prop="password">
                  <el-input type="password" v-model="editdata.password" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">操作密码</td>
              <td>
                <el-form-item label="" prop="operationpass">
                  <el-input type="password" v-model="editdata.operationpass" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">权限</td>
              <td class="el-form-table-tr">
                <el-form-item label="" required>
                  <el-checkbox style="width: 100%;height: 20px;" :indeterminate="isIndeterminate" v-model="checkAll"
                    @change="handleCheckAllChange">全选</el-checkbox>
                  <el-checkbox-group v-model="authority" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="items in authoritydata" :label="items.value" :value="items.value"
                      :key="items.name">{{ items.name }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">状态</td>
              <td>
                <el-form-item label="" required>
                  <el-radio-group v-model="editdata.state">
                    <el-radio :label="true">启用</el-radio>
                    <el-radio :label="false">停用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <!-- <tr>
          <td class="el-form-table-label">样式选择</td>
          <td>        
            <el-form-item label="">
              <select v-model="editdata.color" laceholder="请选择样式">
                <option v-for="item in 6" :key="item" :label="'样式'+item" :value="parseFloat(item)">1</option>
              </select>
            </el-form-item>  
        </td>
        </tr>   -->
            <tr>
              <td class="el-form-table-label">IP白名单</td>
              <td>
                <el-form-item label="">
                  <el-input type="textarea" v-model="editdata.ip" placeholder="多个用逗号分隔"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label"></td>
              <td class="el-form-table-footer">
                <span class="game_box_topbtn" @click="onSubmit('edit', editdata)">确认修改</span>
                <span class="game_box_topbtn" @click="resetForm('edit')">重置</span>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </el-dialog>
    <el-dialog v-model="dialogFormVisible3" title="" class="dssetCom-dialog">
      <div class="titlem bodynav  dialog-padding">
        {{ logdata.index == 1 ? '操作记录' : '登录日志' }} - {{ logdata.account }}
      </div>
      <div class="main-boxdiv1" style="width: 100%;height:92%;">
        <el-table border :header-cell-class-name="'trheader'" :data="logdata.logtable" height="100%"
          style="width: 100%">
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column v-if="logdata.index == 1" label="操作项目">
            <template #default="{ row }">
              {{ GetType(row.Type)[0].name }}
            </template>
          </el-table-column>
          <el-table-column prop="Account" :label="logdata.index == 1 ? '操作人' : '登录账号'" />
          <el-table-column v-if="logdata.index == 1" prop="AccountTo" label="被操作人" />
          <el-table-column prop="Date" :label="logdata.index == 1 ? '操作时间' : '登录时间'" />
          <el-table-column v-if="logdata.index == 2" prop="Ip" label="登录IP" />
          <el-table-column prop="Message" :label="logdata.index == 1 ? '操作内容' : '地区'" />
          <el-table-column prop="Message1" v-if="logdata.index == 1" label="前值" />
          <el-table-column prop="Message2" v-if="logdata.index == 1" label="后值" />
        </el-table>
        <div class="mb-4">
          <el-pagination background layout="total,prev, pager, next" v-model:current-page="logdata.page"
            v-model:page-size="logdata.size" :total="logdata.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </el-dialog>
    <el-table border :header-cell-class-name="'trheader'" :data="tableData" :height="clientHeight2 + 'px'"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="account" label="账号" width="150" />
      <el-table-column prop="name" label="名称" width="120" />
      <el-table-column prop="state" label="状态" width="120">
        <template #default="{ row }">
          <span v-if="row.state">启用</span>
          <span v-else style="color: red;">已停用</span>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="白名单" width="120" />
      <el-table-column prop="color" label="样式" width="120" />
      <el-table-column prop="authority" label="权限">
        <template #default="{ row }">
          {{ getAname(row.authority) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <span @click="edit(row)">编辑</span> |
          <span @click="del(row)">删除</span> |
          <span @click="logdata.id = row.id, logdata.account = row.account, logdata.index = 1, logdata.page = 1, logs()">记录</span> |
          <span @click="logdata.id = row.id, logdata.account = row.account, logdata.index = 2, logdata.page = 1, logs()">日志</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  props: {
    clientHeight2: {
      type: Number
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      checkAll: false,
      isIndeterminate: true,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      adduser: {
        account: '',
        name: '',
        password: '',
        authority: '',
        ip: '',
        color: 1,
        operationpass: ''
      },
      authority: [],
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
        operationpass: [
          { required: true, message: '请输入操作密码', trigger: 'change' },
          { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'change' }
        ]
      },
      editrules: {
        password: [
          {
            validator: (rule, value, callback) => {
              if (value && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(value)) {
                callback(new Error('密码需为6-16位字母+数字组合'));
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change']
          }
        ],
        operationpass: [
          {
            validator: (rule, value, callback) => {
              if (value && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(value)) {
                callback(new Error('密码需为6-16位字母+数字组合'));
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change']
          }
        ]
      },
      authoritydata: [
        { 'name': '彩盘监控', 'value': 'jiankong' },
        { 'name': '订单明细', 'value': 'orderitem' },
        { 'name': '控盘管理', 'value': 'kongpan' },
        { 'name': '报表查询', 'value': 'report' },
        { 'name': '即时注单', 'value': 'jszd' },
        { 'name': '订单备份', 'value': 'backup' },
        { 'name': '账号管理', 'value': 'member' },
        { 'name': '子账管理', 'value': 'son' },
        { 'name': '补货账号', 'value': 'bhuser' },
        { 'name': '开盘设置', 'value': 'lottery' },
        { 'name': '赔率设置', 'value': 'odds' },
        { 'name': '退水设置', 'value': 'backs' },
        { 'name': '自动降赔', 'value': 'autodrops' },
        { 'name': '通知设置', 'value': 'notice' },
        { 'name': '个人资料', 'value': 'person' }
      ],
      tableData: [
      ],
      loading: true,
      loadingadd: false,
      editdata: [],
      page: 1,
      logdata: {
        id: '',
        account: '',
        index: 1,
        page: 1,
        size: 50,
        total: 0,
        logtable: []
      }
    }
  },
  created() {
    this.Authoritys = this.$store.state.Authority
    var a = []
    for (let key in this.authoritydata) {
      if (this.Authoritys.includes(this.authoritydata[key].value)) {
        a.push(this.authoritydata[key])
      }
    }
    this.authoritydata = a
    this.getdata()
    //id page   loginlogs//登录   logs//操作
  },
  methods: {
    handleSizeChange(size) {
      this.logdata.size = size
    },
    handleCurrentChange(newPage) {
      this.logdata.page = newPage
      this.logs()
    },
    handleCheckAllChange(val) {
      this.authority = []
      if (val) {
        for (let key in this.authoritydata) {
          this.authority.push(this.authoritydata[key].value)
        }
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.authoritydata.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.authoritydata.length;
    },
    getdata() {
      this.dialogFormVisible = false
      this.$request.postData('/son/find', {}).then(response => {
        this.loading = false
        if (response.code == 200) {
          this.tableData = response.data.data
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.loading = false
        this.$message.error('网络请求错误');
      });
    },
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
    postdata(val, data) {
      var url = ''
      if (val == 'adduser') {
        if (this.authority.length == 0) { this.$message.error('请选择权限'); return }
        url = '/son/add'
        data.authority = this.authority.join(',')
      }
      if (val == 'edit') {
        url = '/son/edit'
        data.id = parseFloat(data.id)
        data.authority = this.authority.join(',')
      }
      if (val == 'del') {
        data.id = parseFloat(data.id)
        url = '/son/del'
      }
      if (url != '') {
        this.loadingadd = true
        this.$request.postData(url, data).then(response => {
          this.loadingadd = false
          if (response.code == 200) {
            this.$message({
              message: response.msg,
              type: 'success'
            });
            this.getdata()
          } else {
            this.$message.error(response.msg);
          }
        }).catch(error => {
          this.loadingadd = false
          this.$message.error('网络请求错误');
        });
      }
    },
    del(row) {
      var data = { 'id': row.id }
      this.postdata('del', data)
    },
    adduseropen() {
      this.checkAll = false
      this.authority = []
      this.resetForm("adduser")
      this.dialogFormVisible = true

    },
    resetForm(formName) {
      this.authority = []
      this.authorityzu = -1
      this.adduser = this.$options.data.call(this).adduser
      this.addauthority = this.$options.data.call(this).addauthority
    },
    edit(row) {
      this.editdata = JSON.parse(JSON.stringify(row))
      this.editdata.password = ''
      this.editdata.operationpass = ''
      this.authority = this.editdata.authority.split(',')
      this.dialogFormVisible2 = true
    },
    getAname(val) {
      var a = val.split(',')
      var val1 = []
      for (var i = 0; i < this.authoritydata.length; i++) {
        for (var i1 = 0; i1 < a.length; i1++) {
          if (this.authoritydata[i].value == a[i1]) {
            val1.push(this.authoritydata[i].name)
          }
        }
      }
      val1 = val1.join(' | ')
      return val1
    },
    logs() {
      this.logdata.logtable = []
      this.dialogFormVisible3 = true
      var url = this.logdata.index == 2 ? '/loginlogs' : '/logs'
      this.$request.postData(url, { id: parseFloat(this.logdata.id), page: this.logdata.page }).then(response => {
        if (response.code == 200) {
          this.logdata.logtable = response.data.data
          this.logdata.total = response.data.count
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.loading = false
        this.$message.error('网络请求错误');
      });
    },
    GetType(value) {
      var a = [{ 'name': '-' }]
      if (value != '') {
        var a1 = this.authoritydata.filter((item) => item.value == value)
        if (a1.length > 0) {
          a = a1
        }
      }
      return a
    }
  }

}
</script>
<style scoped>
.el-row {
  width: 100%;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  margin-bottom: 5px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  padding-left: 5px;
  text-align: justify;
}

.el-collapse {
  --el-collapse-border-color: none;
  --el-collapse-header-height: 48px;
  --el-collapse-header-padding-left: 10px;
}

.el-checkbox-group {
  width: 100%;
  background-color: #f5f5f5;
  display: contents;
}

.el-checkbox {
  margin-right: 10px !important;
}
</style>