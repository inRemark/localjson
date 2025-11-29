<script setup lang="ts">
import { useStyleStore } from '../stores/style.store';

const styleStore = useStyleStore();
const { isSmallScreen } = toRefs(styleStore);
const siderPosition = computed(() => (isSmallScreen.value ? 'absolute' : 'static'));
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      :width="240"
      :collapsed="false"
      :show-trigger="false"
      :native-scrollbar="false"
      :position="siderPosition"
    >
      <slot name="sider" />
    </n-layout-sider>
    <n-layout class="content">
      <slot name="content" />
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.content {
  ::v-deep(.n-layout-scroll-container) {
    padding: 26px;
  }
}

.n-layout {
  height: 100vh;
}
</style>

