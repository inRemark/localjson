<script lang="ts" setup>
import { ref } from 'vue';
import { NButton, NGrid, NGi, NIcon } from 'naive-ui'; // 请根据实际情况导入 Naive UI 组件
import { BrandApple, BrandWindows, BrandUbuntu } from '@vicons/tabler'; // 请根据实际情况导入图标

let current = ref('LocalJson');
function select(v: string) {
  current.value = v;
}
const apps = [
  {
    name: 'LocalJson',
  },
  {
    name: 'LocalDocs',
  },
];

const downloads = [
  { os: 'macOS', arch: 'arm', icon: BrandApple, link: '/downloads/macos-arm', enabled: true },
  { os: 'macOS', arch: 'x64', icon: BrandApple, link: '/downloads/macos-x64', enabled: false },
  { os: 'Windows', arch: 'arm', icon: BrandWindows, link: '/downloads/windows-arm', enabled: false },
  { os: 'Windows', arch: 'x64', icon: BrandWindows, link: '/downloads/windows-x64', enabled: false },
  { os: 'Linux', arch: 'arm', icon: BrandUbuntu, link: '/downloads/linux-arm', enabled: false },
  { os: 'Linux', arch: 'x64', icon: BrandUbuntu, link: '/downloads/linux-x64', enabled: false },
];
</script>

<template>
  <div mt-2 w-full p-8>
    <h1>Apps</h1>

    <div flex>
      <div w-200px b-r b-gray b-op-10 b-r-solid pr-4>
        <c-button
          v-for="item of apps"
          :key="item.name"
          @click="() => select(item.name)"
          variant="text"
          w-full
          important:justify-start
          important:text-left
          :type="current === item.name ? 'primary' : 'default'"
        >
          {{ item.name }}
        </c-button>
      </div>

      <div flex-1 pl-4>
        <h1>{{ current }}</h1>

        <div class="flex-1 pl-4 flex flex-col">
          <div class="intro">简介内容</div>
          <div class="download-list flex-1">
            <div class="download-page">
              <h2>Download Desktop Version</h2>
              <n-grid cols="2" x-gap="12" y-gap="12" justify-content="center">
                <n-gi v-for="download in downloads" :key="download.link" span="1">
                  <n-button
                    :href="download.enabled ? download.link : null"
                    :disabled="!download.enabled"
                    type="primary"
                    block
                    class="download-button"
                  >
                    <n-icon :size="25" :component="download.icon" class="icon" />
                    {{ download.os }} ({{ download.arch }})
                  </n-button>
                </n-gi>
              </n-grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

.icon {
  margin-right: 8px;
}

.download-button {
  background-color: #f0f0f0; /* 浅灰色背景 */
  color: #000; /* 黑色文字 */
}
</style>
