<template>
  <NuxtLayout name="auth">
    <div class="card p-8 relative">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary mb-2">Doğrulama Kodunu Girin</h1>
        <p class="text-muted-foreground mb-6">
          {{ instructionText }}
        </p>
      </div>
      <form @submit.prevent="verifyCode" class="space-y-6">
        <div>
          <label for="code" class="block text-sm font-medium text-foreground mb-1">Doğrulama Kodu</label>
          <input
            type="text"
            id="code"
            v-model="code"
            required
            class="w-full px-4 py-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground text-center text-lg tracking-widest"
            placeholder="XXXXXX"
            maxlength="6"
          />
        </div>
        <p v-if="errorMessage" class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-600 text-sm text-center">{{ successMessage }}</p>
        <button type="submit" class="btn btn-primary w-full py-2" :disabled="loading">
          <span v-if="loading" class="spinner-small mr-2"></span>
          {{ loading ? 'Doğrulanıyor...' : 'Doğrula' }}
        </button>
      </form>
      <div class="mt-6 text-center text-sm text-muted-foreground">
        <button @click="resendCode" class="font-medium text-primary hover:underline focus:outline-none" :disabled="resendLoading">
          <span v-if="resendLoading" class="spinner-small mr-2"></span>
          {{ resendLoading ? 'Tekrar Gönderiliyor...' : 'Kodu Tekrar Gönder' }}
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import ThemeToggle from '~/components/ThemeToggle.vue';

const route = useRoute();
const code = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);
const resendLoading = ref(false);
const selectedMethod = ref('');

onMounted(() => {
  selectedMethod.value = route.query.method || 'email'; // Varsayılan olarak e-posta
});

const instructionText = computed(() => {
  switch (selectedMethod.value) {
    case 'sms':
      return 'Telefon numaranıza gönderilen 6 haneli kodu girin.';
    case 'email':
      return 'E-posta adresinize gönderilen 6 haneli kodu girin.';
    case 'authenticator':
      return 'Authenticator uygulamanızdaki 6 haneli kodu girin.';
    default:
      return 'Doğrulama kodunu girin.';
  }
});

const verifyCode = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  // Gerçek bir uygulamada, bu kısımda kodu backend API'nize göndererek
  // 2FA doğrulama işlemini gerçekleştirmeniz gerekir.
  // Örneğin: await $fetch('/api/verify-2fa', { method: 'POST', body: { code: code.value, method: selectedMethod.value } });

  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 saniye bekleme

    if (code.value === '123456') { // Demo kodu, gerçekte backend'den gelecek
      successMessage.value = 'Doğrulama başarılı! Yönlendiriliyorsunuz...';
      // Başarılı doğrulama sonrası ana sayfaya veya dashboard'a yönlendir
      navigateTo('/'); // Bu sayfayı daha sonra oluşturacağız
    } else {
      errorMessage.value = 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.';
    }
  } catch (error) {
    console.error('2FA doğrulama hatası:', error);
    errorMessage.value = 'Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.';
  } finally {
    loading.value = false;
  }
};

const resendCode = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  resendLoading.value = true;

  // Gerçek bir uygulamada, bu kısımda backend API'nize kodu tekrar gönderme isteği yapmanız gerekir.
  // Örneğin: await $fetch('/api/resend-2fa-code', { method: 'POST', body: { method: selectedMethod.value } });

  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekleme
    successMessage.value = `Yeni kod ${selectedMethod.value === 'sms' ? 'telefonunuza' : selectedMethod.value === 'email' ? 'e-postanıza' : 'uygulamanıza'} gönderildi.`;
  } catch (error) {
    console.error('Kod tekrar gönderme hatası:', error);
    errorMessage.value = 'Kod tekrar gönderilirken bir hata oluştu.';
  } finally {
    resendLoading.value = false;
  }
};

definePageMeta({
  layout: false,
});
</script>

<style scoped>
/* Tailwind sınıfları yeterli */
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
