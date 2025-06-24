<template>
  <div class="main-boxdiv" v-loading="loading">
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
    <div class="game_herad">
      <div class="game_herad_tab">
        <el-button-group class="button-group-tabs">
          <el-button :class="{ 'tab-active': index === default_Group }" v-for="(items, index) in Play_Grpup_data"
            :key="index" @click="QuickChooseDatas = [], Play_Group_Check(index, 0, items)" class="tab-button">
            {{ items.group_name }}
            <!-- <template v-if="index < 3">
              <span>{{ parseInt(handleTotalLong(items.total_num, 2)) }}</span>
              <span>{{ parseInt(handleTotalLong(items.total_num, 1)) }}</span>
            </template>
            <template v-else>
              <span>{{ parseInt(handleTotalLong(items.total_num, -1)) }}</span>
            </template> -->
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="psc_odds_box" v-loading="Loadingodds">
      <div class="psc_odds_box_top titlem">
        <div class="divW" v-if="Play_Grpup_data[default_Group].play_type.length > 1">
          项目
        </div>
        <div v-if="Play_Grpup_data[default_Group].play_type.length > 1">
          <span class="psc_odds_box_topbtn" v-for="(items, index) in Play_Grpup_data[default_Group].play_type"
            :class="default_PlayType == index ? 'isActive2' : ''" @click="playtypechan(index)">{{ items.name }}</span>
        </div>
        <div class="divW" v-if="Play_Grpup_data[default_Group].PlayZt">
          玩法
        </div>
        <div v-if="Play_Grpup_data[default_Group].PlayZt">
          <span class="psc_odds_box_topbtn" v-for="items in Play_Grpup_data[default_Group].PlayZt"
            :class="default_data.PlayZt == items ? 'isActive1' : ''"
            @click="Play_Group_Check(default_Group, default_PlayType, Play_Grpup_data[default_Group], items)">{{
              Play_Grpup_data[default_Group].PlayZt_txt }}{{ items }}</span>
        </div>
        <div>全盘操作</div>
        <div>
          <span class="psc_odds_box_topbtn" v-if="default_Group == 0" :class="IsOpenGame.tm ? 'isActive1' : ''"
            @click="upopenstate(true, [1, 2, 3, 4])">
            特码收单
          </span>
          <span class="psc_odds_box_topbtn" v-if="default_Group == 0" :class="IsOpenGame.ftm ? 'isActive1' : ''"
            @click="upopenstate(true, [])">
            非特码收单
          </span>
          <span class="psc_odds_box_topbtn" v-if="default_Group == 0" :class="!IsOpenGame.tm ? 'isActive1' : ''"
            @click="upopenstate(false, [1, 2, 3, 4])">
            特码封单
          </span>
          <span class="psc_odds_box_topbtn" v-if="default_Group == 0" :class="!IsOpenGame.ftm ? 'isActive1' : ''"
            @click="upopenstate(false, [])">
            非特码封单
          </span>
          <span class="psc_odds_box_topbtn" @click="initializationOdds()">
            还原赔率
          </span>
        </div>
        <div class="game_info_r_top"
          v-if="home_data.result && home_data.result.Issue && home_data.result != '' && UserInfo && UserInfo.items">
          <div class="game_info_r_top_result_box" v-if="isshowresult">
            <div class="game_info_r_qishu">
              <span>{{ home_data.result.Issue }} 期</span>
            </div>
            <div class="game_info_r_result">
              <span v-for="item in 6">
                <div class="result_num"
                  :class="UserInfo.items[home_data.result['Ball' + item]].NumberBs == 66 ? 'ball_red' : UserInfo.items[home_data.result['Ball' + item]].NumberBs == 67 ? 'ball_blue' : UserInfo.items[home_data.result['Ball' + item]].NumberBs == 68 ? 'ball_green' : ''">
                  <span>{{ UserInfo.items[home_data.result['Ball' + item]].PlayNumber }}</span>
                </div>
                <div>{{ sxData[home_data.result['NumberSx' + item]] }}</div>
              </span>
              <span>
                <div>+</div>
              </span>
              <span>
                <div class="result_num"
                  :class="UserInfo.items[home_data.result['Ball7']].NumberBs == 66 ? 'ball_red' : UserInfo.items[home_data.result['Ball7']].NumberBs == 67 ? 'ball_blue' : UserInfo.items[home_data.result['Ball7']].NumberBs == 68 ? 'ball_green' : ''">
                  <span>{{ UserInfo.items[home_data.result['Ball7']].PlayNumber }}</span>
                </div>
                <div>{{ sxData[home_data.result['NumberSx7']] }}</div>
              </span>
            </div>
          </div>
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
      <div class="psc_odds_box_top">
        <div>
          <span>类型</span>
          <span>
            <select v-model="acq">
              <option label="实货" :value="true" />
              <option label="虚货" :value="false" />
            </select>
          </span>
        </div>
        <div>
          <span>盘口</span>
          <span>
            <select v-model="default_data.Abc" @change="handleChangeABC">
              <option v-for="items in getpankey(Play_ABC)" :label="items + '盘'" :value="items" />
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
        <div>
          <span>调赔</span>
          <span>
            <select v-if="![3, 4, 5, 7, 8, 12, 13, 14].includes(default_Group)" v-model="selectkey">
              <option label="全部" :value="parseInt(-1)" />
              <option label="两面" v-if="default_Group < 4" :value="parseInt(3)" />
              <option label="波色" v-if="[0, 2].includes(default_Group)" :value="parseInt(4)" />
              <option label="1~49" v-if="default_Group < 4" :value="parseInt(5)" />
              <option v-for="item in QuickChooseData" :label="item.PlayNumber" :value="parseInt(item.Id)" />
            </select>
            <select v-else v-model="selectkey">
              <option label="全部" :value="parseInt(-1)" />
              <option v-for="(item, index) in QuickChooseDatas" :label="item.name" :value="parseInt(index)" />
            </select>
          </span>
          <span>变化值</span>
          <span>
            <select v-model="setoddsval">
              <option label="请选择" value="" />
              <option v-for="items in 100" :label="items / 100" :value="items / 100" />
            </select>
          </span>
          <input type="text" v-model="setoddsval" class="psc_odds_box_top_inpt" />
          <span class="psc_odds_box_topbtn" @click="setoddschanges(0)">升</span>
          <span class="psc_odds_box_topbtn" @click="setoddschanges(1)">降</span>
          <span style="display: none;" class="psc_odds_box_topbtn"
            @click="OpenChangeBox(batchsetodds = true, Odds_data)">
            批量控赔
          </span>
          <span style="display: none;" class="psc_odds_box_topbtn">
            锁赔
          </span>
        </div>
        <div style="border-right:0px ;"
          v-if="Play_Grpup_data[default_Group].play_type.length > 1 && default_Group != 0">
          <span>{{ Play_Grpup_data[default_Group].group_name }}收封单</span>
          <span class="psc_odds_box_topbtn" :class="Play_Grpup_data[default_Group].openstate ? 'isActive2' : ''"
            @click="upopenstate(true, Play_Grpup_data[default_Group].opendata)">收单</span>
          <span class="psc_odds_box_topbtn" :class="!Play_Grpup_data[default_Group].openstate ? 'isActive2' : ''"
            @click="upopenstate(false, Play_Grpup_data[default_Group].opendata)">封单</span>
        </div>
        <div style="border-right:0px ;">
          <span>单盘收封单</span>
          <span class="psc_odds_box_topbtn" :class="Play_Grpup_data[default_Group].openstate ? 'isActive2' : ''"
            @click="upopenstate(true, default_data.PlayType)"><span
              v-if="Play_Grpup_data[default_Group].play_type.length > 1">{{
                Play_Grpup_data[default_Group].play_type[default_PlayType].name }}</span>收单</span>
          <span class="psc_odds_box_topbtn" :class="!Play_Grpup_data[default_Group].openstate ? 'isActive2' : ''"
            @click="upopenstate(false, default_data.PlayType)"><span
              v-if="Play_Grpup_data[default_Group].play_type.length > 1">{{
                Play_Grpup_data[default_Group].play_type[default_PlayType].name }}</span>封单</span>
        </div>
      </div>
      <div class="psc_odds_box_list">
        <el-table :header-cell-class-name="'trheader'"
          v-for="(items, key, index) in Play_Grpup_data[default_Group].tableNum" :key="key" border
          :data="items.tableDta" style="margin-left: -1px;"
          :style="{ 'margin-right': index == Object.keys(Play_Grpup_data[default_Group].tableNum).length - 1 ? '-1px' : '' }">
          <el-table-column :label="key">
            <template #header>
              <div class="tableheader">
                <span>{{ key }}</span>
                <el-popconfirm v-if="Play_Grpup_data[default_Group].openbtn"
                  :title="'确定将' + key + (items.openstate ? '封单' : '收单') + '?'" confirm-button-type="danger"
                  @confirm="upopenstate(!items.openstate, items.playtype)" confirm-button-text="确认"
                  cancel-button-text="取消">
                  <template #reference>
                    <span class="psc_odds_box_topbtn" :class="items.openstate ? 'isActive2' : ''">
                      <span v-if="items.openstate">收单</span>
                      <span v-else>封单</span>
                    </span>
                  </template>
                </el-popconfirm>
              </div>
            </template>
            <template #default="{ row }">
              <div class="tableheader" :style="{ 'background': row.State ? '#e8e6e6' : '' }">
                <div style="width: 50%;max-width:24%;overflow: hidden;text-align: left;">
                  <div class="play_text ball_n"
                    :class="row.NumberBs == 66 ? 'ball_red' : row.NumberBs == 67 ? 'ball_blue' : row.NumberBs == 68 ? 'ball_green' : ''"
                    :style="{ 'color': row.NumberItem == 66 || [90, 91, 92, 93, 102, 103, 104, 105, 177].includes(row.NumberItem) ? 'red' : row.NumberItem == 67 || [94, 95, 96, 97, 106, 107, 108, 109, 178].includes(row.NumberItem) ? 'blue' : row.NumberItem == 68 || [98, 99, 100, 101, 110, 111, 112, 113, 179].includes(row.NumberItem) ? 'green' : '' }">
                    <span class="text_nowrap" :title="row.PlayNumber">{{ row.PlayNumber }}</span>
                  </div>
                </div>
                <div class="setRate">
                  <span class="up" @click="setoddschange([row], 0)">+</span>
                  <span @click="openSetOdds(row)"
                    :title="Play_Grpup_data[default_Group].play_type[default_PlayType].secondrate ? row.Rate1 + '/' + row.Rate2 : row.Rate1"
                    class="Rate text_nowrap">{{ row.Rate1 }}<span
                      v-if="Play_Grpup_data[default_Group].play_type[default_PlayType].secondrate">/{{ row.Rate2
                      }}</span></span>
                  <span class="up" @click="setoddschange([row], 1)">-</span>
                </div>
                <div :class="default_Group == 14 ? 'total_box1' : 'total_box'">
                  <span :title="acq ? row.ZcBetMoney : row.BetMoney">{{ parseInt(acq ?
                    row.ZcBetMoney : row.BetMoney) }}</span>
                  <span v-if="default_Group == 0 || default_Group == 2 || default_Group == 3"
                    :style="{ 'color': acq ? row.Maxyk < 0 ? 'red' : '' : row.XuMaxyk < 0 ? 'red' : '' }"
                    :title="acq ? row.Maxyk : row.XuMaxyk">{{ parseInt(acq ? row.Maxyk : row.XuMaxyk) }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="oddssetdialog" title="" style="padding-bottom:25px !important" width="500">
      <div class="titlem bodynav dialog-padding">
        赔率设置
      </div>
      <el-form ref="oddsset" :model="oddssetdata" label-width="80px" class="custom-form-style">
        <div class="form-card">
          <el-form-item label="号码">
            <div class="play_text ball_n" style="white-space: nowrap; font-weight:600;"
              :class="oddssetdata.NumberBs == 66 ? 'ball_red' : oddssetdata.NumberBs == 67 ? 'ball_blue' : oddssetdata.NumberBs == 68 ? 'ball_green' : ''"
              :style="{ 'color': oddssetdata.NumberItem == 66 || [90, 91, 92, 93, 102, 103, 104, 105, 177].includes(oddssetdata.NumberItem) ? 'red' : oddssetdata.NumberItem == 67 || [94, 95, 96, 97, 106, 107, 108, 109, 178].includes(oddssetdata.NumberItem) ? 'blue' : oddssetdata.NumberItem == 68 || [98, 99, 100, 101, 110, 111, 112, 113, 179].includes(oddssetdata.NumberItem) ? 'green' : '' }">
              {{ oddssetdata.PlayNumber }}
            </div>
          </el-form-item>
          
          <el-form-item label="赔率">
            <el-input style="width:120px;" v-model="oddssetdata.Rate1" placeholder="请输入赔率"></el-input>
          </el-form-item>
          
          <div class="form-footer">
            <el-button type="primary" class="submit-btn" @click="oddssetPost()">确认修改</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue';
export default {
  props: {
    UserInfo: {
      type: Object
    },
  },
  data() {
    return {
      loading: false,
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
      home_data: {
        'game_index': 0,
        'GameList': [],
        'result': ''
      },
      currentTime: 10,
      intervalId: null,
      selectkey: -1,
      setoddsval: 0.02,
      batchsetodds: false,
      checkAll: false,
      isIndeterminate: true,
      oddschacktab: ['两面', '号码', '单', '双', '大', '小', '大单', '大双', '小单', '小双', '合单', '合双', '尾大', '尾小', '家禽', '野兽', '鼠', '牛', '虎', '兔', '龙', '马', '蛇', '羊', '猴', '鸡', '狗', '猪', '红波', '蓝波', '绿波', '红大', '红小', '红单', '红双', '蓝大', '蓝小', '蓝单', '蓝双', '绿大', '绿小', '绿单', '绿双'],
      oddschacktab1: [{ 'name': '两面', NumberItem: [] }, { 'name': '号码', NumberItem: [] }, { 'name': '单', NumberItem: [] }, { 'name': '双', NumberItem: [] }, { 'name': '大', NumberItem: [] }],
      oddschacktabon: [],
      heightRe: 0,
      withRe: 0,
      GameList: [],
      QuickChooseDatakey: ['NumberDs', 'NumberDx', 'NumberHsds', 'NumberHsdx', 'NumberJqys', 'NumberSx', 'NumberWs', 'NumberWsdx', 'NumberWx', 'NumberBbb', 'NumberBbds', 'NumberBbdx', 'NumberBs', 'NumberBt', 'NumberTs'],
      QuickChooseData: [],
      QuickChooseDatas: [],
      isshowresult: true,
      sxData: {
        '69': '鼠',
        '70': '牛',
        '71': '虎',
        '72': '兔',
        '73': '龙',
        '74': '蛇',
        '75': '马',
        '76': '羊',
        '77': '猴',
        '78': '鸡',
        '79': '狗',
        '80': '猪',
      },
      Play_Grpup_data: [
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
            'name': '特A',
            'data': [1, 3, 4]
          }, {
            'name': '特B',
            'data': [2, 3, 4]
          }],
          'alignModel': 2,
          'tableNum': {
            '1~10号码': {
              'openstate': false,
              'playtype': [0, 9],
              tableDta: []
            },
            '11~20号码': {
              'openstate': false,
              'playtype': [10, 19],
              tableDta: []
            },
            '21~30号码': {
              'openstate': false,
              'playtype': [20, 29],
              tableDta: []
            },
            '31~40号码': {
              'openstate': false,
              'playtype': [30, 39],
              tableDta: []
            },
            '41~49号码': {
              'openstate': false,
              'playtype': [40, 48],
              tableDta: []
            },
            '两面': {
              'openstate': false,
              'playtype': [49, 60],
              tableDta: []
            },
            '波色': {
              'openstate': false,
              'playtype': [61, 63],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [1, 2, 3, 4],
          'openstate': false
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
            'name': '正码A',
            'data': [5, 7]
          }, {
            'name': '正码B',
            'data': [6, 7]
          }],
          'alignModel': 2,
          'tableNum': {
            '1~10': {
              'openstate': false,
              'playtype': [0, 9],
              tableDta: []
            },
            '11~20': {
              'openstate': false,
              'playtype': [10, 19],
              tableDta: []
            },
            '21~30': {
              'openstate': false,
              'playtype': [20, 29],
              tableDta: []
            },
            '31~40': {
              'openstate': false,
              'playtype': [30, 39],
              tableDta: []
            },
            '41~49': {
              'openstate': false,
              'playtype': [40, 48],
              tableDta: []
            },
            '两面': {
              'openstate': false,
              'playtype': [49, 52],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [5, 6, 7],
          'openstate': false
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
            'name': '正特A',
            'data': [8, 10, 11]
          }, {
            'name': '正特B',
            'data': [9, 10, 11]
          }],
          'alignModel': 2,
          'tableNum': {
            '1~10': {
              'openstate': false,
              'playtype': [0, 9],
              tableDta: []
            },
            '11~20': {
              'openstate': false,
              'playtype': [10, 19],
              tableDta: []
            },
            '21~30': {
              'openstate': false,
              'playtype': [20, 29],
              tableDta: []
            },
            '31~40': {
              'openstate': false,
              'playtype': [30, 39],
              tableDta: []
            },
            '41~49': {
              'openstate': false,
              'playtype': [40, 48],
              tableDta: []
            },
            '两面': {
              'openstate': false,
              'playtype': [49, 60],
              tableDta: []
            },
            '波色': {
              'openstate': false,
              'playtype': [61, 63],
              tableDta: []
            }
          },
          'PlayZt_txt': '正',
          'PlayZt': 6,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [8, 9, 10, 11],
          'openstate': false
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
          'alignModel': 1,
          'tableNum': {
            '特肖': {
              'openstate': false,
              'playtype': [12],
              tableDta: []
            },
            '半特': {
              'openstate': false,
              'playtype': [13],
              tableDta: []
            },
            '特头数': {
              'openstate': false,
              'playtype': [14],
              tableDta: []
            },
            '特尾数': {
              'openstate': false,
              'playtype': [15],
              tableDta: []
            },
            '半波': {
              'openstate': false,
              'playtype': [16, 17, 18, 19],
              tableDta: []
            },
            '半半波': {
              'openstate': false,
              'playtype': [20, 21, 22],
              tableDta: []
            },
            '五行': {
              'openstate': false,
              'playtype': [23],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': true,
          'opendata': [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
          'openstate': false
        },
        // {'group_name':'生肖项','total_num':[{'PlayGroup':[19,20,21],'BetMoney':0,'Ty':0,'Zcje':0,'Zcty':0}],'play_type':[{'name':'生肖项','data':[24,25,26,27,28,29,30,31,32,33,34]}],'alignModel':1,'tableNum':{'一肖中':{'openstate':false,'playtype':[24],tableDta:[]},'一肖不中':{'openstate':false,'playtype':[25],tableDta:[]},'正肖':{'openstate':false,'playtype':[26],tableDta:[]},'生肖量':{'openstate':false,'playtype':[27,28,29,30,31,32,33,34],tableDta:[]}},'PlayZt_txt':'','PlayZt':0,'oddsdata':[],'oddsitems':[],'openbtn':true,'opendata':[24,25,26,27,28,29,30,31,32,33,34],'openstate':false},
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
          'alignModel': 1,
          'tableNum': {
            '一肖中': {
              'openstate': false,
              'playtype': [24],
              tableDta: []
            },
            '一肖不中': {
              'openstate': false,
              'playtype': [25],
              tableDta: []
            },
            '生肖量': {
              'openstate': false,
              'playtype': [27, 28, 29, 30, 31, 32, 33, 34],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': true,
          'opendata': [24, 25, 27, 28, 29, 30, 31, 32, 33, 34],
          'openstate': false
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
          'alignModel': 1,
          'tableNum': {
            '尾数中': {
              'openstate': false,
              'playtype': [35],
              tableDta: []
            },
            '尾数不中': {
              'openstate': false,
              'playtype': [36],
              tableDta: []
            },
            '尾数量': {
              'openstate': false,
              'playtype': [37, 38, 39, 40, 41, 42, 43, 44],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': true,
          'opendata': [35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
          'openstate': false
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
          'alignModel': 2,
          'tableNum': {
            '1~10': {
              'openstate': false,
              'playtype': [0, 9],
              tableDta: []
            },
            '11~20': {
              'openstate': false,
              'playtype': [10, 19],
              tableDta: []
            },
            '21~30': {
              'openstate': false,
              'playtype': [20, 29],
              tableDta: []
            },
            '31~40': {
              'openstate': false,
              'playtype': [30, 39],
              tableDta: []
            },
            '41~49': {
              'openstate': false,
              'playtype': [40, 48],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [56, 57, 58, 59, 60, 61],
          'openstate': false
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
          'play_type': [{
            'name': '生肖连',
            'data': [72, 73, 74, 75, 76, 77, 78, 79]
          }],
          'alignModel': 1,
          'tableNum': {
            '二肖中': {
              'openstate': false,
              'playtype': [72],
              tableDta: []
            },
            '二肖不中': {
              'openstate': false,
              'playtype': [73],
              tableDta: []
            },
            '三肖中': {
              'openstate': false,
              'playtype': [74],
              tableDta: []
            },
            '三肖不中': {
              'openstate': false,
              'playtype': [75],
              tableDta: []
            },
            '四肖中': {
              'openstate': false,
              'playtype': [76],
              tableDta: []
            },
            '四肖不中': {
              'openstate': false,
              'playtype': [77],
              tableDta: []
            },
            '五肖中': {
              'openstate': false,
              'playtype': [78],
              tableDta: []
            },
            '五肖不中': {
              'openstate': false,
              'playtype': [79],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': true,
          'opendata': [72, 73, 74, 75, 76, 77, 78, 79],
          'openstate': false
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
          'play_type': [{
            'name': '尾数连',
            'data': [80, 81, 82, 83, 84, 85, 86, 87]
          }],
          'alignModel': 1,
          'tableNum': {
            '二尾中': {
              'openstate': false,
              'playtype': [80],
              tableDta: []
            },
            '二尾不中': {
              'openstate': false,
              'playtype': [81],
              tableDta: []
            },
            '三尾中': {
              'openstate': false,
              'playtype': [82],
              tableDta: []
            },
            '三尾不中': {
              'openstate': false,
              'playtype': [83],
              tableDta: []
            },
            '四尾中': {
              'openstate': false,
              'playtype': [84],
              tableDta: []
            },
            '四尾不中': {
              'openstate': false,
              'playtype': [85],
              tableDta: []
            },
            '五尾中': {
              'openstate': false,
              'playtype': [86],
              tableDta: []
            },
            '五尾不中': {
              'openstate': false,
              'playtype': [87],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': true,
          'opendata': [80, 81, 82, 83, 84, 85, 86, 87],
          'openstate': false
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
          'alignModel': 2,
          'tableNum': {
            '1~10': {
              'openstate': false,
              'playtype': [0, 9],
              tableDta: []
            },
            '11~20': {
              'openstate': false,
              'playtype': [10, 19],
              tableDta: []
            },
            '21~30': {
              'openstate': false,
              'playtype': [20, 29],
              tableDta: []
            },
            '31~40': {
              'openstate': false,
              'playtype': [30, 39],
              tableDta: []
            },
            '41~49': {
              'openstate': false,
              'playtype': [40, 48],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [88, 89, 90, 91, 92, 93, 94, 95, 96],
          'openstate': false
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
          'alignModel': 2,
          'tableNum': {
            '1~10': {
              'openstate': false,
              'playtype': [0, 9],
              tableDta: []
            },
            '11~20': {
              'openstate': false,
              'playtype': [10, 19],
              tableDta: []
            },
            '21~30': {
              'openstate': false,
              'playtype': [20, 29],
              tableDta: []
            },
            '31~40': {
              'openstate': false,
              'playtype': [30, 39],
              tableDta: []
            },
            '41~49': {
              'openstate': false,
              'playtype': [40, 48],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [97, 97, 99, 100, 101, 102],
          'openstate': false
        },
        {
          'group_name': '任中',
          'total_num': [{
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
          'alignModel': 2,
          'tableNum': {
            '1~10': {
              'openstate': false,
              'playtype': [0, 9],
              tableDta: []
            },
            '11~20': {
              'openstate': false,
              'playtype': [10, 19],
              tableDta: []
            },
            '21~30': {
              'openstate': false,
              'playtype': [20, 29],
              tableDta: []
            },
            '31~40': {
              'openstate': false,
              'playtype': [30, 39],
              tableDta: []
            },
            '41~49': {
              'openstate': false,
              'playtype': [40, 48],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [103, 104, 105, 106, 107],
          'openstate': false
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
          'alignModel': 3,
          'tableNum': {
            '单': {
              'openstate': false,
              'playtype': [145, 146, 147, 148, 149, 150, 151, 152],
              tableDta: []
            },
            '双': {
              'openstate': false,
              'playtype': [153, 154, 155, 156, 157, 158, 159, 160],
              tableDta: []
            },
            '大': {
              'openstate': false,
              'playtype': [161, 162, 163, 164, 165, 166, 167, 168],
              tableDta: []
            },
            '小': {
              'openstate': false,
              'playtype': [169, 170, 171, 172, 173, 174, 175, 176],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': false,
          'opendata': [45, 46, 47, 48, 49, 50, 51, 52],
          'openstate': false
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
          'alignModel': 1,
          'tableNum': {
            '七色波': {
              'openstate': false,
              'playtype': [53, 54, 55],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': true,
          'opendata': [53, 54, 55],
          'openstate': false
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
          'play_type': [{
            'name': '合肖',
            'data': [62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
          }],
          'alignModel': 1,
          'tableNum': {
            '二肖': {
              'openstate': false,
              'playtype': [62],
              tableDta: []
            },
            '三肖': {
              'openstate': false,
              'playtype': [63],
              tableDta: []
            },
            '四肖': {
              'openstate': false,
              'playtype': [64],
              tableDta: []
            },
            '五肖': {
              'openstate': false,
              'playtype': [65],
              tableDta: []
            },
            '六肖': {
              'openstate': false,
              'playtype': [66],
              tableDta: []
            },
            '七肖': {
              'openstate': false,
              'playtype': [67],
              tableDta: []
            },
            '八肖': {
              'openstate': false,
              'playtype': [68],
              tableDta: []
            },
            '九肖': {
              'openstate': false,
              'playtype': [69],
              tableDta: []
            },
            '十肖': {
              'openstate': false,
              'playtype': [70],
              tableDta: []
            },
            '十一肖': {
              'openstate': false,
              'playtype': [71],
              tableDta: []
            }
          },
          'PlayZt_txt': '',
          'PlayZt': 0,
          'oddsdata': [],
          'oddsitems': [],
          'openbtn': true,
          'opendata': [62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
          'openstate': false
        }
      ],
      Play_ABC: '',
      Odds_data: '',
      Odds_data_items: '',
      Company: [],
      change_Data: '',
      change_from: {
        change_Rate_down: '',
        change_Rate: '',
        fast_change_Rate: '',
        fast_change_Rate: ''
      },
      oddssetdialog: false,
      oldoddssetdata: '',
      oddssetdata: '',
      animation: [],
      IsOpenGame: {
        'tm': false,
        'ftm': false
      },
      NowOpen: false
    }
  },
  created() {
    this.getlettery()
    // Initialize UserInfo from store if not passed as prop
    if (!this.UserInfo && this.$store && this.$store.state) {
      this.UserInfo = this.$store.state.UserInfo;
    }
    var a = this.$store.state.UserInfo
    this.QuickChooseData = []
    for (let key in a.items) {
      if (a.items[key].Id > 49 && a.items[key].Id < 119) {
        this.QuickChooseData.push(a.items[key])
      } else if (a.items[key].Id > 118) {
        break
      }
    }
    if (this.$store.state.Current > 10) {
      this.currentTime = this.$store.state.Current
      this.greet(this.currentTime, this.GameList)
    }

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

    initializationOdds() {
      this.$request.postData('/kongpan/restore', { 'LotteryId': this.default_data.LotteryId }).then(response => {
        if (response.code == 200) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.getdata()
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.Loadingodds = false
        this.$message.error('网络请求错误112');
      });
    },
    Play_Group_Check(GroupIndex, PlayTypeIndex, items, PlayZt) {
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
      this.greet(this.currentTime, this.GameList)
      this.default_data.DefaultGroup = parseInt(this.default_Group)
      this.$request.postData('/kongpan/find', this.default_data).then(response => {
        this.Loadingodds = false
        if (response.code == 200) {
          var p1 = response.data.data
          p1.sort((a, b) => a.NumberItem - b.NumberItem)
          this.Play_Grpup_data[this.default_Group].oddsdata = p1
          var tableNum = this.Play_Grpup_data[this.default_Group].tableNum
          for (let key in this.Play_Grpup_data[this.default_Group].tableNum) {
            var playtype = this.Play_Grpup_data[this.default_Group].tableNum[key].playtype
            var alignModel = this.Play_Grpup_data[this.default_Group].alignModel
            this.Play_Grpup_data[this.default_Group].tableNum[key].tableDta = this.chaeckitems(p1, playtype, alignModel)
            this.Play_Grpup_data[this.default_Group].tableNum[key].openstate = this.GetIsOpen(response.data.base.Isopen, this.Play_Grpup_data[this.default_Group].tableNum[key].tableDta[0].PlayType)
          }

          if (JSON.stringify(this.Play_ABC) != JSON.stringify(response.data.base.Pan)) {
            this.Play_ABC = response.data.base.Pan
            if (this.default_data.Abc == '' || !this.Play_ABC[this.default_data.Abc]) {
              for (let key in this.Play_ABC) {
                if (this.Play_ABC[key]) {
                  this.default_data.Abc = key
                  break
                }
              }
            }
          }
          var c = response.data.base.Isopen
          c.sort((a, b) => a.PlayType - b.PlayType)
          var e = c.filter(item => this.Play_Grpup_data[this.default_Group].play_type[this.default_PlayType].data.includes(item.PlayType) && item.Isopen == true)
          if (e.length > 0) {
            if (this.Play_Grpup_data[this.default_Group].openstate == false) { this.Play_Grpup_data[this.default_Group].openstate = true }
          } else {
            if (this.Play_Grpup_data[this.default_Group].openstate == true) { this.Play_Grpup_data[this.default_Group].openstate = false }
          }

          this.Odds_data = p1
          this.handleData(p1)
          this.handleTotal(response.data.base.OrderAll)
          if (this.IsOpenGame.tm != c[0].Isopen) { this.IsOpenGame.tm = c[0].Isopen }
          var d = c.filter(item => item.PlayType != 1 && item.PlayType != 2 && item.PlayType != 3 && item.PlayType != 4 && item.Isopen == true)
          if (d.length > 0) {
            if (this.IsOpenGame.ftm == false) { this.IsOpenGame.ftm = true }
          } else {
            if (this.IsOpenGame.ftm == true) { this.IsOpenGame.ftm = false }
          }

          if (this.default_Group == 3 || this.default_Group == 4 || this.default_Group == 5 || this.default_Group == 7 || this.default_Group == 8 || this.default_Group == 12 || this.default_Group == 13 || this.default_Group == 14) {
            if (this.QuickChooseDatas.length == 0) {
              for (let key in this.Play_Grpup_data[this.default_Group].tableNum) {
                var a = {
                  'key': this.Play_Grpup_data[this.default_Group].tableNum[key].playtype,
                  'name': key
                }
                this.QuickChooseDatas.push(a)
              }
            }
          }
        } else {
          this.$message.error(response.msg);
        }

      }).catch(error => {
        this.Loadingodds = false
        this.$message.error('网络请求错误1');

      });
    },
    handleData(data) {
      if (!this.batchsetodds) {
        this.handleDataChangeOdds(data)
      }
    },
    handleDataChangeOdds(a) {
      var a1 = JSON.parse(JSON.stringify(a))
      this.change_Data = a1
      this.change_from = {
        change_Rate_down: '',
        change_Rate: '',
        fast_change_Rate: ''
      }
      this.oddschacktabon = []
      this.isIndeterminate = true

    },
    handleTotal(data) {
      for (let key1 in this.Play_Grpup_data) {
        var a = this.Play_Grpup_data[key1].total_num
        for (let key2 in a) {
          var b = data.filter(item => a[key2].PlayType.includes(item.PlayType) && a[key2].PlayZt == item.PlayZt)
          if (b.length > 0) {
            var BetMoney = b.reduce((sum, item) => sum + parseFloat(item['BetMoney'] || 0), 0)
            var Ty = b.reduce((sum, item) => sum + parseFloat(item['Ty'] || 0), 0)
            var Zcje = b.reduce((sum, item) => sum + parseFloat(item['Zcje'] || 0), 0)
            var Zcty = b.reduce((sum, item) => sum + parseFloat(item['Zcty'] || 0), 0)
            if (a[key2].BetMoney != BetMoney || a[key2].Ty != Ty || a[key2].Zcje != Zcje || a[key2].Zcty != Zcty) {
              this.animation[key1] = key1 == this.default_Group ? 'topbbs' : 'topbb'
              if (a[key2].BetMoney != BetMoney) { a[key2].BetMoney = BetMoney }
              if (a[key2].Ty != Ty) { a[key2].Ty = Ty }
              if (a[key2].Zcje != Zcje) { a[key2].Zcje = Zcje }
              if (a[key2].Zcty != Zcje) { a[key2].Zcty = Zcty }
            }
          }
        }
      }
      setTimeout(() => { this.animation = []; }, 5000);
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
    playtypechan(index) {
      this.Play_Group_Check(this.default_Group, index, this.Play_Grpup_data[this.default_Group])
    },
    OpenChangeBox(modela) {
      this.handleDataChangeOdds(this.Odds_data)
      this.getdata()
    },
    handleChangeRateDown(type) {
      if (this.change_from.change_Rate_down != '') {
        var a = parseFloat(this.change_from.change_Rate_down)
        for (var i = 0; i < this.change_Data.length; i++) {
          var num1 = parseFloat(this.change_Data[i].Rate1)
          var num2 = parseFloat(this.change_Data[i].Rate2)
          if (type == 1) {
            num1 = num1 + a
            num2 = num2 + a
          } else {
            num1 = num1 - a
            num2 = num2 - a
          }
          num1 = num1.toFixed(3).replace(/\.?0*$/, '')
          num2 = num2.toFixed(3).replace(/\.?0*$/, '')
          if (num1 >= 0) {
            this.change_Data[i].Rate1 = num1
            this.change_Data[i].Rate2 = num2
          }
        }
      }
    },
    handleSetAllOdds() {
      if (this.change_from.change_Rate != '' && parseFloat(this.change_from.change_Rate) > 0) {
        var a = parseFloat(this.change_from.change_Rate)
        for (var i = 0; i < this.change_Data.length; i++) {
          this.change_Data[i].Rate1 = a;
        }
      }
    },
    chaeckitems(data, val, model) {
      return data.filter((item, index) => {
        if (model == 1) {
          return val.indexOf(item.PlayType) > -1
        }
        if (model == 2) {
          return index >= val[0] && index <= val[1]
        }
        if (model == 3) {
          return val.indexOf(item.NumberItem) > -1
        }
      }
      );
    },
    setoddschanges(index) {
      var data = this.Play_Grpup_data[this.default_Group].oddsdata
      this.setoddschange(data, index)
    },
    setoddschange(data, index) {

      if (this.setoddsval != '') {
        var a = parseFloat(this.setoddsval)
        var f = [];
        if (a > 0) {
          this.greet(this.currentTime, this.GameList)

          for (var i = 0; i < data.length; i++) {

            if (this.selectkey != -1) {
              if (this.QuickChooseDatas.length == 0) {
                if (this.selectkey == 3) {
                  if (![3, 7, 10,].includes(data[i].PlayGroup)) {
                    continue
                  }
                } else if (this.selectkey == 4) {
                  if (![4, 11].includes(data[i].PlayGroup)) {
                    continue
                  }
                } else if (this.selectkey == 5) {
                  if (![1, 2, 5, 6, 8, 9].includes(data[i].PlayGroup)) {
                    continue
                  }
                } else {
                  if (data[i].NumberBbb != this.selectkey && data[i].NumberBbds != this.selectkey && data[i].NumberBbdx != this.selectkey && data[i].NumberBs != this.selectkey && data[i].NumberBt != this.selectkey && data[i].NumberDs != this.selectkey && data[i].NumberDx != this.selectkey && data[i].NumberHsds != this.selectkey && data[i].NumberHsdx != this.selectkey && data[i].NumberJqys != this.selectkey && data[i].NumberSx != this.selectkey && data[i].NumberTs != this.selectkey && data[i].NumberWs != this.selectkey && data[i].NumberWsdx != this.selectkey && data[i].NumberWx != this.selectkey) {
                    continue
                  }
                }

              } else {
                if (!this.QuickChooseDatas[this.selectkey].key.includes(data[i].PlayType)) {
                  continue
                }
              }
            }
            var e = 0
            var b = parseFloat(data[i].Rate1)
            if (index == 0) {
              e = e + a
            } else {
              e = e - a
            }
            var c = {
              'LotteryId': data[i].LotteryId,
              'NumberItem': data[i].NumberItem,
              'PlayGroup': data[i].PlayGroup,
              // 'PlayNumber':this.change_Data[i].Data.PlayNumber,
              'PlayType': data[i].PlayType,
              'Rate': e,
              'PlayZt': this.default_data.PlayZt
            }
            f.push(c)
          }
          this.$request.postData('/kongpan/drop', f).then(response => {
            this.Loadingodds = false
            if (response.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.Loadingodds = true
              this.getdata()

            } else {
              this.$message.error(response.msg);
            }
          }).catch(error => {
            this.Loadingodds = false
            this.$message.error('网络请求错误');

          });
        }
      } else {
        this.$message.error('请输入或选择变化值');
      }
    },
    upopenstate(State, PlayType) {
      if (!PlayType) {
        var PlayType = this.Play_Grpup_data[this.default_Group].opendata
      }
      var c = {
        'LotteryId': this.default_data.LotteryId,
        'PlayType': PlayType,
        'State': State
      }
      this.$request.postData('/kongpan/open', c).then(response => {
        this.Loadingodds = false
        if (response.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.Loadingodds = true
          this.getdata()
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.Loadingodds = false
        this.$message.error('网络请求错误');

      });
    },
    GetIsOpen(data, PlayType) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].PlayType == PlayType) {
          return data[i].Isopen
        }
      }
    },
    openSetOdds(row) {
      this.oldoddssetdata = row
      this.oddssetdata = JSON.parse(JSON.stringify(row))
      this.oddssetdialog = true

    },
    oddssetPost() {
      var a = parseFloat(this.oldoddssetdata.Rate1)
      var b = parseFloat(this.oddssetdata.Rate1)
      var e = parseFloat((b - a).toFixed(3));
      var f = [];
      var c = {
        'LotteryId': this.oddssetdata.LotteryId,
        'NumberItem': this.oddssetdata.NumberItem,
        'PlayGroup': this.oddssetdata.PlayGroup,
        // 'PlayNumber':this.change_Data[i].Data.PlayNumber,
        'PlayType': this.oddssetdata.PlayType,
        'Rate': e,
        'PlayZt': this.default_data.PlayZt
      }
      f.push(c)
      this.Loadingodds = true
      this.$request.postData('/kongpan/drop', f).then(response => {
        this.Loadingodds = false
        if (response.code == 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.Loadingodds = true
          this.getdata()
        } else {
          this.$message.error(response.msg);
        }
      }).catch(error => {
        this.Loadingodds = false
        this.$message.error('网络请求错误');

      });
    },
    getpankey() {
      var a = []
      for (let key in this.Play_ABC) {
        if (this.Play_ABC[key]) { a.push(key) }
      }
      return a
    },
    changeLotteryId(item, index) {
      this.isshowresult = false
      this.home_data.game_index = index
      this.$store.commit('setHomeData', this.home_data)
      if (this.count > 2 && this.count < 10) {
        this.getlettery()
      }
    },

    loadingchange() {
      this.loading = true
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
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
  /* background-color: #f6f6f6; */
  /* border-top: 1px solid #e0e0e0; */
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

/* 自定义表单样式 */
.custom-form-style {
  padding: 10px;
}

.form-card {
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  padding: 8px 20px;
  background-color: #0088ff;
  border-color: #0088ff;
}

.submit-btn:hover {
  background-color: #0077ee;
  border-color: #0077ee;
}

.el-form-item {
  margin-bottom: 18px;
}

/* 球号样式 */
.play_text.ball_n {
  /* padding: 6px 12px; */
  border-radius: 4px;
  display: inline-block;
}
</style>