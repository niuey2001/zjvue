<template>
    <div class="main-boxdiv1" style="width: 100%;height:92%;">
      <div class="bodynav">
        <span class="game_box_topbtn" :class="logdata.index==1 ? 'isActive2':''" @click="logdata.index=1,logdata.page=1,logdata.total=0,logs(logdata.id,logdata.account)">操作记录</span>   
        <span class="game_box_topbtn" :class="logdata.index==2 ? 'isActive2':''" @click="logdata.index=2,logdata.page=1,logdata.total=0,logs(logdata.id,logdata.account)">登录日志</span>  
      </div>       
      <el-table border  :header-cell-class-name="'trheader'" :data="logdata.logtable"  v-loading="loadinglog" height="100%" style="width: 100%">
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column v-if="logdata.index==1" label="操作项目">
          <template #default="{row}">
                {{ GetType(row.Type)[0].name }}
          </template>
        </el-table-column>
        <el-table-column prop="Account" :label="logdata.index==1 ? '操作人':'登录账号'" />
        <el-table-column v-if="logdata.index==1" prop="AccountTo" label="被操作人" />
        <el-table-column prop="Date" :label="logdata.index==1 ? '操作时间':'登录时间'" />
        <el-table-column v-if="logdata.index==2" prop="Ip" label="登录IP" />
        <el-table-column prop="Message" :label="logdata.index==1 ? '操作内容':'地区'"/> 
        <el-table-column prop="Message1" v-if="logdata.index==1" label="前值"/>   
        <el-table-column prop="Message2" v-if="logdata.index==1" label="后值"/>      
      </el-table> 
      <div class="mb-4">
        <el-pagination background layout="total,prev, pager, next"
                v-model:current-page="logdata.page"
                v-model:page-size="logdata.size"
                :total="logdata.total"
                @size-change="handleSizeChangelog"
                @current-change="handleCurrentChangelog"
              />         
      </div> 
    </div>              
</template>
  
  
  <script>
  export default {
    props: {
      componentsPoPdata: {
        type: Object,
        required: true
      },  
      MemberType:{
            type: Array
      }                                 
    },      
    data() {
      return {
        logdata:{
              id:'',
              account:'',
              index:1,
              page:1,
              size:50,
              total:0,
              logtable:[]
        },
      }
    },
    created(){
        this.logdata.page=1
        this.logdata.index=1
        this.logdata.total=0
        this.logs(this.componentsPoPdata.id,'')
    },
    methods:{
        handleSizeChangelog(size){
              this.logdata.size=size
            },
            handleCurrentChangelog(newPage){
              this.logdata.page=newPage
              this.logs(this.logdata.id,this.logdata.account)
        },         
        logs(id,account){
              this.loadinglog=true
              this.logdata.logtable=[]
              this.logdata.id=id
              this.logdata.account=account
              var url=this.logdata.index==2 ? '/loginlogs':'/logs'
              this.$request.postData(url,{id:parseFloat(this.logdata.id),page:this.logdata.page}).then(response => {
                this.loadinglog=false
                if(response.code==200){
                    this.logdata.logtable=response.data.data
                    this.logdata.total=response.data.count               
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loadinglog=false
                this.$message.error('网络请求错误');
              });
        },
        GetType(value){
              var a=[{'name':'-'}]
              if(value!=''){
                var a1=this.componentsPoPdata.authoritydata.filter((item) =>item.value==value)
                if(a1.length>0){
                  a=a1
                }
              }
              return a
        }    
    
    }
  }
  </script>