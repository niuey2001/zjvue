<template>
  <div class="main-boxdiv" v-loading="loading">
    <div class="mb-4 mb4_top">  
      <span>{{MemberType[componentsPoPdata.nowmember.type]}}:{{componentsPoPdata.nowmember.account}}</span>    
      <span>
        <span class="topbtnbtn" v-if="componentsPoPdata.nowmember.type<10"  @click="opencomponentsBox('addCom',1,'')">添加代理</span>
        <span class="topbtnbtn" v-if="componentsPoPdata.nowmember.type>1"  @click="opencomponentsBox('addCom',2,'')">添加直属会员</span>           
        <span class="topbtn" v-if="componentsPoPdata.nowmember.type<10" :class="componentsPoPdata.nowdata.type==1 ? 'isActive2':''" @click="componentsPoPdata.nowdata.type=1,componentsPoPdata.nowdata.search='',getdata()">直属代理 {{total1}}</span>
        <span class="topbtn" v-if="componentsPoPdata.nowmember.type>1" :class="componentsPoPdata.nowdata.type==2 ? 'isActive2':''" @click="componentsPoPdata.nowdata.type=2,componentsPoPdata.nowdata.search='',getdata()">直属会员 {{total2}}</span>   
        <span class="topbtn" v-if="componentsPoPdata.nowmember.type<10" :class="componentsPoPdata.nowdata.type==3 ? 'isActive2':''" @click="componentsPoPdata.nowdata.type=3,componentsPoPdata.nowdata.search='',getdata()">全部代理 {{total3}}</span>   
        <span class="topbtn" v-if="componentsPoPdata.nowmember.type<10" :class="componentsPoPdata.nowdata.type==4 ? 'isActive2':''" @click="componentsPoPdata.nowdata.type=4,componentsPoPdata.nowdata.search='',getdata()">全部会员 {{total4}}</span>     
      </span>       
      <span>
        状态 
      </span> 
      <span>
        <select v-model="componentsPoPdata.nowdata.state" style="width: 100px">
            <option label="全部" :value="parseInt(1)"/>
            <option label="启用" :value="parseInt(2)"/>
            <option label="停用" :value="parseInt(3)"/>
        </select>          
      </span> 
      <span>
        <input v-model="componentsPoPdata.nowdata.search" style="width: 100px" placeholder="请输入账号"/>
      </span>
      <span>
          <span class="topbtn"  @click="getdata()">查询</span>     
      </span>
      <span style="margin-left:5px">信用额度:</span>
      <span style="color:red;padding:0px 5px">{{componentsPoPdata.nowmember.ts}}</span>
      <span>可用额度:</span>
      <span style="color:red;padding:0px 5px">{{componentsPoPdata.nowmember.cs}}</span>
      <span style="position: absolute;right: -6px;">
        <span class="topbtn" v-if="componentsPoPdata.topmember.length>1" @click="goback()">返回</span>
      </span>
      
    </div>    
    <el-dialog v-model="dialogFormVisible" title="" :class="componentsPoPdata.opencomponents=='dssetCom' || componentsPoPdata.opencomponents=='logCom' ? 'dssetCom-dialog':''" width="850">
      <div class="titlem bodynav dialog-padding">
       {{componentsPoPdata.title}}
      </div>
      <component :is="componentsPoPdata.opencomponents" :key="dskey" :home_data="home_data" @opencomponentsBox="opencomponentsBox" @getdata="getdata" :MemberType="MemberType" :componentsPoPdata="componentsPoPdata" :Versions="Versions"></component>
    </el-dialog>  
    <el-dialog v-model="tsDown" title="" style="padding-bottom:25px !important" width="500">
      <div class="titlem bodynav dialog-padding">
        批量操作下级-【{{ tsDownData.account }}】
       </div> 
       <el-form ref="oddsset" :model="tsDownData" label-width="0px" class="custom-form-style">
            <table border="1" class="el-form-table">
                <tr>
                  <td class="el-form-table-label">操作类型</td>
                  <td class="el-form-table-tr" style="font-weight:600;">
                    <select v-model="tsDownData.type" style="line-height: 25px;font-weight: 700;">
                      <!-- <option :value="parseInt(1)">批量启用所有下级</option> -->
                      <option :value="parseInt(1)">一键提取所有额度</option>
                      <option :value="parseInt(2)">一键提取所有占成</option>
                    </select>
                  </td>
                </tr>   
                <tr>
                  <td class="el-form-table-label"></td>
                  <td colspan="3" class="el-form-table-footer">
                    <span class="game_box_topbtn" @click="UpBatch()">确认操作</span>
                  </td>          
                </tr>                                       
            </table> 
        </el-form>         
      </el-dialog>              
      <el-table border :header-cell-class-name="'trheader'"  v-if="componentsPoPdata.nowdata.type==1 || componentsPoPdata.nowdata.type==3"
      ref="multipleTableRef" :data="tableData" :cell-class-name="tableCellClassName" :height="clientHeight2+'px'" style="width: 100%" @cell-click="editCell">
        <el-table-column type="index" label="序号" width="55"/>  
        <el-table-column prop="account" label="账号" width="105">
          <template   #default="{ row }">
            <span class="text_nowrap" @click="changgeAccount(row)" :title="row.account">{{row.account}}</span>
          </template>
        </el-table-column>                
        <el-table-column prop="name" label="姓名" width="105"/>
        <el-table-column label="身份" width="105">
          <template   #default="{ row }">
            <span>{{MemberType[row.type]}}</span>
          </template>
        </el-table-column>            
        <el-table-column label="占成" width="105">
          <template   #default="{ row }">
            <span>{{parseFloat((row.top_zc*100).toFixed(4))}}%-{{parseFloat((row.zc*100).toFixed(4))}}%</span>
          </template>          
        </el-table-column>  
        <el-table-column :label="componentsPoPdata.nowdata.type<3 ? MemberType[componentsPoPdata.nowmember.type]+'占成':'上级占成'" width="105">
          <template   #default="{ row }">
            <span >{{parseFloat((row.top_lj_zc*100).toFixed(4))}}%</span>
          </template>          
        </el-table-column>         
        <el-table-column label="信用额度">
          <template  #default="{ row }">
            <input              
            :ref="`name-${row.id}`"
            v-model="tabClickTs" 
            v-show="row.id === tabClickId && tabClickLabel === '信用额度'" placeholder="信用额度" 

            class="Odds_input"
            style="height:auto"
            />
            <span v-show="row.id !== tabClickId || tabClickLabel !== '信用额度'">{{row.ts}}</span>

          </template>       
        </el-table-column>           
        <el-table-column prop="cs" label="可用额度"/>
        <el-table-column prop="ys" label="已用额度"/>
        <el-table-column label="添加日期" width="100">
          <template   #default="{ row }">
            <span>{{convertToLocalDate(row.updated_at)}}</span>
          </template>
        </el-table-column>           
        <el-table-column label="盘口">
          <template #default="{ row }">
            <span v-for="item in componentsPoPdata.pan">
              <span v-if="row[item]">{{item}} </span>
            </span>
          </template>
        </el-table-column>         
         
        <!-- <el-table-column v-if="componentsPoPdata.nowmember.lj_state" prop="lj_state" label="拦截占成">
          <template #default="{row}">
              <span>{{row.lj_state ? '是':'否'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="启/停用" width="70">
          <template   #default="{ row }">
            <el-popconfirm :title="'确定将'+row.account+(row.state ? '停用':'启用')+'?'" confirm-button-type="danger"  @confirm="changeState(row)" confirm-button-text="确认" cancel-button-text="取消">
                <template #reference>
                  <span :style="{'color':row.state ? '':'red'}">{{row.state ? '启用':'停用'}}</span>
                </template>
              </el-popconfirm>    
          </template>
        </el-table-column>   
        <el-table-column label="冻结" width="60">
          <template   #default="{ row }">
            <el-popconfirm :title="'确定将'+row.account+(row.is_bet ? '冻结':'解除冻结')+'?'" confirm-button-type="danger"  @confirm="changeBetState(row)" confirm-button-text="确认" cancel-button-text="取消">
                <template #reference>
                  <span :style="{'color':row.is_bet ? '':'red'}">{{row.is_bet ? '正常':'冻结'}}</span>
                </template>
              </el-popconfirm>                
          </template>
        </el-table-column>       
        <!-- <el-table-column v-if="componentsPoPdata.nowmember.is_buhuo" label="补货" width="60">
          <template   #default="{ row }">
            <span :style="{'color':row.is_buhuo ? '':'red'}">{{row.is_buhuo ? '是':'否'}}</span> 
          </template>
        </el-table-column>     -->
        <el-table-column label="操作" width="250" >
          <template #default="{ row }">
            <span  @click="opencomponentsBox('editCom',1,row.id)">修改</span> |
            <span @click="opencomponentsBox('dssetCom',1,row)">退水</span> |
            <span  @click="tsDownData.id=row.id,tsDownData.account=row.account,tsDownData.type=1,tsDown=true">批量操作</span> |
            <span @click="opencomponentsBox('logCom',1,row)">记录</span>       
          </template>
        </el-table-column>
      </el-table>
      <el-table border :header-cell-class-name="'trheader'"  v-if="componentsPoPdata.nowdata.type==2 || componentsPoPdata.nowdata.type==4"
      ref="multipleTableRef" :data="tableData" :height="clientHeight2+'px'" style="width: 100%" @cell-click="editCell">
        <el-table-column type="index" label="序号" width="55"/>
        <el-table-column prop="account" :label="componentsPoPdata.nowdata.type<3 ? MemberType[componentsPoPdata.nowmember.type]+'直属会员账号':'会员账号'"/>        
        <el-table-column prop="name" label="姓名"/>
        <el-table-column :label="componentsPoPdata.nowdata.type<3 ? MemberType[componentsPoPdata.nowmember.type]+'占成':'上级占成'">
          <template   #default="{ row }">
            <span >{{parseFloat((row.top_lj_zc*100).toFixed(4))}}%</span>
            <!-- <span>{{parseFloat((row.top_zc*100).toFixed(4))}}%</span> -->
          </template>          
        </el-table-column>          
        <el-table-column label="信用额度">
          <template  #default="{ row }">
            <input              
            :ref="`name-${row.id}`"
            v-model="tabClickTs" 
            v-show="row.id === tabClickId && tabClickLabel === '信用额度'" placeholder="信用额度" 

            class="Odds_input"
            style="height:auto"
            />
            <span v-show="row.id !== tabClickId || tabClickLabel !== '信用额度'">{{row.ts}}</span>

          </template>       
        </el-table-column>   
        <el-table-column prop="cs" label="可用额度"/>
        <el-table-column prop="ys" label="已用额度"/>
        <el-table-column label="添加日期" width="100">
          <template   #default="{ row }">
            <span>{{convertToLocalDate(row.updated_at)}}</span>
          </template>
        </el-table-column>           
        <el-table-column label="盘口">
          <template #default="{ row }">
            <span v-for="item in componentsPoPdata.pan">
              <span v-if="row[item]">{{item}} </span>
            </span>
          </template>
        </el-table-column>         

        <el-table-column label="启/停用">
          <template   #default="{ row }">
            <el-popconfirm :title="'确定将'+row.account+(row.state ? '停用':'启用')+'?'" confirm-button-type="danger"  @confirm="changeState(row)" confirm-button-text="确认" cancel-button-text="取消">
                <template #reference>
                  <span :style="{'color':row.state ? '':'red'}">{{row.state ? '启用':'停用'}}</span>
                </template>
            </el-popconfirm>    
          </template>
        </el-table-column>   
        <el-table-column label="冻结" width="60">
          <template   #default="{ row }">
            <el-popconfirm :title="'确定将'+row.account+(row.is_bet ? '冻结':'解除冻结')+'?'" confirm-button-type="danger"  @confirm="changeBetState(row)" confirm-button-text="确认" cancel-button-text="取消">
                <template #reference>
                  <span :style="{'color':row.is_bet ? '':'red'}">{{row.is_bet ? '正常':'冻结'}}</span>
                </template>
              </el-popconfirm>                
          </template>
        </el-table-column>   
               
        <el-table-column label="操作" width="200" >
          <template #default="{ row }">
            <span @click="opencomponentsBox('editCom',2,row.id)">修改</span> |
            <span @click="opencomponentsBox('dssetCom',2,row)">退水</span> |           
            <span @click="opencomponentsBox('logCom',2,row)">记录</span>        
          </template>
        </el-table-column>
      </el-table>

      <div class="mb-4">
        <el-pagination background layout="total,prev, pager, next"
                v-model:current-page="componentsPoPdata.nowdata.page"
                v-model:page-size="componentsPoPdata.nowdata.size"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />         
      </div>
      <div class="main-boxdiv-bottom"></div>
  </div>
   
</template>  
     
<script>
import { defineAsyncComponent } from 'vue';
      export default {
        components: {
          dssetCom: defineAsyncComponent(() => import('./dsset.vue')),
          addCom: defineAsyncComponent(() => import('./add.vue')),
          editCom: defineAsyncComponent(() => import('./edit.vue')),
          logCom: defineAsyncComponent(() => import('./log.vue')),
        }, 
        props: {
          clientHeight2:{
              type:Number
          },          
          UserInfo: {
                    type: Object
                  },  
          home_data: {
                    type: Object
          },
          MemberType:{
            type: Array
          }                                
        },                
        data() {
          return {
            dskey:0,
            total:0,
            total1:0,
            total2:0,
            total3:0,
            total4:0,
            componentsPoPdata:{
               'id':0,
               'opencomponents':'',
               'ctype':1,
               'pan':['A','B','C','D','E','F','G','H','I','J','K','L'],
               'title':'',
               'loading':false,
               'authoritydata':[
                  {'name':'账号管理','value':'member'},
                  {'name':'赔率设置','value':'odds'},
                  {'name':'退水设置','value':'backs'},
                  {'name':'控盘管理','value':'kongpan'},
                  {'name':'彩盘监控','value':'jiankong'},
                  {'name':'报表查看','value':'report'},
                  {'name':'彩种管理','value':'lottery'},
                  {'name':'通知公告','value':'notice'}
                ],
                'nowdata':{
                  id:0,
                  type:1,
                  search:'',
                  state:1,
                  page:1,
                  size:50
                },
                'topmember':[],
                'nowmember':{
                  'id':0,
                  'account':'',
                  'type':''
                },
                'editfrist':false,
                'dsspan':[]                
            },
            dialogFormVisible: false,     
            tableData: [                         
            ],          
            loading: false,
            tabClickId: '',
            tabClickLabel: '',
            tabClickTs:'',
            tabClickIndex:'',
            Versions:'',
            tsDown:false,
            tsDownData:{
              'id':0,
              'type':1,
              'account':''
            }
          }
        },
        created(){
          for(let key in this.componentsPoPdata.nowmember){
            this.componentsPoPdata.nowmember[key]=key=='id' ? 0:this.UserInfo[key]
          }
          this.getdata()
        },
        methods: {
          editCell(item,column){   
            return      
              if(this.tabClickId==''){
                switch (column.label) {
                  case '信用额度': 
                    this.tabClickId = item.id
                    this.tabClickLabel = column.label
                    this.tabClickTs=item.ts
                    this.tabClickIndex=this.tableData.indexOf(item)
                    break
                  default: 
                    this.inputBlur()
                    return
                }               
              }else{
                if(parseFloat(this.tabClickTs)>=0 && this.tabClickTs!='' && parseFloat(this.tabClickTs)!=this.tableData[parseInt(this.tabClickIndex)].ts){
                  this.PostTs(this.tabClickId,this.tabClickTs,this.tabClickIndex)
                }
                this.tabClickId=''
                this.editCell(item,column)
              }
            },
            inputBlur() {          
              this.tabClickId = "";
              this.tabClickLabel = "";
              this.tabClickTs=""
              this.tabClickIndex=""              
            },
            PostTs(tabClickId,tabClickTs,tabClickIndex){
            return
              this.loading=true
              var data={
                'id':parseInt(tabClickId),
                'ts':parseFloat(tabClickTs)
              }
              var a=JSON.parse(JSON.stringify(this.tableData[parseInt(tabClickIndex)]))
              this.tableData[parseInt(tabClickIndex)].ts=tabClickTs   
              this.$request.postData('/member/editpost',data).then(response => {
                    this.loading=false
                    if(response.code==200){                   
                      this.$message({
                        message: response.msg,
                        type: 'success'
                      });
                                     
                    }else{
                      this.tableData[parseInt(tabClickIndex)].ts=a.ts
                      this.$message.error(response.msg);
                    }
                  }).catch(error => {
                    this.tableData[parseInt(tabClickIndex)].ts=a.ts
                    this.loadingadd=false
                    this.$message.error('网络请求错误');
                  }); 
            },
            changgeAccount(row){
              if(this.componentsPoPdata.nowdata.type>1){
                  return
              }
              if(!this.componentsPoPdata.topmember.includes(row.id)){
                    this.componentsPoPdata.topmember.push(row.id)
              }
              if(row.type==10){
                this.componentsPoPdata.nowdata={
                    id:row.id,
                    type:2,
                    search:'',
                    state:1,
                    page:1,
                    size:50
                }                
              }else{
                this.componentsPoPdata.nowdata={
                    id:row.id,
                    type:1,
                    search:'',
                    state:1,
                    page:1,
                    size:50
                }
              }              

              this.getdata()
            },
            goback(){
              if(this.componentsPoPdata.topmember.includes(this.componentsPoPdata.nowmember.id)){
                    this.componentsPoPdata.topmember= this.componentsPoPdata.topmember.filter(item => item !== this.componentsPoPdata.nowmember.id);
              }  
              let lastElement = this.componentsPoPdata.topmember[this.componentsPoPdata.topmember.length - 1]         
              this.componentsPoPdata.nowdata={
                  id:lastElement,
                  type:1,
                  search:'',
                  state:1,
                  page:1,
                  size:20
              }
              this.getdata()
            },
            handleSizeChange(size){
              this.componentsPoPdata.nowdata.pagesize=size
            },
            handleCurrentChange(newPage){
              this.componentsPoPdata.nowdata.page=newPage
              this.getdata()
            },                    
            tableCellClassName({ row, column, rowIndex, columnIndex }) {
              if(columnIndex==1 || columnIndex==17){
                return 'username';
              }
              return ''
            },          
            opencomponentsBox(view,type,row) {
              this.componentsPoPdata.ctype=type
              this.componentsPoPdata.title=''
              if(view=='addCom'){
                this.componentsPoPdata.title='添加'
                this.componentsPoPdata.title+=type==1 ? this.MemberType[this.componentsPoPdata.nowmember.type+1]:this.MemberType[this.componentsPoPdata.nowmember.type]+'直属会员'
              }else if(view=='editCom'){
                this.componentsPoPdata.id=row
                this.componentsPoPdata.title='编辑'
                this.componentsPoPdata.title+=type==1 ? this.MemberType[this.componentsPoPdata.nowmember.type+1]:this.MemberType[this.componentsPoPdata.nowmember.type]+'直属会员'
              }else if(view=='logCom'){
                this.componentsPoPdata.title='用户日志-'+row.account
                this.componentsPoPdata.id=row.id              
              }else if(view=='dssetCom'){
                this.componentsPoPdata.id=row.id
                this.componentsPoPdata.dsspan=[]
                for(let key in this.componentsPoPdata.pan){
                  var item=this.componentsPoPdata.pan[key]
                   if(row[item]){
                    var a=item=='A' ? 'a':item=='B' ? 'b':item=='C' ? 'c':item=='D' ? 'd':item=='E' ? 'e':item=='F' ? 'f':item=='I' ? 'i':item=='J' ? 'j':item=='K' ? 'k':item=='L' ? 'l':''
                    if(a!=''){
                       this.componentsPoPdata.dsspan.push(a)
                    }                    
                   }
                }
                
                this.componentsPoPdata.title='退水设置'+'-【'+row.account+'】'+this.MemberType[row.type]                
              }else{
                return
              }
              this.dskey++
              this.dialogFormVisible=true
              this.componentsPoPdata.opencomponents = view;
            },          
            getdata(){
              this.inputBlur()
              this.loading=true
              this.tableData=[]
              this.dialogFormVisible=false
              this.$request.postData('/member/find',this.componentsPoPdata.nowdata).then(response => {
                this.loading=false
                if(response.code==200){
                  this.total=response.data.count
                  this.total1=response.data.count1
                  this.total2=response.data.count2
                  this.total3=response.data.count3
                  this.total4=response.data.count4
                  this.componentsPoPdata.nowmember=response.data.member
                  this.tableData=response.data.members
                  this.Versions=response.data.companycode   
                  if(!this.componentsPoPdata.topmember.includes(this.componentsPoPdata.nowmember.id)){
                    this.componentsPoPdata.topmember.push(this.componentsPoPdata.nowmember.id)
                  }
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loading=false
                this.$message.error('网络请求错误');
              }); 
            },        
            //时间格式处理
            convertToLocalDate(isoString) {
              const date = new Date(isoString);
              const year = date.getUTCFullYear();
              const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
              const day = date.getUTCDate().toString().padStart(2, '0');
              return `${year}-${month}-${day}`;
            },
            UpBatch(){
              this.$request.postData('/member/tiqu',this.tsDownData).then(response => {
                if(response.code==200){
                  this.getdata()
                  this.$message({
                        message: response.msg,
                        type: 'success'
                      });
                      this.tsDown=false
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.$message.error('网络请求错误');
              });               
            },
            changeState(row){
              if(!this.componentsPoPdata.nowmember.state){
                this.$message.error('停用状态无法操作');
                return
              }
              if(!this.componentsPoPdata.nowmember.is_bet){
                this.$message.error('冻结状态无法操作');
                return
              }              
              this.$request.postData('/member/statepost',{'id':row.id,'state':!row.state}).then(response => {
                if(response.code==200){
                  this.getdata()
                  this.$message({
                        message: response.msg,
                        type: 'success'
                      });
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.$message.error('网络请求错误');
              });  
            },
            changeBetState(row){
              if(!this.componentsPoPdata.nowmember.state){
                this.$message.error('停用状态无法操作');
                return
              }
              if(!this.componentsPoPdata.nowmember.is_bet){ 
                this.$message.error('冻结状态无法操作');
                return
              }              
              this.$request.postData('/member/betstatepost',{'id':row.id,'is_bet':!row.is_bet}).then(response => {
                if(response.code==200){
                  this.getdata()
                  this.$message({
                        message: response.msg,
                        type: 'success'
                      });
                }else{
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