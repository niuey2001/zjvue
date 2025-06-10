<template>
    <el-form v-if="editdata!=''" ref="edit" :model="editdata" :rules="rules" label-width="0px" class="custom-form-style" v-loading="loadingadd">
        <table border="1" class="el-form-table">
          <tr>
            <td class="el-form-table-label">{{componentsPoPdata.ctype==1 ? '代理':'会员'}}账号</td>
            <td class="el-form-table-tr">        
              <el-form-item label="">
                {{ editdata.account }}
              </el-form-item> 
           </td>
           <td class="el-form-table-label">{{componentsPoPdata.ctype==1 ? '代理':'会员'}}姓名</td>
           <td class="el-form-table-tr">        
              <el-form-item label="" prop="name">
                <el-input v-model="editdata.name" placeholder="请输入姓名"></el-input>
              </el-form-item> 
           </td>                              
          </tr>            
          <tr>
            <td class="el-form-table-label">登录密码</td>
            <td class="el-form-table-tr" colspan="3">        
              <el-form-item label=""  prop="password">
                <el-input type="password" v-model="editdata.password" placeholder="请输入密码"></el-input>
              </el-form-item> 
            </td>  
          </tr>             
          <tr>
            <td class="el-form-table-label">信用额度</td>
            <td class="el-form-table-tr" colspan="3">        
              <el-form-item label="">
                <el-input v-model="editdata.ts" placeholder="请输入额度"></el-input>&nbsp;&nbsp;<span>剩余可分配额度:</span>
                <span style="color:red">{{(parseInt(edittopmember.cs)-(parseInt(editdata.ts)-parseInt(oldts)))>=0 ? (parseInt(edittopmember.cs)-(parseInt(editdata.ts)-parseInt(oldts))):editdata.ts ? editdata.ts=parseInt(oldts)+parseInt(edittopmember.cs):parseInt(oldts)+parseInt(edittopmember.cs)}}</span>
              </el-form-item> 
            </td>  
          </tr> 
          <tr v-if="componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1">
            <td class="el-form-table-label" style="line-height: 22px;">{{MemberType[editdata.type]}}<br/>最高成数</td>
            <td colspan="3" class="el-form-table-tr" >        
              <el-form-item label="">
                <el-input v-model="editdata.zc" placeholder="请输入百分比"></el-input>&nbsp;%&nbsp;
                (最大<!-- {{percentage()}}% -->{{ edittopmember.zc }}%) 
                <span style="color:red;margin-left:10px;">指下级最大成数的占成最高上限</span>
              </el-form-item> 
            </td>                                                                   
          </tr> 
          <tr v-if="componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1">
            <td class="el-form-table-label" style="line-height: 22px;">
              {{MemberType[editdata.type]}}<br/>
              最低占成</td>
            <td class="el-form-table-tr" colspan="3">        
              <el-form-item label="">
                <el-input v-model="editdata.top_zc" placeholder="请输入值"></el-input>&nbsp;%&nbsp;
                <!-- <span>剩余可分配比例:</span><span style="color:red">
                  {{percentage()}}%</span>  -->
                  (最大{{ edittopmember.zc }}%) 
                  <span style="color:red;margin-left:10px;">指下级固定最少占成成数</span>
              </el-form-item> 
            </td>                 
                                                              
          </tr>             
          <!-- <tr v-if="edittopmember.is_lj && editdata.type>2 && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1">
            <td class="el-form-table-label">{{MemberType[edittopmember.type]}}最高占成</td>
            <td class="el-form-table-tr" colspan="3">        
              <el-form-item label="">
                <el-input v-model="editdata.top_lj_zc" placeholder="请输入百分比"></el-input>&nbsp;%
              </el-form-item> 
            </td>                 
                                                              
          </tr> -->
          <tr>
            <td class="el-form-table-label" style="line-height: 22px;">{{MemberType[edittopmember.type]}}(本级)<br/>最高占成</td>
            <td class="el-form-table-tr" colspan="3">        
              <el-form-item label="">
                <el-input v-model="editdata.top_lj_zc" placeholder="请输入百分比"></el-input>&nbsp;%&nbsp;
                ({{ edittopmember.type==1 ? 0:edittopmember.top_zc }}%-{{ edittopmember.zc }}%)
                <span style="color:red;margin-left:10px;">指本级占成成数</span>
              </el-form-item> 
            </td>                 
                                                              
          </tr> 
          <tr>
            <td class="el-form-table-label">开放游戏</td>
            <td colspan="3" class="el-form-table-tr" > 
              <el-checkbox :indeterminate="isIndeterminateGame" v-model="checkAllGame" @change="handleCheckAllChangeGame">全选</el-checkbox>
              <el-checkbox-group  v-model="editGame" @change="handleCheckedCitiesChangeGame"> 
                <el-checkbox v-for="items in topGame" :label="items" :key="items" :value="items">{{getGameName(parseInt(items))[0].name}}</el-checkbox>
              </el-checkbox-group>                   
            </td>  
          </tr>                     
          <tr>
            <td class="el-form-table-label">开放盘口</td>
            <td colspan="3" class="el-form-table-tr" > 
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group  v-model="chackpan" @change="handleCheckedCitiesChange"> 
                <el-checkbox v-for="items in getpan(edittopmember)" :label="items" :key="items" :value="items">{{items}}盘</el-checkbox>
              </el-checkbox-group>                   
            </td>  
          </tr>               
          <tr>
            <td class="el-form-table-label">账号权限</td>
            <td colspan="3" class="el-form-table-tr" >        
              <el-form-item label=""> 
                  <span>启停状态</span>
                  <select v-bind:disabled="!edittopmember.state" v-model="editdata.state">
                    <option :value="true">启用</option>
                    <option :value="false">停用</option>
                  </select>
                  <span>冻结状态</span>
                  <select v-bind:disabled="!edittopmember.is_bet" v-model="editdata.is_bet">
                    <option :value="true">正常</option>
                    <option :value="false">冻结</option>
                  </select>    
                  <span v-if="edittopmember.is_buhuo && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1">补货</span>
                  <select v-bind:disabled="!edittopmember.is_buhuo" v-if="edittopmember.is_buhuo && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1" v-model="editdata.is_buhuo">
                    <option :value="true">允许</option>
                    <option :value="false">禁止</option>
                  </select>   
                  <span v-if="edittopmember.is_kongpan && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1">控盘操作</span>
                  <select v-bind:disabled="!edittopmember.is_kongpan" v-if="edittopmember.is_kongpan && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1" v-model="editdata.is_kongpan">
                    <option :value="true">允许</option>
                    <option :value="false">禁止</option>
                  </select>  
                  <!-- <span v-if="edittopmember.is_lj && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1">拦截占成</span>
                  <select v-bind:disabled="!edittopmember.is_lj" v-if="edittopmember.is_lj && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1" v-model="editdata.is_lj">
                    <option :value="true">允许</option>
                    <option :value="false">禁止</option>
                  </select>                                                                                             -->
              </el-form-item>   
            </td>      
          </tr>     
          <!-- <tr v-if="edittopmember.type==1 && componentsPoPdata.nowdata.type==1 && componentsPoPdata.ctype==1">
            <td class="el-form-table-label">查看{{MemberType[edittopmember.type]}}报表</td>
            <td class="el-form-table-tr" colspan="3">        
              <el-form-item label=""> 
                <span>查看{{MemberType[edittopmember.type]}}总报</span>
                <select v-model="editdata.is_report">
                  <option :value="true">允许</option>
                  <option :value="false">禁止</option>
                </select>   
                <span>查看{{MemberType[edittopmember.type]}}报表明细</span>
                <select v-model="editdata.is_report_detail">
                  <option :value="true">允许</option>
                  <option :value="false">禁止</option>
                </select>                   
              </el-form-item>   
            </td>      
          </tr>    -->
          <tr v-if="edittopmember.type==1">
            <td class="el-form-table-label">版本样式</td>
            <td class="el-form-table-tr" colspan="3">        
              <el-form-item label=""> 
                <select v-model="editdata.color" style="width:100px">
                  <option v-for="item in Versions" :value="parseInt(item.type)">&nbsp;&nbsp;{{ item.web_name }}&nbsp;&nbsp;</option>
                </select>                    
              </el-form-item>   
            </td>      
          </tr>                                      
          <tr>
            <td class="el-form-table-label"></td>
            <td colspan="3" class="el-form-table-footer">
              <span class="game_box_topbtn" @click="onSubmit('edit',editdata)">确认修改</span>
            </td>          
          </tr>       
        </table>
        </el-form>   
