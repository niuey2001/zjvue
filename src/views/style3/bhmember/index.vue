<template>
  <div class="main-boxdiv">
    <div class="mb-4">
      <span class="game_box_topbtn" @click="adduseropen">添加外补账号</span>
    </div>
    <el-dialog v-model="dialogFormVisible" title="" width="800">
      <div class="titlem bodynav dialog-padding">
        添加外补账号
      </div>
      <el-form ref="adduser" :model="adduser" :rules="rules" label-width="0px" class="custom-form-style"
        v-loading="loadingadd">
        <table border="1" class="el-form-table">
          <tbody>
            <tr>
              <td class="el-form-table-label">账号</td>
              <td>
                <el-form-item label="" prop="account">
                  <el-input style="width:150px;" v-model="adduser.account" placeholder="请输入账号"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">名称</td>
              <td>
                <el-form-item label="">
                  <el-input style="width:150px;" v-model="adduser.name" placeholder="请输入名称/备注"></el-input>
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
        编辑外补账号
      </div>
      <el-form ref="adduser" :model="editdata" :rules="rules" label-width="0px" class="custom-form-style"
        v-loading="loadingadd">
        <table border="1" class="el-form-table">
          <tbody>
            <tr>
              <td class="el-form-table-label">账号</td>
              <td>
                <el-form-item label="" prop="account">
                  {{ editdata.account }}
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">名称</td>
              <td>
                <el-form-item label="">
                  <el-input style="width:150px;" v-model="editdata.name" placeholder="请输入名称/备注"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">状态</td>
              <td>
                <el-form-item label="">
                  <select v-model="editdata.state">
                    <option :value="true">启动</option>
                    <option :value="false">停用</option>
                  </select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label"></td>
              <td class="el-form-table-footer">
                <span class="game_box_topbtn" @click="postdata('edit', editdata)">确认修改</span>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </el-dialog>
    <el-dialog v-model="dialogFormVisible3" title="" class="dssetCom-dialog">
      <div class="titlem bodynav dialog-padding">
        {{ set_user_title }}
      </div>
      <component :is="opencomponents" :user_id="set_user_id" :home_data="home_data"></component>
    </el-dialog>
    <el-table border :header-cell-class-name="'trheader'" :data="tableData" :height="clientHeight2 + 'px'"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="account" label="补货账号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="state" label="状态">
        <template #default="{ row }">
          <span v-if="row.state">启用</span>
          <span v-else style="color: red;">已停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <span @click="edit(row)">编辑</span> |
          <span @click="opencomponentsBox('oddset', row)">赔率</span> |
          <span @click="opencomponentsBox('dsset', row)">退水</span> |
          <span @click="del(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
import { defineAsyncComponent } from 'vue';
export default {
  props: {
    clientHeight2: {
      type: Number,
      required: true
    },
    home_data: {
      type: Array
    }
  },
  components: {
    oddset: defineAsyncComponent(() => import('./oddset.vue')),
    dsset: defineAsyncComponent(() => import('./dsset.vue')),
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      adduser: {
        account: '',
        name: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'change' },
          { min: 3, max: 12, message: '账号长度在 3 到 5 个字符', trigger: 'change' }
        ]
      },

      tableData: [
      ],
      loading: true,
      loadingadd: false,
      editdata: [],
      page: 1,
      opencomponents: '',
      set_user_id: 0,
      set_user_title: '',
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      this.dialogFormVisible = false
      this.dialogFormVisible2 = false
      this.$request.postData('/bhuser/find', {}).then(response => {
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
        url = '/bhuser/add'
      }
      if (val == 'edit') {
        url = '/bhuser/edit'
      }
      if (val == 'del') {
        var data1 = {}
        data.id = parseFloat(data.id)
        url = '/bhuser/del'
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
      this.resetForm("adduser")
      this.dialogFormVisible = true

    },
    resetForm(formName) {
      this.adduser = this.$options.data.call(this).adduser
    },
    edit(row) {
      this.editdata = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible2 = true
    },
    opencomponentsBox(view, row) {
      this.opencomponents = view;
      this.set_user_id = row.id
      this.dialogFormVisible3 = true
      if (view == 'oddset') {
        this.set_user_title = '赔率设置' + '-补货账号【' + row.account + '】'
      } else {
        this.set_user_title = '退水设置' + '-补货账号【' + row.account + '】'
      }
    },
  }

}
</script>