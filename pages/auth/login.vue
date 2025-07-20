<template>
  <NuxtLayout name="auth">
    <div class="card p-8 relative">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary mb-2">Giriş Yap</h1>
        <p class="text-muted-foreground mb-6">Hesabınıza giriş yapmak için bilgilerinizi girin.</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
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
        <div>
          <label for="password" class="block text-sm font-medium text-foreground mb-1">Şifre</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="••••••••"
          />
          <div class="text-right mt-2">
            <NuxtLink to="/auth/forgot-password" class="text-sm font-medium text-primary hover:underline">Şifreni mi unuttun?</NuxtLink>
          </div>
        </div>
        <p v-if="errorMessage" class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
        <button type="submit" class="btn btn-primary w-full py-2" :disabled="loading">
          <span v-if="loading" class="spinner-small mr-2"></span>
          {{ loading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-muted-foreground">
        Hesabınız yok mu?
        <NuxtLink to="/auth/register" class="font-medium text-primary hover:underline">Kayıt Ol</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
import ThemeToggle from '~/components/ThemeToggle.vue';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;

  await authStore.loginAsync({
      email: email.value,
      password: password.value
    })
  loading.value = false;
};

definePageMeta({
  layout: false,
});
</script>

<style scoped>
/* Tailwind sınıfları yeterli olduğu için özel stil gerekmiyor */
.spinner-small {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
