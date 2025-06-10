<template>
  <div class="body-div">
            <div><h1>修改密码</h1></div>

  </div>

</template>


<script>
export default {
  data() {
    return {

    }
  },
  created(){

  },
  methods:{
    Isagree(){
      alert("同意");
    },
    Unagree(){
      alert("不同意");
    }     
  
  }
}
</script>
<style>
  .body-div {
    width: 80vw;
    margin: 0 auto;
    border: 1px solid #511e02;
    background: green;
    border-radius: 5px;
    box-shadow: 0px -5px 10px 0px #511e02, -6px 0px 6px 0px #511e02, 6px 0px 6px 0px #511e02, 0px 5px 19px 0px #511e02;
    padding: 20px;
  }

  

</style>