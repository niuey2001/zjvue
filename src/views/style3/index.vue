<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { use } from 'echarts/core'
import { PieChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent, LegendComponent, TitleComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import * as echarts from 'echarts'

// 注册必要的ECharts组件
use([PieChart, LineChart, CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// 系统数据
const statsData = ref({
  todayOrders: 128,
  bettingCount: 1024,
  bettingAmount: 25600
})

// 设备统计数据
const deviceStats = ref({
  pc: 45,
  h5: 30,
  app: 20,
  other: 5
})

// 整体看板数据
const dashboardData = ref({
  winAmount: 15280,
  betCount: 8432,
  betAmount: 128650,
  onlinePeak: 1024
})

// 彩票排行榜数据
const lotteryRankData = ref([
  { rank: 1, name: '双色球', count: 3245, bet: 98760, win: 45680 },
  { rank: 2, name: '大乐透', count: 2876, bet: 86420, win: 38750 },
  { rank: 3, name: '快乐8', count: 2543, bet: 75640, win: 32460 },
  { rank: 4, name: '福彩3D', count: 2187, bet: 65320, win: 28970 },
  { rank: 5, name: '排列三', count: 1876, bet: 56240, win: 24580 },
  { rank: 6, name: '七星彩', count: 1654, bet: 49620, win: 21340 },
  { rank: 7, name: '排列五', count: 1432, bet: 42980, win: 18760 },
  { rank: 8, name: '11选5', count: 1287, bet: 38610, win: 16540 },
  { rank: 9, name: '快3', count: 1154, bet: 34620, win: 14870 },
  { rank: 10, name: '六合彩', count: 986, bet: 29580, win: 12450 }
])

// 周数据
const weekData = ref({
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  betAmounts: [4200, 5800, 6100, 8400, 9200, 7600, 6800],
  winAmounts: [1800, 2500, 2800, 3600, 4100, 3400, 2900]
})

// 获取最新数据
const fetchLatestData = async () => {
  try {
    // 这里应该是API请求逻辑
    // 模拟一个更新
    statsData.value.todayOrders += Math.floor(Math.random() * 10)
    statsData.value.bettingCount += Math.floor(Math.random() * 50)
    statsData.value.bettingAmount += Math.floor(Math.random() * 1000)

    return true
  } catch (error) {
    console.error('数据获取失败', error)
    return false
  }
}
const currentTimeStr = ref(formatTime(new Date()))
const statusFilter = ref('全部')
const activeTimeFilter = ref('week')
const chartInstance = ref(null)

// 为ECharts图表准备数据
const pieOption = computed(() => {
  return {
    title: {
      text: '投注占比',
      left: '50%'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: '60%',
      top: 'middle',
      data: ['PC端', 'H5端', 'APP端', '其他'],
      textStyle: {
        color: '#555'
      },
      formatter: function (name) {
        const value = deviceStats.value[name.replace('端', '').toLowerCase()]
        return `${name} (${value}%)`;
      }
    },
    series: [
      {
        name: '投注占比',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: deviceStats.value.pc, name: 'PC端', itemStyle: { color: '#4299e1' } },
          { value: deviceStats.value.h5, name: 'H5端', itemStyle: { color: '#fc8181' } },
          { value: deviceStats.value.app, name: 'APP端', itemStyle: { color: '#f6ad55' } },
          { value: deviceStats.value.other, name: '其他', itemStyle: { color: '#68d391' } }
        ]
      }
    ]
  };
});

// 折线图配置
const lineOption = computed(() => {
  return {
    title: {
      text: '本周数据趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['投注金额', '输赢金额'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: weekData.value.days
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    series: [
      {
        name: '投注金额',
        type: 'line',
        data: weekData.value.betAmounts,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#4299e1'
        },
        itemStyle: {
          color: '#4299e1'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(66, 153, 225, 0.6)'
            },
            {
              offset: 1,
              color: 'rgba(66, 153, 225, 0.1)'
            }
          ])
        }
      },
      {
        name: '输赢金额',
        type: 'line',
        data: weekData.value.winAmounts,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#f6ad55'
        },
        itemStyle: {
          color: '#f6ad55'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(246, 173, 85, 0.6)'
            },
            {
              offset: 1,
              color: 'rgba(246, 173, 85, 0.1)'
            }
          ])
        }
      }
    ]
  };
});

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

// 更新时间
setInterval(() => {
  currentTimeStr.value = formatTime(new Date())
}, 1000)

function resizeChart() {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
}

