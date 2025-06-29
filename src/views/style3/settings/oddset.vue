<template>
  <div class="main-boxdiv" v-loading="loading">
        <div ref="maintopmenu" class="game_herad"> 
          <div class="game_herad_tab">
            <div class="game_herad_tab_nav" v-for="(items,index) in Play_Grpup_data" :class="index === Play_Group_Index ? 'isActive1' : ''" @click="changePlayGroup(index)">
              <div class="game_herad_tab_nav_title" style="padding:8px 0px;">
                {{ items.group_name }}
              </div>             
            </div>
          </div>    
        </div> 
        <div class="titlem bodynav mb4_top">
          <span>当前彩种</span>
          <span>
          <select v-model="lottery_id" @change="getdata()" style="height:24px">
            <option v-for="(item,index) in GameList" :label="item.name" :value="parseInt(item.lottery_id)"/>
          </select> 
          </span> 
          <span class="game_box_topbtn" @click="edit()">保存赔率设置</span>
          <span class="game_box_topbtn" @click="reset()">重置输入</span>
          <span class="game_box_topbtn" @click="empty()">清空赔率</span>
        </div>       
      <el-table border 
       :data="editData" :header-cell-class-name="'trheader'" :height="clientHeight2+'px'" style="width: 100%;">          
        <el-table-column fixed prop="group_name" label="项目" width="80"/>
        <el-table-column fixed prop="play_name" label="玩法" width="180"/>
        <el-table-column label="A盘赔率" width="180">
          <template  #default="{ row,$index }">
                  <input :class="parseFloat(OldeditData[$index].odds1)!=parseFloat(row.odds1) ? 'Odds_input_focus':''" class="Odds_input" type="number" v-model="row.odds1"  @focus="handlefocus(row)"/>
                  <span v-if="row.is_two">/
                    <input :class="parseFloat(OldeditData[$index].odds2)!=parseFloat(row.odds2) ? 'Odds_input_focus':''" class="Odds_input" type="number" v-model="row.odds2" />
                  </span>
                  
          </template> 
        </el-table-column>    
        <el-table-column  v-for="(items,key) in keyname" :label="items">
          <template  #default="{ row,$index }">
                  <input :class="parseFloat(OldeditData[$index][key])!=parseFloat(row[key]) ? 'Odds_input_focus':''" class="Odds_input" type="number" v-model="row[key]" />                  
          </template> 
        </el-table-column>                                            
        <el-table-column label="是否开放">
          <template #header>
              <span>状态</span><br/>
              <el-switch
              v-model="allstate" @change="chstate()" />  
          </template>          
          <template  #default="{ row }">
              <el-switch
              v-model="row.self_state"
               />                            
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
            Kj:'',
            lottery_id:1,
            Play_Group_Index:0,
            PlayGroup:[1,2,3,4],
            Play_Grpup_data:[
              {'group_name':'特码','PlayGroup':[1,2,3,4]},
              {'group_name':'正码','PlayGroup':[5,6,7]},
              {'group_name':'正码特','PlayGroup':[8,9,10,11]},
              {'group_name':'特码项','PlayGroup':[12,13,14,15,16,17,18]},
              {'group_name':'生肖项','PlayGroup':[19,20,21]},
              {'group_name':'尾数项','PlayGroup':[22,23]},
              {'group_name':'连码','PlayGroup':[26]},
              {'group_name':'生肖连','PlayGroup':[28]},
              {'group_name':'尾数连','PlayGroup':[29]},
              {'group_name':'不中','PlayGroup':[30]},
              {'group_name':'中一','PlayGroup':[31]},
              {'group_name':'任中','PlayGroup':[32]},
              {'group_name':'七码','PlayGroup':[24]},
              {'group_name':'七色波','PlayGroup':[25]},
              {'group_name':'合肖','PlayGroup':[27]}
            ],        
            OldData:[],
            OldeditData:[],
            editData:[],
            GameList:[], 
             keyname:{
                 'b':'B盘赔率差',
                 'c':'C盘赔率差',
                 'd':'D盘赔率差',
                 'e':'E盘赔率差',
                 'f':'F盘赔率差',
                 'g':'G盘赔率差',
                 'h':'H盘赔率差',
                 'i':'I盘赔率差',
                 'j':'J盘赔率差',
                 'k':'K盘赔率差',
                 'l':'L盘赔率差'
             },
             allstate:false
          }
        },
        created(){
        
             this.lottery_id=this.home_data.GameList[this.home_data.game_index].lottery_id
             this.GameList=JSON.parse(JSON.stringify(this.home_data.GameList)) 
             this.getdata()
        },
        mounted() {
 
          
        },
        computed: {
        },
        methods: {
          chstate(){
             for(var i=0;i<this.editData.length;i++){
              this.editData[i].self_state=this.allstate
             }
          },
          chstate1(){
            this.allstate=false
            for(var i=0;i<this.editData.length;i++){
              if(this.editData[i].self_state){
                this.allstate=true
                break
              }
             }
          },          
          getBoxHeight (box) {
                  if (!box) return 0
                  const styles = window.getComputedStyle(box)
                  const height = parseFloat(styles.height)
                  const marginTop = parseFloat(styles.marginTop)
                  const marginBottom = parseFloat(styles.marginBottom)
                  return height + marginTop + marginBottom
          },
          getBoxPadding (box) {
                  if (!box) return 0
                  const styles = window.getComputedStyle(box)
                  const paddingTop = parseFloat(styles.paddingTop)
                  const paddingBottom = parseFloat(styles.paddingBottom)
                  return paddingTop + paddingBottom
          },          
          getdata(){
              this.loading=true
              this.$request.postData('/odds/find',{'lottery_id':this.lottery_id}).then(response => {
                if(response.code==200){
                  this.OldData=response.data.data
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
              this.editData=[]
              this.OldeditData=[]
              for(var i=0;i<data.length;i++){
                     if(this.PlayGroup.indexOf(data[i].PlayGroup)>-1){
                       this.editData.push(data[i])
                       var a=JSON.parse(JSON.stringify(data[i]))
                       this.OldeditData.push(a)
                     }  
              }
              this.chstate1()
            },
            changePlayGroup(index){
                this.Play_Group_Index=index
                this.PlayGroup=this.Play_Grpup_data[index].PlayGroup
                var a=JSON.parse(JSON.stringify(this.OldData))
                this.handleData(a);
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
              if(udata.length<=0){
                this.$message.error('数据无变化')
                return
              }         
              this.$request.postData('/odds/edit',udata).then(response => {
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
            reset(){
              var a=JSON.parse(JSON.stringify(this.OldData))
              this.handleData(a);
            },
            empty(){
              for(var i=0;i<this.editData.length;i++){
                this.editData[i].odds1=''
                if(this.editData[i].is_two){
                  this.editData[i].odds2=''
                }
              }
            },
            handlefocus(row){
             // row.a=111
             
            },
            changestate(val,id){
              //this.edit()
            },           
            setstate(){

            }
                      
        }
    
      }
</script>
