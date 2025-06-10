<template>
<div class="main-boxdiv">
  <div class="titlem bodynav" style="text-align: left;padding-left: 6px;margin-top:2px;">
    最新消息
  </div>     
  <el-table border :data="noticelist" :header-cell-class-name="'trheader'" :height="clientHeight2+'px'" style="width: 100%" >
    <el-table-column type="index" label="序号" width="55"/>
    <el-table-column prop="date" label="时间" width="200"/>
    <el-table-column prop="message" label="内容"/>  
  </el-table>  

</div>
</template>  
   
    <script>   
    export default {  
      props: {
        clientHeight2: {
                type: Number
              },            
        noticelist: {
                type: Array
              },               
        },            
      data() {
        return {
        }
      },
      created(){
      },
      mounted() {


      },      
      methods: {        
      }
  
    }
    </script>
    