</template>
  
  
  <script>
  export default {
    props: {
      componentsPoPdata: {
        type: Object,
        required: true
      },  
      Versions: {
        type: Object
      },       
      MemberType:{
            type: Array
      },       
      home_data: {
                type: Object
              },                                 
    },     
    data() {
      return {
        loadingadd:false,
        editdata:'',
        edittopmember:'',
        oldts:0,
        rules: {
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
              name: [
                { required: true, message: '请输入名称', trigger: 'change' }
              ]                             
        },
        isIndeterminate: false, 
        checkAll: false,          
        chackpan:[],
        topGame:[],
        isIndeterminateGame: false, 
        checkAllGame: false,               
        editGame:[]    
      }
    },
    created(){
      this.geteditdata()
      
    },
    watch: {
         
    },
    methods:{
      onSubmit(val,data){
        this.$refs[val].validate((valid) => {
                if (valid){
                  this.postdatae(val,data)
                }else{
                  this.$message.error('请正确填写参数');
                  return
                }
              });        

      }, 
      postdatae(val,data){
        if(this.editGame.length<=0){
          this.$message.error('必须最少选择一个游戏');
          return
        }
        const tpan =this.getpan(this.edittopmember)
              var data=JSON.parse(JSON.stringify(this.editdata))
              for(var i=0;i<this.componentsPoPdata.pan.length;i++){
                data[this.componentsPoPdata.pan[i]]=false
                if(this.chackpan.includes(this.componentsPoPdata.pan[i]) && tpan.includes(this.componentsPoPdata.pan[i])){
                  data[this.componentsPoPdata.pan[i]]=true
                }              
              }              
              data.game_str=this.editGame.join(",")          
              data.ts=parseFloat(data.ts)
              data.top_zc=parseFloat((parseFloat(data.top_zc)/100).toFixed(4))
              // if(this.componentsPoPdata.nowdata.type==1 && this.componentsPoPdata.ctype==1){
                  data.zc=parseFloat((parseFloat(data.zc)/100).toFixed(4))
                  data.top_lj_zc=parseFloat((parseFloat(data.top_lj_zc)/100).toFixed(4))
                  // if(this.edittopmember.is_lj && data.type>2){
                  //   data.top_lj_zc=parseFloat((parseFloat(data.top_lj_zc)/100).toFixed(4))
                  // }
             //}

              if(this.edittopmember.type==1){
                data.color=parseFloat(data.color)
              }              
              this.postdata('edit',data)
      }, 
      resetForm(formName) {
              this.adduser.account=''
              this.adduser.password=''
              this.adduser.name=''
      },
      postdata(val,data){                                                         
                  this.loadingadd=true
                  this.$request.postData('/member/editpost',data).then(response => {
                    this.loadingadd=false
                    if(response.code==200){
                        if(this.componentsPoPdata.ctype==2 && this.componentsPoPdata.nowdata.type!=2){
                            this.componentsPoPdata.nowdata.type=2
                        }
                        if(this.componentsPoPdata.editfrist==true){
                            this.componentsPoPdata.editfrist=false
                            this.$emit('getdata')
                            this.$emit('opencomponentsBox','dssetCom',this.componentsPoPdata.ctype,data)
                        }else{
                            this.$emit('getdata')
                        }  
                        this.geteditdata()                     
                      this.$message({
                        message: response.msg,
                        type: 'success'
                      }); 
                                    
                    }else{
                      this.$message.error(response.msg);
                    }
                  }).catch(error => {
                    this.loadingadd=false
                    this.$message.error('网络请求错误');
                  }); 
      },          
      geteditdata(){
              this.loadingadd=true
              this.$request.postData('/member/edit',{id:parseInt(this.componentsPoPdata.id)}).then(response => {
                this.loadingadd=false
                if(response.code==200){
                  this.editdata=response.data.member
                  this.edittopmember=response.data.topmember
                  var a = JSON.parse(JSON.stringify(this.edittopmember.game_str))
                  a = a.replace(/\s*/g,"")//清除全部空格
                  this.topGame=a==''? []:a.split(",")
                  var b = JSON.parse(JSON.stringify(this.editdata.game_str))
                  b = b.replace(/\s*/g,"")//清除全部空格

                  this.editGame=b==''? []:b.split(",")
                  if(a==b && a!=''){
                    this.checkAllGame=true
                  }
                  this.editdata.password=''
                  this.chackpan=this.getpan(this.editdata)
                  if(this.componentsPoPdata.pan.length==this.chackpan.length){
                    this.checkAll=true
                  }
                  this.oldts=parseFloat(this.editdata.ts)
                  this.editdata.zc=parseFloat((parseFloat(this.editdata.zc)*100).toFixed(3))
                  this.editdata.top_zc=parseFloat((parseFloat(this.editdata.top_zc)*100).toFixed(3))
                  this.edittopmember.zc=parseFloat((parseFloat(this.edittopmember.zc)*100).toFixed(3))
                  this.edittopmember.top_zc=parseFloat((parseFloat(this.edittopmember.top_zc)*100).toFixed(3))
                  this.editdata.top_lj_zc=parseFloat((parseFloat(this.editdata.top_lj_zc)*100).toFixed(3))
                  // if(this.edittopmember.is_lj && this.editdata.type>2){
                  //   this.editdata.top_lj_zc=parseFloat((parseFloat(this.editdata.top_lj_zc)*100).toFixed(3))
                  // } 
                      
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loadingadd=false
                this.$message.error('网络请求错误');
              }); 
      },
      getpan(row){
              var a=[]
              for(let key in this.componentsPoPdata.pan){
                if(row[this.componentsPoPdata.pan[key]]){
                  a.push(this.componentsPoPdata.pan[key])
                }
              }
              return a
      },
      percentage(){
                var a=this.editdata.zc? parseFloat(parseFloat(this.editdata.zc).toFixed(4)):0
                var b=this.editdata.top_zc? parseFloat(parseFloat(this.editdata.top_zc).toFixed(4)):0

               var d=parseFloat((parseFloat(this.edittopmember.zc)-a-b).toFixed(4))
               if(d<0){
                return '-'
               }
               return d
      },
      handleCheckAllChange(val) {
              var pan=this.getpan(this.edittopmember)
              this.chackpan= val ? pan : []
              this.isIndeterminate = false;   

      },
      handleCheckedCitiesChange(value){
        var pan=this.getpan(this.edittopmember)
                let checkedCount = value.length;
                this.checkAll = checkedCount === pan.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.chackpan.length;
      },
      handleCheckAllChangeGame(val) {
              this.editGame= val ? this.topGame : []
              this.isIndeterminateGame = false;   

      },
      handleCheckedCitiesChangeGame(value){
                let checkedCount = value.length;
                this.checkAllGame = checkedCount === this.topGame.length;
                this.isIndeterminateGame = checkedCount > 0 && checkedCount < this.editGame.length;
      },
      getGameName(id){
         return this.home_data.GameList.filter((item) =>item.lottery_id==id)
      }                        
    }
  }
  </script>
