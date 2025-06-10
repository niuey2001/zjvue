<template>
  <div class="main-boxdiv">
    <div class="mb-4 mb4_top" style="background:#f4fdfd;">
      <span>
        <select v-model="LotteryId" @change="getdata()">
          <option v-for="items in home_data.GameList" :value="parseInt(items.lottery_id)">
            {{ items.name }}
          </option>
        </select>
      </span>
      <span>更新</span> 
      <span>{{count}}</span> 
      <span>
        <select v-model="currentTime" placeholder="" @change="handleChangeCurrent">
          <option label="10秒" :value="parseInt(10)" />
          <option label="15秒" :value="parseInt(15)" />
          <option label="20秒" :value="parseInt(20)" />
          <option label="30秒" :value="parseInt(30)" />
        </select>         
      </span>
      <span style="position: absolute;right: 10px;">
        <span class="topbtn" @click="backupData()">备份数据</span>   
      </span>      
    </div>         
    <el-table border :header-cell-class-name="'trheader'" :data="tableData" :height="clientHeight2+'px'" style="width: 100%">
      <el-table-column label="彩种" >
          <template #default="{row}">
          <span>
              {{home_data.GameList.filter(item=>item.lottery_id==row.LotteryId)[0].name}}
          </span>
          </template>
      </el-table-column>    
      <el-table-column label="期号" >
          <template #default="{row}">
          <span>
              {{row.Issue}}
          </span>
          </template>
      </el-table-column>          
      <el-table-column prop="OrderSn" label="订单号" width="180" />
      <el-table-column prop="Date" label="投注时间" width="150"/>
      <el-table-column prop="Account" label="投注会员"  width="100"/> 
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
    <div class="mb-4">
      <el-pagination background layout="total,prev, pager, next"
              v-model:current-page="page"
              v-model:page-size="size"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />         
    </div>  
    <div class="main-boxdiv-bottom"></div> 
  </div>
</template>
  
  
  <script>
import { ref, onMounted, onUnmounted } from 'vue';
  export default {
    props: {
      clientHeight2: {
                    type: Number,
                    required: true
      },        
      home_data: {
                type: Object
      },               
    },      
    data() {
      return {
        LotteryId:0,
        currentTime:15,
        issue:0,
        tableData:[],
        page:1,
        size:50,
        total:0,
        Playdata:[]       
      }
    },
    created(){
      this.Playdata=this.$store.state.Playdata
      this.LotteryId=this.home_data.GameList[this.home_data.game_index].lottery_id  
      this.getdata()
    },
    setup() {        
          // 定义响应式参数
          const val = ref('');
          const count = ref(15);
          let timerId = null;
          function greet(val) {
            clearInterval(timerId);
            startCountdown(val)
          }     
          const startCountdown = (val) => {
            count.value = val
            timerId = setInterval(() => {
              count.value--;
              if (count.value < 0) {
                count.value = val;
              }
            }, 1000);
          };
      
          onMounted(() => {
            greet(count.value)
          });
      
          onUnmounted(() => {
            if (timerId) {
              clearInterval(timerId);
            }
          });
      
          return { count,greet};
    },        
     computed: {
         
    },    
    watch: {
            count: {
                handler(newVal, oldVal) {
                  if(newVal==0){
                    this.getdata()
                  }
                },
                deep: true
            }            
    },  
    methods:{ 
      getdata(){
        this.$request.postData('/order/find',{page:this.page,LotteryId:this.LotteryId}).then(response => {
                if(response.code==200){
                  this.total=response.data.count;
                  this.tableData=response.data.data
                }
              }).catch(error => {
                //console.log("error")
              }); 
      },
      backupData(){
        this.$request.postData('/order/backup',{page:this.page,LotteryId:this.LotteryId}).then(response => {
                if(response.code==200){
                  const protocol = window.location.protocol;
                  const host = window.location.host;
                  const currentUrl = `${protocol}//${host}/downloadexcel/${response.data.data}`;          
                  window.open(currentUrl)
                }else{
                  this.$message.error(response.msg);
                }
              }).catch(error => {
                //console.log("error")
              }); 
      },      
      handleChangeCurrent(val){
            this.greet(this.currentTime)        
      },
      handleSizeChange(size){
              this.pagesize=size
      },
      handleCurrentChange(newPage){
              this.page=newPage
              this.greet(this.currentTime)  
              this.getdata()
      },  
      getPlayGroup(row){
                var a=''
                a=this.Playdata.filter(item=>item.id===row.PlayType)
                return a.length>0 ? a[0].name:'-'
      },                  
    }
  }
  </script>