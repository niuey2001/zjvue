<template>
  {{ tableData }}
    <el-tabs type="border-card"  @tab-click="handleClick">
      <el-tab-pane :label="items1.name" v-for="items1 in gametype1">
            <el-tabs  @tab-click="handleClick1">
              <el-tab-pane :label="items2.name" v-for="items2 in items1.data">
                <el-tabs  @tab-click="handleClick2">
                  <el-tab-pane :label="items3.name+'类'" v-for="items3 in items2.data">
                    {{ items1.name }} -- {{ items2.name }} -- {{ items3.name }}
                    <br/>
                    <el-select
                    v-model="test.code"
                    multiple
                    clearable
                    placeholder="Select"
                    popper-class="custom-header"
                    style="width: 240px"
                  >
                    <template #header>
                      <el-checkbox
                      v-model="check"
                      class="m-l-20"
                      :indeterminate="test.code.length !== options.length"
                      @change="selectAll"
                    >
                      全选
                    </el-checkbox>
                    <el-checkbox
                    v-model="check"
                    class="m-l-20"
                    :indeterminate="test.code.length !== options.length"
                    @change="selectAll"
                    >
                      单
                    </el-checkbox>                    
                    </template>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>            
                    <br/>
                 
                    <!--主体表单-->
                    <el-table 
                      :data="items3.data" 
                      border   
                      select-all
                      stripe
                      ref="multipleTableRef"
                      @selection-change="handleSelectionChange"
                      @select="handleSelect"
                      @select-all="handleALL"
                      :row-class-name="tableRowClassName"   
                      highlight-selection-row                                  
                      style="width: 100%">  
                      
                      <el-table-column type="selection" width="55">
                      </el-table-column>                  
                      <el-table-column v-for="(value, key) in items3.data[0]" :key="key" :prop="key" :label="gettableheader(key)">
                        <template #default="scope">
                          <el-input v-model="scope.row[key]" v-if="key!='ball'"></el-input>
                        </template>
                      </el-table-column>  
                                      
                    </el-table>
                    <!--主体表单-->

{{ multipleTableRef }}
///////////

<span>

