<template>
  <div class="full-screen-div">
    <div class="body-div">
      <div><h1>用户协议</h1></div>
      <el-table
      border
      :data="tableData"
      style="width: 100%" 
      height="460"
      :show-header="false"
      >
      <el-table-column
        prop="sort"             
        width="50">
      </el-table-column>
      <el-table-column
        prop="content"
        >
      </el-table-column>
      </el-table>        
      <div style="margin-top: 20px">
        <el-button type="primary" @click="Isagree()">同意</el-button>
        <el-button type="primary"  @click="Unagree()">不同意</el-button>      
      </div>
</div>    
  </div>  
</template>


<script>
export default {
  data() {
    return {
      tableData: [{
            sort: '1',
            content: '使用本公司网站的用户，请留意您所在国家或地区的相关法律法规，请您自觉遵守并选择退出，本公司对此不承担任何责任。'
          }, {
            sort: '2',
            content: '若发生遭骇客入侵破坏行为或者不可抗拒之灾害导致网站故障或资料损坏等情况，本公司有权中止投注；对系统失控接受的订单，公司有权取消；对资料损坏，公司将以备份资料作为最后处理依据。'
          }, {
            sort: '3',
            content: '用户有责任确保自己登录资料的保密性，用户使用帐号操作均被视为个人行为。所有盗用帐号的损失将由用户自行承担。'
          }, {
            sort: '4',
            content: '对公司所有游戏项目胜负评判方法以投注页面所付《游戏规则》为准，请您在投注前详细阅读《游戏规则》。'
          }, {
            sort: '5',
            content: '开奖结果以官方公布的结果为准。开奖统计等资料仅供参考，并非对客户操作的指引，本公司不接受关于统计资料错误而引起的相关投诉'
          }, {
            sort: '6',
            content: '本公司公布的所有赔率和退佣，是计算投注结果的唯一参考资料，用户有选择是否投注的权利但无权要求公司对上述资料进行调整。'
          }, {
            sort: '7',
            content: '当您确定任何一笔投注前，请您检查该投注的项目，数量，金额，赔率等内容是否与您主观意愿一致，投注一经确认不得修改和取消。投注完成后请您再次确认订单，避免重复投注。如出现特殊网路情况或线路不稳定导致不能下注或下注失败，本公司概不负责。'
          }, {
            sort: '8',
            content: '本公司拥有一切判决及注销任何涉嫌以非正常方式下注订单的许可权，在调查期间将停止发放与其相关的任何彩金。本公司保留取消非法操作用户所有注单的权利。'
          }, {
            sort: '9',
            content: '如由公司工作人员打字错误或其他非故意人为因素引起的差错，本公司保留改回正确结果的权利。'
          }, {
            sort: '10',
            content: '任何异议或投诉必须在开奖前提出，本公司不接受任何开奖后的异议或投诉。'
          }, {
            sort: '11',
            content: '各级代理商必须对本系统各项功能进行了解及熟悉，任何违反正常使用的操作，后台概不负责，均由代理商自行承担。'
          }, {
            sort: '12',
            content: '各级代理商必须留意下级的信用额度，在特殊情况下，下线信用额可能会出现透支，该情况一律以公司处理结果为准。'
          }, {
            sort: '13',
            content: '同一浏览器只能同时开启同个网站的一个会员帐号，因为后开的帐号会把前面先登录的帐号覆盖掉，为了避免操作失误请严格遵守。'
          }, {
            sort: '14',
            content: '用户一经在本公司开户，即被视为无条件接受上诉所有规则。'
          }, {
            sort: '15',
            content: '本公司保留对所有争议事项的最终解释权。'
          }]
    }
  },
  created(){

  },
  methods:{
    Isagree(){
      var value = this.$store.state.value
      var view='home'+String(value)
      this.$emit('switchWindow',view)   
    },
    Unagree(){
      var value = this.$store.state.value
      var view='login'+String(value)
      this.$emit('switchWindow',view)      
    }     
  
  }
}
</script>
<style scoped>
.full-screen-div {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%; 
  height: 100%;
  /* background: #e4e4e4; */
  background: #1e68a3;
}
  .body-div {
    width: 80vw;
    margin: 0 auto;
    border: 1px solid #511e02;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0px -5px 10px 0px #511e02, -6px 0px 6px 0px #511e02, 6px 0px 6px 0px #511e02, 0px 5px 19px 0px #511e02;
    padding: 20px;
    margin-top: 5%;
  }
  .el-table .cell{
    white-space: normal !important;
  }
  

</style>