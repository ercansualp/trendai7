<template>
  <div class="container mx-auto py-8 px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Haber Önizleme</h1>
      <p class="text-muted-foreground">Seçilen haberin detaylarını önizleyin</p>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-96">
      <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="ml-3 text-foreground text-lg">Haber yükleniyor...</p>
    </div>

    <div v-else-if="!newsItem" class="card p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
      </svg>
      <h3 class="text-lg font-medium text-foreground mb-2">Haber bulunamadı</h3>
      <p class="text-muted-foreground mb-4">Aradığınız haber bulunamadı veya silinmiş olabilir.</p>
      <NuxtLink to="/cms/news" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-input rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-colors duration-200">
        Haber Yönetimine Geri Dön
      </NuxtLink>
    </div>

    <div v-else class="card p-6 flex flex-col">
      <!-- Geri Dön, Düzenle, Sil butonları ve Durum/Tip etiketleri - Haber Başlığının üstünde -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
        <div class="flex items-center mb-4 md:mb-0">
          <NuxtLink to="/cms/news" class="inline-flex items-center px-3 py-2 text-sm font-medium border border-input rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-colors duration-200 mr-2 md:mr-4">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Haber Yönetimine Dön
          </NuxtLink>
        </div>
        <div class="flex flex-wrap gap-2 justify-end">
          <NuxtLink :to="`/cms/news/edit/${newsItem.id}`" class="inline-flex items-center px-3 py-2 text-sm font-medium border border-input rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            Düzenle
          </NuxtLink>
          <button @click="handleDeleteNews" class="inline-flex items-center px-3 py-2 text-sm font-medium border border-transparent rounded-md text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:border-transparent shadow-sm transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Sil
          </button>
          <span :class="getStatusColor(newsItem.contentStatus)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
            {{ getStatusText(newsItem.contentStatus) }}
          </span>
          <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-secondary text-secondary-foreground">
            {{ getTypeText(newsItem.contentType) }}
          </span>
        </div>
      </div>

      <!-- Haber Başlığı - Tüm ekranlarda doğal sırada -->
      <h2 class="text-xl sm:text-2xl font-bold text-foreground break-words mb-4">
        {{ newsItem.title }}
      </h2>

      <!-- Haber Resmi - Tüm ekranlarda doğal sırada -->
      <div class="relative w-full h-64 sm:h-80 md:h-96 mb-6 rounded-lg overflow-hidden bg-muted">
        <img
          :src="newsItem.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
          :alt="newsItem.title"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-muted-foreground text-sm">
        <div class="flex items-center">
          <div
            class="w-8 h-8 rounded-full overflow-hidden mr-3 cursor-pointer flex-shrink-0"
            @click="openImageModal(newsItem.author?.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"
          >
            <img
              :src="newsItem.author?.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
              alt="Author Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <span>Yazar: <b class="text-foreground">{{ newsItem.author?.fullName || 'Bilinmiyor' }}</b></span>
        </div>
        <div class="flex items-center">
          <div
            class="w-6 h-6 object-contain mr-3 cursor-pointer flex-shrink-0"
            @click="openImageModal(getSourceLogo(newsItem.sourceId))"
          >
            <img
              :src="getSourceLogo(newsItem.sourceId)"
              alt="Source Logo"
              class="w-full h-full object-contain"
            />
          </div>
          <span>Kaynak: <b class="text-foreground">{{ getSourceName(newsItem.sourceId) }}</b></span>
        </div>
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <span>Kategori: <b class="text-foreground">{{ getCategoryName(newsItem.categoryId) }}</b></span>
        </div>
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>Yayın Tarihi: <b class="text-foreground">{{ formatDate(newsItem.publishedDate) }}</b></span>
        </div>
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Okuma Süresi: <b class="text-foreground">{{ newsItem.readingDuration }} dk</b></span>
        </div>
      </div>

      <div v-if="newsItem.tags && newsItem.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="tag in newsItem.tags"
          :key="tag.name"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
        >
          {{ tag.name }}
        </span>
      </div>

      <div class="prose prose-lg dark:prose-invert max-w-none text-foreground">
        <p class="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p class="mb-4">
          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus adipiscing euismod.
        </p>
        <p class="mb-4">
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus dictum.
        </p>
        <p class="mb-4">
          Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.
        </p>
        <p>
          Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui ligula, fringilla a, euismod sodales, sollicitudin vel, wisi.
        </p>
      </div>

      <div class="mt-8 pt-6 border-t border-border flex justify-end">
        <NuxtLink to="/cms/news" class="inline-flex items-center px-4 py-2 text-sm font-medium border border-input rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-colors duration-200">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Haber Yönetimine Geri Dön
        </NuxtLink>
      </div>
    </div>

    <!-- Image View Modal -->
    <div v-if="showImageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" @click="closeImageModal">
      <div class="relative bg-background rounded-lg shadow-xl p-4 max-w-lg w-full max-h-[90vh] overflow-hidden" @click.stop>
        <button
          class="absolute top-2 right-2 text-foreground hover:text-muted-foreground transition-colors duration-200"
          @click="closeImageModal"
          aria-label="Close image modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div class="flex items-center justify-center h-full">
          <img :src="modalImageUrl" alt="Enlarged Image" class="max-w-full max-h-[80vh] object-contain rounded-md" />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Haberi Sil"
      message="Bu haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      confirm-button-text="Sil"
      confirm-button-class="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, navigateTo } from '#app'
