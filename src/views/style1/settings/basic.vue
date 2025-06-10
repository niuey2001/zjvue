<template>
  <div class="main-boxdiv">  
  <div class="titlem bodynav">
    基础设置
  </div>      


      <el-table border :show-header=false :data="form" style="width: 100%"  :cell-style="headerCellStyle">
        <el-table-column width="400">
          <template #default="{row}">
            <div style="width: 100%;text-align: right;" >
              {{ row.name }}
            </div>
          </template>          
        </el-table-column>
        <el-table-column>
          <template #default="{row}">
            <el-input v-model="row.value" v-if="row.type=='string'" style="width: 240px" />
            <el-select
            v-model="row.value"
            placeholder="Select"
            size="large"
            style="width: 240px"
            v-if="row.type=='select'"
          >
            <el-option
              v-for="item in row.data"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>            
            <el-button type="primary" size="small" @click="onSubmit"  v-if="row.type=='btn'">{{row.data}}</el-button>  
          </template>          
        </el-table-column>
      </el-table>
      

  </div>  
</template>  
 
  <script>
  export default {
    data() {
      return {
        form:[
          {'name':'系统名称','value':'M6','type':'string','data':[]},
          {'name':'默认模板','value':'默认','type':'select','data':['默认','中原','金沙','OA']},
          {'name':'当前生肖','value':'鼠','type':'select','data':['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']},
          {'name':'','value':'','type':'btn','data':'保存设置'},
        ]
      }
    },
    created(){

    },
    methods: {
        onSubmit(){
            console.log('submit!')
        },
        headerCellStyle({ rowIndex, columnIndex }) {        
          if(columnIndex==0){
            return {'background-color': '#f6f6f6'}; 
          }
        },  
    }

  }
  </script>
  