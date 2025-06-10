<template>
    <el-page-header @back="goBack" content="退水设置">
    </el-page-header>   
    <el-form :model="form" label-width="auto" style="max-width: 600px;padding:20px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.region" placeholder="请选择类型">
            <el-option label="香港" value="香港" />
            <el-option label="老澳" value="老澳" />
            <el-option label="新澳" value="新澳" />
            <el-option label="柬埔寨" value="柬埔寨" />
          </el-select>
        </el-form-item>
        <el-form-item label="开奖时间">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="form.date2"
              placeholder="Pick a time"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="特码封盘时间">
            <el-col :span="11">
              <el-time-picker
                v-model="form.date2"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>    
          <el-form-item label="非特码封盘时间">
            <el-col :span="11">
              <el-time-picker
                v-model="form.date2"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>             
          <el-form-item label="开盘时间">
            <el-col :span="11">
              <el-time-picker
                v-model="form.date2"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>              
        <el-form-item label="是否自动开盘">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        <el-form-item label="是否自动收单">
            <el-switch v-model="form.delivery" />
        </el-form-item>        
        <el-form-item label="开放项目">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <span style="margin-right: 30px;"></span>
          <el-checkbox-group v-model="form.type" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="items in gametype" :key="items" :value="items">
                {{ items }}
            </el-checkbox>                                                    
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否允许占成">
          <el-radio-group v-model="form.resource">
            <el-radio value="Sponsor">允许</el-radio>
            <el-radio value="Venue">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">创建</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </template>  
     
      <script>
      
      export default {
        data() {
          return {
            checkAll: false,
            isIndeterminate: true,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            },
            gametype:['两面','特码','正码','正1','正2','正3','正4','正5','正6','波色','一肖','一肖不中','特肖','六肖中','六肖不中','尾数','尾数不中','一肖量','五行','七码','过关','四中四','三全中','三中二','二全中','二中特','特串','二肖连中','三肖连中','四肖连中','五肖连中','二肖连不中','三肖连不中','四肖连不中','五肖连不中','五不中','六不中','七不中','八不中','九不中','十不中','十一不中','十二不中','五中一','六中一','七中一','八中一','九中一','十中一','十一中一','十二中一','一粒任中','二粒任中','三粒任中','四粒任中','五粒任中'],
            gametype1:['两面11','特码','正码','正1','正2','正3','正4','正5','正6','波色','一肖','一肖不中','特肖','六肖中','六肖不中','尾数','尾数不中','一肖量','五行','七码','过关','四中四','三全中','三中二','二全中','二中特','特串','二肖连中','三肖连中','四肖连中','五肖连中','二肖连不中','三肖连不中','四肖连不中','五肖连不中','五不中','六不中','七不中','八不中','九不中','十不中','十一不中','十二不中','五中一','六中一','七中一','八中一','九中一','十中一','十一中一','十二中一','一粒任中','二粒任中','三粒任中','四粒任中','五粒任中']
          }
        },
        created(){
          console.log('123');
        },
        methods: {
            onSubmit(){
                console.log('submit!')
            },
            handleCheckAllChange(val) {
                this.form.type = val ? this.gametype : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.gametype.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.gametype.length;
            }
        }
    
      }
      </script>
<style>
.el-checkbox-group{
    display: contents;
}
</style>      