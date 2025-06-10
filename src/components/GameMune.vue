<template>
    <div class="game_herad"> 
        <div class="game_herad_tab">
          <div class="game_herad_tab_nav" v-for="(items,index) in Play_Grpup_data" :class="index === default_Group ? 'isActive1' : ''" @click="changeGame(index,0,items)">
            <div class="game_herad_tab_nav_title">
              {{ items.group_name }}
            </div>
            <div><span v-for="(total,index) in items.total_num">{{total}} <span v-if="index<items.total_num.length-1">/</span> </span></div>
          </div>
        </div>
      </div>
  </template>
  
  <script>
  export default {
    name: 'GameMune',
    props: {
        Play_Grpup_data: String,
        default_Group: String,
    },
    data () {
          return {

          }
    },
    created () {

    },
    mounted () {
      
    },
    methods: {
        changeGame(index,default_PlayType,items){
            this.$emit('ChangePage',{index,default_PlayType,items})
        },
    }
  };
  