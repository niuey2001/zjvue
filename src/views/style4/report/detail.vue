<template>
    <div class="main-boxdiv1 reportbox" style="width: 100%;height:92%;" v-loading="loading"> 
        <div class="mb-4 mb4_top" style="line-height:20px;">  
           <span v-if="this.DetailData.type==1">
              <span class="topbtn" v-if="this.DetailData.State==true"> 
                <el-popconfirm title="确定撤销所选订单？" confirm-button-type="danger"  @confirm="getcd()" confirm-button-text="确认" cancel-button-text="取消">
                    <template #reference>
                    <span>撤单</span>
                    </template>
                </el-popconfirm>   
               </span>    
               <span class="topbtn" :class="this.DetailData.State ? 'isActive2':''" @click="this.DetailData.State=true,getOrderList()">订单列表</span>    
               <span class="topbtn" :class="!this.DetailData.State ? 'isActive2':''" @click="this.DetailData.State=false,getOrderList()">已撤单列表</span>          
           </span>
        </div>    
        
        <el-table border v-loading="loading" :row-class-name="!this.DetailData.State ? 'strikethrough-row':''"  @selection-change="handleSelectionChange" 
        show-summary :summary-method="getSummaries" :data="OtableData" :header-cell-style="headerCellStylereptot" :header-cell-class-name="'trheader'"  :cell-style="cellStyle"  height="100%" style="width: 100%">
        <el-table-column type="selection" width="55" v-if="this.DetailData.type==1 && this.DetailData.State==true" />   
        <el-table-column label="彩种" width="80" >
                <template #default="{row}">
                <span>
                    {{home_data.GameList.filter(item=>item.lottery_id==row.LotteryId)[0].name}}
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
            <el-table-column label="订单号">
                <template #default="{row}">
                  <span>
                    <div class="text_nowrap" :title="row.OrderSn">{{ row.OrderSn }}</div>
                  </span>
                </template>
            </el-table-column>              
            <el-table-column prop="Date" label="投注时间"/>
            <el-table-column prop="Account" label="账号"/> 
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
            <el-table-column prop="Yk" label="盈亏">
              <template #default="{row}">
                <span :style="{'color':row.Yk<0 ? 'red':''}">
                  {{row.Yk}}
                </span>
                <span style="color:#9E9E9E;" v-if="row.Result==3">(和局)</span>
              </template>
            </el-table-column>  
            <el-table-column :label="MemberType[loginmember.Type]">
                    <el-table-column prop="Zcje" label="占成金额">
                        <template #default="{row}">
                        <span>
                            {{row.Zcje}}
                        </span>
                        </template>
                    </el-table-column>                   
                    <el-table-column prop="Zcty" label="退佣">
                        <template #default="{row}">
                        <span :style="{'color':row.Zcty<0 ? 'red':''}">
                            {{row.Zcty}}
                        </span>
                        </template>
                    </el-table-column>   
                    <el-table-column prop="Zcyk" label="盈亏">
                        <template #default="{row}">
                        <span :style="{'color':row.Zcyk<0 ? 'red':''}">
                            {{row.Zcyk}}
                        </span>
                        </template>
                    </el-table-column>   
                    <el-table-column prop="Zp" label="赚赔">
                        <template #default="{row}">
                        <span :style="{'color':row.Zp<0 ? 'red':''}">
                            {{row.Zp}}
                        </span>
                        </template>
                    </el-table-column>  
                    <el-table-column prop="Zy" label="赚佣">
                        <template #default="{row}">
                        <span :style="{'color':row.Zy<0 ? 'red':''}">
                            {{row.Zy}}
                        </span>
                        </template>
                    </el-table-column>  
                    <el-table-column prop="Zyk" label="总盈亏">
                        <template #default="{row}">
                        <span :style="{'color':row.Zyk<0 ? 'red':''}">
                            {{row.Zyk}}
                        </span>
                        </template>
                    </el-table-column>                     
            </el-table-column> 
          </el-table> 
          <el-table border :show-header="false" style='margin-top:-1px;' :data="totaltable" :cell-style="cellStyle1">
            <el-table-column width="55"  v-if="this.DetailData.type==1 && this.DetailData.State==true">
                <template #default="{row}">
                <span>
                    总计
                </span>
                </template>
            </el-table-column> 
            <el-table-column width="80"  v-if="this.DetailData.type==2 || this.DetailData.State==false">
                <template #default="{row}">
                <span>
                    总计
                </span>
                </template>
            </el-table-column>             
            <el-table-column width="80" v-if="this.DetailData.type==1 && this.DetailData.State==true"/> 
            <el-table-column width="80"/> 
            <el-table-column/> 
            <el-table-column/> 
            <el-table-column/> 
            <el-table-column/> 
            <el-table-column/> 
            <el-table-column width="60"/> 
            <el-table-column  /> 
            <el-table-column  prop="BetMoney"/> 
            <el-table-column prop="Ty">
                <template #default="{row}">
                <span :style="{'color':row.Ty<0 ? 'red':''}">
                    {{row.Ty}}
                </span>
                </template>
            </el-table-column> 
            <el-table-column prop="Yk">
                <template #default="{row}">
                <span :style="{'color':row.Yk<0 ? 'red':''}">
                    {{row.Yk}}
                </span>
                </template>
            </el-table-column>   
            <el-table-column prop="Zcje">
                <template #default="{row}">
                <span :style="{'color':row.Zcje<0 ? 'red':''}">
                    {{row.Zcje}}
                </span>
                </template>
            </el-table-column>   
            <el-table-column prop="Zcty">
                <template #default="{row}">
                <span :style="{'color':row.Zcty<0 ? 'red':''}">
                    {{row.Zcty}}
                </span>
                </template>
            </el-table-column>    
            <el-table-column prop="Zcyk">
                <template #default="{row}">
                <span :style="{'color':row.Zcyk<0 ? 'red':''}">
                    {{row.Zcyk}}
                </span>
                </template>
            </el-table-column>   
            <el-table-column prop="Zp">
                <template #default="{row}">
                <span :style="{'color':row.Zp<0 ? 'red':''}">
                    {{row.Zp}}
                </span>
                </template>
            </el-table-column>   
            <el-table-column prop="Zy">
                <template #default="{row}">
                <span :style="{'color':row.Zy<0 ? 'red':''}">
                    {{row.Zy}}
                </span>
                </template>
            </el-table-column>  
            <el-table-column prop="Zyk">
                <template #default="{row}">
                <span :style="{'color':row.Zyk<0 ? 'red':''}">
                    {{row.Zyk}}
                </span>
                </template>
            </el-table-column>                                                                          
          </el-table>  
          <el-pagination background layout="total,prev, pager, next"
          v-model:current-page="DetailData.page"
          v-model:page-size="size"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />                  
    </div>
   </template>      
   <script>
   import { h } from 'vue';
         export default {
          props: {
            home_data: {
                type: Object
            },  
            DetailData:{
                type: Object
            },  
            loginmember:{
                type: Object
            },  
            MemberType:{
                type: Array
            }          
          },        
           data() {
             return {
                size:50,
                total:0,
                OtableData:[],
                totaltable:[],
                loading:false,
                Playdata:[],
                multipleSelection:[],
                Selectdata:[]
             }
           },
           created(){
                this.Playdata=this.$store.state.Playdata
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
                    this.DetailData.page=newPage
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
            getOrderList(){
                this.loading=true
                this.$request.postData('/report/orderdetail',this.DetailData).then(response => {
                if(response.code==200){
                    if(response.data.data==null){
                        this.OtableData=[]
                        this.total=0
                        this.totaltable=[]
                    }else{
                        this.OtableData=response.data.data
                        if(response.data.dataall.length>0){
                            this.total=response.data.dataall[0].Num
                            this.totaltable=[]
                            this.totaltable.push(response.data.dataall[0])
                        }

                    }
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
            },
            headerCellStylereptot({row, column, rowIndex, columnIndex}){
                if(columnIndex<6 && column.level==2){
                    return {'background-color': '#cb4949 !important'}; 
                }
                if(this.DetailData.type==2){
                    if(columnIndex>=10 && column.level==1){
                        return {'background-color': '#cb4949 !important'}; 
                    }                      
                }
                if(this.DetailData.type==1){
                    if(this.DetailData.State){
                        if(columnIndex>12 && column.level==1){
                            return {'background-color': '#cb4949 !important'}; 
                        }  
                    }else{
                        if(columnIndex>=12 && column.level==1){
                            return {'background-color': '#cb4949 !important'}; 
                        }                          
                    }

                }                                      
            },
            getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                sums[index] = '小计';
                return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                    return prev + curr;
                    } else {
                    return prev;
                    }
                }, 0);
                sums[index] = parseFloat(sums[index].toFixed(2));
                // 修改点：负数显示红色
                if (sums[index] < 0) {
                    sums[index] = h('span', { style: { color: 'red' } }, sums[index]);
                }
                } else {
                sums[index] = '';
                }
            });
            return sums;
            },
            handleSelectionChange(val) {
              this.Selectdata=[]
              for(var i=0;i<val.length;i++){
                this.Selectdata.push(val[i].Id)
              }
              this.multipleSelection = val
            },            
            getcd(){
                if(this.Selectdata.length<=0){
                    this.$message.error("没有选择操作的数据!");
                    return
                }
                this.loading=true
                this.$request.postData('/order/chedan',{Id:this.Selectdata}).then(response => {
                    if(response.code==200){
                        this.DetailData.State=false
                        this.$message({
                            message: response.msg,
                            type: 'success'
                        });                          
                        this.DetailData.page=1
                        this.getOrderList()            
                        this.loading=false
                    }else{
                        this.$message.error(response.msg);
                        this.loading=false
                    }
                }).catch(error => {                   
                    this.loading=false
                });             
            }            
          }
         }
   </script>
  
      