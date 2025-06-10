<template>
  <div class="main-boxdiv1" style="width: 100%;height:92%;" v-loading="loading"> 
        <div class="titlem bodynav mb4_top" style="line-height:35px;background: #f0f9ff !important;">
          <span>当前彩种</span>
          <span>
          <select v-if="GameList.length>0" v-model="lottery_id" @change="handleData(OldData,OldDataTop)" style="height:24px">
            <option v-for="(item,index) in GameList" :label="item.name" :value="parseInt(item.lottery_id)"/>
          </select> 
          </span>
          <span class="game_box_topbtn" @click="edit()">保存退水设置</span>   
          <span class="game_box_topbtn" @click="handleData(OldData,OldDataTop)">重置输入</span>   
        </div>  
        <el-table border 
        v-if="OldeditDataTop.length>0 && editData.length>0 && OldeditDataTop.length==editData.length"
        ref="multipleTableRef" :data="editData" height="100%" 
        :header-cell-class-name="'trheader'"
        style="width: 100%;" 
        show-footer
        >
         
          <el-table-column v-for="(items,key) in keyname" :label="items">
            <template #header>
              <div>
               {{ items }}
              </div> 
              <div>
                    <select
                    class="dissuffix"
                    v-model="quicktrue[key].value"
                    placeholder="Select"
                    size="large"
                    style="width: 66px;padding: 2px 3px;"
                    @change="selectchange(key)"
                     v-if="key!='group_name' && key!='rate' && key!='min_money' && key!='max_money' && key!='all_money'"
                    >
                    <option label="快捷" value="-1"></option>
                    <option label="全赚" value="1"></option>
                    <option v-for="items1 in quicktrue[key].data" :label="items1==0 ? '全退':'赚'+items1" :value="items1"></option>
                    </select> 
                    <input v-if="key=='rate' || key=='min_money' || key=='max_money' || key=='all_money'" class="Odds_input" type="number" 
                    @input="inputchange(key)"
                    v-model="quicktrue[key].value" />    
                  <span  v-if="key=='group_name'">
                    快捷
                  </span>
               </div>                                                          
            </template>               
            <template  #default="{ row,$index }">
              <span v-if="key!='group_name'">
                 <input :id="'input_'+$index+'_'+key" :class="getInuptClass(row,$index,key)" class="Odds_input" type="number" v-model="row[key]"/>  
              </span>
              <span v-else>
                {{ row[key] }}
              </span>
                                  
            </template> 
          </el-table-column>                                                                                                                                               
      </el-table>
   </div>
 </template>      
 <script>
       export default {
        props: {
          componentsPoPdata: {
                type: Object
              },  
          home_data: {
                type: Object
          },                           
        },        
         data() {
           return {
             loading:true,
             lottery_id:1,        
             GameList:[],   
             GameList1:[],       
             OldData:[],
             editData:[],
             OldeditData:[],
             OldeditDataTop:[],
             OldDataTop:[],
             quicktrue:{
                 'rate':{
                    'value':0,
                    'data':[]
                 },
                 'min_money':{
                    'value':0,
                    'data':[]
                 },
                 'max_money':{
                    'value':0,
                    'data':[]
                 },
                 'all_money':{
                    'value':0,
                    'data':[]
                 },
                 'a':{
                    'value':-1,
                    'data':[]
                 },
                 'b':{
                    'value':-1,
                    'data':[]
                 },
                 'c':{
                    'value':-1,
                    'data':[]
                 },
                 'd':{
                    'value':-1,
                    'data':[]
                 },
                 'e':{
                    'value':-1,
                    'data':[]
                 },
                 'f':{
                    'value':-1,
                    'data':[]
                 },
                 'g':{
                    'value':-1,
                    'data':[]
                 },
                 'h':{
                    'value':-1,
                    'data':[]
                 },
                 'i':{
                    'value':-1,
                    'data':[]
                 },
                 'j':{
                    'value':-1,
                    'data':[]
                 },
                 'k':{
                    'value':-1,
                    'data':[]
                 },
                 'l':{
                    'value':-1,
                    'data':[]
                 }
             },
             keyname:{
                 'group_name':'项目',
                 'rate':'赚赔',
                 'min_money':'单注最低',
                 'max_money':'单注最高',
                 'all_money':'单项最高',
                 'a':'A盘退水',
                 'b':'B盘退水',
                 'c':'C盘退水',
                 'd':'D盘退水',
                 'e':'E盘退水',
                 'f':'F盘退水',
                 'g':'G盘退水',
                 'h':'H盘退水',
                 'i':'I盘退水',
                 'j':'J盘退水',
                 'k':'K盘退水',
                 'l':'L盘退水'

             }
           }
         },
         created(){
          this.GameList1=JSON.parse(JSON.stringify(this.home_data.GameList))
          // for(let key in this.GameList){
          //   this.GameList[key].IsChange=false
          // }
          // this.lottery_id=this.GameList[this.home_data.game_index].lottery_id  
          this.getTableData()
          this.getdata()        
         },
         computed: {
             
         },
        mounted() {

        },
         methods: {
          getInuptClass(row,index,key){
            var a=this.OldeditDataTop.filter(item=>item.LotteryId===row.LotteryId && item.PlayGroup===row.PlayGroup && item.group_name===row.group_name)
            if(a.length!=1){ return ''}
            var b=this.OldeditData[index]
             if(parseFloat(a[0][key])<parseFloat(row[key]) || parseFloat(row[key])<0){
                 return 'Odds_input_danger'
             }
             if(parseFloat(row[key])!=parseFloat(b[key])){
                 return 'Odds_input_focus'
             }
          },
          inputchange(key){
            for(var i=0;i<this.editData.length;i++){
              this.editData[i][key]=this.quicktrue[key].value 
            }
          },
          selectchange(key){
            if(parseFloat(this.quicktrue[key].value)<0){
               return
            }
            var a=JSON.parse(JSON.stringify(this.OldeditDataTop))
              for(var i=0;i<this.editData.length;i++){
                var topdata=a.filter(item=>item.LotteryId===this.editData[i].LotteryId && item.PlayGroup===this.editData[i].PlayGroup && item.group_name===this.editData[i].group_name)
                if(topdata.length!=1){continue;}
                var s1=parseFloat(topdata[0][key])-this.quicktrue[key].value                
                if(s1<0){               
                  this.editData[i][key]=0
                }else{
                  s1=parseFloat(s1.toFixed(4))
                  this.editData[i][key]=s1
                }               
              }
          },
          getdata(){
              this.$request.postData('/member/back',{'id':this.componentsPoPdata.id}).then(response => {
                this.loading=false
                if(response.code==200){
                  var aa=JSON.parse(JSON.stringify(this.home_data.GameList))
                  var bb=response.data.member.game_str
                  bb = bb.replace(/\s*/g,"")//清除全部空格
                  bb=bb.split(",")
                  var cc=[]
                  for(let key in aa){
                    if(bb.includes((aa[key].lottery_id).toString())){
                       var dd=aa[key]
                       dd.IsChange=false
                       cc.push(dd)
                    }
                  }
                  this.GameList=cc
                  if(bb.includes((this.GameList1[this.home_data.game_index].lottery_id).toString())){
                    this.lottery_id=this.GameList1[this.home_data.game_index].lottery_id  
                  }else{
                    this.lottery_id=this.GameList[0].lottery_id  
                  }
                  this.OldData=response.data.backs
                  this.OldDataTop=response.data.topbacks
                  var a=JSON.parse(JSON.stringify(response.data.backs))
                  var b=JSON.parse(JSON.stringify(response.data.topbacks))                
                  this.handleData(a,b)
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loading=false
                this.$message.error('网络请求错误');
              }); 
            },
            handleData(data,data1){
              var m1=data[this.lottery_id]
              var m2=data1[this.lottery_id]
              m1.sort(function (a1, b1) {
                    return a1.PlayGroup - b1.PlayGroup;
                  });  
              m2.sort(function (a1, b1) {
                    return a1.PlayGroup - b1.PlayGroup;
              });                                  
              this.OldeditData=JSON.parse(JSON.stringify(m1));
              this.OldeditDataTop=JSON.parse(JSON.stringify(m2));
              this.editData=JSON.parse(JSON.stringify(m1))
              this.handlequick(this.OldeditDataTop)                       
            },
            handlequick(data){
              var a=JSON.parse(JSON.stringify(data)) 
              var d={} 

                for(let key in  this.quicktrue){  
                  if(key!='rate' && key!='min_money' && key!='max_money' && key!='all_money'){
                      d[key]=Math.max(...a.map(item => item[key]))
                  } 
                    
                }
              for(let key in d){ 
                if(d[key]>0){  
                  var i1=0                
                  for(var i=0;i<d[key];i+=0.001){
                      var s1=i
                      s1=parseFloat(s1.toFixed(4))
                      if(!this.quicktrue[key].data.includes(s1)){
                         this.quicktrue[key].data.push(s1)
                      }                     
                      i1++
                      if(i1>300){
                        break
                      }
                  }                 
                }
              }
              
            },
            edit(){
              var a=JSON.parse(JSON.stringify(this.OldData))
              a=a[this.lottery_id]
              var b=JSON.parse(JSON.stringify(this.OldDataTop))
              b=b[this.lottery_id]
              a.sort(function (a1, b1) {
                return a1.PlayGroup - b1.PlayGroup;
              });  
              b.sort(function (a1, b1) {
                return a1.PlayGroup - b1.PlayGroup;
              }); 
              var c=JSON.parse(JSON.stringify(this.editData))
              c.sort(function (a1, b1) {
                return a1.PlayGroup - b1.PlayGroup;
              });          
              if(a==c){
                this.$message({
                        message: '保存成功,注意修改其它游戏退水！',
                        type:'success'
                      }); 
                return
              }
              var udata=[];   
              var msg=''                        
                for(var i=0;i<c.length;i++){
                    if(JSON.stringify(c[i])!=JSON.stringify(a[i])){
                      if(b[i].group_name==c[i].group_name){
                        for(let key in b[i]){                        
                           if(key!='LotteryId' && key!='PlayGroup' && key!='group_name'){
                                if(c[i][key]<0){
                                  msg=msg+'['+c[i]['group_name']+']:'+this.keyname[key]+'不能为负数;<br/>'
                                }                              
                                if(b[i][key]>=c[i][key]){
                                    if(key!='reate' && key!='min_money' && key!='max_money' && key!='all_money'){
                                       c[i][key]=b[i][key]-c[i][key]
                                       c[i][key]= parseFloat(c[i][key].toFixed(4))
                                    }                                                                                           
                                }else{
                                  if(key!='rate' && key!='min_money' && key!='max_money' && key!='all_money'){
                                     msg=msg+'['+c[i]['group_name']+']:'+this.keyname[key]+'不能大于'+b[i][key]+';<br/>'
                                  }
                                   
                                }
                           }
                        }
                        udata.push(c[i])         
                             
                      }
                     
                    }
                }
              if(msg!=''){
                this.$message({
                  dangerouslyUseHTMLString: true,
                  message: msg,
                  type: 'warning',
                // duration: 5000，
                  showClose: true 
                })
                return
              } 
              if(udata.length<=0){
                var n=""
                if(this.GameList.length>1){
                  n=",注意修改其它游戏退水"
                }
                this.$message({
                        message: '保存成功'+n+'！',
                        type:'success'
                      }); 
                return
              } 
              var  postdata={'id':this.componentsPoPdata.id,'Backs':udata} 
              this.loading=true
              this.$request.postData('/member/backpost',postdata).then(response => {
                this.loading=false
                if(response.code==200){
                  var IsChangeC=[]
                  for(let key in this.GameList){
                    if(this.GameList[key].lottery_id==this.lottery_id){
                     this.GameList[key].IsChange=true
                    }
                    if(!this.GameList[key].IsChange){
                      IsChangeC.push(this.GameList[key].name)
                    }
                  }                  
                  this.$message({
                        message: IsChangeC.length>0 ? response.msg+';还有'+IsChangeC.join(',')+'未设置,注意修改全部游戏退水！':response.msg,
                        type:'success',
                        duration:IsChangeC.length>0 ? 5000:3000
                      }); 
                      this.getdata()                    
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.loading=false
                this.$message.error('网络请求错误');
              }); 
            },
            getTableData(){
              var a={}
              for(let key in this.keyname){
                 if(this.componentsPoPdata.dsspan.includes(key) || key=='group_name' || key=='rate' || key=='min_money' || key=='max_money' || key=='all_money'){
                  a[key]=this.keyname[key]
                 }
              }
              var b={}
              for(let key in this.quicktrue){
                if(this.componentsPoPdata.dsspan.includes(key) || key=='group_name' || key=='rate' || key=='min_money' || key=='max_money' || key=='all_money'){
                  b[key]=this.quicktrue[key]
                 }
              }
              this.quicktrue=b
              this.keyname=a
            }

                       
         }
     
       }
 </script>

    