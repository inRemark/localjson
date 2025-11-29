<script lang="ts" setup>
import { NIcon, useThemeVars } from 'naive-ui';

import { RouterLink } from 'vue-router';
import { Home2 } from '@vicons/tabler';

import { storeToRefs } from 'pinia';
import HeroGradient from '@/assets/hero-gradient.svg';
import MenuLayout from '@/components/MenuLayout.vue';
import NavbarButtons from '@/core/components/NavbarButtons.vue';
import { useStyleStore } from '@/stores/style.store';
import { config } from '@/core/config';
import type { ToolCategory } from '@/core/tools/tools.types';
import { useToolStore } from '@/core/tools/tools.store';
import { useTracker } from '@/core/modules/tracker/tracker.services';
import CollapsibleToolMenu from '@/core/components/CollapsibleToolMenu.vue';
import { useI18n } from 'vue-i18n';

const themeVars = useThemeVars();
const styleStore = useStyleStore();
const version = config.app.version;
const commitSha = config.app.lastCommitSha.slice(0, 7);

const { tracker } = useTracker();
const { t } = useI18n();

const toolStore = useToolStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);

const tools = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0 ? [{ name: t('tools.categories.favorite-tools'), components: favoriteTools.value }] : []),
  ...toolsByCategory.value,
]);
</script>

<template>
  <MenuLayout class="menu-layout" style="--wails-draggable:drag" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <div class="sider">
      
      <RouterLink to="/" class="hero-wrapper">
        <HeroGradient class="gradient" />  
        <div class="text-wrapper">
          <div class="title">
            LocalJson
          </div>
          <div class="divider" />
          <div class="subtitle">
            {{ $t('home.subtitle') }}
          </div>
        </div>
      </RouterLink>
   
      <div class="sider-content">
        <div v-if="styleStore.isSmallScreen" flex flex-col items-center>
          <locale-selector w="90%" />

          <div flex justify-center>
            <NavbarButtons />
          </div>
        </div>

        <CollapsibleToolMenu :tools-by-category="tools" />

        <div class="footer">
          <div>
            LocalJson Tools
            <c-link target="_blank" rel="noopener" openUrl="https://github.com/inRemark/localjson">
              v{{ version }}
            </c-link>
          </div>
          <div>
            Based on
            <c-link target="_blank" rel="noopener" openUrl="https://github.com/CorentinTh/it-tools">
              IT Tools
            </c-link>
          </div>
          <div>
            © {{ new Date().getFullYear() }}
            <c-link target="_blank" rel="noopener" openUrl="https://github.com/inRemark">
              inRemark
            </c-link>
          </div>
        </div>
      </div>
    </div>
    </template>

    <template #content>
      <div class="navbar" flex items-center justify-center gap-2>
        <c-tooltip :tooltip="$t('home.home')" position="bottom">
          <c-button to="/" circle variant="text" :aria-label="$t('home.home')">
            <NIcon size="25" :component="Home2" />
          </c-button>
        </c-tooltip>

        <c-tooltip :tooltip="$t('home.uiLib')" position="bottom">
          <c-button v-if="config.app.env === 'development'" to="/c-lib" circle variant="text" :aria-label="$t('home.uiLib')">
            <icon-mdi:brush-variant text-20px />
          </c-button>
        </c-tooltip>

        <c-tooltip :tooltip="$t('home.apps')" position="bottom">
          <c-button v-if="config.app.env === 'production'" to="/apps" circle variant="text" :aria-label="$t('home.apps')">
            <icon-mdi:octagram-outline text-20px />
          </c-button>
        </c-tooltip>

        <command-palette />
        <locale-selector v-if="!styleStore.isSmallScreen" />

        <div>
          <NavbarButtons v-if="!styleStore.isSmallScreen" />
        </div>
      </div>
      <slot />
    </template>
  </MenuLayout>
</template>

<style lang="less" scoped>
.support-button {
  background: rgb(87, 159, 241);
  background: linear-gradient(48deg, rgba(87, 159, 241, 1) 0%, rgb(61, 161, 243) 60%, rgb(64, 115, 245) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    padding-left: 30px;
    padding-right: 30px;
  }
}

.footer {
  text-align: center;
  color: #838587;
  margin-top: 20px;
  padding: 20px 0;
}

.navbar {
  margin-bottom: 20px;
}

.sider-content {
  padding-top: 160px;
  padding-bottom: 100px;
}

.hero-wrapper {
  position: absolute;
  // display: block;
  top: 0; 
  left: 0;
  width: 100%;
  z-index: 10;
  overflow: hidden;
  .gradient {
    margin-top: -65px;
  }
  .text-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    top: 8px;
    color: #fff;
    .title {
      font-size: 25px;
      font-weight: 600;
    }

    .divider {
      width: 50px;
      height: 2px;
      border-radius: 4px;
      background-color: v-bind('themeVars.primaryColor');
      margin: 0 auto 5px;
    }
    .title {
      font-style: italic;
    }
    .subtitle {
      font-size: 11px;
    }
  }
}
</style>

