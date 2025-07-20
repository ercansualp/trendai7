<template>
  <div :class="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Notivue v-slot="item">
        <Notification :item="item" />
      </Notivue>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';

const theme = ref('light'); // Default theme

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.value = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark';
  }
});

// Provide theme and toggleTheme to child components
provide('theme', theme);
provide('toggleTheme', toggleTheme);
</script>

<style>
/* Light mode variables */
:root {
  --background: 0 0% 100%; /* white */
  --foreground: 222.2 84% 4.9%; /* black */
  --card: 0 0% 100%; /* white */
  --card-foreground: 222.2 84% 4.9%; /* black */
  --primary: 221.2 83.2% 53.3%; /* blue */
  --primary-foreground: 210 40% 98%; /* white */
  --secondary: 210 40% 96.1%; /* light gray */
  --secondary-foreground: 222.2 47.4% 11.2%; /* dark gray */
  --muted: 210 40% 96.1%; /* light gray */
  --muted-foreground: 215.4 16.3% 46.9%; /* medium gray */
  --accent: 210 40% 96.1%; /* light gray */
  --accent-foreground: 222.2 47.4% 11.2%; /* dark gray */
  --destructive: 0 84.2% 60.2%; /* red */
  --destructive-foreground: 210 40% 98%; /* white */
  --border: 214.3 31.8% 91.4%; /* light border */
  --input: 214.3 31.8% 91.4%; /* light input */
  --ring: 221.2 83.2% 53.3%; /* primary blue */
  --popover: 0 0% 100%; /* white */
  --popover-foreground: 222.2 84% 4.9%; /* black */
}

/* Dark mode variables */
.dark {
  --background: 222.2 84% 4.9%; /* dark blue-gray */
  --foreground: 210 40% 98%; /* light gray */
  --card: 222.2 84% 9%; /* slightly lighter dark blue-gray for elevated surfaces */
  --card-foreground: 210 40% 98%; /* light gray */
  --primary: 217.2 91.2% 59.8%; /* lighter blue */
  --primary-foreground: 222.2 47.4% 11.2%; /* dark blue-gray */
  --secondary: 217.2 32.6% 17.5%; /* darker gray */
  --secondary-foreground: 210 40% 98%; /* light gray */
  --muted: 217.2 32.6% 17.5%; /* darker gray */
  --muted-foreground: 215 20.2% 65.1%; /* lighter gray */
  --accent: 217.2 32.6% 17.5%; /* darker gray */
  --accent-foreground: 210 40% 98%; /* light gray */
  --destructive: 0 62.8% 30.6%; /* dark red */
  --destructive-foreground: 210 40% 98%; /* light gray */
  --border: 217.2 32.6% 17.5%; /* dark border */
  --input: 217.2 32.6% 17.5%; /* dark input */
  --ring: 217.2 91.2% 59.8%; /* primary blue */
  --popover: 222.2 84% 9%; /* slightly lighter dark blue-gray for popover */
  --popover-foreground: 210 40% 98%; /* light gray */
}
</style>
