<template>
    <el-page-header @back="goBack" content="账号管理">
    </el-page-header> 
    <div class="mb-4">     
      <el-button type="primary" @click="adduseropen">添加账号</el-button>
      <el-button  @click="addauthorityopen">添加权限组</el-button>
      <el-button @click="dialogFormVisible3 = true">管理权限组</el-button>
      <el-button type="success" @click="open">启用</el-button>
      <el-button type="warning" @click="stop">停用</el-button>
      <el-button type="danger" @click="del">删除</el-button>
    </div>    
    <el-dialog v-model="dialogFormVisible" title="添加账号" width="800">
    <el-form ref="adduser" :model="adduser" :rules="rules" label-width="auto" style="max-width: 600px;padding:20px" v-loading="loadingadd">
        <el-form-item label="账号" prop="UserAcount">
          <el-input v-model="adduser.UserAcount" prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="adduser.UserName" prefix-icon="User" placeholder="请输入名称"></el-input>
        </el-form-item>    
        <el-form-item label="密码" prop="UserPassword">
          <el-input type="password" v-model="adduser.UserPassword" prefix-icon="Lock" placeholder="请输入密码"></el-input>
        </el-form-item>    
        <el-form-item label="快捷权限">
          <div>
            <el-radio-group v-model="authorityzu" size="medium" @change="changezu">
              <el-radio-button v-for="(items,index) in authoritys" :label="index">{{items.Name}}</el-radio-button>
              <el-radio-button label="-2">重置</el-radio-button>
            </el-radio-group>
          </div>         
        </el-form-item>                 
        <el-form-item label="权限" required>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group  v-model="authority" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="items in authoritydata" :label="items.value" :key="items.name">{{items.name}}</el-checkbox>
          </el-checkbox-group>                                                               
        </el-form-item>
        <el-form-item label="操作码" required>
          <el-input type="password" v-model="adduser.OperationPassword" prefix-icon="Lock" placeholder="请输入操作码"></el-input>
        </el-form-item>           
        <el-form-item>
          <el-button type="primary" @click="onSubmit('adduser',adduser)">确认添加</el-button>
          <el-button @click="resetForm('adduser')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> 
    <el-dialog v-model="dialogFormVisible2" title="添加权限组" width="800">
      <el-form ref="addauthority" :rules="rules" :model="addauthority" label-width="auto" style="max-width: 600px;padding:20px" v-loading="loadingauthority">
          <el-form-item label="组名称" prop="Name">
            <el-input v-model="addauthority.Name" />
          </el-form-item>
       
          <el-form-item label="权限选择">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll2" @change="handleCheckAllChange2" style="margin-right: 15px;">全选</el-checkbox>
            <el-checkbox-group  v-model="authority" @change="handleCheckedCitiesChange2">
              <el-checkbox v-for="items in authoritydata" :label="items.value" :key="items.name">{{items.name}}</el-checkbox>
            </el-checkbox-group>                                                      
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('addauthority',addauthority)">创建</el-button>
            <el-button @click="resetForm('addauthority')">重置</el-button>
          </el-form-item>
        </el-form>
    </el-dialog> 
    <el-dialog v-model="dialogFormVisible6" title="编辑权限组" width="800">
      <el-form ref="editauthority" :rules="rules" :model="editgroupdata" label-width="auto" style="max-width: 600px;padding:20px" v-loading="loadingauthority">
          <el-form-item label="组名称" prop="Name">
            <el-input v-model="editgroupdata.Name" />
          </el-form-item>
       
          <el-form-item label="权限选择">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll2" @change="handleCheckAllChange2" style="margin-right: 15px;">全选</el-checkbox>
            <el-checkbox-group  v-model="authority" @change="handleCheckedCitiesChange2">
              <el-checkbox v-for="items in authoritydata" :label="items.value" :key="items.name">{{items.name}}</el-checkbox>
            </el-checkbox-group>                                                      
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('editauthority',editgroupdata)">确认修改</el-button>
            <el-button @click="resetForm('editauthority')">重置</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>     
      <el-dialog v-model="dialogFormVisible3" title="限组管理列表" width="800">
        <el-table :data="authoritys" style="width: 100%">
          <el-table-column fixed prop="Name" label="名称" width="150" />
          <el-table-column prop="Value" label="权限">
            <template #default="{$index}">
              {{ getAname(authoritys[$index].Value) }}
             </template>            
          </el-table-column>  
          <el-table-column fixed="right" label="操作"  width="150">
            <template #default="{$index}">
              <el-button type="primary" size="small" @click="editgroup($index)">编辑</el-button>
              <el-button type="danger" size="small" @click="delgroup($index)">删除</el-button>          
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>         
      <el-dialog v-model="dialogFormVisible4" title="编辑账号" width="800">
        <el-form ref="edit" :rules="rules"  :model="editdata" label-width="auto" style="max-width: 600px;padding:20px">
            <el-form-item label="账号">
              {{ editdata.UserAcount }}
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="editdata.UserName" />
            </el-form-item>    
            <el-form-item label="密码">
              <el-input type="password" v-model="editdata.UserPassword" />
            </el-form-item>  
            <el-form-item label="状态">
              <el-radio-group v-model="editdata.State">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>               
            <el-form-item label="白名单">
              <el-input v-model="editdata.Ip" />
            </el-form-item>               
            <el-form-item label="快捷权限">
              <div>
                <el-radio-group v-model="authorityzu" size="medium" @change="changezu">
                  <el-radio-button v-for="(items,index) in authoritys" :label="index">{{items.Name}}</el-radio-button>
                  <el-radio-button label="-2">重置</el-radio-button>
                </el-radio-group>
              </div>        
            </el-form-item>                 
            <el-form-item label="权限选择">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group  v-model="authority" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="items in authoritydata" :label="items.value" :key="items.name">{{items.name}}</el-checkbox>
              </el-checkbox-group>                                                                  
            </el-form-item>
            <el-form-item label="操作码">
              <el-input type="password" v-model="editdata.OperationPassword" />
            </el-form-item>             
            <el-form-item>
              <el-button type="primary" @click="onSubmit('edit',editdata)">修改</el-button>
              <el-button @click="resetForm('edit')">重置</el-button>
            </el-form-item>
          </el-form>
      </el-dialog>  
      <el-dialog v-model="dialogFormVisible5" title="操作日志" width="800"> 
        11
      </el-dialog>      
    <div  v-loading="loading">
      
      <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData.filter(data => !search || data.UserAcount.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="UserAcount" label="名称" width="150" />
        <el-table-column prop="UserName" label="名称" width="120" />
        <el-table-column prop="State" label="状态" width="120">
          <template #default="{$index}">
               <span v-if="tableData[$index].State" style="color: red;">停用</span>
               <span v-else style="color: green;">启用</span>
          </template>
        </el-table-column>  
        <el-table-column prop="Authority" label="权限">
          <template #default="{$index}">
            {{ getAname(tableData[$index].Authority) }}
           </template> 
        </el-table-column> 
        <el-table-column fixed="right" label="Operations" width="280" >
          <template #header>
            <el-input v-model="search" size="small" placeholder="快速搜索" />
          </template>
          <template #default="{$index}">
            <el-button type="primary" size="small" @click="edit($index)">编辑</el-button>
            <el-button type="danger" size="small" @click="del($index)">删除</el-button>    
            <el-button size="small" @click="dialogFormVisible5=true">记录</el-button>        
          </template>
        </el-table-column>
      </el-table>
      <div class="mb-4">
        <el-pagination background layout="prev, pager, next" :total="1000" /> 
      </div>
    </div>

   
</template>  
     
<script>
      export default {
        data() {
          return {
            dialogFormVisible: false,
            checkAll: false,
            isIndeterminate: true,
            dialogFormVisible2: false,
            checkAll2: false,
            isIndeterminate2: true, 
            dialogFormVisible3: false,  
            dialogFormVisible4: false, 
            dialogFormVisible5: false,  
            dialogFormVisible6: false,         
            adduser: {
              UserAcount:'',
              UserName: '',
              UserPassword:'',
              Authority:'',
              OperationPassword:''
            },
            rules: {
              UserAcount: [
                { required: true, message: '请输入账号', trigger: 'change' },
                { min: 3, max: 12, message: '账号长度在 3 到 5 个字符', trigger: 'change' }
              ], 
              UserPassword: [
                { required: true, message: '请输入密码', trigger: 'change' },
                { min: 6, max: 16, message: '账号长度在 6 到 16 个字符', trigger: 'change' }
              ], 
              AuthorityName: [
                { required: true, message: '请输入名称', trigger: 'change' }
              ]                             
            },
            authority:[],
            authoritydata:[
              {'name':'账号管理','value':'user'},
              {'name':'基础设置','value':'system'},
              {'name':'游戏设置','value':'game'},
              {'name':'赔率设置','value':'odds'},
              {'name':'赔率设置','value':'ds'},
              {'name':'总监设置','value':'company'}
            ],
            authorityzu:-1,
            authoritys:[
            ],
            addauthority: {
              Name:'',
              Value:''
            },            
            tableData: [                         
            ],
            multipleSelection: [],//多选
            search: '',
            loading: true,
            loadingadd: false,
            loadingauthority:false,
            editdata:[],
            editgroupdata:[]   
          }
        },
        created(){
          this.getdata()
        },
        methods: {
            getdata(){
              this.dialogFormVisible=false
              this.dialogFormVisible2=false
              this.dialogFormVisible3=false
              this.dialogFormVisible4=false
              this.dialogFormVisible5=false
              this.dialogFormVisible6=false
              this.$request.postData('api/user/find',{}).then(response => {
                this.loading=false
                if(response.code==200){
                  this.authoritys=response.data.group
                  this.tableData=response.data.users
                  console.log("表格数据"+this.tableData)
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loading=false
                this.$message.error('网络请求错误');
              }); 
            },
            onSubmit(val,data){
              this.$refs[val].validate((valid) => {
                if (valid){
                     this.postdata(val,data)
                }else{
                  this.$message.error('请正确填写参数');
                  return false;
                }
              });
            },
            postdata(val,data){
              var url=''
              if(val=='adduser'){
                url='api/user/add'
                data.Authority=this.authority.join()
              }
              if(val=='addauthority'){
                url='api/authoritygroup/add'
                data.Value=this.authority.join()
              }   
              if(val=='editauthority'){
                url='api/authoritygroup/edit'
                data.Value=this.authority.join()
              }                
              if(val=='edit'){
                url='api/user/edit'
                data.Authority=this.authority.join()
              } 
              if(val=='del'){
                url='api/user/del'
              }   
              if(val=='delgroup'){
                url='api/authoritygroup/del'
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
              this.authority=[]
              if(val){
                for(var i=0;i<this.authoritydata.length;i++){
                  this.authority.push(this.authoritydata[i].value)
                }
              }
                //this.authority = val ? this.authoritydata : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.authoritydata.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.authoritydata.length;
            },
            handleCheckAllChange2(val) {
                this.authority=[]
                if(val){
                  for(var i=0;i<this.authoritydata.length;i++){
                    this.authority.push(this.authoritydata[i].value)
                  }
                }
                this.isIndeterminate2 = false;
            },            
            handleCheckedCitiesChange2(value) {
                let checkedCount = value.length;
                this.checkAll2 = checkedCount === this.authoritydata.length;
                this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.authoritydata.length;
            },            
            //表格操作
            handleClick(row){
              console.log(row)
            },
            handleSelectionChange(val) {
              this.multipleSelection = val;
            },
            open(index){

            },
            stop(index){

            },
            del(index){
              var data={'id':this.tableData[index].Id}
              this.postdata('delgroup',data)
            },
            adduseropen(){
              this.resetForm("adduser")
             //获取权限组
        
             //处理默认权限
             this.dialogFormVisible=true

            },
            addauthorityopen(){
              this.resetForm("addauthority")
             //获取权限组
        
             //处理默认权限
             this.dialogFormVisible2=true

            },   
            delgroup(index){
              console.log(this.authoritys[index])
              var data={'id':this.authoritys[index].Id}
              this.postdata('delgroup',data)
            }, 
            editgroup(index){
              this.editgroupdata=this.authoritys[index]
              this.authority=this.editgroupdata.Value.split(',')
              this.handleCheckedCitiesChange2(this.authority)
              this.dialogFormVisible6=true
            },                                
            changezu(val){
              if(val>-1){
                this.authority= this.authoritys[val].Value.split(',')
              }else{
                this.authority=[]
              }
              this.handleCheckedCitiesChange(this.authority)
            },
            resetForm(formName) {
              this.authority=[]
              this.authorityzu=-1
              this.handleCheckedCitiesChange(this.authority)  
              this.handleCheckedCitiesChange2(this.authority)             
              this.adduser=this.$options.data.call(this).adduser    
              this.addauthority=this.$options.data.call(this).addauthority     
            }, 
            edit(index){
              this.editdata=this.tableData[index]
              this.editdata.UserPassword=''
              this.editdata.OperationPassword=''
              this.authority=this.editdata.Authority.split(',')
              this.handleCheckedCitiesChange(this.authority)
              this.dialogFormVisible4=true
            },
            getAname(val){
              var a=val.split(',')
              var val1=[]
              for(var i=0;i<this.authoritydata.length;i++){
                for(var i1=0;i1<a.length;i1++){
                  if(this.authoritydata[i].value==a[i1]){
                    val1.push(this.authoritydata[i].name)
                   }
                }
              }  
              val1=val1.join(' | ')   
              return val1         
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
  display: contents;
}
.el-checkbox{
  margin-right: 10px !important;
}
</style>      