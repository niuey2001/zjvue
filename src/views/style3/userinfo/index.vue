<template>
  <div class="main-boxdiv">
    <div class="mb-4 mb4_top">  
      <span>
        <span class="topbtn" :class="pagetype==3 ? 'isActive2':''" @click="pagetype=3,logs()">操作记录</span>  
        <span class="topbtn" :class="pagetype==4 ? 'isActive2':''" @click="pagetype=4,loginlogs()">登录记录</span>    
      </span>      
    </div>
  <el-table v-if="pagetype>=3" border  :header-cell-class-name="'trheader'" :data="logtable"  v-loading="loading" :height="clientHeight2+'px'" style="width: 100%">
    <el-table-column type="index" label="序号" width="55" />
    <el-table-column v-if="pagetype==3"  label="操作项目">
      <template #default="{row}">
            {{ GetType(row.Type)[0].name }}
      </template>
    </el-table-column>
    <el-table-column prop="Account" v-if="pagetype==3" label="操作人" />
    <el-table-column prop="AccountTo" v-if="pagetype==3" label="被操作人" />
    <el-table-column prop="Date" :label="pagetype==3 ? '操作时间':'登录时间'" />
    <el-table-column prop="Ip"  v-if="pagetype==4" label="IP" />
    <el-table-column prop="Message" v-if="pagetype==3" label="操作内容"/> 
    <el-table-column prop="Message1" v-if="pagetype==3" label="前值"/>   
    <el-table-column prop="Message2" v-if="pagetype==3" label="后值"/>      
  </el-table> 
  <div class="mb-4" v-if="pagetype>=3">
    <el-pagination background layout="total,prev, pager, next"
            v-model:current-page="page"
            v-model:page-size="size"
            :total="total"
            @size-change="handleSizeChangelog"
            @current-change="handleCurrentChangelog"
          />         
  </div>   


   <div class="main-boxdiv-bottom"></div>
   
  </div>
</template>
  
  
  <script>
  export default {
    props: {     
          clientHeight2:{
            type:Number
          },       
          home_data: {
                    type: Object 
                  }, 
          UserInfo: {
                    type: Object 
                  },                       
        },     
    data() {
      return {
             pagetype:3,
             loading:true,
             lottery_id:1,        
             GameList:[],        
             editData:[],
             page:1,
             total:0,
             logtable:[],
             size:50,
             authoritydata:this.$store.state.Authoritydata
      }
    },
    created(){
      this.lottery_id=this.home_data.GameList[this.home_data.game_index].lottery_id  
      this.GameList=JSON.parse(JSON.stringify(this.home_data.GameList))         
      this.logs()
    },
    methods:{
      handleSizeChangelog(size){
              this.size=size
      },
      handleCurrentChangelog(newPage){
              this.page=newPage
              this.logs()
      },          
      logs(){
         this.loading=true
              this.$request.postData('/person/log',{page:this.page,account:'',type:''}).then(response => {
                this.loading=false
                if(response.code==200){
                    this.logtable=response.data.data
                    this.total=response.data.count               
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loading=false
                this.$message.error('网络请求错误');
              });
      },
      loginlogs(){
        this.loading=true
              this.$request.postData('/person/loginlog',{page:this.page,account:''}).then(response => {
                this.loading=false
                if(response.code==200){
                    this.logtable=response.data.data
                    this.total=response.data.count               
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loading=false
                this.$message.error('网络请求错误');
              });
      },
        GetType(value){
              var a=[{'name':'-'}]
              if(value!=''){
                var a1=this.authoritydata.filter((item) =>item.value==value)
                if(a1.length>0){
                  a=a1
                }
              }
              return a
        } 
    }
  }
  </script>