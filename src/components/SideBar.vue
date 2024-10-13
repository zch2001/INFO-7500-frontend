<template>
  <el-menu default-active="bestten" class="el-menu-vertical-demo">
    <el-menu-item index="bestten" @click="navigateTo('bestten')">
      Best 10 Blocks
    </el-menu-item>
    <el-menu-item index="tbd" @click="navigateTo('tbd')">
      Dashboard
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter();

    const navigateTo = (route: string) => {
      router.push({ name: route });
    };

    return {
      navigateTo,
    };
  },
});
</script>

<style scoped>
.el-menu {
  height: 100%;
}
</style>
