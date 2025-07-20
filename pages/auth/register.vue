<template>
  <NuxtLayout name="auth">
    <div class="card p-8 relative">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary mb-2">Kayıt Ol</h1>
        <p class="text-muted-foreground mb-6">Yeni bir hesap oluşturmak için bilgilerinizi girin.</p>
      </div>
      <form @submit.prevent="handleRegister" class="space-y-6">
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
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-foreground mb-1">Şifreyi Onayla</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            required
            class="w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" class="btn btn-primary w-full py-2">Kayıt Ol</button>
      </form>
      <p class="mt-6 text-center text-sm text-muted-foreground">
        Zaten bir hesabınız var mı?
        <NuxtLink to="/auth/login" class="font-medium text-primary hover:underline">Giriş Yap</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue';
import ThemeToggle from '~/components/ThemeToggle.vue'; // ThemeToggle bileşenini import et

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Şifreler eşleşmiyor!');
    return;
  }
  
  await authStore.registerAsync({
    email: email.value,
    password: password.value
  });
};

// Layout'u belirtmek için Nuxt 3'te definePageMeta kullanılır
definePageMeta({
  layout: false, // auth layout'u NuxtLayout bileşeni ile manuel olarak kullanıldığı için false olarak ayarlanır
});
</script>

<style scoped>
/* Tailwind sınıfları yeterli olduğu için özel stil gerekmiyor */
</style>
