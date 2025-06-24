<template>
  <el-watermark :content="fontvalue" :font="font">
    <div class="main-boxdiv" v-loading="Loadingodds">
      <div ref="topheii">
        <div class="game_herad_mueu">
          <div class="game-tab-container">
            <div class="game-tab" v-for="(items, index) in home_data.GameList.slice(0, 6)" :key="items.lottery_id"
              :class="{ 'active': index === home_data.game_index }" @click="changeLotteryId(items, index)">
              <div class="tab-content">
                <div class="tab-name">{{ items.name }}</div>
                <div class="tab-count">0</div>
              </div>
            </div>

            <div class="game-tab more-games" v-if="home_data.GameList.length >= 6">
              <el-dropdown>
                <div class="tab-content">
                  <div class="tab-name">更多游戏</div>
                  <div class="tab-count">0</div>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="(items, index) in home_data.GameList" v-if="index >= 6"
                      :key="items.lottery_id" @click="changeLotteryId(items, index)">
                      {{ items.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

        </div>
      </div>
      <div class="mb-4 total_nav_span">
        <span>总收：<span>{{ acq ?
          parseFloat(All_total.Zcje.toFixed(2)) : parseFloat(All_total.BetMoney.toFixed(2)) }}</span></span>
        <span>佣金：<span class="Rate">{{ acq ?
          parseFloat(All_total.Zcty.toFixed(2)) : parseFloat(All_total.Ty.toFixed(2)) }}</span></span>
        <span>总实收：<span :class="[acq ? (All_total.Zcje + All_total.Zcty) < 0 ? 'Rate' : '' : '']">{{ acq ?
          parseFloat((All_total.Zcje + All_total.Zcty).toFixed(2)) : parseFloat((All_total.BetMoney +
            All_total.Ty).toFixed(2)) }}</span></span>
      </div>
      <div class="game_herad">
        <div class="game_herad_tab" style="margin:0 auto">
          <div class="game_herad_tab_nav" v-for="(items, index) in Play_Grpup_data"
            :class="index === default_Group ? 'isActive1' : ''"
            @click="QuickChooseDatas = [], Play_Group_Check(index, 0, items)">
            <div class="game_herad_tab_nav_a" :class="animation[index]"
              :style="{ 'align-items': index == 0 ? 'center' : '' }">
              <span class="game_herad_tab_nav_title">
                {{ items.group_name }}
              </span>
              <span v-if="index < 4 && index != 0">{{ parseInt(handleTotalLong(items.total_num, 2)) }}</span>
              <span v-if="index < 4 && index != 0">{{ parseInt(handleTotalLong(items.total_num, 1)) }}</span>
              <span v-if="index >= 4 && index != 0">{{ parseInt(handleTotalLong(items.total_num, -1)) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <span v-for="item in gettotal_num()"><span class="total_name">{{ item.name }}</span>:<span
            class="total_nav_span">{{
              parseFloat((acq ? item.Zcje : item.BetMoney).toFixed(2)) }}</span>/<span
            :class="[acq ? item.Zcty < 0 ? 'Rate' : '' : item.Ty < 0 ? 'Rate' : '']" class="total_nav_span">{{
              parseFloat((acq ?
                item.Zcty : item.Ty).toFixed(2)) }}</span>/<span
            :class="[acq ? (item.Zcje + item.Zcty) < 0 ? 'Rate' : '' : (item.BetMoney + item.Ty) < 0 ? 'Rate' : '']"
            class="total_nav_span">{{ acq ?
              parseFloat((item.Zcje + item.Zcty).toFixed(2)) : parseFloat((item.BetMoney + item.Ty).toFixed(2)) }}</span>
        </span>
      </div>
      <div class="psc_odds_box">
        <div class="psc_odds_box_top titlem">
          <div
            v-if="Play_Grpup_data[default_Group].play_type.length > 1 && Play_Grpup_data[default_Group].alignModel != 3">
            <span>项目</span>
            <span class="psc_odds_box_topbtn" v-for="(items, index) in Play_Grpup_data[default_Group].play_type"
              :class="default_PlayType == index ? 'isActive2' : ''" @click="playtypechan(index)">{{ items.name }}</span>
          </div>
          <div v-if="Play_Grpup_data[default_Group].PlayZt">
            <span>玩法</span>
            <span class="psc_odds_box_topbtn" v-for="items in Play_Grpup_data[default_Group].PlayZt"
              :class="default_data.PlayZt == items ? 'isActive1' : ''"
              @click="Play_Group_Check(default_Group, default_PlayType, Play_Grpup_data[default_Group], items)">正{{
                items }}</span>
          </div>
          <div>
            <span>类型</span>
            <span>
              <select v-model="acq">
                <option label="实货" :value="true" />
                <option label="虚货" :value="false" />
              </select>
            </span>
          </div>
          <div style="width:45px"><span @click="greet(currentTime, this.GameList)">更新</span>{{ count }}</div>
          <div>
            <span>
              <select v-model="currentTime" placeholder="" @change="handleChangeCurrent">
                <option label="10秒" :value="parseInt(10)" />
                <option label="15秒" :value="parseInt(15)" />
                <option label="20秒" :value="parseInt(20)" />
                <option label="25秒" :value="parseInt(25)" />
                <option label="30秒" :value="parseInt(30)" />
              </select>
            </span>
          </div>
          <div class="psc_issue_open">
            <span>{{ GameList.issue }}期</span>
            <span v-if="pan_state == -1" class="stoptime">-</span>
            <span v-if="pan_state == 0" class="stoptime">封盘中</span>
            <span v-if="pan_state == 1">距离开盘:</span>
            <span v-if="pan_state == 1">{{ open_times }}</span>
            <span v-if="pan_state == 2">
              <span v-if="end_times != '00:00:00'">
                <span>距离封盘: </span>
                <span class="stoptime" style="color:green">{{ end_times }}</span>
              </span>
              <span v-else class="stoptime">已封盘</span>
              <span>
                <span>距离开奖: </span>
                <span class="stoptime">{{ kj_times }}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div
        :class="[Play_Grpup_data[default_Group].alignModel == 3 ? 'monitor_table_align' : '', Play_Grpup_data[default_Group].alignModel == 2 ? 'monitor_alignModel2_box' : '']">
        <el-table v-for="(items, indexs) in getTableData()" border class="monitor_table" :span-method="objectSpanMethod"
          :header-cell-class-name="'trheader'" :data="items.tableData"
          :height="Play_Grpup_data[default_Group].alignModel != 2 ? clientHeight1 + 'px' : 'auto'"
          :style="GetTableStyle()" :cell-class-name="cellClassName">
          <el-table-column v-if="Play_Grpup_data[default_Group].alignModel == 2" width="50">
            <template #header>
              项目
            </template>
            <template #default="{ row, $index }">
              {{ items.name }}
            </template>
          </el-table-column>
          <el-table-column type="index"
            v-if="Play_Grpup_data[default_Group].alignModel != 3 && Play_Grpup_data[default_Group].alignModel != 2"
            label="序号" />
          <el-table-column
            :label="Play_Grpup_data[default_Group].alignModel == 3 || Play_Grpup_data[default_Group].alignModel == 2 ? items.name : '球号'"
            :width="Play_Grpup_data[default_Group].alignModel >= 3 ? '' : '100'">
            <template #default="{ row, $index }">
              <span v-if="default_Group == 1 || default_Group == 0">特码&nbsp;</span>
              <span v-if="default_Group == 2">正码&nbsp;</span>
              <span v-if="default_Group == 3">正{{ this.default_data.PlayZt }}&nbsp;</span>
              <span @click="GetOrderListPost = row, dskey = dskey + 1, OrderShow = true"
                v-if="Play_Grpup_data[default_Group].alignModel != 3" class="play_text ball_n"
                :class="GetnumberClass(row)" :style="GetnumberStyle(row)">
                <span class="text_nowrap" :title="row.PlayNumber">{{ row.PlayNumber }}</span>
              </span>
              <div class="monitor_table_cell_div" style="justify-content:space-between;"
                v-if="Play_Grpup_data[default_Group].alignModel == 3">
                <div class="text_nowrap" :title="row.PlayNumber"
                  @click="GetOrderListPost = row, dskey = dskey + 1, OrderShow = true">{{ row.PlayNumber }}={{ (acq ?
                    row.ZcBetMoney : row.BetMoney).toFixed(1) }}</div>
                <div class="text_nowrap">
                  <span class="color_red" @click="bh(1, items.tableData, $index, items.name)">单补</span>
                  <span class="color_red" v-if="$index > 0"
                    @click="bh(2, items.tableData, $index, items.name)">多补</span>
                </div>
              </div>

            </template>
          </el-table-column>
          <el-table-column label="会员下注" v-if="default_Group != 0 && default_Group != 7">
            <template #default="{ row }">
              <div class="monitor_table_cell_div" @click="GetOrderListPost = row, dskey = dskey + 1, OrderShow = true">
                <div class="text_nowrap">{{ parseInt(row.BetMoney) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="占成金额" v-if="default_Group != 0 && default_Group != 7">
            <template #default="{ row, $index }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap">{{ (acq ? row.ZcBetMoney : row.BetMoney).toFixed(1) }}</div>
                <div class="text_nowrap color_red" @click="bh(1, items.tableData, $index, items.name)">单补</div>
                <div class="text_nowrap color_red" v-if="$index > 0"
                  @click="bh(2, items.tableData, $index, items.name)">多补
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退佣" v-if="default_Group != 0 && default_Group != 7">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap" :class="[acq ? row.Zcty != 0 ? 'Rate' : '' : row.Ty != 0 ? 'Rate' : '']">{{
                  (acq ?
                    row.Zcty : row.Ty).toFixed(2) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="派彩" v-if="default_Group != 0 && default_Group != 7">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap">{{ parseInt((acq ? row.Paicai : row.XuPaicai)) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="default_Group == 1 || default_Group == 3 || default_Group == 4 || default_Group == 0"
            label="最大盈亏">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap" :class="[acq ? row.Maxyk < 0 ? 'Rate' : '' : row.XuMaxyk < 0 ? 'Rate' : '']">{{
                  (acq ?
                    row.Maxyk : row.XuMaxyk).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="已补货" v-if="default_Group != 0 && default_Group != 7">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap">{{ parseInt(row.BhMoney) }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="特码" width="180" v-if="default_Group == 0">
            <template #default="{ row, $index }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyTm < 0 ? 'Rate' : '' : row.BetMoneyTm < 0 ? 'Rate' : '']"
                  @click="GetOrderListPost = row, dskey = dskey + 1, OrderShow = true">{{ (acq ?
                    row.ZcBetMoneyTm : row.BetMoneyTm).toFixed(1) }}</div>
                <div class="text_nowrap color_red" @click="bh(1, items.tableData, $index, items.name)">单补</div>
                <div class="text_nowrap color_red" v-if="$index > 0"
                  @click="bh(2, items.tableData, $index, items.name)">多补
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="两面" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyLm < 0 ? 'Rate' : '' : row.BetMoneyLm < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyLm : row.BetMoneyLm).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="波色" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyBs < 0 ? 'Rate' : '' : row.BetMoneyBs < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyBs : row.BetMoneyBs).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="特肖" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneySx < 0 ? 'Rate' : '' : row.BetMoneySx < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneySx : row.BetMoneySx).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="特头" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyTs < 0 ? 'Rate' : '' : row.BetMoneyTs < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyTs : row.BetMoneyTs).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="特尾" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyWs < 0 ? 'Rate' : '' : row.BetMoneyWs < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyWs : row.BetMoneyWs).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="半特" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyBt < 0 ? 'Rate' : '' : row.BetMoneyBt < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyBt : row.BetMoneyBt).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="半波" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyBb < 0 ? 'Rate' : '' : row.BetMoneyBb < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyBb : row.BetMoneyBb).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="半半波" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyBbb < 0 ? 'Rate' : '' : row.BetMoneyBbb < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyBbb : row.BetMoneyBbb).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="五行" v-if="default_Group == 0">
            <template #default="{ row }">
              <div class="monitor_table_cell_div">
                <div class="text_nowrap"
                  :class="[acq ? row.ZcBetMoneyWx < 0 ? 'Rate' : '' : row.BetMoneyWx < 0 ? 'Rate' : '']">
                  {{ (acq ? row.ZcBetMoneyWx : row.BetMoneyWx).toFixed(1) }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-boxdiv-bottom"></div>
      <el-dialog v-model="bhdia" title="" :class="bhtype == 2 ? 'Bh-dialogs' : 'Bh-dialog'" :append-to-body="true">
        <div class="titlem bodynav dialog-padding">
          <span v-if="default_Group == 0">特码</span>{{ bhname }}补货
        </div>
        <div class="psc_odds_box_top" style="max-height: calc(100vh - 300px); overflow: auto;">

          <div>
            <span>补货账号</span>
            <span>
              <select v-model="bhaccount" @change="changeBhAb()">
                <option v-for="(item, index) in bhuser" :label="item.account" :value="item.account" />
              </select>
            </span>
          </div>
          <div>
            <span v-if="default_Group < 4">玩法</span>
            <span v-if="default_Group < 4">
              <select v-model="BhAb" @change="changeBhAb()">
                <option v-for="(item, index) in BhAbData[default_Group].data" :label="item.name"
                  :value="item.playtype" />
              </select>
            </span>
          </div>
          <div>
            <span>盘口</span>
            <span>
              <select v-model="bhAbc" @change="changeBhAb()">
                <option v-for="(item, index) in ABC" :label="item" :value="item" />
              </select>
            </span>
          </div>
          <div>
            <span>快速金额</span>
            <span>
              <input type="text" v-model="BhBetMoney" class="monitor_table_bh_input" />
            </span>
          </div>
          <div>
            <span class="psc_odds_box_topbtn" @click="inputBhBetMoney()">传送金额</span>
            <span class="psc_odds_box_topbtn" @click="inputres()">重置输入</span>
          </div>
          <div>
            <span class="Rate" style="font-weight:500;font-size: 12px;">
              点击可补金额可快速复制到补货金额输入中
            </span>
          </div>

        </div>
        <div class="main-boxdiv1" style="width: 100%;max-height: calc(100vh - 300px);overflow: visible;">
          <el-table border class="monitor_table monitor_tabledia" style="width: 100%"
            height="calc(100vh - 300px)" :header-cell-class-name="'trheader'"
            :data="ShowListData" v-loading="LoadingBh">
            <el-table-column type="index" width="100" label="序号" />
            <el-table-column label="球号">
              <template #default="{ row, $index }">
                <span class="play_text ball_n" :style="GetnumberStyleBh(row)">
                  <span class="text_nowrap" :title="row.PlayNumber">{{ row.PlayNumber.join(',') }}</span>
                </span>

              </template>
            </el-table-column>
            <el-table-column label="赔率">
              <template #default="{ row, $index }">
                <span class="Rate">
                  <input type="text" v-model="row.Rate1" class="monitor_table_bh_input" />
                </span>
                <span v-if="row.Rate2 > 0" class="Rate">/<input type="text" v-model="row.Rate2"
                    class="monitor_table_bh_input" /></span>
              </template>
            </el-table-column>
            <el-table-column label="退佣">
              <template #default="{ row, $index }">
                <span>
                  <input type="text" v-model="row.Back" class="monitor_table_bh_input" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="可补金额">
              <template #default="{ row, $index }">
                <span @click="row.BetMoney = parseInt(row.KMoney)">{{ row.KMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column label="补货金额">
              <template #default="{ row, $index }">
                <input type="text" v-model="row.BetMoney" class="monitor_table_bh_input"
                  @click="changeBhBetMoney($index)" />
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: center; margin-top: 20px; margin-bottom: 10px;">
            <el-button type="primary" @click="OpenBhSubmit()">提交补货</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="OrderShow" title="" class="dssetCom-dialog" width="850">
        <div class="titlem bodynav dialog-padding">
          订单明细
        </div>
        <component :is="'detail'" :key="dskey" :GameList="GameList" :GetOrderListPost="GetOrderListPost"
          :PlayZt="default_data.PlayZt" :CompanyId="default_data.CompanyId"></component>
      </el-dialog>

    </div>
  </el-watermark>
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';
export default {
  components: {
    detail: defineAsyncComponent(() => import('./detail.vue')),
  },
  props: {
    clientHeight1: {
      type: Number,
      required: true
    },
    home_data: {
      type: Object
    },
  },
  data() {
    return {
      fontvalue: '',
      font: {
        fontSize: 32,
        color: 'rgba(0, 0, 0, 0.08)',
      },
      IsPost: true,
      acq: true,
      Loadingodds: false,
      default_Group: 0,
      default_PlayType: 0,
      default_data: {
        'LotteryId': 1,
        'Abc': '',
        'PlayType': [1, 3, 4],
        'PlayZt': 0,
        'DefaultGroup': 0
      },
      currentTime: 10,
      intervalId: null,
      selectkey: -1,
      setoddsval: '',
      batchsetodds: false,
      checkAll: false,
      isIndeterminate: true,
      heightRe: 0,
      withRe: 0,
      GameList: [],
      animation: [],
      All_total: {
        'BetMoney': 0,
        'Ty': 0,
        'Zcje': 0,
        'Zcty': 0
      },
      bhdia: false,
      BhBetMoney: '',
      ShowListData: [],
      OldShowListData: [],
      bhPostData: {},
      bhuser: '',
      bhaccount: '',
      bhAbc: 'A',
      BhAb: [],
      ABC: [],
      bhtype: 1,
      IsPostBhBet: false,
      BhAbData: [
        { 'name': '总项', 'data': [{ 'name': '特A', 'playtype': [1] }, { 'name': '特B', 'playtype': [2] }] },
        { 'name': '特码', 'data': [{ 'name': '特A', 'playtype': [1, 3, 4] }, { 'name': '特B', 'playtype': [2, 3, 4] }] },
        { 'name': '正码', 'data': [{ 'name': '正码A', 'playtype': [5, 7] }, { 'name': '正码B', 'playtype': [6, 7] }] },
        { 'name': '正特', 'data': [{ 'name': '正特A', 'playtype': [8, 10, 11] }, { 'name': '正特B', 'playtype': [9, 10, 11] }] }
      ],
      LoadingBh: false,
      bhname: '',
      OrderShow: false,
      dskey: 0,
      AllTableData: [],
      Play_Grpup_data: [
        {
          'group_name': '总项',
          'total_num': [{
            'PlayType': [1, 2],
            'name': '特码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '总项',
            'data': [1, 2]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '总项', 'playtype': [1, 2], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [1, 2]
        },
        {
          'group_name': '特码',
          'total_num': [{
            'PlayType': [1, 2],
            'name': '特码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [3],
            'name': '两面',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [4],
            'name': '波色',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '特码',
            'data': [1, 2, 3, 4]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '特码', 'playtype': [1, 2, 3, 4], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [1, 2, 3, 4]
        },
        {
          'group_name': '正码',
          'total_num': [{
            'PlayType': [5, 6],
            'name': '正码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [7],
            'name': '两面',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '正码',
            'data': [5, 6, 7]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '特码', 'playtype': [5, 6, 7], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [5, 6, 7]
        },
        {
          'group_name': '正码特',
          'total_num': [{
            'PlayType': [8, 9],
            'name': '正1',
            'PlayZt': 1,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正1两面',
            'PlayZt': 1,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正1波色',
            'PlayZt': 1,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正2',
            'PlayZt': 2,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正2两面',
            'PlayZt': 2,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正2波色',
            'PlayZt': 2,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正3',
            'PlayZt': 3,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正3两面',
            'PlayZt': 3,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正3波色',
            'PlayZt': 3,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正4',
            'PlayZt': 4,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正4两面',
            'PlayZt': 4,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正4波色',
            'PlayZt': 4,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正5',
            'PlayZt': 5,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正5两面',
            'PlayZt': 5,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正5波色',
            'PlayZt': 5,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正6',
            'PlayZt': 6,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正6两面',
            'PlayZt': 6,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正6波色',
            'PlayZt': 6,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '正码特',
            'data': [8, 9, 10, 11]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '正1', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正2', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正3', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正4', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正5', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正6', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
          ],
          'PlayZt': 6,
          'opendata': [8, 9, 10, 11]
        },
        {
          'group_name': '特码项',
          'total_num': [{
            'PlayType': [12],
            'name': '特肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [13],
            'name': '半特',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [14],
            'name': '特头数',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [15],
            'name': '特尾数',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [16, 17, 18, 19],
            'name': '半波',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [20, 21, 22],
            'name': '半半波',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [23],
            'name': '五行',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '特码项',
            'data': [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
          }],
          'alignModel': 2,
          'tableNum': [
            { 'name': '特肖', 'playtype': [12], 'tableDta': [] },
            { 'name': '半特', 'playtype': [13], 'tableDta': [] },
            { 'name': '特头数', 'playtype': [14], 'tableDta': [] },
            { 'name': '特尾数', 'playtype': [15], 'tableDta': [] },
            { 'name': '半波', 'playtype': [16, 17, 18, 19], 'tableDta': [] },
            { 'name': '半半波', 'playtype': [20, 21, 22], 'tableDta': [] },
            { 'name': '五行', 'playtype': [23], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
        },
        {
          'group_name': '生肖项',
          'total_num': [{
            'PlayType': [24],
            'name': '一肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [25],
            'name': '一肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [27, 28, 29, 30, 31, 32, 33, 34],
            'name': '生肖量',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '生肖项',
            'data': [24, 25, 27, 28, 29, 30, 31, 32, 33, 34]
          }],
          'alignModel': 2,
          'tableNum': [
            { 'name': '一肖中', 'playtype': [24], 'tableDta': [] },
            { 'name': '一肖不中', 'playtype': [25], 'tableDta': [] },
            { 'name': '生肖量', 'playtype': [27, 28, 29, 30, 31, 32, 33, 34], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [24, 25, 27, 28, 29, 30, 31, 32, 33, 34]
        },
        {
          'group_name': '尾数项',
          'total_num': [{
            'PlayType': [35],
            'name': '尾数中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [36],
            'name': '尾数不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [37, 38, 39, 40, 41, 42, 43, 44],
            'name': '尾数量',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '尾数项',
            'data': [35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
          }],
          'alignModel': 2,
          'tableNum': [
            { 'name': '尾数中', 'playtype': [35], 'tableDta': [] },
            { 'name': '尾数不中', 'playtype': [36], 'tableDta': [] },
            { 'name': '尾数量', 'playtype': [37, 38, 39, 40, 41, 42, 43, 44], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
        },
        {
          'group_name': '连码',
          'total_num': [{
            'PlayType': [59],
            'name': '二全中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [60],
            'name': '二中特',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [61],
            'name': '特串',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [57],
            'name': '三全中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [58],
            'name': '三中二',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [56],
            'name': '四中四',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '二全中',
            'data': [59]
          }, {
            'name': '二中特',
            'data': [60],
            'secondrate': true
          }, {
            'name': '特串',
            'data': [61]
          }, {
            'name': '三全中',
            'data': [57]
          }, {
            'name': '三中二',
            'data': [58],
            'secondrate': true
          }, {
            'name': '四中四',
            'data': [56]
          }],
          'alignModel': 3,
          'tableNum': [
            { 'name': '二全中', 'playtype': [59], 'tableDta': [] },
            { 'name': '二中特', 'playtype': [60], 'tableDta': [] },
            { 'name': '特串', 'playtype': [61], 'tableDta': [] },
            { 'name': '三全中', 'playtype': [57], 'tableDta': [] },
            { 'name': '三中二', 'playtype': [58], 'tableDta': [] },
            { 'name': '四中四', 'playtype': [56], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [56, 57, 58, 59, 60, 61]
        },
        {
          'group_name': '生肖连',
          'total_num': [{
            'PlayType': [72],
            'name': '二肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [73],
            'name': '二肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [74],
            'name': '三肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [75],
            'name': '三肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [76],
            'name': '四肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [77],
            'name': '四肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [78],
            'name': '五肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [79],
            'name': '五肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [
            { 'name': '二肖中', 'data': [72] },
            { 'name': '二肖不中', 'data': [73] },
            { 'name': '三肖中', 'data': [74] },
            { 'name': '三肖不中', 'data': [75] },
            { 'name': '四肖中', 'data': [76] },
            { 'name': '四肖不中', 'data': [77] },
            { 'name': '五肖中', 'data': [78] },
            { 'name': '五肖不中', 'data': [79] }
          ],
          'alignModel': 4,
          'tableNum': [
            { 'name': '二肖中', 'playtype': [72], 'tableDta': [] },
            { 'name': '二肖不中', 'playtype': [73], 'tableDta': [] },
            { 'name': '三肖中', 'playtype': [74], 'tableDta': [] },
            { 'name': '三肖不中', 'playtype': [75], 'tableDta': [] },
            { 'name': '四肖中', 'playtype': [76], 'tableDta': [] },
            { 'name': '四肖不中', 'playtype': [77], 'tableDta': [] },
            { 'name': '五肖中', 'playtype': [78], 'tableDta': [] },
            { 'name': '五肖不中', 'playtype': [79], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [72, 73, 74, 75, 76, 77, 78, 79]
        },
        {
          'group_name': '尾数连',
          'total_num': [{
            'PlayType': [80],
            'name': '二尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [81],
            'name': '二尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [82],
            'name': '三尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [83],
            'name': '三尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [84],
            'name': '四尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [85],
            'name': '四尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [86],
            'name': '五尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [87],
            'name': '五尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [
            { 'name': '二尾中', 'data': [80] },
            { 'name': '二尾不中', 'data': [81] },
            { 'name': '三尾中', 'data': [82] },
            { 'name': '三尾不中', 'data': [83] },
            { 'name': '四尾中', 'data': [84] },
            { 'name': '四尾不中', 'data': [85] },
            { 'name': '五尾中', 'data': [86] },
            { 'name': '五尾不中', 'data': [87] }
          ],
          'alignModel': 4,
          'tableNum': [
            { 'name': '二尾中', 'playtype': [80], 'tableDta': [] },
            { 'name': '二尾不中', 'playtype': [81], 'tableDta': [] },
            { 'name': '三尾中', 'playtype': [82], 'tableDta': [] },
            { 'name': '三尾不中', 'playtype': [83], 'tableDta': [] },
            { 'name': '四尾中', 'playtype': [84], 'tableDta': [] },
            { 'name': '四尾不中', 'playtype': [85], 'tableDta': [] },
            { 'name': '五尾中', 'playtype': [86], 'tableDta': [] },
            { 'name': '五尾不中', 'playtype': [87], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [80, 81, 82, 83, 84, 85, 86, 87]
        },
        {
          'group_name': '不中',
          'total_num': [{
            'PlayType': [88],
            'name': '四不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [89],
            'name': '五不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [90],
            'name': '六不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [91],
            'name': '七不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [92],
            'name': '八不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [93],
            'name': '九不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [94],
            'name': '十不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [95],
            'name': '十一不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [96],
            'name': '十二不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '四不中',
            'data': [88]
          }, {
            'name': '五不中',
            'data': [89]
          }, {
            'name': '六不中',
            'data': [90]
          }, {
            'name': '七不中',
            'data': [91]
          }, {
            'name': '八不中',
            'data': [92]
          }, {
            'name': '九不中',
            'data': [93]
          }, {
            'name': '十不中',
            'data': [94]
          }, {
            'name': '十一不中',
            'data': [95]
          }, {
            'name': '十二不中',
            'data': [96]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '四不中', 'playtype': [88], 'tableDta': [] },
            { 'name': '五不中', 'playtype': [89], 'tableDta': [] },
            { 'name': '六不中', 'playtype': [90], 'tableDta': [] },
            { 'name': '七不中', 'playtype': [91], 'tableDta': [] },
            { 'name': '八不中', 'playtype': [92], 'tableDta': [] },
            { 'name': '九不中', 'playtype': [93], 'tableDta': [] },
            { 'name': '十不中', 'playtype': [94], 'tableDta': [] },
            { 'name': '十一不中', 'playtype': [95], 'tableDta': [] },
            { 'name': '十二不中', 'playtype': [96], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [88, 89, 90, 91, 92, 93, 94, 95, 96]
        },
        {
          'group_name': '中一',
          'total_num': [{
            'PlayType': [97],
            'name': '五中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [98],
            'name': '六中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [99],
            'name': '七中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [100],
            'name': '八中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [101],
            'name': '九中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [102],
            'name': '十中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '五中一',
            'data': [97]
          }, {
            'name': '六中一',
            'data': [98]
          }, {
            'name': '七中一',
            'data': [99]
          }, {
            'name': '八中一',
            'data': [100]
          }, {
            'name': '九中一',
            'data': [101]
          }, {
            'name': '十中一',
            'data': [102]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '五中一', 'playtype': [97], 'tableDta': [] },
            { 'name': '六中一', 'playtype': [98], 'tableDta': [] },
            { 'name': '七中一', 'playtype': [99], 'tableDta': [] },
            { 'name': '八中一', 'playtype': [100], 'tableDta': [] },
            { 'name': '九中一', 'playtype': [101], 'tableDta': [] },
            { 'name': '十中一', 'playtype': [102], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [97, 97, 99, 100, 101, 102]
        },
        {
          'group_name': '任中',
          'total_num': [{
            'PlayType': [97],
            'name': '五中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [98],
            'name': '六中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [103],
            'name': '一粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [104],
            'name': '二粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [105],
            'name': '三粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [106],
            'name': '四粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [107],
            'name': '五粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '一粒任中',
            'data': [103]
          }, {
            'name': '二粒任中',
            'data': [104]
          }, {
            'name': '三粒任中',
            'data': [105]
          }, {
            'name': '四粒任中',
            'data': [106]
          }, {
            'name': '五粒任中',
            'data': [107]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '一粒任中', 'playtype': [103], 'tableDta': [] },
            { 'name': '二粒任中', 'playtype': [104], 'tableDta': [] },
            { 'name': '三粒任中', 'playtype': [105], 'tableDta': [] },
            { 'name': '四粒任中', 'playtype': [106], 'tableDta': [] },
            { 'name': '五粒任中', 'playtype': [107], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [103, 104, 105, 106, 107]
        },
        {
          'group_name': '七码',
          'total_num': [{
            'PlayType': [45, 46, 47, 48, 49, 50, 51, 52],
            'name': '七码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '七码',
            'data': [45, 46, 47, 48, 49, 50, 51, 52]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '七码', 'playtype': [45, 46, 47, 48, 49, 50, 51, 52], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [45, 46, 47, 48, 49, 50, 51, 52]
        },
        {
          'group_name': '七色波',
          'total_num': [{
            'PlayType': [53, 54, 55],
            'name': '七色波',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '七色波',
            'data': [53, 54, 55]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '七色波', 'playtype': [53, 54, 55], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [53, 54, 55]
        },
        {
          'group_name': '合肖',
          'total_num': [{
            'PlayType': [62],
            'name': '二肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [63],
            'name': '三肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [64],
            'name': '四肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [65],
            'name': '五肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [66],
            'name': '六肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [67],
            'name': '七肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [68],
            'name': '八肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [69],
            'name': '九肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [70],
            'name': '十肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [71],
            'name': '十一肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [
            { 'name': '二肖', 'data': [62] },
            { 'name': '三肖', 'data': [63] },
            { 'name': '四肖', 'data': [64] },
            { 'name': '五肖', 'data': [65] },
            { 'name': '六肖', 'data': [66] },
            { 'name': '七肖', 'data': [67] },
            { 'name': '八肖', 'data': [68] },
            { 'name': '九肖', 'data': [69] },
            { 'name': '十肖', 'data': [70] },
            { 'name': '十一肖', 'data': [71] },
          ],
          'alignModel': 4,
          'tableNum': [
            { 'name': '二肖', 'playtype': [62], 'tableDta': [] },
            { 'name': '三肖', 'playtype': [63], 'tableDta': [] },
            { 'name': '四肖', 'playtype': [64], 'tableDta': [] },
            { 'name': '五肖', 'playtype': [65], 'tableDta': [] },
            { 'name': '六肖', 'playtype': [66], 'tableDta': [] },
            { 'name': '七肖', 'playtype': [67], 'tableDta': [] },
            { 'name': '八肖', 'playtype': [68], 'tableDta': [] },
            { 'name': '九肖', 'playtype': [69], 'tableDta': [] },
            { 'name': '十肖', 'playtype': [70], 'tableDta': [] },
            { 'name': '十一肖', 'playtype': [71], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
        }
      ],

      GetOrderListPost: ''
    }
  },
  created() {
    this.GameList = this.home_data.GameList[this.home_data.game_index]
    this.default_data.LotteryId = this.GameList.lottery_id

    this.fontvalue = this.$store.state.UserName
    if (this.$store.state.Current > 10) {
      this.currentTime = this.$store.state.Current
      this.greet(this.currentTime, this.GameList)
    }
    this.getdata()
  },


  setup() {
    // 定义响应式参数
    const game = ref('');
    const open_times = ref('00:00:00');
    const kj_times = ref('00:00:00');
    const end_times = ref('00:00:00');
    const pan_state = ref(-1);//盘状态            
    const val = ref('');
    const count = ref(30);
    let timerId = null;
    function greet(val, default_game) {
      if (default_game.end_time) {
        clearInterval(timerId);
        startCountdown(val, default_game)
      }
    }
    const startCountdown = (val, default_game) => {
      count.value = val
      timerId = setInterval(() => {
        const day = new Date(default_game.date)
        const open_time = default_game.open_time
        const kj_time = default_game.kj_time
        const end_time = default_game.end_time
        const now = new Date();
        if (now.getTime() > day.getTime()) {
          const open_time1 = GetDateHan(open_time, day)
          const kj_time1 = GetDateHan(kj_time, day)
          const end_time1 = GetDateHan(end_time, day)
          const nowTime = now.getTime()
          if (open_time1.getTime() > nowTime) {
            pan_state.value = 1
            open_times.value = msToTime((open_time1.getTime() - now.getTime()))
          } else if (open_time1.getTime() < nowTime && end_time1.getTime() > nowTime && kj_time1.getTime() > nowTime && default_game.state) {
            pan_state.value = 2
            end_times.value = msToTime((end_time1.getTime() - now.getTime()))
            kj_times.value = msToTime((kj_time1.getTime() - now.getTime()))
          } else if (open_time1.getTime() < nowTime && end_time1.getTime() < nowTime && kj_time1.getTime() > nowTime && !default_game.state) {
            pan_state.value = 3
            end_times.value = '00:00:00'
            kj_times.value = msToTime((kj_time1.getTime() - now.getTime()))
          } else {
            pan_state.value = 0
          }
        } else {
          pan_state.value = 0
        }
        if (!default_game.state) {
          pan_state.value = 0
        }
        count.value--;
        if (count.value < 0) {
          count.value = val;
        }
      }, 1000);
    };
    //时间上的处理
    function GetDateHan(date, day) {
      day = new Date(day)
      const parts = date.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      day.setHours(hours, minutes, seconds, 0);
      return day
    }
    //时间上的处理
    function msToTime(milliseconds) {
      var hours = Math.floor(milliseconds / 3600000);
      var minutes = Math.floor((milliseconds % 3600000) / 60000);
      var seconds = Math.floor(((milliseconds % 3600000) % 60000) / 1000);
      return (hours < 10 && hours > 0 ? '0' : '') + (hours ? hours + ':' : '00' + ':') + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
    onMounted(() => {
      greet(count.value, game)
    });

    onUnmounted(() => {
      if (timerId) {
        clearInterval(timerId);
      }
    });

    return { pan_state, open_times, end_times, kj_times, count, greet };
  },
  computed: {

  },
  watch: {
    'GameList.state': {
      handler(newVal, oldVal) {
        this.greet(this.count, this.GameList)
      },
      deep: false
    },
    'GameList.date': {
      handler(newVal, oldVal) {
        this.greet(this.count, this.GameList)
      },
      deep: false
    },
    'GameList.open_time': {
      handler(newVal, oldVal) {
        this.greet(this.count, this.GameList)
      },
      deep: false
    },
    'GameList.end_time': {
      handler(newVal, oldVal) {
        this.greet(this.count, this.GameList)
      },
      deep: false
    },
    'GameList.kj_time': {
      handler(newVal, oldVal) {
        this.greet(this.count, this.GameList)
      },
      deep: false
    },
    default_data: {
      handler(newVal, oldVal) {
        this.Loadingodds = true
        this.getdata()
      },
      deep: true
    },
    count: {
      handler(newVal, oldVal) {
        if (newVal == 0) {
          this.getdata()
        }
      },
      deep: true
    }
  },
  methods: {
    getlettery() {
      this.greet(10, this.GameList)
      this.$request.postData('/home', {}).then(response => {
        if (response.code == 200) {
          var lotterydata = response.data.lottery
          lotterydata.sort((a, b) => a.sort - b.sort)
          if (this.home_data.GameList.length == lotterydata.length) {
            for (let key in this.home_data.GameList) {
              var a = lotterydata.filter(item => item.lottery_id === this.home_data.GameList[key].lottery_id)
              if (a.length == 1) {
                for (let key1 in a[0]) {
                  if (key1 != 'id' && key1 != 'lottery_id' && key1 != 'name' && key1 != 'sort') {
                    if (this.home_data.GameList[key][key1] != a[0][key1]) {
                      this.home_data.GameList[key][key1] = a[0][key1]
                    }
                  }
                }
              }
            }
          } else {
            this.home_data.GameList = lotterydata
          }

          this.GameList = this.home_data.GameList[this.home_data.game_index]
          this.default_data.LotteryId = this.GameList.lottery_id

          this.$store.commit('setHomeData', this.home_data)

          var lotteryresult = response.data.lotteryresult
          var r = lotteryresult.filter(item => item.LotteryId === this.home_data.GameList[this.home_data.game_index].lottery_id)
          if (JSON.stringify(this.home_data.result) != JSON.stringify(r[0])) this.home_data.result = r[0];
          if (JSON.stringify(this.noticelist) != JSON.stringify(response.data.notice)) {
            this.noticelist = response.data.notice

          }
          this.isshowresult = true
          this.getdata()
        }
      }).catch(error => {
        console.log("error")
      });
    },

    changeLotteryId(item, index) {
      this.isshowresult = false
      this.home_data.game_index = index
      this.$store.commit('setHomeData', this.home_data)
      if (this.count > 2 && this.count < 10) {
        this.getlettery()
      }
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 && this.Play_Grpup_data[this.default_Group].alignModel == 2) {
        return 'monitor_alignModel2'
      } else {
        return 'monitor_table_cell'
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.Play_Grpup_data[this.default_Group].alignModel == 2) {
        if (columnIndex == 0) {
          if (rowIndex > 0) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else {
            return {
              rowspan: 12,
              colspan: 1
            }
          }

        }
      }
    },
    Play_Group_Check(GroupIndex, PlayTypeIndex, items, PlayZt) {
      this.IsPost = true
      this.Loadingodds = true
      this.selectkey = -1
      this.setoddsval = ''
      this.default_Group = GroupIndex
      this.default_PlayType = PlayTypeIndex
      this.default_data.PlayType = items.play_type[PlayTypeIndex].data
      if (items.PlayZt > 0) {
        this.default_data.PlayZt = PlayZt ? PlayZt : 1
      } else {
        this.default_data.PlayZt = 0
      }

    },
    handleChangeABC(val) {

    },
    handleChangeCurrent() {
      this.greet(this.currentTime, this.GameList)
      this.$store.commit('setCurrent', this.currentTime)
    },
    getdata() {
      if (!this.IsPost) {
        return
      }
      this.greet(this.currentTime, this.GameList)
      this.default_data.DefaultGroup = parseInt(this.default_Group)
      console.log(this.default_data)
      this.$request.postData('/jiankong/find', this.default_data).then(response => {
        this.Loadingodds = false
        if (response.code == 200) {
          this.IsPost = true
          var p1 = this.default_Group == 0 ? response.data.dataall : response.data.data
          if (this.default_Group < 5 && this.default_Group != 2 && this.default_Group != 3) {
            p1.sort((a, b) => a.Maxyk - b.Maxyk)
          }
          if (this.default_Group == 2 || this.default_Group == 3) {
            p1.sort((a, b) => b.BetMoney - a.BetMoney)
          }
          if (this.default_Group > 4 && this.default_Group != 7) {
            p1.sort((a, b) => b.BetMoney - a.BetMoney)
          }

          this.AllTableData = p1
          this.handleTotal(response.data.base.OrderAll)
          //处理数据
          if (p1) {
            for (let key in this.Play_Grpup_data[this.default_Group].tableNum) {
              var l = p1.filter(item => this.Play_Grpup_data[this.default_Group].tableNum[key].playtype.includes(item.PlayType))
              if (this.default_data.PlayZt > 0) {
                if ((this.default_data.PlayZt - 1) == key) {
                  if (JSON.stringify(this.Play_Grpup_data[this.default_Group].tableNum[key].tableData) != JSON.stringify(l)) {
                    this.Play_Grpup_data[this.default_Group].tableNum[key].tableData = l
                  }
                }
              } else {
                if (JSON.stringify(this.Play_Grpup_data[this.default_Group].tableNum[key].tableData) != JSON.stringify(l)) {
                  this.Play_Grpup_data[this.default_Group].tableNum[key].tableData = l
                }
              }
            }
          }

        } else {
          this.IsPost = false
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.IsPost = false
        this.Loadingodds = false
        if (this.IsPost) {
          this.$message.error('网络请求错误');
        }

      });
    },
    getTableData() {
      var a = []
      var b = this.default_data.PlayZt > 0 ? this.Play_Grpup_data[this.default_Group].tableNum[this.default_data.PlayZt - 1] : this.Play_Grpup_data[this.default_Group].alignModel == 4 ? this.Play_Grpup_data[this.default_Group].tableNum[this.default_PlayType] : this.Play_Grpup_data[this.default_Group].tableNum
      if (this.default_data.PlayZt > 0 || this.Play_Grpup_data[this.default_Group].alignModel == 4) { a.push(b) } else { a = b }
      return a
    },
    resetPlay_Grpup_data() {
      this.Play_Grpup_data = [
        {
          'group_name': '总项',
          'total_num': [{
            'PlayType': [1, 2],
            'name': '特码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '总项',
            'data': [1, 2]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '总项', 'playtype': [1, 2], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [1, 2]
        },
        {
          'group_name': '特码',
          'total_num': [{
            'PlayType': [1, 2],
            'name': '特码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [3],
            'name': '两面',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [4],
            'name': '波色',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '特码',
            'data': [1, 2, 3, 4]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '特码', 'playtype': [1, 2, 3, 4], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [1, 2, 3, 4]
        },
        {
          'group_name': '正码',
          'total_num': [{
            'PlayType': [5, 6],
            'name': '正码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [7],
            'name': '两面',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '正码',
            'data': [5, 6, 7]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '特码', 'playtype': [5, 6, 7], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [5, 6, 7]
        },
        {
          'group_name': '正码特',
          'total_num': [{
            'PlayType': [8, 9],
            'name': '正1',
            'PlayZt': 1,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正1两面',
            'PlayZt': 1,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正1波色',
            'PlayZt': 1,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正2',
            'PlayZt': 2,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正2两面',
            'PlayZt': 2,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正2波色',
            'PlayZt': 2,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正3',
            'PlayZt': 3,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正3两面',
            'PlayZt': 3,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正3波色',
            'PlayZt': 3,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正4',
            'PlayZt': 4,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正4两面',
            'PlayZt': 4,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正4波色',
            'PlayZt': 4,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正5',
            'PlayZt': 5,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正5两面',
            'PlayZt': 5,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正5波色',
            'PlayZt': 5,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [8, 9],
            'name': '正6',
            'PlayZt': 6,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [10],
            'name': '正6两面',
            'PlayZt': 6,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [11],
            'name': '正6波色',
            'PlayZt': 6,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '正码特',
            'data': [8, 9, 10, 11]
          }],
          'alignModel': 1,
          'tableNum': [
            { 'name': '正1', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正2', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正3', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正4', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正5', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
            { 'name': '正6', 'playtype': [8, 9, 10, 11], 'tableDta': [] },
          ],
          'PlayZt': 6,
          'opendata': [8, 9, 10, 11]
        },
        {
          'group_name': '特码项',
          'total_num': [{
            'PlayType': [12],
            'name': '特肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [13],
            'name': '半特',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [14],
            'name': '特头数',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [15],
            'name': '特尾数',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [16, 17, 18, 19],
            'name': '半波',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [20, 21, 22],
            'name': '半半波',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [23],
            'name': '五行',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '特码项',
            'data': [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
          }],
          'alignModel': 2,
          'tableNum': [
            { 'name': '特肖', 'playtype': [12], 'tableDta': [] },
            { 'name': '半特', 'playtype': [13], 'tableDta': [] },
            { 'name': '特头数', 'playtype': [14], 'tableDta': [] },
            { 'name': '特尾数', 'playtype': [15], 'tableDta': [] },
            { 'name': '半波', 'playtype': [16, 17, 18, 19], 'tableDta': [] },
            { 'name': '半半波', 'playtype': [20, 21, 22], 'tableDta': [] },
            { 'name': '五行', 'playtype': [23], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
        },
        {
          'group_name': '生肖项',
          'total_num': [{
            'PlayType': [24],
            'name': '一肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [25],
            'name': '一肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [27, 28, 29, 30, 31, 32, 33, 34],
            'name': '生肖量',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '生肖项',
            'data': [24, 25, 27, 28, 29, 30, 31, 32, 33, 34]
          }],
          'alignModel': 2,
          'tableNum': [
            { 'name': '一肖中', 'playtype': [24], 'tableDta': [] },
            { 'name': '一肖不中', 'playtype': [25], 'tableDta': [] },
            { 'name': '生肖量', 'playtype': [27, 28, 29, 30, 31, 32, 33, 34], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [24, 25, 27, 28, 29, 30, 31, 32, 33, 34]
        },
        {
          'group_name': '尾数项',
          'total_num': [{
            'PlayType': [35],
            'name': '尾数中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [36],
            'name': '尾数不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [37, 38, 39, 40, 41, 42, 43, 44],
            'name': '尾数量',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '尾数项',
            'data': [35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
          }],
          'alignModel': 2,
          'tableNum': [
            { 'name': '尾数中', 'playtype': [35], 'tableDta': [] },
            { 'name': '尾数不中', 'playtype': [36], 'tableDta': [] },
            { 'name': '尾数量', 'playtype': [37, 38, 39, 40, 41, 42, 43, 44], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
        },
        {
          'group_name': '连码',
          'total_num': [{
            'PlayType': [59],
            'name': '二全中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [60],
            'name': '二中特',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [61],
            'name': '特串',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [57],
            'name': '三全中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [58],
            'name': '三中二',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [56],
            'name': '四中四',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '二全中',
            'data': [59]
          }, {
            'name': '二中特',
            'data': [60],
            'secondrate': true
          }, {
            'name': '特串',
            'data': [61]
          }, {
            'name': '三全中',
            'data': [57]
          }, {
            'name': '三中二',
            'data': [58],
            'secondrate': true
          }, {
            'name': '四中四',
            'data': [56]
          }],
          'alignModel': 3,
          'tableNum': [
            { 'name': '二全中', 'playtype': [59], 'tableDta': [] },
            { 'name': '二中特', 'playtype': [60], 'tableDta': [] },
            { 'name': '特串', 'playtype': [61], 'tableDta': [] },
            { 'name': '三全中', 'playtype': [57], 'tableDta': [] },
            { 'name': '三中二', 'playtype': [58], 'tableDta': [] },
            { 'name': '四中四', 'playtype': [56], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [56, 57, 58, 59, 60, 61]
        },
        {
          'group_name': '生肖连',
          'total_num': [{
            'PlayType': [72],
            'name': '二肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [73],
            'name': '二肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [74],
            'name': '三肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [75],
            'name': '三肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [76],
            'name': '四肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [77],
            'name': '四肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [78],
            'name': '五肖中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [79],
            'name': '五肖不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [
            { 'name': '二肖中', 'data': [72] },
            { 'name': '二肖不中', 'data': [73] },
            { 'name': '三肖中', 'data': [74] },
            { 'name': '三肖不中', 'data': [75] },
            { 'name': '四肖中', 'data': [76] },
            { 'name': '四肖不中', 'data': [77] },
            { 'name': '五肖中', 'data': [78] },
            { 'name': '五肖不中', 'data': [79] }
          ],
          'alignModel': 4,
          'tableNum': [
            { 'name': '二肖中', 'playtype': [72], 'tableDta': [] },
            { 'name': '二肖不中', 'playtype': [73], 'tableDta': [] },
            { 'name': '三肖中', 'playtype': [74], 'tableDta': [] },
            { 'name': '三肖不中', 'playtype': [75], 'tableDta': [] },
            { 'name': '四肖中', 'playtype': [76], 'tableDta': [] },
            { 'name': '四肖不中', 'playtype': [77], 'tableDta': [] },
            { 'name': '五肖中', 'playtype': [78], 'tableDta': [] },
            { 'name': '五肖不中', 'playtype': [79], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [72, 73, 74, 75, 76, 77, 78, 79]
        },
        {
          'group_name': '尾数连',
          'total_num': [{
            'PlayType': [80],
            'name': '二尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [81],
            'name': '二尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [82],
            'name': '三尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [83],
            'name': '三尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [84],
            'name': '四尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [85],
            'name': '四尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [86],
            'name': '五尾中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [87],
            'name': '五尾不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [
            { 'name': '二尾中', 'data': [80] },
            { 'name': '二尾不中', 'data': [81] },
            { 'name': '三尾中', 'data': [82] },
            { 'name': '三尾不中', 'data': [83] },
            { 'name': '四尾中', 'data': [84] },
            { 'name': '四尾不中', 'data': [85] },
            { 'name': '五尾中', 'data': [86] },
            { 'name': '五尾不中', 'data': [87] }
          ],
          'alignModel': 4,
          'tableNum': [
            { 'name': '二尾中', 'playtype': [80], 'tableDta': [] },
            { 'name': '二尾不中', 'playtype': [81], 'tableDta': [] },
            { 'name': '三尾中', 'playtype': [82], 'tableDta': [] },
            { 'name': '三尾不中', 'playtype': [83], 'tableDta': [] },
            { 'name': '四尾中', 'playtype': [84], 'tableDta': [] },
            { 'name': '四尾不中', 'playtype': [85], 'tableDta': [] },
            { 'name': '五尾中', 'playtype': [86], 'tableDta': [] },
            { 'name': '五尾不中', 'playtype': [87], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [80, 81, 82, 83, 84, 85, 86, 87]
        },
        {
          'group_name': '不中',
          'total_num': [{
            'PlayType': [88],
            'name': '四不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [89],
            'name': '五不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [90],
            'name': '六不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [91],
            'name': '七不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [92],
            'name': '八不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [93],
            'name': '九不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [94],
            'name': '十不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [95],
            'name': '十一不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [96],
            'name': '十二不中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '四不中',
            'data': [88]
          }, {
            'name': '五不中',
            'data': [89]
          }, {
            'name': '六不中',
            'data': [90]
          }, {
            'name': '七不中',
            'data': [91]
          }, {
            'name': '八不中',
            'data': [92]
          }, {
            'name': '九不中',
            'data': [93]
          }, {
            'name': '十不中',
            'data': [94]
          }, {
            'name': '十一不中',
            'data': [95]
          }, {
            'name': '十二不中',
            'data': [96]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '四不中', 'playtype': [88], 'tableDta': [] },
            { 'name': '五不中', 'playtype': [89], 'tableDta': [] },
            { 'name': '六不中', 'playtype': [90], 'tableDta': [] },
            { 'name': '七不中', 'playtype': [91], 'tableDta': [] },
            { 'name': '八不中', 'playtype': [92], 'tableDta': [] },
            { 'name': '九不中', 'playtype': [93], 'tableDta': [] },
            { 'name': '十不中', 'playtype': [94], 'tableDta': [] },
            { 'name': '十一不中', 'playtype': [95], 'tableDta': [] },
            { 'name': '十二不中', 'playtype': [96], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [88, 89, 90, 91, 92, 93, 94, 95, 96]
        },
        {
          'group_name': '中一',
          'total_num': [{
            'PlayType': [97],
            'name': '五中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [98],
            'name': '六中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [99],
            'name': '七中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [100],
            'name': '八中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [101],
            'name': '九中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [102],
            'name': '十中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '五中一',
            'data': [97]
          }, {
            'name': '六中一',
            'data': [98]
          }, {
            'name': '七中一',
            'data': [99]
          }, {
            'name': '八中一',
            'data': [100]
          }, {
            'name': '九中一',
            'data': [101]
          }, {
            'name': '十中一',
            'data': [102]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '五中一', 'playtype': [97], 'tableDta': [] },
            { 'name': '六中一', 'playtype': [98], 'tableDta': [] },
            { 'name': '七中一', 'playtype': [99], 'tableDta': [] },
            { 'name': '八中一', 'playtype': [100], 'tableDta': [] },
            { 'name': '九中一', 'playtype': [101], 'tableDta': [] },
            { 'name': '十中一', 'playtype': [102], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [97, 97, 99, 100, 101, 102]
        },
        {
          'group_name': '任中',
          'total_num': [{
            'PlayType': [97],
            'name': '五中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [98],
            'name': '六中一',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [103],
            'name': '一粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [104],
            'name': '二粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [105],
            'name': '三粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [106],
            'name': '四粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [107],
            'name': '五粒任中',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '一粒任中',
            'data': [103]
          }, {
            'name': '二粒任中',
            'data': [104]
          }, {
            'name': '三粒任中',
            'data': [105]
          }, {
            'name': '四粒任中',
            'data': [106]
          }, {
            'name': '五粒任中',
            'data': [107]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '一粒任中', 'playtype': [103], 'tableDta': [] },
            { 'name': '二粒任中', 'playtype': [104], 'tableDta': [] },
            { 'name': '三粒任中', 'playtype': [105], 'tableDta': [] },
            { 'name': '四粒任中', 'playtype': [106], 'tableDta': [] },
            { 'name': '五粒任中', 'playtype': [107], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [103, 104, 105, 106, 107]
        },
        {
          'group_name': '七码',
          'total_num': [{
            'PlayType': [45, 46, 47, 48, 49, 50, 51, 52],
            'name': '七码',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '七码',
            'data': [45, 46, 47, 48, 49, 50, 51, 52]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '七码', 'playtype': [45, 46, 47, 48, 49, 50, 51, 52], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [45, 46, 47, 48, 49, 50, 51, 52]
        },
        {
          'group_name': '七色波',
          'total_num': [{
            'PlayType': [53, 54, 55],
            'name': '七色波',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [{
            'name': '七色波',
            'data': [53, 54, 55]
          }],
          'alignModel': 4,
          'tableNum': [
            { 'name': '七色波', 'playtype': [53, 54, 55], 'tableDta': [] }
          ],
          'PlayZt': 0,
          'opendata': [53, 54, 55]
        },
        {
          'group_name': '合肖',
          'total_num': [{
            'PlayType': [62],
            'name': '二肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [63],
            'name': '三肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [64],
            'name': '四肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [65],
            'name': '五肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [66],
            'name': '六肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [67],
            'name': '七肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [68],
            'name': '八肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [69],
            'name': '九肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [70],
            'name': '十肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }, {
            'PlayType': [71],
            'name': '十一肖',
            'PlayZt': 0,
            'BetMoney': 0,
            'Ty': 0,
            'Zcje': 0,
            'Zcty': 0
          }],
          'play_type': [
            { 'name': '二肖', 'data': [62] },
            { 'name': '三肖', 'data': [63] },
            { 'name': '四肖', 'data': [64] },
            { 'name': '五肖', 'data': [65] },
            { 'name': '六肖', 'data': [66] },
            { 'name': '七肖', 'data': [67] },
            { 'name': '八肖', 'data': [68] },
            { 'name': '九肖', 'data': [69] },
            { 'name': '十肖', 'data': [70] },
            { 'name': '十一肖', 'data': [71] },
          ],
          'alignModel': 4,
          'tableNum': [
            { 'name': '二肖', 'playtype': [62], 'tableDta': [] },
            { 'name': '三肖', 'playtype': [63], 'tableDta': [] },
            { 'name': '四肖', 'playtype': [64], 'tableDta': [] },
            { 'name': '五肖', 'playtype': [65], 'tableDta': [] },
            { 'name': '六肖', 'playtype': [66], 'tableDta': [] },
            { 'name': '七肖', 'playtype': [67], 'tableDta': [] },
            { 'name': '八肖', 'playtype': [68], 'tableDta': [] },
            { 'name': '九肖', 'playtype': [69], 'tableDta': [] },
            { 'name': '十肖', 'playtype': [70], 'tableDta': [] },
            { 'name': '十一肖', 'playtype': [71], 'tableDta': [] },
          ],
          'PlayZt': 0,
          'opendata': [62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
        }
      ]
    },
    handleTotal(data) {
      if (data.length == 0) {
        this.resetPlay_Grpup_data()
      }
      var All = {
        'BetMoney': 0,
        'Ty': 0,
        'Zcje': 0,
        'Zcty': 0
      }
      for (let key1 in this.Play_Grpup_data) {
        var a = this.Play_Grpup_data[key1].total_num
        for (let key2 in a) {
          var b = data.filter(item => a[key2].PlayType.includes(item.PlayType) && a[key2].PlayZt == item.PlayZt)
          if (b.length > 0) {
            var BetMoney = b.reduce((sum, item) => sum + parseFloat(item['BetMoney'] || 0), 0)
            var Ty = b.reduce((sum, item) => sum + parseFloat(item['Ty'] || 0), 0)
            var Zcje = b.reduce((sum, item) => sum + parseFloat(item['Zcje'] || 0), 0)
            var Zcty = b.reduce((sum, item) => sum + parseFloat(item['Zcty'] || 0), 0)
            if (key1 > 0) {
              All.BetMoney += BetMoney
              All.Ty += Ty
              All.Zcje += Zcje
              All.Zcty += Zcty
            }
            if (a[key2].BetMoney != BetMoney || a[key2].Ty != Ty || a[key2].Zcje != Zcje || a[key2].Zcty != Zcty) {
              // this.animation[key1] = key1 == this.default_Group ? 'topbbs' : 'topbb'
              if (a[key2].BetMoney != BetMoney) { a[key2].BetMoney = BetMoney }
              if (a[key2].Ty != Ty) { a[key2].Ty = Ty }
              if (a[key2].Zcje != Zcje) { a[key2].Zcje = Zcje }
              if (a[key2].Zcty != Zcje) { a[key2].Zcty = Zcty }
            }
          }

        }
      }
      if (JSON.stringify(this.All_total) != JSON.stringify(All)) {
        this.All_total = All
      }
      // setTimeout(() => { this.animation = []; }, 5000);
    },
    handleTotalLong(data, num) {
      if (num == -1) {
        return this.acq ? data.reduce((sum, item) => sum + parseFloat(item['Zcje'] || 0), 0) : data.reduce((sum, item) => sum + parseFloat(item['BetMoney'] || 0), 0)
      } else {
        var a = data.filter(item => item.PlayType.length == num)
        if (a.length > 0) {
          return this.acq ? a.reduce((sum, item) => sum + parseFloat(item['Zcje'] || 0), 0) : a.reduce((sum, item) => sum + parseFloat(item['BetMoney'] || 0), 0)
        } else {
          return 0
        }
      }

    },
    gettotal_num() {
      return this.Play_Grpup_data[this.default_Group].total_num.filter(item => parseInt(item.PlayZt) == parseInt(this.default_data.PlayZt))
    },
    playtypechan(index) {
      this.Play_Group_Check(this.default_Group, index, this.Play_Grpup_data[this.default_Group])
    },
    getpankey() {
      var a = []
      for (let key in this.Play_ABC) {
        if (this.Play_ABC[key]) { a.push(key) }
      }
      return a
    },
    GetnumberClass(row) {
      if (row.NumberBs == 66) { return 'color_red' }
      if (row.NumberBs == 67) { return 'color_blue' }
      if (row.NumberBs == 68) { return 'color_green' }
    },
    GetnumberStyle(row) {
      if (row.NumberItem == 66 || [90, 91, 92, 93, 102, 103, 104, 105, 177].includes(row.NumberItem)) {
        return { 'color': 'red' }
      }
      if (row.NumberItem == 67 || [94, 95, 96, 97, 106, 107, 108, 109, 178].includes(row.NumberItem)) {
        return { 'color': 'blue' }
      }
      if (row.NumberItem == 68 || [98, 99, 100, 101, 110, 111, 112, 113, 179].includes(row.NumberItem)) {
        return { 'color': 'green' }
      }
    },
    GetnumberStyleBh(row) {
      if (this.default_Group < 5 || this.default_Group == 14) {
        var a = row.NumberItem[0]
        var data = this.AllTableData.filter(item => item.NumberItem == a)
        if (data.length > 0) {
          if (data[0].NumberItem == 66 || data[0].NumberBs == 66 || [90, 91, 92, 93, 102, 103, 104, 105, 177].includes(data[0].NumberItem)) {
            return { 'color': 'red' }
          }
          if (data[0].NumberItem == 67 || data[0].NumberBs == 67 || [94, 95, 96, 97, 106, 107, 108, 109, 178].includes(data[0].NumberItem)) {
            return { 'color': 'blue' }
          }
          if (data[0].NumberItem == 68 || data[0].NumberBs == 68 || [98, 99, 100, 101, 110, 111, 112, 113, 179].includes(data[0].NumberItem)) {
            return { 'color': 'green' }
          }
        }
      }
    },
    GetTableStyle() {
      if (this.Play_Grpup_data[this.default_Group].alignModel == 3) {
        return { 'margin-left': '-1px' }
      }
      if (this.Play_Grpup_data[this.default_Group].alignModel == 2) {
        return { 'margin-bottom': '4px' }
      }
    },
    bh(type, data, index, name) {
      this.bhname = name
      this.ShowListData = []
      this.bhtype = type
      this.BhAb = []
      this.ABC = []
      this.bhAbc = 'A'
      this.BhBetMoney = ''
      if (this.default_Group < 4) {
        this.BhAb = this.BhAbData[this.default_Group].data[0].playtype
      }
      var a = JSON.parse(JSON.stringify(data))
      var LotteryId = a[0].LotteryId
      var PlayGroups = []
      if (type == 1) {
        a = a[index]
        var NumberItem = []
        var PlayNumber = []
        if (a.NumberItemstr && a.NumberItemstr != '') {
          var b = a.NumberItemstr.split(',')
          for (let key in b) {
            NumberItem.push(parseInt(b[key]))
          }
          var c = a.PlayNumber.split(',')
          for (let key in c) {
            PlayNumber.push(c[key])
          }
        } else {
          NumberItem.push(a.NumberItem)
          PlayNumber.push(a.PlayNumber)
        }

        var PlayGroup = parseInt(a.PlayGroup)
        if (this.default_Group < 4) {
          var PlayType = [3, 4, 7, 10, 11].includes(parseInt(a.PlayType)) ? parseInt(a.PlayType) : this.BhAb[0]
        } else {
          var PlayType = parseInt(a.PlayType)
        }
        if (!PlayGroups.includes(PlayGroup)) {
          PlayGroups.push(PlayGroup)
        }
        var t = {
          'PlayGroup': PlayGroup,
          'PlayType': PlayType,
          'BetMoney': '',
          'KMoney': this.default_Group == 0 ? parseFloat(a.ZcBetMoneyTm) : parseFloat(a.ZcBetMoney),
          'NumberItem': NumberItem,
          'PlayNumber': PlayNumber,
          'Rate1': 0,
          'Rate2': 0
        }
        this.ShowListData.push(t)

      } else {
        for (var i = 0; i <= index; i++) {
          var NumberItem = []
          var PlayNumber = []
          if (a[i].NumberItemstr && a[i].NumberItemstr != '') {
            var b = a[i].NumberItemstr.split(',')
            for (let key in b) {
              NumberItem.push(parseInt(b[key]))
            }
            var c = a[i].PlayNumber.split(',')
            for (let key in c) {
              PlayNumber.push(c[key])
            }
          } else {
            NumberItem.push(a[i].NumberItem)
            PlayNumber.push(a[i].PlayNumber)
          }
          var PlayGroup = parseInt(a[i].PlayGroup)
          if (this.default_Group < 4) {
            var PlayType = [3, 4, 7, 10, 11].includes(parseInt(a[i].PlayType)) ? parseInt(a[i].PlayType) : this.BhAb[0]
          } else {
            var PlayType = parseInt(a[i].PlayType)
          }
          if (!PlayGroups.includes(PlayGroup)) {
            PlayGroups.push(PlayGroup)
          }
          var t = {
            'PlayGroup': PlayGroup,
            'PlayType': PlayType,
            'BetMoney': '',
            'KMoney': this.default_Group == 0 ? parseFloat(a[i].ZcBetMoneyTm) : parseFloat(a[i].ZcBetMoney),
            'NumberItem': NumberItem,
            'PlayNumber': PlayNumber,
            'Rate1': 0,
            'Rate2': 0,
            'Back': 0
          }
          this.ShowListData.push(t)
        }
      }
      if (this.default_Group < 4) {
        var PlayTypes = this.BhAb
      } else {
        var PlayTypes = this.Play_Grpup_data[this.default_Group].opendata
      }
      this.bhPostData = {
        'LotteryId': LotteryId,
        'Abc': this.bhAbc,
        'PlayGroup': PlayGroups,
        'PlayType': PlayTypes,
        'PlayZt': this.default_data.PlayZt,
        'NumberItem': JSON.parse(JSON.stringify(this.ShowListData)),
        'Back': 0,
        'Account': this.bhaccount
      }
      this.GetBhData()
      this.bhdia = true

    },
    changeBhAb() {
      if (this.default_Group < 4) {
        for (let key in this.ShowListData) {
          if (![3, 4, 7, 10, 11].includes(parseInt(this.ShowListData[key].PlayType))) {
            this.ShowListData[key].PlayType = this.BhAb[0]
            this.ShowListData[key].PlayGroup = this.BhAb[0]
            this.ShowListData[key].BetMoney = ''
            this.ShowListData[key].Rate1 = 0
            this.ShowListData[key].Rate2 = 0
            this.ShowListData[key].Back = 0
          }
        }
        this.bhPostData.PlayType = this.BhAb
        this.bhPostData.PlayGroup = this.BhAb
      }
      this.bhPostData.Abc = this.bhAbc
      this.bhPostData.Account = this.bhaccount
      this.bhPostData.NumberItem = JSON.parse(JSON.stringify(this.ShowListData))
      this.GetBhData()
    },
    GetBhData() {
      if (this.bhPostData.Abc == '') {
        this.$message.error('没有可补盘口')
        return
      }
      this.LoadingBh = true
      this.ABC = []
      this.$request.postData('/jiankong/getodd', this.bhPostData).then(response => {
        if (response.code == 200) {
          this.ShowListData = response.data.data.NumberItem
          if (this.bhaccount == '') {
            this.bhaccount = response.data.bhuser[0].account
          }
          if (this.bhPostData.Account == '') {
            this.bhPostData.Account = this.bhaccount
          }
          this.bhuser = response.data.bhuser
          for (let key in response.data.pan) {
            if (response.data.pan[key]) {
              this.ABC.push(key)
            }
          }
          if (!this.ABC.includes(this.bhAbc)) {
            if (this.ABC.length > 0) {
              this.bhAbc = this.ABC[0]
              this.bhPostData.Abc = this.ABC[0]
            } else {
              this.bhAbc = ''
              this.bhPostData.Abc = ''
            }
          }
          this.bhPostData.NumberItem = JSON.parse(JSON.stringify(this.ShowListData))
        } else {
          this.$message.error(response.msg);
        }
        this.LoadingBh = false
      }).catch(error => {
        this.LoadingBh = false
        this.$message.error('网络请求错误');
      });
    },
    inputBhBetMoney() {
      var a = parseInt(this.BhBetMoney)
      if (a > 0) {
        for (let key in this.ShowListData) {
          if (parseInt(this.ShowListData[key].KMoney) > a) {
            this.ShowListData[key].BetMoney = a
          } else {
            this.ShowListData[key].BetMoney = parseInt(this.ShowListData[key].KMoney)
          }
        }
      }
    },
    changeBhBetMoney(index) {
      if (parseInt(this.BhBetMoney) > 0 && this.ShowListData[index].BetMoney == '') {
        if (parseInt(this.ShowListData[index].KMoney) >= parseInt(this.BhBetMoney)) {
          this.ShowListData[index].BetMoney = parseInt(this.BhBetMoney)
        } else {
          this.ShowListData[index].BetMoney = parseInt(this.ShowListData[index].KMoney)
        }
      }
    },
    inputres() {
      this.BhBetMoney = ''
      for (let key in this.ShowListData) {
        this.ShowListData[key].BetMoney = ''
      }
    },
    OpenBhSubmit() {
      var ShowListDatas = []
      var html = '<div class="maxboxs"><table border="1" style="max-height:500px;overflow:scroll" class="el-form-table">'
      html += '<tr class="trheader"><td>补货号码</td><td>盘口</td><td>赔率</td><td>退水</td><td>补货金额</td></tr>'
      for (let key in this.ShowListData) {
        if (parseInt(this.ShowListData[key].BetMoney) > 0) {
          var Rate = this.ShowListData[key].Rate2 > 0 ? this.ShowListData[key].Rate1 + '/' + this.ShowListData[key].Rate2 : this.ShowListData[key].Rate1
          html += '<tr><td>' + this.ShowListData[key].PlayNumber.join(',') + '</td><td>' + this.bhPostData.Abc + '</td><td class="Rate">' + Rate + '</td><td>' + this.ShowListData[key].Back + '</td><td>' + this.ShowListData[key].BetMoney + '</td></tr>'
          this.ShowListData[key].BetMoney = parseInt(this.ShowListData[key].BetMoney)
          ShowListDatas.push(this.ShowListData[key])
        }
      }
      html += '</table><div>'
      var bhPostDatas = JSON.parse(JSON.stringify(this.bhPostData))
      bhPostDatas.NumberItem = ShowListDatas
      if (ShowListDatas.length > 0) {
        this.$alert(html, '请确认补货信息', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确认补货',
          closeOnPressEscape: true,
          center: true,
          showCancelButton: true,
          customClass: 'MessageBoxs'
        }).then(() => {

          this.SubmitBh(bhPostDatas)
        }).catch(() => {

        });
      } else {
        this.$message.error('请设置补货数据');
      }
    },
    SubmitBh(bhPostDatas) {
      if (this.IsPostBhBet) {
        return
      }
      this.LoadingBh = true
      this.IsPostBhBet = true
      this.$request.postData('/jiankong/zjbuhuo', bhPostDatas).then(response => {
        if (response.code == 200) {
          this.getdata()
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.bhdia = false
        } else {
          this.$message.error(response.msg);
        }
        this.IsPostBhBet = false
        this.LoadingBh = false
      }).catch(error => {
        this.IsPostBhBet = false
        this.LoadingBh = false
        this.$message.error('网络请求错误');
      });

    }
  }

}
</script>
<style scoped>
/* Existing styles... */

/* Styles for the topheii element */
.game_herad_mueu {
  width: 100%;
  background-color: #eef0f8;
  overflow: hidden;
}

.game-tab-container {
  display: flex;
  overflow: hidden;
}

.game-tab {
  min-width: 120px;
  height: 100%;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.game-tab:hover {
  background-color: transparent;
}

.game-tab.active {
  background-color: transparent;
  border-bottom: 2px solid #1e90ff;
  font-weight: bold;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px 15px;
}

.tab-name {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tab-count {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.game_info_r_top {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #f6f6f6;
  border-top: 1px solid #e0e0e0;
}

.game_info_r_top_result_box {
  display: flex;
  align-items: center;
}

.game_info_r_qishu {
  margin-right: 10px;
  font-weight: bold;
}

.game_info_r_result {
  display: flex;
  align-items: center;
}

.result_num {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
  font-weight: bold;
  /* color: white; */
}

.ball_red {
  background-color: #ff4444;
}

.ball_blue {
  background-color: #3399ff;
}

.ball_green {
  background-color: #33cc33;
}

.button-group-tabs {
  display: flex;
  overflow-x: auto;
  width: 100%;
}

.button-group-tabs .el-button-group {
  display: flex;
  flex-wrap: nowrap;
}

.tab-button {
  border-radius: 20px !important;
  margin: 0 3px !important;
  padding: 8px 15px !important;
  background-color: #d7def2;
  color: #333333 !important;
  border: none !important;
  height: 32px !important;
  line-height: 1 !important;
  font-size: 13px !important;
}

.tab-button.tab-active {
  background-color: #0088ff !important;
  color: #ffffff !important;
}

/* 覆盖element-ui默认样式 */
.el-button-group .el-button {
  margin-left: 3px !important;
  margin-right: 3px !important;
}

.el-button-group .el-button:first-child,
.el-button-group .el-button:last-child {
  border-radius: 20px !important;
}
</style>