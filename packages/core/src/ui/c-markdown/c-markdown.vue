<script setup lang="ts">
import { marked } from 'marked';
import DomPurify from 'dompurify';
import { usePlatform } from '../../adapters';

const props = withDefaults(defineProps<{ markdown?: string }>(), { markdown: '' });
const { markdown } = toRefs(props);
const platform = usePlatform();

marked.use({
  renderer: {
    link(href, title, text) {
      return `<a class="text-primary transition decoration-none hover:underline" href="${href}" target="_blank" rel="noopener">${text}</a>`;
    },
  },
});

const html = computed(() => DomPurify.sanitize(marked(markdown.value), { ADD_ATTR: ['target'] }));
function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.tagName === 'A' && target.getAttribute('href')) {
    event.preventDefault(); // 阻止默认行为
    const url = target.getAttribute('href')!;
    platform.openURL(url);
  }
}
</script>

<template>
  <div v-html="html" @click="handleClick"/>
</template>
