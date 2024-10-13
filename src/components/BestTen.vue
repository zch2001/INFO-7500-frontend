<template>
  <div>
    <h1>Best 10 Blocks</h1>
    <el-table :data="blockData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="height" label="Height" width="150" />
      <el-table-column prop="size" label="Size (bytes)" width="150" />
      <el-table-column prop="num_transactions" label="Number of Transactions" width="200" />
      <el-table-column
          prop="timestamp"
          label="Timestamp"
          width="200"
          :formatter="formatTimestamp"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

interface BlockData {
  id: number;
  height: number;
  size: number;
  num_transactions: number;
  timestamp: number;
}

export default defineComponent({
  name: 'BestTen',
  setup() {
    const blockData = ref<BlockData[]>([]);

    const fetchBlockInfos = async () => {
      try {
        const response = await fetch('https://demo.slightdream.com/api/get_data');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        blockData.value = data.data as BlockData[];
      } catch (error) {
        console.error('Error fetching block heights:', error);
      }
    };

    const formatTimestamp = (row: BlockData) => {
      return new Date(row.timestamp * 1000).toLocaleString();
    };

    onMounted(fetchBlockInfos);

    return {
      blockData,
      formatTimestamp,
    };
  },
});
</script>

<style scoped>
/* 样式部分 */
</style>
