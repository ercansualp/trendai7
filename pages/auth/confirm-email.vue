<template>
  <NuxtLayout name="auth">
    <div class="card p-8 relative">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary mb-2">E-posta Onayı</h1>
        <div v-if="loading" class="text-muted-foreground mb-6">
          <p>E-posta adresiniz onaylanıyor...</p>
          <div class="spinner mt-4"></div>
        </div>
        <div v-else>
          <p v-if="isConfirmed" class="text-green-600 font-semibold mb-6">
            E-posta adresiniz başarıyla onaylandı! Artık giriş yapabilirsiniz.
          </p>
          <p v-else-if="errorMessage" class="text-red-600 font-semibold mb-6">
            {{ errorMessage }}
          </p>
          <p v-else class="text-muted-foreground mb-6">
            E-posta adresinizi onaylamak için gelen kutunuzu kontrol edin.
            Onay bağlantısı e-postanıza gönderildi.
          </p>

          <p v-if="resendMessage" class="text-green-600 font-semibold mt-4 mb-2">
            {{ resendMessage }}
          </p>

          <p class="text-muted-foreground mb-6">
            E-postayı almadınız mı?
            <button @click="resendEmail" class="font-medium text-primary hover:underline focus:outline-none">Tekrar Gönder</button>
          </p>
        </div>
      </div>
      <p class="mt-6 text-center text-sm text-muted-foreground">
        Giriş sayfasına geri dönmek için
        <NuxtLink to="/auth/login" class="font-medium text-primary hover:underline">Giriş Yap</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Nuxt 3'te useRoute vue-router'dan gelir
import ThemeToggle from '~/components/ThemeToggle.vue';

const authStore = useAuthStore();

const route = useRoute();
const isConfirmed = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const resendMessage = ref(''); // Yeni eklendi

const confirmEmail = async () => {
  loading.value = true;
  const token = route.query.token;
  const email = route.query.email;
  
  try {
    const response = await authStore.confirmEmailAsync(email, token);
    
    if (response) { // Bu kısmı kendi token doğrulama mantığınıza göre değiştirin
      isConfirmed.value = true;
    } else {
      errorMessage.value = 'Geçersiz veya süresi dolmuş onay token\'ı.';
    }
  } catch (error) {
    errorMessage.value = 'E-posta onaylanırken bir hata oluştu. Lütfen tekrar deneyin.';
  } finally {
    loading.value = false;
  }
};

const resendEmail = async () => {
  isConfirmed.value = false;
  errorMessage.value = "";
  resendMessage.value = "";
  try {
    const response = await authStore.sendConfirmationEmailAsync(route.query.email);
    if(response)
    {
      resendMessage.value = 'Onay e-postası tekrar gönderildi! Gelen kutunuzu kontrol edin.';
    }
    else
    {
      errorMessage.value = 'E-posta tekrar gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
    }
  } catch (error) {
    errorMessage.value = 'E-posta tekrar gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
  }
};

onMounted(() => {
  if(route.query.email && route.query.token)
  {
    confirmEmail();
  }
});

definePageMeta({
  layout: false,
});
</script>

<style scoped>
/* Tailwind sınıfları yeterli */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db; /* Primary color for spinner */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
