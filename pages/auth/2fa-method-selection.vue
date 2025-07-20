<template>
  <NuxtLayout name="auth">
    <div class="card p-8 relative">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary mb-2">İki Faktörlü Doğrulama</h1>
        <p class="text-muted-foreground mb-6">Lütfen doğrulama yönteminizi seçin.</p>
      </div>
      <div class="space-y-4">
        <button @click="selectMethod('sms')" class="btn btn-outline w-full py-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-text mr-2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M13 8H7"/>
            <path d="M17 12H7"/>
          </svg>
          SMS ile Doğrula
        </button>
        <button @click="selectMethod('email')" class="btn btn-outline w-full py-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail mr-2">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          E-posta ile Doğrula
        </button>
        <button @click="selectMethod('authenticator')" class="btn btn-outline w-full py-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key mr-2">
            <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/>
            <circle cx="16.5" cy="7.5" r=".5"/>
          </svg>
          Authenticator Uygulaması
        </button>
      </div>
      <p class="mt-6 text-center text-sm text-muted-foreground">
        Giriş sayfasına geri dönmek için
        <NuxtLink to="/auth/login" class="font-medium text-primary hover:underline">Giriş Yap</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import ThemeToggle from '~/components/ThemeToggle.vue';

const selectMethod = (method) => {
  // Seçilen yöntemi query parametresi olarak göndererek kod giriş sayfasına yönlendir
  navigateTo(`/auth/2fa-code-entry?method=${method}`);
};

definePageMeta({
  layout: false,
});
</script>

<style scoped>
/* Tailwind sınıfları yeterli */
</style>
