<template>
    <el-page-header @back="goBack" content="游戏管理">
    </el-page-header> 
    <div class="mb-4">
      <el-button type="primary" @click="dialogFormVisible = true">创建游戏</el-button>
      <el-button disabled>Default</el-button>
      <el-button type="primary" disabled>Primary</el-button>
      <el-button type="info" disabled>Info</el-button>
      <el-button type="success" @click="open">启用</el-button>
      <el-button type="warning" @click="stop">停用</el-button>
      <el-button type="danger" @click="del">删除</el-button>
    </div>    

    <el-dialog v-model="dialogFormVisible" title="创建游戏" width="800">
    <el-form :model="form" label-width="auto" style="max-width: 600px;padding:20px" v-loading="loadingadd">
        <el-form-item label="名称">
          <el-input v-model="form.Name" />
        </el-form-item>
        <el-form-item label="拷贝赔率">
          <el-radio-group v-model="form.Id">
            <el-radio :label="items.Id" v-for="items in tableData">{{items.Name}}</el-radio>
          </el-radio-group>  
        </el-form-item>
     
<!----      
        <el-form-item label="开盘规则">
          <el-select v-model="form.region" placeholder="请选择规则">
            <el-option label="每日" value="每日" />
            <el-option label="隔天" value="隔天" />
            <el-option label="3天" value="3天" />
            <el-option label="手动" value="手动" />
          </el-select>
        </el-form-item>
        <el-form-item label="首期开奖时间">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.date2"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="特码封盘时间">
            <el-col :span="11">
              <el-time-picker
                v-model="form.date2"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>    
          <el-form-item label="非特码封盘时间">
            <el-col :span="11">
              <el-time-picker
                v-model="form.date2"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>             
          <el-form-item label="开盘时间">
            <el-col :span="11">
              <el-time-picker
                v-model="form.date2"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>              
        <el-form-item label="是否自动开盘">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        <el-form-item label="是否自动收单">
            <el-switch v-model="form.delivery" />
        </el-form-item>        
        <el-form-item label="开放项目">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group  v-model="form.type" @change="handleCheckedCitiesChange">
            <el-collapse>
              <el-collapse-item title="游戏项目" name="1">
                    <el-row :gutter="10">
                      <el-col :span="6"  v-for="items in gametype" :key="items"><div class="grid-content bg-purple">
                        <el-checkbox :value="items"  >
                          {{ items }}
                        </el-checkbox> 
                      </div></el-col>
                    </el-row> 
              </el-collapse-item>
            </el-collapse> 
          </el-checkbox-group>                                                      

         
        </el-form-item>
      

        <el-form-item label="备注信息">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
    --->    
        <el-form-item>
          <el-button type="primary" @click="onSubmit('addgame',form)">确认添加</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>   
    <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column fixed prop="Id" label="ID" />
      <el-table-column fixed prop="Name" label="名称" />
      <el-table-column fixed prop="CreatedAt" label="创建时间" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #header>
          <el-input v-model="search" size="small" placeholder="快速搜索" />
        </template>
        <template #default>

        </template>
      </el-table-column>
    </el-table>
    <div class="mb-4">
      <el-pagination background layout="prev, pager, next" :total="1000" /> 
    </div>

   
</template>  
     
<script>
      export default {
        data() {
          return {
            dialogFormVisible: false,
            checkAll: false,
            isIndeterminate: true,
            form: {
                Id:'',
                Name: ''
            },
            gametype:['两面','特码','正码','正1','正2','正3','正4','正5','正6','波色','一肖','一肖不中','特肖','六肖中','六肖不中','尾数','尾数不中','一肖量','尾数量','五行','七码','过关','四中四','三全中','三中二','二全中','二中特','特串','二肖连中','三肖连中','四肖连中','五肖连中','二肖连不中','三肖连不中','四肖连不中','五肖连不中','五不中','六不中','七不中','八不中','九不中','十不中','十一不中','十二不中','五中一','六中一','七中一','八中一','九中一','十中一','十一中一','十二中一','一粒任中','二粒任中','三粒任中','四粒任中','五粒任中','特头数','特尾数','总肖','七色波','合肖','正肖'],
            gametype1:['两面11','特码','正码','正1','正2','正3','正4','正5','正6','波色','一肖','一肖不中','特肖','六肖中','六肖不中','尾数','尾数不中','一肖量','尾数量','五行','七码','过关','四中四','三全中','三中二','二全中','二中特','特串','二肖连中','三肖连中','四肖连中','五肖连中','二肖连不中','三肖连不中','四肖连不中','五肖连不中','五不中','六不中','七不中','八不中','九不中','十不中','十一不中','十二不中','五中一','六中一','七中一','八中一','九中一','十中一','十一中一','十二中一','一粒任中','二粒任中','三粒任中','四粒任中','五粒任中','特头数','特尾数','总肖','七色波','合肖','正肖'],
            tableData: [            
            ],
            multipleSelection: [],//多选
            search: '',
            loading:false,
            loadingadd:false
          }
        },
        created(){
          this.getdata()
        },
        methods: {
            getdata(){
              this.loading=true
                  this.$request.postData('api/lottery/find',{}).then(response => {
                    this.loading=false
                    if(response.code==200){
                       this.tableData=  response.data.data         
                    }else{
                      this.$message.error(response.msg);
                    }
                  }).catch(error => {
                    this.loading=false
                    this.$message.error('网络请求错误');
                  }); 
            },         
            onSubmit(val,data){
               this.postdata(val,data)
            },
            postdata(val,data){
              var url=''
              if(val=='addgame'){
                url='api/lottery/add'
              }                                     
              if(url!=''){
                  this.loadingadd=true
                  this.$request.postData(url,data).then(response => {
                    this.loadingadd=false
                    if(response.code==200){
                      this.$message({
                        message: response.msg,
                        type: 'success'
                      }); 
                      this.getdata()                 
                    }else{
                      this.$message.error(response.msg);
                    }
                  }).catch(error => {
                    this.loadingadd=false
                    this.$message.error('网络请求错误');
                  }); 
                }
            },
            handleCheckAllChange(val) {
                this.form.type = val ? this.gametype : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.gametype.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.gametype.length;
            },
            //表格操作
            handleClick(row){
              console.log(row)
            },
            handleSelectionChange(val) {
              this.multipleSelection = val;
            },
            open(){
              this.$message({
              message: '启用游戏成功',
              type: 'success',
              iconClass:'tt'
              });
            },
            stop(){
              this.$message({
              message: '停用游戏成功',
              type: 'warning'
              });
            },
            del(){
              this.$message({
              message: '删除游戏成功',
              type: 'error'
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
.el-collapse{
  --el-collapse-border-color:none;
  --el-collapse-header-height: 48px;
  --el-collapse-header-padding-left:10px;
}

.el-checkbox-group{
  width: 100%;
  background-color: #f5f5f5;
}
</style>      