import ConfirmDialog from '~/components/ConfirmDialog.vue' // Import the ConfirmDialog component

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const newsItem = ref(null)
const isLoading = ref(true)

const showImageModal = ref(false)
const modalImageUrl = ref('')
const showConfirmDialog = ref(false) // New ref for confirmation modal

const openImageModal = (url) => {
  modalImageUrl.value = url
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  modalImageUrl.value = ''
}

const handleDeleteNews = () => {
  showConfirmDialog.value = true; // Open the confirmation modal
};

const confirmDelete = () => {
  if (newsItem.value && newsItem.value.id) {
    console.log(`Haber siliniyor: ${newsItem.value.id}`);
    // Gerçek bir API çağrısı burada yapılmalı
    // Örneğin: await $fetch(`/api/news/${newsItem.value.id}`, { method: 'DELETE' });
    // Silme başarılı olursa Haber Yönetimi sayfasına yönlendir:
    navigateTo('/cms/news');
  }
};

const cancelDelete = () => {
  console.log('Haber silme işlemi iptal edildi.');
  // Modal otomatik kapanır, ek bir işlem yapmaya gerek yok
};

// Mock data for authors (should be consistent with index.vue)
const authors = ref([
  { id: 'author_001', fullName: 'Ahmet Yılmaz', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_002', fullName: 'Fatma Demir', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_003', fullName: 'Mehmet Kaya', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_004', fullName: 'Ayşe Kara', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_005', fullName: 'Zeynep Can', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_006', fullName: 'Ali Veli', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_007', fullName: 'Deniz Ak', avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
]);

// Mock data for sources (should be consistent with index.vue)
const sources = ref([
  { id: 'source_001', name: 'TechCrunch', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TechCrunch_logo.svg/2560px-TechCrunch_logo.svg.png' },
  { id: 'source_002', name: 'BBC News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/BBC_News_2022.svg/1200px-BBC_News_2022.svg.png' },
  { id: 'source_003', name: 'Reuters', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Reuters_logo.svg/1280px-Reuters_logo.svg.png' },
  { id: 'source_004', name: 'Bloomberg HT', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Bloomberg_HT_logo.svg/1280px-Bloomberg_HT_logo.svg.png' },
  { id: 'source_005', name: 'Anadolu Ajansı', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Anadolu_Ajans%C4%B1_logo.svg/1280px-Anadolu_Ajans%C4%B1_logo.svg.png' }
])

// Mock data for categories (should be consistent with index.vue)
const categories = ref([
  { id: 'cat_001', name: 'Teknoloji' },
  { id: 'cat_002', name: 'Ekonomi' },
  { id: 'cat_003', name: 'Sağlık' },
  { id: 'cat_004', name: 'Spor' },
  { id: 'cat_005', name: 'Yaşam' },
  { id: 'cat_006', name: 'Bilim' },
  { id: 'cat_007', name: 'Eğitim' }
]);

// Mock data for news (should be consistent with index.vue)
const mockNews = [
  {
    id: 'news_001',
    title: 'Yapay Zeka Teknolojisinde Yeni Gelişmeler',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 5,
    publishedDate: new Date('2023-12-01T10:00:00Z'),
    author: { id: 'author_001', fullName: 'Ahmet Yılmaz', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_001',
    categoryId: 'cat_001',
    tags: [{ name: 'yapay-zeka' }, { name: 'teknoloji' }]
  },
  {
    id: 'news_002',
    title: 'Blockchain ve Kripto Para Piyasası Analizi',
    imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Draft',
    contentType: 'Article',
    readingDuration: 8,
    publishedDate: new Date('2023-12-02T14:30:00Z'),
    author: { id: 'author_002', fullName: 'Fatma Demir', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_004',
    categoryId: 'cat_002',
    tags: [{ name: 'blockchain' }, { name: 'kripto-para' }]
  },
  {
    id: 'news_003',
    title: 'Mobil Uygulama Geliştirme Trendleri',
    imageUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'Blog',
    readingDuration: 6,
    publishedDate: new Date('2023-12-03T09:15:00Z'),
    author: { id: 'author_003', fullName: 'Mehmet Kaya', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_002',
    categoryId: 'cat_001',
    tags: [{ name: 'mobil-uygulama' }, { name: 'geliştirme' }]
  },
  {
    id: 'news_004',
    title: 'Siber Güvenlik: 2024 Trendleri ve Öneriler',
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 7,
    publishedDate: new Date('2023-12-04T11:20:00Z'),
    author: { id: 'author_004', fullName: 'Ayşe Kara', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_003',
    categoryId: 'cat_001',
    tags: [{ name: 'siber-güvenlik' }, { name: 'teknoloji' }, { name: 'güvenlik' }]
  },
  {
    id: 'news_005',
    title: 'Bulut Bilişim Hizmetlerinde Son Gelişmeler',
    imageUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Archived',
    contentType: 'Article',
    readingDuration: 9,
    publishedDate: new Date('2023-11-28T16:45:00Z'),
    author: { id: 'author_003', fullName: 'Mehmet Kaya', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_001',
    categoryId: 'cat_001',
    tags: [{ name: 'bulut-bilişim' }, { name: 'teknoloji' }]
  },
  {
    id: 'news_006',
    title: 'E-ticaret Sektöründe Dijital Dönüşüm',
    imageUrl: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Draft',
    contentType: 'Blog',
    readingDuration: 4,
    publishedDate: new Date('2023-12-05T08:30:00Z'),
    author: { id: 'author_002', fullName: 'Fatma Demir', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_005',
    categoryId: 'cat_002',
    tags: [{ name: 'e-ticaret' }, { name: 'dijital-dönüşüm' }]
  },
  {
    id: 'news_007',
    title: 'Yenilenebilir Enerji Kaynakları ve Geleceği',
    imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 6,
    publishedDate: new Date('2023-12-06T10:00:00Z'),
    author: { id: 'author_005', fullName: 'Zeynep Can', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_002',
    categoryId: 'cat_006',
    tags: [{ name: 'enerji' }, { name: 'çevre' }]
  },
  {
    id: 'news_008',
    title: 'Finansal Teknolojilerde İnovasyon',
    imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'Article',
    readingDuration: 7,
    publishedDate: new Date('2023-12-07T11:30:00Z'),
    author: { id: 'author_006', fullName: 'Ali Veli', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_004',
    categoryId: 'cat_002',
    tags: [{ name: 'finans' }, { name: 'teknoloji' }]
  },
  {
    id: 'news_009',
    title: 'Uzay Keşiflerinde Yeni Ufuklar',
    imageUrl: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Draft',
    contentType: 'Blog',
    readingDuration: 5,
    publishedDate: new Date('2023-12-08T09:00:00Z'),
    author: { id: 'author_007', fullName: 'Deniz Ak', avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_003',
    categoryId: 'cat_006',
    tags: [{ name: 'uzay' }, { name: 'bilim' }]
  },
  {
    id: 'news_010',
    title: 'Geleceğin Şehirleri: Akıllı Kent Teknolojileri',
    imageUrl: 'https://images.pexels.com/photos/262919/pexels-photo-262919.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 6,
    publishedDate: new Date('2023-12-09T13:00:00Z'),
    author: { id: 'author_001', fullName: 'Ahmet Yılmaz', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_001',
    categoryId: 'cat_001',
    tags: [{ name: 'akıllı-şehir' }, { name: 'teknoloji' }]
  },
  {
    id: 'news_011',
    title: 'Yeşil Enerjiye Geçişte Yeni Adımlar',
    imageUrl: 'https://images.pexels.com/photos/159397/pexels-photo-159397.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'Article',
    readingDuration: 8,
    publishedDate: new Date('2023-12-10T15:45:00Z'),
    author: { id: 'author_005', fullName: 'Zeynep Can', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_002',
    categoryId: 'cat_006',
    tags: [{ name: 'yeşil-enerji' }, { name: 'çevre' }]
  },
  {
    id: 'news_012',
    title: 'Metaverse ve Sanal Gerçeklik Deneyimleri',
    imageUrl: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Draft',
    contentType: 'Blog',
    readingDuration: 7,
    publishedDate: new Date('2023-12-11T10:30:00Z'),
    author: { id: 'author_007', fullName: 'Deniz Ak', avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_003',
    categoryId: 'cat_001',
    tags: [{ name: 'metaverse' }, { name: 'sanal-gerçeklik' }]
  },
  {
    id: 'news_013',
    title: 'Kuantum Bilgisayarların Geleceği',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 9,
    publishedDate: new Date('2023-12-12T14:00:00Z'),
    author: { id: 'author_004', fullName: 'Ayşe Kara', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_003',
    categoryId: 'cat_006',
    tags: [{ name: 'kuantum' }, { name: 'bilgisayar' }]
  },
  {
    id: 'news_014',
    title: 'Biyoteknolojideki Son Yenilikler',
    imageUrl: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Archived',
    contentType: 'Article',
    readingDuration: 10,
    publishedDate: new Date('2023-12-13T11:00:00Z'),
    author: { id: 'author_006', fullName: 'Ali Veli', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_004',
    categoryId: 'cat_006',
    tags: [{ name: 'biyoteknoloji' }, { name: 'bilim' }]
  },
  {
    id: 'news_015',
    title: 'Uzaktan Çalışma Kültürünün Evrimi',
    imageUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'Blog',
    readingDuration: 5,
    publishedDate: new Date('2023-12-14T09:30:00Z'),
    author: { id: 'author_001', fullName: 'Ahmet Yılmaz', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_005',
    categoryId: 'cat_005',
    tags: [{ name: 'uzaktan-çalışma' }, { name: 'iş-hayatı' }]
  },
  {
    id: 'news_016',
    title: 'Sürdürülebilir Tarım Uygulamaları',
    imageUrl: 'https://images.pexels.com/photos/3861970/pexels-photo-3861970.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 6,
    publishedDate: new Date('2023-12-15T10:00:00Z'),
    author: { id: 'author_005', fullName: 'Zeynep Can', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_002',
    categoryId: 'cat_005',
    tags: [{ name: 'tarım' }, { name: 'sürdürülebilirlik' }]
  },
  {
    id: 'news_017',
    title: 'Yapay Zeka Destekli Sağlık Çözümleri',
    imageUrl: 'https://images.pexels.com/photos/3861971/pexels-photo-3861971.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Draft',
    contentType: 'Article',
    readingDuration: 8,
    publishedDate: new Date('2023-12-16T14:30:00Z'),
    author: { id: 'author_003', fullName: 'Mehmet Kaya', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_001',
    categoryId: 'cat_003',
    tags: [{ name: 'sağlık' }, { name: 'yapay-zeka' }]
  },
  {
    id: 'news_018',
    title: 'Eğitim Teknolojilerinde İnovasyon',
    imageUrl: 'https://images.pexels.com/photos/3861973/pexels-photo-3861973.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentStatus: 'Published',
    contentType: 'Blog',
    readingDuration: 7,
    publishedDate: new Date('2023-12-17T09:15:00Z'),
    author: { id: 'author_002', fullName: 'Fatma Demir', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    sourceId: 'source_004',
    categoryId: 'cat_007',
    tags: [{ name: 'eğitim' }, { name: 'teknoloji' }]
  },
]

onMounted(async () => {
  isLoading.value = true
  const newsId = route.params.id
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
    const foundNews = mockNews.find(n => n.id === newsId)
    if (foundNews) {
      // Ensure publishedDate is a Date object if it's not already
      foundNews.publishedDate = new Date(foundNews.publishedDate);
      newsItem.value = foundNews
    }
  } catch (error) {
    console.error('Failed to fetch news item:', error)
    // Optionally show a notification
  } finally {
    isLoading.value = false
  }
})

const getStatusColor = (status) => {
  const colors = {
    'Published': 'bg-green-100 text-green-800',
    'Draft': 'bg-yellow-100 text-yellow-800',
    'Archived': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    'Published': 'Yayınlandı',
    'Draft': 'Taslak',
    'Archived': 'Arşivlendi'
  }
  return texts[status] || status
}

const getTypeText = (type) => {
  const texts = {
    'News': 'Haber',
    'Article': 'Makale',
    'Blog': 'Blog'
  }
  return texts[type] || type
}

const getSourceName = (sourceId) => {
  const source = sources.value.find(s => s.id === sourceId)
  return source ? source.name : 'Bilinmiyor'
}

const getSourceLogo = (sourceId) => {
  const source = sources.value.find(s => s.id === sourceId)
  return source ? source.logo : 'https://via.placeholder.com/20x20?text=?' // Fallback logo
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Bilinmiyor';
};

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
/* Add any specific styles for the preview page here if needed */
/* For the prose class, ensure you have @tailwindcss/typography plugin installed and configured in tailwind.config.js */
</style>
