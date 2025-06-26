<template>
    <div class="main-boxdiv1" style="width: 100%;height:92%;">
          <div class="titlem bodynav mb4_top" style="line-height:35px;background: #f0f9ff !important;">
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
          <div ref="maintopmenu" class="game_herad"> 
            <div class="game_herad_tab" style="margin: 0 auto;">
              <div class="game_herad_tab_nav" v-for="(items,index) in Play_Grpup_data" :class="index === Play_Group_Index ? 'isActive1' : ''" @click="changePlayGroup(index)">
                <div class="game_herad_tab_nav_title" style="padding:8px 0px;">
                  {{ items.group_name }}
                </div>               
              </div>
            </div>    
          </div>                          
        <el-table border 
        :header-cell-class-name="'trheader'"
        ref="multipleTableRef" @selection-change="handleSelectionChange" :data="editData.filter(data => !search || data.group_name.toLowerCase().includes(search.toLowerCase()))" height="100%" style="width: 100%;">
        
          <el-table-column fixed prop="group_name" label="项目" width="80"/>
          <el-table-column fixed prop="play_name" label="玩法" width="180"/>
          <el-table-column label="A盘赔率" width="180">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.odds1"  @focus="handlefocus(row)"/>
                    <span v-if="row.is_two">/
                      <input class="Odds_input" type="number" v-model="row.odds2" />
                    </span>
                    
            </template> 
          </el-table-column>    
          <el-table-column label="B盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.b" />                  
            </template> 
          </el-table-column> 
          <el-table-column label="C盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.c" />                  
            </template> 
          </el-table-column> 
          <el-table-column label="D盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.d" />                  
            </template> 
          </el-table-column> 
          <el-table-column label="E盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.e" />                  
            </template> 
          </el-table-column> 
          <el-table-column label="F盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.f" />                  
            </template> 
          </el-table-column>   
          <el-table-column label="H盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.h" />                  
            </template> 
          </el-table-column> 
          <el-table-column label="I盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.i" />                  
            </template> 
          </el-table-column> 
          <el-table-column label="J盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.j" />                  
            </template> 
          </el-table-column>   
          <el-table-column label="K盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.K" />                  
            </template> 
          </el-table-column>  
          <el-table-column label="L盘赔率差" width="100">
            <template  #default="{ row }">
                    <input class="Odds_input" type="number" v-model="row.l" />                  
            </template> 
          </el-table-column>                                              
          <el-table-column label="状态">
            <template #header>
                <span>状态</span>
                <el-switch
                v-model="allstate" @change="chstate()" />  
            </template>            
            <template  #default="{ row }">
                <el-switch
                v-model="row.state"
               
              />                              
            </template> 
          </el-table-column>                                     
      </el-table> 
    </div>
    
  
  
  </template>      
  <script>
        export default {
          props: {
            home_data: {
                type: Array
            },             
            user_id: {
                  type: Number,
                  default: 0
            },              
          },        
          data() {
            return {
              Kj:'',
              lottery_id:1,
              Play_Group_Index:0,
              PlayGroup:[1,2,3,4],
              GameList:[],
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
              editData:[],
              mainp:false,
              allstate:false
            }
          },
          created(){
                this.GameList=this.home_data.GameList
                this.lottery_id=this.GameList[this.home_data.game_index].lottery_id
               this.getdata()
          },
          mounted() {
            // const windowInnerHeight = window.innerHeight // 屏幕可视高度
            // const maintopDiv1 = this.$refs.maintopmenu
            // const aaaaa=this.getBoxHeight(maintopDiv1)
            // const bbbbb=this.getBoxPadding(maintopDiv1)
            // const topheight=aaaaa+bbbbb
            // const topheight1=topheight/windowInnerHeight
            // this.mainp=(1-topheight1)*100    
            
          },
          computed: {
          },
          methods: {
            chstate(){
              for(var i=0;i<this.editData.length;i++){
                this.editData[i].state=this.allstate
              }
            },
            chstate1(){
              this.allstate=false
              for(var i=0;i<this.editData.length;i++){
                if(this.editData[i].state){
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
                this.$request.postData('/bhodds/find',{'user_id':this.user_id,'lottery_id':this.lottery_id}).then(response => {
                  if(response.code==200){
                    this.OldData=response.data.data
                    var a=JSON.parse(JSON.stringify(response.data.data))
                    this.handleData(a)
                  }else{
                    this.$message.error(response.msg);
                  }
                }).catch(error => {
                  this.$message.error('网络请求错误');
                }); 
              },
              handleData(data){
                this.editData=[]
                for(var i=0;i<data.length;i++){
                       if(this.PlayGroup.indexOf(data[i].PlayGroup)>-1){
                         this.editData.push(data[i])
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
                for(var i=0;i<this.editData.length;i++){
                  udata.push(this.editData[i])
                }              
                this.$request.postData('/bhodds/edit',udata).then(response => {
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
  