<template>
  <NuxtLayout name="auth">
    <div class="card p-8 relative">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary mb-2">Şifremi Unuttum</h1>
        <p class="text-muted-foreground mb-6">Şifrenizi sıfırlamak için e-posta adresinizi girin.</p>
      </div>
      <form @submit.prevent="handleForgotPassword" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-foreground mb-1">E-posta</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="eposta@example.com"
          />
        </div>
        <button type="submit" class="btn btn-primary w-full py-2" :disabled="loading">Şifre Sıfırlama Bağlantısı Gönder</button>
      </form>
      <p class="mt-6 text-center text-sm text-muted-foreground">
        Giriş sayfasına geri dönmek için
        <NuxtLink to="/auth/login" class="font-medium text-primary hover:underline">Giriş Yap</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
import ThemeToggle from '~/components/ThemeToggle.vue';

const authStore = useAuthStore();
const loading = ref(false);

const email = ref('');

const handleForgotPassword = async () => {
  loading.value = true;
  await authStore.forgotPasswordAsync(email.value);
  loading.value = false;
};

definePageMeta({
  layout: false,
});
</script>

<style scoped>
/* Tailwind sınıfları yeterli */
</style>
