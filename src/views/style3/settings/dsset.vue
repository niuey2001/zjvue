<template>
      <div class="main-boxdiv" v-loading="loading"> 
        <div class="titlem bodynav mb4_top">
          <span>当前彩种</span>
          <span>
          <select v-model="lottery_id" @change="getdata()" style="height:24px">
            <option v-for="(item,index) in GameList" :label="item.name" :value="parseInt(item.lottery_id)"/>
          </select> 
          </span>          
          <span class="game_box_topbtn" @click="edit()">保存退水</span>
          <span class="game_box_topbtn" @click="handleData(OldeditData)">重置输入</span>   
        </div>                
        <el-table border 
         :header-cell-class-name="'trheader'"
         :data="editData" :height="clientHeight2+50+'px'" style="width: 100%;" 
        show-footer
        >             
            <el-table-column  v-for="(items,key) in keyname" :label="items">
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
        },        
         data() {
           return {
             loading:true,
             lottery_id:1,        
             GameList:[],        
             //OldData:[],
             OldeditData:[],
             editData:[],
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
          this.lottery_id=this.home_data.GameList[this.home_data.game_index].lottery_id  
          this.GameList=JSON.parse(JSON.stringify(this.home_data.GameList))   
          this.getdata()        
         },
         computed: {
             
         },
        mounted() {

        },
         methods: {
          getInuptClass(row,index,key){
            if(row[key]!=parseFloat(this.OldeditData[index][key])){
                return 'Odds_input_focus'
            }
          },
          getdata(){
              this.loading=true
              this.$request.postData('/backs/find',{'lottery_id':this.lottery_id}).then(response => {
                if(response.code==200){
                  //this.OldData=response.data.data
                  var a=JSON.parse(JSON.stringify(response.data.data))
                  this.handleData(a)
                }else{
                  this.$message.error(response.msg);
                }
                this.loading=false
              }).catch(error => {
                this.loading=false
                this.$message.error('网络请求错误');
              }); 
            },
            handleData(data){
              this.editData=data
              var a=JSON.parse(JSON.stringify(data))
              this.OldeditData=a           
            },
            edit(){
              var udata=[];
              var upindex=[];
              for(var i=0;i<this.editData.length;i++){
                if(JSON.stringify(this.OldeditData[i])!=JSON.stringify(this.editData[i])){
                    udata.push(this.editData[i])
                    upindex.push(i)
                }                 
              }   
              this.$request.postData('/backs/edit',udata).then(response => {
                if(response.code==200){
                  this.$message({
                        message: response.msg,
                        type: 'success'
                      }); 
                      for(var i=0;i<upindex.length;i++){
                        this.OldeditData[upindex[i]]=udata[i]
                      }                      
                      //this.getdata()                    
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                this.$message.error('网络请求错误');
              }); 
            },
            changestate(val,id){
              //this.edit()
            },           
            setstate(){

            }
                       
         }
     
       }
 </script>
    