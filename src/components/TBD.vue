<template>
  <div class="tbd-page">
    <el-row>
      <el-col :span="24" class="header">
        <h2>Bitcoin Price Chart</h2>
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
      <el-col :span="8">
        <h3> block_height {{ stats.block_height }}</h3>
      </el-col>
      <el-col :span="8">
        <h3> blockchain_size {{ stats.blockchain_size }}</h3>
      </el-col>
      <el-col :span="8">
        <h3> difficulty {{ stats.difficulty }}</h3>
      </el-col>
      <el-col :span="8">
        <h3> mempool_size {{ stats.mempool_size }}</h3>
      </el-col>
      <el-col :span="8">
        <h3> network_hashrate {{ stats.network_hashrate }}</h3>
      </el-col>
      <el-col :span="8">
        <h3> total_supply {{ stats.total_supply }}</h3>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
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

    // 默认天数，默认为 30 天
    const days = ref('30');

    const fetchPriceData = async (days: string) => {
      const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      const prices = data.prices.map((item: any) => ({
        date: new Date(item[0]), // 将时间戳转为 Date 对象
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

      // 获取数据中的最大和最小价格
      const minPrice = Math.min(...priceData.map((item) => item.price));
      const maxPrice = Math.max(...priceData.map((item) => item.price));

      // 设置 x 轴的单位
      let xAxisInterval;
      if (days.value === '1') {
        xAxisInterval = 2 * 60 * 60 * 1000; // 1D, 每2小时一个刻度
      } else if (days.value === '7') {
        xAxisInterval = 24 * 60 * 60 * 1000; // 1W, 每天一个刻度
      } else if (days.value === '30') {
        xAxisInterval = 7 * 24 * 60 * 60 * 1000; // 1M, 每周一个刻度
      } else {
        xAxisInterval = 30 * 24 * 60 * 60 * 1000; // 1Y, 每月一个刻度
      }

      const option = {
        title: {
          text: `Bitcoin ${days.value} Day Price`,
          left: 'center',
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: (value: number) => {
              const date = new Date(value);
              return days.value === '1'
                  ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })  // 精确到分钟
                  : date.toLocaleDateString(); // 根据天数格式化日期
            },
            interval: xAxisInterval, // 根据选择的天数动态设置刻度
          },
        },
        yAxis: {
          type: 'value',
          min: minPrice,
          max: maxPrice,
        },
        series: [
          {
            data: priceData.map((item: any) => [item.date.getTime(), item.price]), // x 轴使用时间戳，y 轴使用价格
            type: 'line',
            smooth: true,
            areaStyle: {
              color: 'rgba(255, 165, 0, 0.5)', // 阴影颜色
            },
          },
        ],
      };

      chartInstance.setOption(option);
    };

    // 更新图表，根据按钮选择的天数重新绘制图表
    const updateChart = (newDays: string) => {
      days.value = newDays;
      drawChart();
    };

    onMounted(async () => {
      await fetchStatsData();
      drawChart();
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
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#price-chart {
  margin-bottom: 20px;
}
</style>
