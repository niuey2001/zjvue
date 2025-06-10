<template>
    <div class="main-boxdiv">
      <div class="main-boxdiv-box" style="text-align: justify;background: #ffffff;height: 98%;overflow: auto;line-height: 26px;">
            <div v-html="Rule"></div>
      </div>     
      <div class="main-boxdiv-bottom"></div> 
    </div>
     
  </template>  
       
  <script>
  import { defineAsyncComponent } from 'vue';
        export default {     
          data() {
            return {
              Rule:''

            }
          },
          created(){
            this.Rule=this.$store.state.Rule
          },
          methods: {          
          }
      
        }
  </script>
    