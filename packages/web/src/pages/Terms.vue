<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { ref, onMounted } from 'vue';

useHead({ title: 'User Terms and Privacy Policy - LocalJson Tools' });
const markdownContent = ref('');

onMounted(async () => {
  try {
    const response = await fetch('/terms.md');
    if (response.ok) {
      markdownContent.value = await response.text();
    } else {
      console.error('Failed to load terms.md:', response.statusText);
    }
  } catch (error) {
    console.error('Error loading terms.md:', error);
  }
});

</script>

<template>
  <c-markdown :markdown="markdownContent" mx-auto mt-50px max-w-600px />
</template>
