<template> 
    <div class="main-boxdiv1" style="width: 100%;height:92%;" v-loading="loading"> 
        <el-table border v-loading="loading" :data="OtableData"  :header-cell-class-name="'trheader'"  :cell-style="cellStyle"  height="100%" style="width: 100%">
            <el-table-column label="彩种" width="80" >
                <template #default="{row}">
                <span>
                    {{GameList.name}}
                </span>
                </template>
            </el-table-column>    
            <el-table-column label="期号" width="80" >
                <template #default="{row}">
                <span>
                    {{row.Issue}}
                </span>
                </template>
            </el-table-column>                        
            <el-table-column label="订单号" width="140">
                <template #default="{row}">
                  <span>
                    <div class="text_nowrap" :title="row.OrderSn">{{ row.OrderSn }}</div>
                  </span>
                </template>
            </el-table-column> 
            <el-table-column prop="Account" label="投注会员"  width="130"/>             
            <el-table-column prop="Date" label="投注时间"  width="130"/>
            <el-table-column label="项目">
              <template #default="{row}">
                <span>
                    {{getPlayGroup(row)}} {{ row.PlayZt>0 ? '正'+row.PlayZt:'' }}
                </span>
              </template>
            </el-table-column>          
            <el-table-column label="号码"> 
              <template #default="{row}">
                <div class="text_nowrap" :title="row.PlayNumber">{{ row.PlayNumber}}</div> 
              </template>        
            </el-table-column> 
            <el-table-column prop="Abc" label="盘口" width="60"/>
            <el-table-column label="赔率">
                <template #default="{row}">
                  <span class="Rate">{{ row.Rate1}}<span v-if="row.Rate2>0">/{{row.Rate2}}</span></span>
                </template>
            </el-table-column>             
            <el-table-column prop="BetMoney" label="投注金额" />         
            <el-table-column prop="Ty" label="退佣" />

            <el-table-column prop="Zcje" label="占成金额" />         
            <el-table-column prop="Zcty" label="占成退佣" />
            <el-table-column prop="Zcyk" label="占成盈亏">
              <template #default="{row}">
                <span :style="{'color':row.Zcyk<0 ? 'red':''}">
                  {{row.Zcyk}}
                </span>
              </template>
            </el-table-column>               

          </el-table> 
          <el-pagination background layout="total,prev, pager, next"
            v-model:current-page="page"
            v-model:page-size="size"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            />                  
    </div>
   </template>      
   <script>
         export default {
          props: {
            GameList: {
                type: Array
            },
            GetOrderListPost: {
                type: Object
            },
            PlayZt:{
                type: Number
            }                     
          },        
           data() {
             return {
                page:1,
                size:50,
                total:0,
                OtableData:[],
                totaltable:[],
                loading:false,
                Playdata:[]
             }
           },
           created(){
                this.Playdata=this.$store.state.Playdata
            //this.DetailData.LotteryId=this.home_data.GameList[this.home_data.game_index]
                this.getOrderList()
           },
           computed: {
               
           },
          mounted() {
  
          },
          methods: {
            handleSizeChange(size){
                    this.size=size
            },
            handleCurrentChange(newPage){
                    this.page=newPage
                    this.getOrderList()
            },            
            cellStyle({row, column, rowIndex, columnIndex}) {
                if(row.Result==1 || row.Result==2){
                    return {'background-color': '#4CAF50 !important'};
                }                       
            },            
            cellStyle1({row, column, rowIndex, columnIndex}) {
                return {'background-color': '#ffcb04 !important'};                       
            },            
            getOrderList(Issue){
                //return
                this.loading=true
                this.$request.postData('/order/item',{'LotteryId':this.GetOrderListPost.LotteryId,'PlayType':this.GetOrderListPost.PlayType,'PlayNumber':this.GetOrderListPost.PlayNumber,'PlayZt':this.PlayZt,'page':this.page}).then(response => {
                if(response.code==200){
                    this.OtableData=response.data.data
                    this.total=response.data.count
                    // if(response.data.dataall.length>0){
                    //     this.total=response.data.dataall[0].Num
                    //     this.totaltable=[]
                    //     this.totaltable.push(response.data.dataall[0])
                    // }

                    this.loading=false
                }
                }).catch(error => {
                    this.loading=false
                });             
            },
            getPlayGroup(row){
                var a=''
                a=this.Playdata.filter(item=>item.id===row.PlayType)
                return a.length>0 ? a[0].name:'-'
            }          
          }
         }
   </script>
  
      