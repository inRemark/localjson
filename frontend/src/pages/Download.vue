<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { NButton, NGrid, NGi, NIcon } from 'naive-ui'; // 请根据实际情况导入 Naive UI 组件
import { BrandApple, BrandWindows, BrandUbuntu } from '@vicons/tabler'; // 请根据实际情况导入图标

useHead({ title: 'Download Desktop Version - LocalJson Tools' });

const downloads = [
  {
    os: 'macOS',
    arch: 'Universal',
    icon: BrandApple,
    link: 'https://github.com/inRemark/localjson/releases',
    enabled: true,
  },
  {
    os: 'Windows',
    arch: '',
    icon: BrandWindows,
    link: 'https://github.com/inRemark/localjson/releases',
    enabled: false,
  },
  { os: 'Linux', arch: '', icon: BrandUbuntu, link: 'https://github.com/inRemark/localjson/releases', enabled: false },
];
</script>

<template>
  <div class="download-page">
    <h2>Download Desktop Version</h2>
    <n-grid cols="1" x-gap="12" y-gap="12" justify-content="center">
      <n-gi v-for="download in downloads" :key="download.link" span="1">
                  <c-link
                    target="_blank"
                    :href="download.enabled ? download.link : null"
                    :disabled="!download.enabled"
                    type="primary"
                    block
                    class="download-button"
                  >
                    <div class="download-content">
                      <n-icon :size="25" :component="download.icon" class="icon" />
                      <span>{{ download.os }} {{ download.arch }}</span>
                    </div>
                  </c-link>
                </n-gi>
    </n-grid>
  </div>
</template>

<style scoped>
.download-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  /* text-align: center; */
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}
.icon {
  margin-right: 8px;
}

.download-button {
  display: flex;
  align-items: center;
}

.download-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>