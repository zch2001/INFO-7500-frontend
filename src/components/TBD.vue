<template>
  <div class="tbd-page">
    <el-row>
      <el-col :span="24" class="header">
        <h2>Bitcoin Price Chart</h2>
        <!-- 按钮组 -->
        <el-button-group>
          <el-button @click="updateChart('1')">1D</el-button>
          <el-button @click="updateChart('7')">1W</el-button>
          <el-button @click="updateChart('30')">1M</el-button>
          <el-button @click="updateChart('365')">1Y</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div id="price-chart" style="width: 100%; height: 400px;"></div>
      </el-col>
    </el-row>
    <!-- 显示统计数据的部分 -->
    <el-row>
      <el-col :span="8" class="stats-item">
        <div class="stats-value">{{ stats.block_height }}</div>
        <div class="stats-label">Block Height</div>
      </el-col>
      <el-col :span="8" class="stats-item">
        <div class="stats-value">{{ stats.blockchain_size }}</div>
        <div class="stats-label">Blockchain Size</div>
      </el-col>
      <el-col :span="8" class="stats-item">
        <div class="stats-value">{{ stats.difficulty }}</div>
        <div class="stats-label">Difficulty</div>
      </el-col>
      <el-col :span="8" class="stats-item">
        <div class="stats-value">{{ stats.mempool_size }}</div>
        <div class="stats-label">Mempool Size</div>
      </el-col>
      <el-col :span="8" class="stats-item">
        <div class="stats-value">{{ stats.network_hashrate }}</div>
        <div class="stats-label">Network Hashrate</div>
      </el-col>
      <el-col :span="8" class="stats-item">
        <div class="stats-value">{{ stats.total_supply }}</div>
        <div class="stats-label">Total Supply</div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted } from 'vue';
import * as echarts from 'echarts';

interface StatsData {
  block_height: number;
  blockchain_size: string;
  difficulty: string;
  mempool_size: string;
  network_hashrate: string;
  total_supply: string;
}

export default defineComponent({
  name: 'TBD',
  setup() {
    const stats = ref<StatsData>({
      block_height: 0,
      blockchain_size: '0',
      difficulty: '0',
      mempool_size: '0',
      network_hashrate: '0',
      total_supply: '0',
    });

    const days = ref('30'); // 默认天数
    let intervalId: number;

    const fetchPriceData = async (days: string) => {
      const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      const prices = data.prices.map((item: any) => ({
        date: new Date(item[0]),
        price: item[1],
      }));

      return prices;
    };

    const fetchStatsData = async () => {
      const response = await fetch('https://demo.slightdream.com/api/stats');
      const data = await response.json();
      stats.value = {
        block_height: data.block_height,
        blockchain_size: data.blockchain_size,
        difficulty: data.difficulty,
        mempool_size: data.mempool_size,
        network_hashrate: data.network_hashrate,
        total_supply: data.total_supply,
      };
    };

    const drawChart = async () => {
      const priceData = await fetchPriceData(days.value);
      const chartDom = document.getElementById('price-chart') as HTMLElement;
      const chartInstance = echarts.init(chartDom);

      // const minPrice = Math.min(...priceData.map((item) => item.price));
      // const maxPrice = Math.max(...priceData.map((item) => item.price));
      const minPrice = Math.floor(Math.min(...priceData.map((item) => item.price))); // 取下限整数
      const maxPrice = Math.ceil(Math.max(...priceData.map((item) => item.price))); // 取上限整数

      let xAxisInterval;
      if (days.value === '1') {
        xAxisInterval = 2 * 60 * 60 * 1000;
      } else if (days.value === '7') {
        xAxisInterval = 24 * 60 * 60 * 1000;
      } else if (days.value === '30') {
        xAxisInterval = 7 * 24 * 60 * 60 * 1000;
      } else {
        xAxisInterval = 30 * 24 * 60 * 60 * 1000;
      }

      const option = {
        title: {
          text: `Bitcoin ${days.value} Day Price`,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: (value: number) => {
              const date = new Date(value);
              return days.value === '1'
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString();
            },
            interval: xAxisInterval,
          },
        },
        yAxis: {
          type: 'value',
          min: minPrice,
          max: maxPrice,
        },
        series: [
          {
            data: priceData.map((item: any) => [item.date.getTime(), item.price]),
            type: 'line',
            smooth: true,
            areaStyle: {
              color: 'rgba(255, 165, 0, 0.5)',
            },
            sampling: 'lttb', // 使用lttb算法来减少显示的点，简化折线
          },
        ],
      };

      chartInstance.setOption(option);
    };

    const updateChart = (newDays: string) => {
      days.value = newDays;
      drawChart();
    };

    const startAutoRefresh = () => {
      intervalId = setInterval(() => {
        drawChart();
      }, 5000);
    };

    onMounted(async () => {
      await fetchStatsData();
      drawChart();
      startAutoRefresh();
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      stats,
      days,
      updateChart,
    };
  },
});
</script>

<style scoped>
.tbd-page {
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stats-item {
  text-align: center;
  margin-bottom: 20px;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.stats-label {
  font-size: 14px;
  color: #888;
}

.el-button-group {
  margin-bottom: 20px;
}

#price-chart {
  margin-bottom: 20px;
}
</style>
