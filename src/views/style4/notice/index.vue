<template>
  <div class="main-boxdiv">
    <div class="mb-4">
      <span class="game_box_topbtn" @click="dialogFormVisible = true">添加公告</span>
    </div>
    <el-dialog v-model="dialogFormVisible" title="" width="800">
      <div class="titlem bodynav dialog-padding">
        添加公告
      </div>
      <el-form label-width="0px" class="custom-form-style">
        <table border="1" class="el-form-table">
          <tbody>
            <tr>
              <td class="el-form-table-label">内容</td>
              <td>
                <el-form-item label="">
                  <el-input type="textarea" v-model="updata.message" placeholder="请输入内容"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label">排序</td>
              <td>
                <el-form-item label="">
                  <el-input v-model="updata.sort" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="el-form-table-label"></td>
              <td class="el-form-table-footer">
                <span class="game_box_topbtn" @click="updatapost()">确认添加</span>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </el-dialog>


    <el-table border :header-cell-class-name="'trheader'" :data="tableData" :height="clientHeight2 + 'px'"
      v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="message" label="内容" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <span @click="del(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="main-boxdiv-bottom"></div>
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
      loading: false,
      dialogFormVisible: false,
      isIndeterminate: true,
      checkAll: false,
      checkdata: [],
      updata: {
        message: '',
        sort: 1
      },

      tableData: [
      ],
      multipleSelection: [],
      Company: ['A总监', 'B总监'],
      showdata: ['总监', '代理', '会员']
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      this.loading = true
      this.$request.postData('/notice/find', {}).then(response => {
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
    updatapost() {
      this.updata.sort = parseInt(this.updata.sort)
      this.$request.postData('/notice/add', this.updata).then(response => {
        if (response.code == 200) {
          this.dialogFormVisible = false
          this.updata = {
            message: '',
            sort: 1
          }
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.getdata()
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.$message.error('网络请求错误');
      });
    },
    del(row) {
      this.$request.postData('/notice/del', row).then(response => {
        if (response.code == 200) {
          if (response.code == 200) {
            this.$message({
              message: response.msg,
              type: 'success'
            });
            this.getdata()
          } else {
            this.$message.error(response.msg);
          }
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.$message.error('网络请求错误');
      });
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