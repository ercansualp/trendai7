<template>
  <NuxtLayout name="auth">
    <div class="card p-8 relative">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary mb-2">Şifreyi Sıfırla</h1>
        <p class="text-muted-foreground mb-6">Yeni şifrenizi belirleyin.</p>
      </div>
      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <div>
          <label for="new-password" class="block text-sm font-medium text-foreground mb-1">Yeni Şifre</label>
          <input
            type="password"
            id="new-password"
            v-model="newPassword"
            required
            class="w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label for="confirm-new-password" class="block text-sm font-medium text-foreground mb-1">Yeni Şifreyi Onayla</label>
          <input
            type="password"
            id="confirm-new-password"
            v-model="confirmNewPassword"
            required
            class="w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" class="btn btn-primary w-full py-2">Şifreyi Sıfırla</button>
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
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const newPassword = ref('');
const confirmNewPassword = ref('');

const handleResetPassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    alert('Şifreler eşleşmiyor!');
    return;
  }

  await authStore.resetPasswordAsync(route.query.resetCode, route.query.email, newPassword.value);
};

definePageMeta({
  layout: false,
});

onMounted(() => {
  if(!route.query.resetCode || !route.query.email)
  {
    router.push(localePath('/auth/login'));
  }
})
</script>

<style scoped>
/* Tailwind sınıfları yeterli */
</style>
