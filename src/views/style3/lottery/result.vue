<template>
  <div class="main-boxdiv resultB" v-loading="Loading">       
      <div class="titlem bodynav">
        <span>开奖历史</span>
        <span>
          <select v-model="lottery_id" @change="getResults()" style="height:24px">
            <option v-for="(item,index) in GameList" :label="item.name" :value="parseInt(item.lottery_id)"/>
          </select> 
          </span>            
      </div> 
      <el-table border :data="histroy" :header-cell-class-name="'trheader'" :header-cell-style="headerCellStylereptot" :height="clientHeight2-80+'px'" :cell-style="cellStyle" style="width: 100%">
          <el-table-column prop="Issue" label="期数"/>
          <el-table-column prop="Date" label="开奖时间" width="170"/>
          <el-table-column v-for="item in 7" :label="item==7 ? '特码':'正'+item">
            <template #default="{row}">
              <div class="tableheader" style="display: flex;">
                <div style="margin: 0px 3px;">
                <div class="play_text ball_n" :class="UserInfo.items[row['Ball'+item]].NumberBs==66 ? 'ball_red':UserInfo.items[row['Ball'+item]].NumberBs==67 ? 'ball_blue':UserInfo.items[row['Ball'+item]].NumberBs==68 ? 'ball_green':''">
                  <span class="text_nowrap">{{UserInfo.items[row['Ball'+item]].PlayNumber}}</span>
                </div>
                </div>
                <div style="margin: 0px 3px;">
                 <span>{{sxData[row['NumberSx'+item]]}}</span>
                </div>
              </div>
            </template>          
          </el-table-column>
          <el-table-column prop="NumberPoint" label="总分"/>  
          <el-table-column label="单双">
            <template #default="{row}">
              <span :style="{'color':row.NumberDs==52 ? 'blue':'red'}">
                {{row.NumberDs==52 ? '单':'双'}}
              </span>
            </template>
          </el-table-column>  
          <el-table-column label="大小">
            <template #default="{row}">
              <span :style="{'color':row.NumberDx==50 ? 'blue':'red'}">
                {{row.NumberDx==50 ? '大':'小'}}
              </span>
            </template>
          </el-table-column>  
          <el-table-column label="家禽野兽">
            <template #default="{row}">
              <span :style="{'color':row.NumberJqys==60 ? 'blue':'red'}">
                {{row.NumberJqys==60 ? '家禽':'野兽'}}
              </span>
            </template>
          </el-table-column>                 
          <el-table-column label="合数单双">
            <template #default="{row}">
              <span :style="{'color':row.NumberHsds==56 ? 'blue':'red'}">
                {{row.NumberHsds==56 ? '合单':'合双'}}
              </span>
            </template>
          </el-table-column> 
          <el-table-column label="合数大小">
            <template #default="{row}">
              <span :style="{'color':row.NumberHsdx==54 ? 'blue':'red'}">
                {{row.NumberHsdx==54 ? '合大':'合小'}}
              </span>
            </template>
          </el-table-column>         
          <el-table-column label="尾数大小">
            <template #default="{row}">
              <span :style="{'color':row.NumberWsdx==58 ? 'blue':'red'}">
                {{row.NumberWsdx==58 ? '尾大':'尾小'}}
              </span>
            </template>
          </el-table-column>             
        </el-table>          
      <div class="mb-4">
          <el-pagination background layout="total,prev, pager, next"
                  v-model:current-page="page"
                  v-model:page-size="pagesize"
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
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
      UserInfo:{
          type:Object
      }                      
    },     
    data() {
      return {
        Loading:true,
        GameList:[],
        lottery_id:'',
        histroy:[],
        pagesize:50,
        page:1,
        total:0,
          sxData:{
              '69':'鼠',
              '70':'牛',
              '71':'虎',
              '72':'兔',
              '73':'龙',
              '74':'蛇',
              '75':'马',
              '76':'羊',
              '77':'猴',
              '78':'鸡',
              '79':'狗',
              '80':'猪',

          }    
      }
    },
    created(){
      var a=JSON.parse(JSON.stringify(this.home_data.GameList[this.home_data.game_index]))
      this.lottery_id= a.lottery_id
      this.GameList=JSON.parse(JSON.stringify(this.home_data.GameList))
      this.getResults()
    },
    methods: {
        CellBallClass(id){
            return 'ball1'
          for (let index = 0; index < this.NumberItem[0].data.length; index++) {
            if(this.NumberItem[0].data[index]==id){
              return this.NumberItem[0].ClassName[index]
            }
          }
        }, 
        headerCellStylereptot({row, column, rowIndex, columnIndex}){
          return {'text-align': 'center'}; 
        },   
        cellStyle({row, column, rowIndex, columnIndex}) {
          return {'font-weight': '500 !important'};
        },              
        handleSizeChange(size){
              this.pagesize=size
        },
        handleCurrentChange(newPage){
              this.page=newPage
              this.getResults()
        },           
        getResults(){
              this.Loading=true
              this.$request.postData('/lottery/lotteryresults',{LotteryId:parseInt(this.lottery_id),page:this.page}).then(response => {
              if(response.code==200){
                  this.histroy=[]
                  for(let key in response.data.results){
                  this.histroy.push(response.data.results[key])
                  } 
                  this.total=response.data.count
                  this.Loading=false
              }             
              }).catch(error => {
                  //this.showerro=true
                  this.Loading=false
              });               
          },      
          getNumber(id){
          return this.Number49.filter(item => item.NumberItem === id)  
          },      
          getNumberSx(id){
          return this.NumberItem[1].namedata.filter(item => item.id === id)  
          },
    }

  }
  </script>
  <style scoped>
  .ball_n {
  font-size: 14px;
  color: #111626;
  text-align: center;
  width: 16px;
  margin: 0 2px;
  font-weight: 400;
}

.ball_red {
  letter-spacing: 0;
  width: 28px;
  height: 28px;
  line-height: 28px;
  /* display: inline-block; */
  border-radius: 50%;
  font-size: 14px;
  color: #fff;
  text-align: center;
  font-weight: 700;
  background-color: #ff4444;
}


.ball_blue {
  letter-spacing: 0;
  width: 28px;
  height: 28px;
  line-height: 28px;
  display: inline-block;
  border-radius: 50%;
  font-size: 14px;
  color: #fff;
  text-align: center;
  font-weight: 700;
  background-color: #3399ff;
}

.ball_green {
  letter-spacing: 0;
  width: 28px;
  height: 28px;
  line-height: 28px;
  display: inline-block;
  border-radius: 50%;
  font-size: 14px;
  color: #fff;
  text-align: center;
  font-weight: 700;
  background-color: #33cc33;
}
  .tableheader{
      justify-content: center !important;
  }
  </style>
  