</span>

                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
            </el-tabs>
      </el-tab-pane>
    </el-tabs>
    </template>  
     
      <script>
      export default {
        data() {
          return {
            //select全选
            test: {
                code: []
              },
            options: [
                { value: '01', label: '01' },
                { value: '02', label: '02' },
                { value: '03', label: '03' },
                { value: '04', label: '04' },
                { value: '05', label: '05' },
                { value: '06', label: '06' },
                { value: '07', label: '07' },
                { value: '08', label: '08' },
                { value: '09', label: '09' },
            ],         
            multipleSelection: [],//多选
            selectID: [],//设置一个变量记录选中行的数据

            activeName:'',
            checkAll: false,
            gametab:[],
            gametype1:[
              {
                'name':'香港六合彩',
                'data':[
                  {
                    'name':'两面',
                    'data':[
                        {
                          'name':'A',
                          'data':[
                            {
                              'ball':'01',
                              'A':'47.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                            {
                              'ball':'02',
                              'A':'46.8',
                              'B':'46.8',
                              'C':'46.8',
                              'D':'46.8',
                              'E':'46.8',
                              'F':'46.8',
                              'G':'46.8',
                              'H':'46.8',
                              'J':'46.8',
                              'K':'46.8',
                            },
                            {
                              'ball':'03',
                              'A':'46.8',
                              'B':'46.8',
                              'C':'46.8',
                              'D':'46.8',
                              'E':'46.8',
                              'F':'46.8',
                              'G':'46.8',
                              'H':'46.8',
                              'J':'46.8',
                              'K':'46.8',
                            },
                            {
                              'ball':'04',
                              'A':'46.8',
                              'B':'46.8',
                              'C':'46.8',
                              'D':'46.8',
                              'E':'46.8',
                              'F':'46.8',
                              'G':'46.8',
                              'H':'46.8',
                              'J':'46.8',
                              'K':'46.8',
                            },                             
                          ],
                        },
                        {
                          'name':'B',
                          'data':[
                            {
                              'ball':'01',
                              'A':'43.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },                       
                      ]
                  },
                  {
                    'name':'特码',
                    'data':[
                        {
                          'name':'A',
                          'data':[
                            {
                              'ball':'01',
                              'A':'40.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },
                        {
                          'name':'B',
                          'data':[
                            {
                              'ball':'01',
                              'A':'45.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },                       
                      ]
                  }, 
                  {
                    'name':'正码',
                    'data':[
                        {
                          'name':'A',
                          'data':[
                            {
                              'ball':'01',
                              'A':'44.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },
                        {
                          'name':'B',
                          'data':[
                            {
                              'ball':'01',
                              'A':'43.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },                       
                      ]
                  },                                                   
                ],
              }, 
              {
                'name':'澳门六合彩',
                'data':[
                  {
                    'name':'两面',
                    'data':[
                        {
                          'name':'A',
                          'data':[
                            {
                              'ball':'01',
                              'A':'42.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },
                        {
                          'name':'B',
                          'data':[
                            {
                              'ball':'01',
                              'A':'41.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },                       
                      ]
                  },
                  {
                    'name':'特码',
                    'data':[
                        {
                          'name':'A',
                          'data':[
                            {
                              'ball':'01',
                              'A':'40.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },
                        {
                          'name':'B',
                          'data':[
                            {
                              'ball':'01',
                              'A':'37.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },                       
                      ]
                  }, 
                  {
                    'name':'正码',
                    'data':[
                        {
                          'name':'A',
                          'data':[
                            {
                              'ball':'01',
                              'A':'47.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },
                        {
                          'name':'B',
                          'data':[
                            {
                              'ball':'01',
                              'A':'47.8',
                              'B':'47.8',
                              'C':'47.8',
                              'D':'47.8',
                              'E':'47.8',
                              'F':'47.8',
                              'G':'47.8',
                              'H':'47.8',
                              'J':'47.8',
                              'K':'47.8',
                            },
                          ],
                        },                       
                      ]
                  },                                                   
                ],
              },        
            ],
            gametype:['两面','特码','正码','正1','正2','正3','正4','正5','正6','波色','一肖','一肖不中','特肖','六肖中','六肖不中','尾数','尾数不中','一肖量','尾数量','五行','七码','过关','四中四','三全中','三中二','二全中','二中特','特串','二肖连中','三肖连中','四肖连中','五肖连中','二肖连不中','三肖连不中','四肖连不中','五肖连不中','五不中','六不中','七不中','八不中','九不中','十不中','十一不中','十二不中','五中一','六中一','七中一','八中一','九中一','十中一','十一中一','十二中一','一粒任中','二粒任中','三粒任中','四粒任中','五粒任中','特头数','特尾数','总肖','七色波','合肖','正肖'],
            //选卡
            tab1:0,
            tab2:1,
            tab3:2,
            nowdata:[],
            numbers:[],
            multipleTable:[],
            tableData:[]

          }
        },
        created(){
          this.nowdata=this.gametype1[0].data[0].data[0].data
          this.getdata()
        },
        computed: {
          check: {
            get () {
              if (this.test.code.length === this.options.length) {
                return true
              }
              return false
            },
            set () {}
          }
        },
        methods: {
          getdata(){
              this.loading=true
                  this.$request.postData('api/lotteryodd/find',{}).then(response => {
                    this.loading=false
                    if(response.code==200){
                       this.tableData=  response.data.data         
                    }else{
                      this.$message.error(response.msg);
                    }
                  }).catch(error => {
                    this.loading=false
                    this.$message.error('网络请求错误');
                  }); 
            },            
            //选卡点击时
            handleClick(val){
              this.tab1=val.paneName;
              this.nowdata=this.gametype1[this.tab1].data[this.tab2].data[this.tab3].data
               console.log('一级数据'+val.paneName)
            },
            handleClick1(val){
              this.tab2=val.paneName;
              this.nowdata=this.gametype1[this.tab1].data[this.tab2].data[this.tab3].data
               console.log('二级数据'+val.paneName)
            },
            handleClick2(val){
              this.tab3=val.paneName;
              this.nowdata=this.gametype1[this.tab1].data[this.tab2].data[this.tab3].data
               console.log('三级数据'+val.paneName)
            },                        
            gettableheader(key){
                if(key=='ball'){
                     return '球号'
                }else{
                     return key+'盘'
                }
            },
            onSubmit(){
                console.log('submit!')
            },
            /* 全选 */
            handleALL (val) {
              this.handleSelect(val)
            },            
            /*  获取当前选中的数据 */
            handleSelect (row) {
              console.log(row)
              this.selectID = []
              if (row.length > 0) {
                row.forEach((value, index) => {
                  this.selectID.push(value.ball)
                })
              }
            },
            //单元格选中
            handleRowChick(rows){
                //高亮变色
                this.multipleSelection=[];
            },
            handleSelectionChange(val){
              this.multipleSelection = val;
              this.handleSelect(val)
              
            },
            // 选中背景色  className 的回调方法
            tableRowClassName({ row, rowIndex }) {
              let color = ''
              for(let item of this.selectID){
                if(item === row.ball)color = 'table-SelectedRow-bgcolor'
              }
              console.log(color)
              return color
            },
            //select全选

            selectAll (checked) {
              if (checked) {
                this.test.code = this.options.map(d => d.value)
              } else {
                this.test.code = []
              }
            },
                      
        }
    
      }
      </script>
<style>
.el-checkbox-group{
    display: contents;
}
.table-SelectedRow-bgcolor {
  td{
    background-color: #fa645f !important;
  }
}

</style>      