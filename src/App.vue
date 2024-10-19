<template>
  <el-container style="height: 100vh; width: 100vw;">
    <el-header class="header">
      <img src="@/assets/Logo.png" alt="Logo" class="logo">
      Bitcoin Explorer
    </el-header>
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* 保证绝对定位的图标不会影响标题文本 */
}

.logo {
  position: absolute; /* 图标绝对定位，放在最左边 */
  left: 20px; /* 左边距 */
  height: 40px; /* 图标高度 */
}

.footer {
  background-color: black;
  color: white;
  text-align: center;
  line-height: 40px;
  padding: 0;
}
</style>
