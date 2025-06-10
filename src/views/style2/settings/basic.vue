<template>
     
<el-form :model="form" label-width="auto" style="max-width: 600px;padding:20px">
    <el-form-item label="系统名称">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="默认模板">
      <el-select v-model="form.default" placeholder="">
        <el-option label="默认" value="0" />
        <el-option label="模板1" value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="当前生肖">
      <el-select v-model="form.default_sx" placeholder="">
        <el-option v-for="items in sx" :label="items" :value="items" />
      </el-select>
    </el-form-item>   
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button>重置</el-button>
    </el-form-item>     
  </el-form>
</template>  
 
  <script>
  export default {
    data() {
      return {
        form: {
            name: 'M6',
            default: '0',
            default_sx: '龙',
        }, 
        sx:['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
      }
    },
    created(){

    },
    methods: {
        onSubmit(){
            console.log('submit!')
        } 
    }

  }
  </script>
  