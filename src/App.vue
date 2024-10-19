<template>
  <el-container style="height: 100vh; width: 100vw;">
    <el-header class="header">Bitcoin Explorer</el-header>
    <el-container>
      <el-aside style="width: 200px; padding: 0; margin: 0;">
        <Sidebar />
      </el-aside>
      <el-main style="padding: 0; height: 100%; overflow: auto;">
        <router-view />
      </el-main>
    </el-container>
    <el-footer class="footer">© 2024 Northeastern INFO7500</el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from './components/SideBar.vue'; // 引入 Sidebar 组件

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
  },
});
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: black;
  color: white;
  text-align: center;
  line-height: 60px;
  padding: 0;
  margin: 0;
}

.footer {
  background-color: black;
  color: white;
  text-align: center;
  line-height: 40px;
  padding: 0;
}
</style>
