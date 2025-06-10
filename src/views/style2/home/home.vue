<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside width="200px" style="border-right: 1px solid #e6e6e6;">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '3']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><setting /></el-icon>系统
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-6" @click="switchWindow('users')">账号管理</el-menu-item>
              <el-menu-item index="1-1" @click="switchWindow('basic')">基础设置</el-menu-item>
              <el-menu-item index="1-2" @click="switchWindow('gameset')">游戏设置</el-menu-item>
              <el-menu-item index="1-3" @click="switchWindow('oddset')">赔率设置</el-menu-item>
              <el-menu-item index="1-4" @click="switchWindow('dsset')">退水设置</el-menu-item>
              <el-menu-item index="1-4" @click="switchWindow('dsset')">总监管理</el-menu-item>
              <el-menu-item index="1-5" @click="switchWindow('httpset')">域名设置</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Avatar /></el-icon>线路管理
            </template>
            <el-menu-item-group>

              <el-menu-item index="2-1">Option 1</el-menu-item>
              <el-menu-item index="2-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>             
              <el-menu-item index="2-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title>Option 4</template>
              <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>数据统计
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">监控</el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="3-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="3-4">
              <template #title>Option 4</template>
              <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><setting /></el-icon>操盘管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">控盘</el-menu-item>
              <el-menu-item index="4-2">退水</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>          
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px"
              ><setting
            /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item>登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{UserName}}</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <component :is="currentView"></component>

        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>  
  
</template>
   
<script>
import { defineAsyncComponent } from 'vue';
export default {
  data() {
    return {
      currentView: '',
      Authority:[],
      UserName:''
    }
  },
  created() {
    //this.doSomethingBeforeMount()
    this.currentView = 'gmain'
    this.UserName=this.$store.state.UserName
    this.Authority=this.$store.state.Authority
  },
  methods: {
    switchWindow(view) {
      this.currentView = view; // 设置当前显示的组件名称
    },
    doSomethingBeforeMount() {
      // 在页面渲染前执行的逻辑
      if(!this.$store.state.UserName || !this.$store.state.value || !this.$store.state.token || !this.$store.state.Authority){
      window.location.reload()
      return
      }
    }    
  },
  components: {
    users: defineAsyncComponent(() => import('../user/index.vue')),
    basic: defineAsyncComponent(() => import('../settings/basic.vue')),
    gameset: defineAsyncComponent(() => import('../settings/gameset.vue')),
    oddset: defineAsyncComponent(() => import('../settings/oddset.vue')),
    dsset: defineAsyncComponent(() => import('../settings/dsset.vue')),
    httpset: defineAsyncComponent(() => import('../settings/httpset.vue')),
  }
}
</script>
<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>