<script lang="ts" setup>
import { ref } from 'vue';
import { NButton, NGrid, NGi, NIcon } from 'naive-ui';
import { BrandApple, BrandWindows, BrandUbuntu } from '@vicons/tabler'; 

let current = ref('LocalJson');
function select(v: string) {
  current.value = v;
}
const apps = [
  {
    name: 'LocalJson',
  },
];

const downloads = [
  { os: 'macOS', arch: 'ARM', icon: BrandApple, link: '/downloads/macos-arm', enabled: true },
  { os: 'Windows', arch: 'AMD64', icon: BrandWindows, link: '/downloads/windows-x64', enabled: false },
  { os: 'Windows', arch: 'ARM', icon: BrandWindows, link: '/downloads/windows-arm', enabled: false },
  { os: 'Linux', arch: 'ARM', icon: BrandUbuntu, link: '/downloads/linux-arm', enabled: false },
  { os: 'Linux', arch: 'AMD64', icon: BrandUbuntu, link: '/downloads/linux-x64', enabled: false },
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
        <div class="flex-1 pl-4 flex flex-col">
          <div class="title"> {{ current }} </div>
          <div class="intro">A lightweight cross-platform toolset desktop app.</div>
          <div class="download-list flex-1">
            <div class="download-page">
              <n-grid cols="1" x-gap="12" y-gap="12" justify-content="center">
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

.title {
  display: block;
    font-size: 2em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
}
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
  background-color: #f0f0f0; 
  color: #000;
}
</style>
