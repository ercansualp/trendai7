<template>
  <div class="min-h-screen flex items-center justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Bu layout için özel bir script gerekmiyor, sadece slot içeriğini render edecek.
</script>

<style scoped>
/* Bu layout için özel stil gerekmiyor, Tailwind sınıfları yeterli. */
</style>
