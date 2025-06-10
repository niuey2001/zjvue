<template>
    <div class="draggable">
        <el-table
                row-key="id"
                :data="tableData"
                style="width: 100%"
                border
                 :header-cell-class-name="'trheader'"
        >
        <el-table-column type="index" label="序号"/>
        <el-table-column label="游戏名称">
            <template  #default="{ row,$index }">
                {{ row.name }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
            <template  #default="{ row,$index }">
                <!-- <el-icon class="el-icon_btn" v-if="$index>0" title="置顶"><Upload /></el-icon>
                <el-icon class="el-icon_btn" title="置底"><Download /></el-icon>
                <el-icon class="el-icon_btn" v-if="$index>0" title="上移"><Top /></el-icon>
                <el-icon class="el-icon_btn" title="下移"><bottom /></el-icon>    -->
                <el-icon class="el-icon_btn" title="拖拽"><Rank /></el-icon>             
            </template>
        </el-table-column>        
        </el-table>
    </div>
    <div class="mb-4 mb4_top" style="justify-content: center;"> 
        <span @click="saveGamesort">
            <span class="topbtn">保存设置</span>
        </span>
    </div>
</template>
<script>
    import Sortable from 'sortablejs';
 
    export default {
        props: {
            GameList: {
                    type: Array
                  }, 
            gamesort: {
                    type: Boolean
                  }                    
        },          
        mounted() {
            this.rowDrop()
        },
        created() {
            this.tableData=JSON.parse(JSON.stringify(this.GameList))
        },
        data() {
            return {
                tableData: []
            }
        },
        methods: {
            // 行拖拽
            rowDrop() {
                // 此时找到的元素是要拖拽元素的父容器
                const tbody = document.querySelector('.draggable .el-table__body-wrapper tbody');
                const _this = this;
                Sortable.create(tbody, {
                    //  指定父元素下可被拖拽的子元素
                    draggable: ".draggable .el-table__row",
                    onEnd({newIndex, oldIndex}) {
                        const currRow = _this.tableData.splice(oldIndex, 1)[0];
                        _this.tableData.splice(newIndex, 0, currRow);
                    }
                });
            },
            saveGamesort(){
                for(var i=0;i<this.tableData.length;i++){
                    for(var i1=0;i1<this.GameList.length;i1++){
                      if(parseInt(this.tableData[i].lottery_id)==parseInt(this.GameList[i1].lottery_id)){
                        this.GameList[i1].sort=i
                      }
                    }
                }
                this.GameList.sort((a, b) => a.sort - b.sort) 
                this.$emit('changeLotteryId',this.GameList[0],0) 
                // if(JSON.stringify(this.GameList)!=JSON.stringify(this.tableData)){
                //         this.$emit('changeLotteryId',this.GameList[0],0) 
                // }
               this.$emit('setgamesort')
                
            }
        }
    }
</script>