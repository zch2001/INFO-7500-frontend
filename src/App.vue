<template>
  <div class="common-layout" style="height: 100%;width: 100%">
    <el-container style="height: 100vh;">
      <el-header class="header">Bitcoin Explorer</el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
      <el-footer class="footer">© 2024 Northeastern INFO7500</el-footer>
    </el-container>
  </div>
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
}


.common-layout {
  height: 100vh;
}

.header {
  background-color: black;
  color: white;
  text-align: center;
  line-height: 60px;
}

.footer {
  background-color: black;
  color: white;
  text-align: center;
  line-height: 40px;
}
</style>