// 加载最新数据
onMounted(async () => {
  await fetchLatestData()

  // 等待DOM更新后执行图表初始化
  nextTick(() => {
    // 等待窗口加载完成，确保DOM尺寸已经计算
    window.addEventListener('load', () => {
      resizeChart();
    });
  });

  // 添加窗口大小改变的监听
  window.addEventListener('resize', resizeChart);
})
</script>

<template>
  <div class="home-container">
    <div class="section-title">
      实时数据 <el-tooltip content="最近24小时内的统计数据" placement="top">
        <el-icon><question-filled /></el-icon>
      </el-tooltip>
      <span class="update-time">更新时间: {{ new Date().toLocaleString() }}</span>
    </div>

    <el-card class="section-container" shadow="hover">
      <div class="stats-container">
        <div class="stats-row">
          <el-card class="stats-card cyan" shadow="hover">
            <div class="card-title">今日输赢</div>
            <div class="card-value">{{ statsData.todayOrders }}</div>
            <i class="card-icon1"></i>
          </el-card>

          <el-card class="stats-card purple" shadow="hover">
            <div class="card-title">投注笔数</div>
            <div class="card-value">{{ statsData.bettingCount }}</div>
            <i class="card-icon2"></i>
          </el-card>

          <el-card class="stats-card coral" shadow="hover">
            <div class="card-title">投注金额</div>
            <div class="card-value">¥{{ statsData.bettingAmount.toLocaleString() }}</div>
            <i class="card-icon3"></i>
          </el-card>
        </div>

        <div class="chart-container">
          <div class="chart-section">
            <div class="chart-content">
              <v-chart class="chart" :option="pieOption" autoresize ref="chartInstance" />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="section-container" shadow="hover">
      <template #header>
        <div class="section-title">
          整体看板
          <div class="time-filter">
            <el-radio-group v-model="activeTimeFilter" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="lastWeek">上周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <div class="dashboard-stats">
        <el-card class="dashboard-card" shadow="hover">
          <div class="dashboard-title">输赢金额</div>
          <div class="dashboard-value">¥{{ dashboardData.winAmount.toLocaleString() }}</div>
          <el-tag type="success" size="small" effect="light" class="dashboard-trend">+12.5%</el-tag>
        </el-card>
        <el-card class="dashboard-card" shadow="hover">
          <div class="dashboard-title">投注笔数</div>
          <div class="dashboard-value">{{ dashboardData.betCount.toLocaleString() }}</div>
          <el-tag type="success" size="small" effect="light" class="dashboard-trend">+8.3%</el-tag>
        </el-card>
        <el-card class="dashboard-card" shadow="hover">
          <div class="dashboard-title">投注金额</div>
          <div class="dashboard-value">¥{{ dashboardData.betAmount.toLocaleString() }}</div>
          <el-tag type="danger" size="small" effect="light" class="dashboard-trend">-2.1%</el-tag>
        </el-card>
        <el-card class="dashboard-card" shadow="hover">
          <div class="dashboard-title">在线峰值</div>
          <div class="dashboard-value">{{ dashboardData.onlinePeak.toLocaleString() }}</div>
          <el-tag type="success" size="small" effect="light" class="dashboard-trend">+15.7%</el-tag>
        </el-card>
      </div>

      <div class="chart-placeholder large">
        <v-chart class="chart" :option="lineOption" autoresize />
      </div>
    </el-card>

    <el-card class="section-container" shadow="hover">
      <template #header>
        <div class="section-header">
          <div class="section-title">彩票排行榜</div>

          <div class="time-filter">
            <el-select v-model="statusFilter" size="small" style="margin-right: 10px;width:80px;   ">
              <el-option label="全部" value="全部" />
              <el-option label="Top10" value="Top10" />
            </el-select>

            <el-radio-group v-model="activeTimeFilter" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="lastWeek">上周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      <div class="lottery-stats">彩票总数：<span class="stats-value">{{ lotteryRankData.length }}</span></div>
      <el-table :data="lotteryRankData" style="width: 100%">
        <el-table-column prop="rank" label="排名" width="80" align="center" />
        <el-table-column prop="name" label="彩种名称" min-width="180" />
        <el-table-column prop="count" label="投注笔数" width="120" sortable align="center" />
        <el-table-column prop="bet" label="投注金额" width="120" sortable align="center">
          <template #default="scope">
            ¥{{ scope.row.bet.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="win" label="输赢金额" width="120" sortable align="center">
          <template #default="scope">
            ¥{{ scope.row.win.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-empty-slot>
          <el-empty description="暂无数据" />
        </el-table-empty-slot>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.home-container {
  padding: 0 20px;
  width: 100%;
  color: #333;
  box-sizing: border-box;
  overflow-x: hidden;
}

.section-title {
  font-size: 16px;
  color: #656b7b;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  position: relative;
}

.section-title :deep(.el-icon) {
  margin-left: 5px;
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

.update-time {
  position: absolute;
  right: 0;
  font-size: 12px;
  color: #999;
  font-weight: normal;
}

.section-container {
  margin-bottom: 20px;
}

.stats-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stats-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  min-width: 250px;
}

.stats-card {
  color: white;
  position: relative;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s;
  margin-bottom: 0 !important;
}

.stats-card:hover {
  transform: translateY(-5px);
}

.stats-card.cyan {
  background: linear-gradient(135deg, #37b9d6, #2eccb0) !important;
}

.stats-card.purple {
  background: linear-gradient(135deg, #876edd, #948fe3) !important;
}

.stats-card.coral {
  background: linear-gradient(135deg, #f8836f, #ffa382) !important;
}

.card-title {
  font-size: 14px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-icon1 {
  position: absolute;
  height: 44px;
  width: 44px;
  right: 40px;
  top: 35px;
  font-size: 24px;
  opacity: 0.8;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAQAAAC0jZKKAAACQklEQVR42tXXO2gUQRjA8Tk0nq9CC3MRjG8kFomQzqBYxETluoApDDHGx4UQjBbpYiFYpdPOzsJKUZQgCYopA8IhAa0ENZdcIB4WIvEZk/tbuPft7N7Met6Oxc02s/vd92Nudl6rVM0WNtDPBHmKVF4+MfI39iQ5qilF9kSxGVaotjTZ2eMx2Nt2to5Z+dlzemhmf8XXtqhu6BN21O1oeOyxkw6sNFmWyJJWSjHvwd0OWL+kFctedWdsOKvBWSXVVGz4mwYvOYM5xep/aDFHA+2FtBOYVj6L8700KmLDHOSjKDf9xzFhdrMgxh0SFcO0M84ttluiDbwV4QFr9FAkzDnvXedpNUS38kryn7IuGIyAOa8Noa+cDkU380Ki02wMJ1thLoZ2kyLX/T4kyZREZthS3ioLTMa4Sd3/0zLWyuIFb6g39aIRZlBjRxjT6JfsIMFduZ+jMZB5hGmmaDHCDGnsVaWU4iw/5Mki96Re4ECATVAA4LUB5rLWvmF5epgPhl36UOj/15dCZTBXtMShQFIjMwH2C21lHZuywGS0MTBYlraJhxL/SYdxwljggrADxgmT4AYAy3RZZqIFznnspYjV4RjX2Gud4ha4gxyLnKl6pWuwvryY+0iqluHS+rXPCbyrNBiVHF+7nMDdnjavGPeqz5zAk572SNHr7lDIqFh9iiTvtO2ll6Z/OMb6VzM92sL/njqlFJ0xDt6mskK7v1usOmT15YBO5pyws5wId3ySCzxhgV9Vfj3lmaCf9bX7Qfob5ZzyCuDdCuAAAAAASUVORK5CYII=);
}

.card-icon2 {
  position: absolute;
  height: 44px;
  width: 44px;
  right: 40px;
  top: 35px;
  font-size: 24px;
  opacity: 0.8;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAQAAAC0jZKKAAABbklEQVR42u2XsWrCQBiAj6DiIF30CTq0pYMUCoLUrq76KF0LpaM4Fn2IQiftrDhInkBd2lJwMLqVigVF7NfBq3B6QXIXwSFftv/PfSF3/yX/CbEFZZqMCMYKjwZl4QcZWtjQIq3TphhgS4/krrhKGFS2tecsZKpDjrgIAA452nL0kqyarMuEiyMMIEZXGmpqoi/DBWEIhf95VsNTAOYkjMUJlgDM1PCaibCAyVoSiY9AzMWmCPWMKZmJX/ZuYM9M/LxXPDQTn+LyzdT3eqMYldsxiGcAfIQvXv+Y7kIXC8EVl0IcQKy5sci7pnq/eOXETjz03XEPdmLPV/xoJy4x1kh/6Wg7Ht/Fu+H6AIvHEwD34Yt/APiMvhWReKcqllZN4RyAqRruWbext9LQV8M1Ge4SM9I6uNJQVxNZ2d1Cm3ywrp44OTpy9IKz7XQllMNNdfe5yc08mzMgpXultPUBMuM/X2UaeKwCKkc01SPvH+GtNJ8+fQWEAAAAAElFTkSuQmCC);
}

.card-icon3 {
  position: absolute;
  height: 44px;
  width: 44px;
  right: 40px;
  top: 35px;
  font-size: 24px;
  opacity: 0.8;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAQAAAC0jZKKAAADZ0lEQVR4Aa3BXWjVZRwA4J/7MImoG5NCrSCWlJGBIamVOVMyuinWgqiryswKCVsWXVRXfUDRRV4ERikolgVJINFcgUxwsOgMzdmHQTaV5nQztXQunzjn9WzHnf/ZdqLniSwmudlT3rHNHr87btCgfr/bY5t3rTDbpKiOWsttcdR4+mx2r9qYCLVW6VGNHivVxtjcYo9ygw7ap1OnfQ4aVO4Hs6MydzthxClfWKvRdDVRQo0ZGq21zWkjBiyObK50TFGbB0yJcZjiQd8qOmpaZLFO0mNZVMFyhyTrIot98s5qiCqZZVDeT5HFP/J+jv/ALwoii6IVUSVPuiCyGLHRzJggM2wwLLIodc5nHnZ5jMHlmm11TonIotyQLuu1aLbQrRo0mGOhh7RYL2dImcgi+dNp1TrjpILIIsmZ6hU9Juq4N1zlc3mHIoskFxGhzj3e9r3zKjlnr/csUR8RYZbdfnJfZJHkooRLzdHsZW9aZ6PNPvSWNR4115SYKEku/m+SXEyIW7xgk05HnDTkpCM6bbbGnBhNkotxqPe0/SrrtkpdjJCccFmMwQ1yxtelIYoU7TA1KjDTIaWG9Npnt269hpQ6YkYkRvRa44rIYIOidi3mmxzDTDZfi3ZFGyNxsb9t9bgGtVHCH/L63RUVWWRAXl8ksg360Zfe85LZEZJjbo+KzHdcQSSSg9plO63BiDarzVUbw9Saa7VvDItE0hHhNh/pV+4Ro53VI2enLj3OGiUSSUcUqHOH123zq/OS30xTlUgkHTGKKa4x150ui5Actkdlex1WEImkI8YgaY1wrVU+tdN+x5z3lwN22uJ510fYoSASSUeMQdIaFzEpLmKHgkgknTEGSWeMyXcKInFA3lkNUZGiry1WE2XUWKzVBZH4QNKjMSpQasB2r1mpyTJNnvKa7fqViMTVBhR95X51UUZVoshSp4zo84lnLXWdmrhAVWKEebqVO6Pbt56IkLRr8pE/lOu3SbNdCqKUei0OyTZP0hoRYZKbNHrYc1611mOWuFFdRIQ2BTGaOk0+cdxo90paY0zaFEQ2teZZ4X077NXrlI/V65PXb1FUZJF+eb0xcTYoaveiBSbHMJdYoMUuRRti4kx3WKl/9NmvQ7ejhpQ6bGZUQ4Mu4+syK6qlzirdKvvRM+qj4F8tiG4MRX19vgAAAABJRU5ErkJggg==);
}

.chart-container {
  flex: 1;
  height: 100%;
  min-height: 400px;
  min-width: 250px;
}

.chart-section {
  height: 100%;
}

.chart-content {
  height: calc(100% - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.chart {
  height: 100%;
  width: 100%;
  min-height: 300px;
}

.time-filter {
  display: flex;
  margin-left: auto;
  white-space: nowrap;
}

.time-filter :deep(.el-radio-group) {
  flex-wrap: nowrap;
}

.dashboard-stats {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.dashboard-card {
  flex: 1;
  min-width: 200px;
  text-align: center;
  transition: transform 0.3s;
  margin-bottom: 0 !important;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}

.dashboard-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.dashboard-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.dashboard-trend {
  display: inline-block;
}

.chart-placeholder.large {
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-chart {
  width: 95%;
  height: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: 40px;
  padding-bottom: 30px;
}

.chart-grid {
  flex: 1;
  background-image: linear-gradient(#eee 1px, transparent 1px),
    linear-gradient(90deg, #eee 1px, transparent 1px);
  background-size: calc(100% / 6) calc(100% / 5), calc(100% / 6) calc(100% / 5);
}

.chart-axis-y {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 30px;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding-right: 10px;
}

.chart-axis-x {
  position: absolute;
  left: 40px;
  right: 0;
  bottom: 0;
  height: 30px;
  display: flex;
  justify-content: space-between;
}

.axis-label {
  font-size: 12px;
  color: #999;
}

.lottery-stats {
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}

.stats-value {
  font-weight: bold;
  margin-left: 5px;
}

@media (max-width: 1200px) {
  .stats-container {
    flex-direction: column;
  }

  .dashboard-stats {
    flex-wrap: wrap;
  }

  .dashboard-card {
    flex: 1 0 40%;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 0 10px;
  }

  .dashboard-stats {
    flex-direction: column;
  }

  .dashboard-card {
    flex: 1 0 100%;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
}
</style>