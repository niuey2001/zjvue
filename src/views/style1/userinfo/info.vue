<template>
  <div class="main-boxdiv" style="width: 800px;">  
  <div class="titlem bodynav">
    个人信息 &nbsp;
  </div> 
  <table border="1" class="el-form-table" v-if="editGame!=''">
    <tr>
      <td class="el-form-table-label">总监账号</td>
      <td class="el-form-table-tr">
        {{UserInfo.account}}                    
      </td>
    </tr>         
    <tr>
      <td class="el-form-table-label">状态</td>
      <td class="el-form-table-tr">
        正常                    
      </td>
    </tr>      
    <tr>
      <td class="el-form-table-label">开放彩种</td>
      <td class="el-form-table-tr">
        <span v-for="(item,index) in GameList">{{item.name}}
          <span v-if="(GameList.length-1)>index">,</span>
        </span>                       
      </td>
    </tr>
                       
  </table>      
  </div>  
</template>  
 
  <script>
  export default {
    props: {
      UserInfo: {
                type: Object
              },    
      home_data: {
                type: Object
              },                          
    },     
    data() {
      return {
        GameList:[]    
      }
    },
    created(){
      var a=JSON.parse(JSON.stringify(this.home_data.GameList))
      this.GameList=a
    },
    methods: {

    }

  }
  </script>
  