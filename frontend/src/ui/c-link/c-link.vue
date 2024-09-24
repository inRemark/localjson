<script lang="ts" setup>
import { type RouteLocationRaw, RouterLink } from 'vue-router';
import { useTheme } from './c-link.theme';
import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime'; // 导入 BrowserOpenURL 函数

const props = withDefaults(defineProps<{
  href?: string
  to?: RouteLocationRaw
  openUrl?: string
}>(),{
  href: undefined,
  to: undefined,
  openUrl: '',
});

const { href, to, openUrl } = toRefs(props);

function handleClick(event: MouseEvent) {
  if(openUrl.value.length > 0){
    BrowserOpenURL(openUrl.value);
  }
}

const theme = useTheme();
const tag = computed(() => {
  if (href?.value) {
    return 'a';
  }
  if (to?.value) {
    return RouterLink;
  }
  return 'span';
});

</script>

<template>
  <component :is="tag" :href="href ?? to" class="c-link" :to="to" @click="handleClick">
    <slot />
  </component>
</template>

<style lang="less" scoped>
.c-link {
  line-height: inherit;
  font-family: inherit;
  font-size: inherit;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 400;
  color: v-bind('theme.default.textColor');
  border-radius: 4px;
  transition: color cubic-bezier(0.4, 0, 0.2, 1) 0.3s;

  outline-offset: 1px;

  &:hover {
    color: v-bind('theme.default.hover.textColor');
  }

  &:active {
    color: v-bind('theme.default.textColor');
  }

  &:focus {
    color: v-bind('theme.default.outline.color');
  }
}
</style>
