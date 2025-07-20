<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Yazar Yönetimi</h1>
      <p class="text-muted-foreground">Yazarları yönetin ve düzenleyin</p>
    </div>

    <div v-if="notification.message" class="p-4 mb-4 rounded-md text-white flex justify-between items-center"
      :class="{
        'bg-green-500': notification.type === 'success',
        'bg-red-500': notification.type === 'error',
        'bg-blue-500': notification.type === 'info'
      }">
      <span>{{ notification.message }}</span>
      <button @click="hideNotification" class="ml-4 text-white font-bold">&times;</button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="ml-3 text-foreground">Yazarlar yükleniyor...</p>
    </div>

    <div v-else class="card p-6 mb-6 relative">
      <!-- Filter Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Yazar ara..."
            class="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full shadow-sm"
            v-model="searchQuery"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear search"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <input
            type="date"
            v-model="startDate"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full sm:w-40"
            title="Başlangıç Tarihi"
          />
          <input
            type="date"
            v-model="endDate"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full sm:w-40"
            title="Bitiş Tarihi"
          />
        </div>

        <button @click="openAuthorModal('add')" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Yeni Yazar Ekle
        </button>
      </div>

      <div class="flex justify-end mb-4">
        <button
          @click="clearAllFilters"
          class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Filtreleri Temizle
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortBy('fullName')"
              >
                <div class="flex items-center">
                  Yazar
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'fullName' && sortOrder === 'asc', 'text-muted-foreground/50': !(sortKey === 'fullName' && sortOrder === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'fullName' && sortOrder === 'desc', 'text-muted-foreground/50': !(sortKey === 'fullName' && sortOrder === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortBy('title')"
              >
                <div class="flex items-center">
                  Unvan
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'title' && sortOrder === 'asc', 'text-muted-foreground/50': !(sortKey === 'title' && sortOrder === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'title' && sortOrder === 'desc', 'text-muted-foreground/50': !(sortKey === 'title' && sortOrder === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortBy('contentCount')"
              >
                <div class="flex items-center">
                  İçerik Sayısı
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'contentCount' && sortOrder === 'asc', 'text-muted-foreground/50': !(sortKey === 'contentCount' && sortOrder === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'contentCount' && sortOrder === 'desc', 'text-muted-foreground/50': !(sortKey === 'contentCount' && sortOrder === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortBy('createdAt')"
              >
                <div class="flex items-center">
                  Oluşturulma
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'createdAt' && sortOrder === 'asc', 'text-muted-foreground/50': !(sortKey === 'createdAt' && sortOrder === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'createdAt' && sortOrder === 'desc', 'text-muted-foreground/50': !(sortKey === 'createdAt' && sortOrder === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="author in paginatedAuthors" :key="author.id" class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground flex items-center">
                <img
                  :src="author.imageUrl || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
                  alt="Author Avatar"
                  class="w-10 h-10 rounded-full object-cover mr-3 cursor-pointer"
                  @click="openAvatarViewModal(author.imageUrl || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"
                />
                <span class="font-medium">{{ author.fullName }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ author.title || 'Belirtilmemiş' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ author.contentCount || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(author.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openAuthorModal('edit', author)" class="text-primary hover:text-primary/80 mr-3 font-medium">Düzenle</button>
                <button @click="confirmDeleteAuthor(author.id, author.fullName)" class="text-destructive hover:text-destructive/80 font-medium">Sil</button>
              </td>
            </tr>
            <tr v-if="paginatedAuthors.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-muted-foreground">Yazar bulunamadı.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination Controls -->
      <div v-if="totalPages > 1 || filteredAuthors.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
        <div class="text-sm text-muted-foreground">
          {{ paginatedAuthors.length }} / {{ filteredAuthors.length }} yazar gösteriliyor
        </div>
        <div class="flex justify-center items-center space-x-2">
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <span class="hidden sm:inline">İlk</span>
            <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <span class="hidden sm:inline">Önceki</span>
            <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <template v-for="(page, index) in visiblePages" :key="index">
            <span v-if="page === '...'" class="px-3 py-1 text-muted-foreground">...</span>
            <button
              v-else
              @click="goToPage(page)"
              :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
                currentPage === page ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted border border-input'
              ]"
            >
              {{ page }}
            </button>
          </template>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <span class="hidden sm:inline">Sonraki</span>
            <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <span class="hidden sm:inline">Son</span>
            <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading Overlay for Table Content -->
      <div v-if="isTableLoading" class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
        <svg class="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="ml-3 text-foreground text-lg">Yazarlar yükleniyor...</p>
      </div>
    </div>

    <!-- Author Modal -->
    <div v-if="isAuthorModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-2xl font-bold text-foreground mb-4">{{ modalMode === 'add' ? 'Yeni Yazar Ekle' : 'Yazar Düzenle' }}</h2>
        <form @submit.prevent="saveAuthor">
          <div class="mb-4">
            <label for="fullName" class="block text-sm font-medium text-muted-foreground mb-1">Ad Soyad *</label>
            <input type="text" id="fullName" v-model="currentAuthor.fullName" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required />
          </div>
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-muted-foreground mb-1">Unvan</label>
            <input type="text" id="title" v-model="currentAuthor.title" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
          </div>
          <div class="mb-4">
            <label for="imageUrl" class="block text-sm font-medium text-muted-foreground mb-1">Profil Resmi URL</label>
            <input type="url" id="imageUrl" v-model="currentAuthor.imageUrl" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
            <p class="text-xs text-muted-foreground mt-1">Veya cihazınızdan yükleyin:</p>
            <input type="file" ref="avatarFileInput" @change="handleAvatarUpload" accept="image/*" class="hidden" />
            <button type="button" @click="triggerFileInput" :disabled="isSaving" class="mt-2 inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              Cihazdan Yükle
            </button>
            <div v-if="currentAuthor.imageUrl" class="mt-4 flex items-center space-x-3">
              <img
                :src="currentAuthor.imageUrl"
                alt="Avatar Preview"
                class="w-20 h-20 object-contain border border-border rounded-md cursor-pointer"
                @click="openAvatarViewModal(currentAuthor.imageUrl)"
              />
              <button type="button" @click="clearAvatar" :disabled="isSaving" class="text-destructive hover:text-destructive/80 text-sm font-medium">Avatarı Temizle</button>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="isAuthorModalOpen = false" :disabled="isSaving" class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">İptal</button>
            <button type="submit" :disabled="isSaving" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? (modalMode === 'add' ? 'Ekleniyor...' : 'Güncelleniyor...') : (modalMode === 'add' ? 'Ekle' : 'Güncelle') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Yazarı Sil"
      :message="`'${authorToDeleteName}' adlı yazarı silmek istediğinizden emin misunuz? Bu işlem geri alınamaz.`"
      confirm-button-text="Sil"
      confirm-button-class="bg-destructive hover:bg-destructive/90"
      @confirm="executeDeleteAuthor"
      @cancel="cancelDeleteAuthor"
    />

    <!-- Avatar View Modal -->
    <div v-if="isAvatarViewModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4" @click.self="isAvatarViewModalOpen = false">
      <div class="relative bg-card rounded-lg shadow-xl p-4 max-w-lg max-h-full overflow-hidden flex flex-col items-center justify-center">
        <button @click="isAvatarViewModalOpen = false" class="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img :src="avatarToViewUrl" alt="Full size author avatar" class="max-w-full max-h-[80vh] object-contain rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

definePageMeta({
  layout: 'admin'
})

const isLoading = ref(true) // For initial page load
const isTableLoading = ref(false) // For pagination
const isSaving = ref(false) // For modal save button
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const authors = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// New filter states for date
const startDate = ref('')
const endDate = ref('')

// Sorting states
const sortKey = ref(null) // Default sort key, null for unsorted
const sortOrder = ref(null) // 'asc', 'desc', or null for unsorted

const isAuthorModalOpen = ref(false)
const modalMode = ref('add')
const currentAuthor = ref({
  id: '',
  fullName: '',
  title: '',
  imageUrl: '',
  contentCount: 0,
  createdAt: null
})

const showConfirmDialog = ref(false)
const authorToDeleteId = ref(null)
const authorToDeleteName = ref('')

// Ref for the hidden file input
const avatarFileInput = ref(null)

// New state for Avatar View Modal
const isAvatarViewModalOpen = ref(false);
const avatarToViewUrl = ref('');

// Mock data
const mockAuthors = [
  {
    id: 'author_001',
    fullName: 'Ahmet Yılmaz',
    title: 'Teknoloji Editörü',
    imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 15,
    createdAt: new Date('2023-01-15T10:00:00Z')
  },
  {
    id: 'author_002',
    fullName: 'Fatma Demir',
    title: 'Ekonomi Muhabiri',
    imageUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 23,
    createdAt: new Date('2023-02-20T14:30:00Z')
  },
  {
    id: 'author_003',
    fullName: 'Mehmet Kaya',
    title: 'Spor Yazarı',
    imageUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 8,
    createdAt: new Date('2023-03-01T09:15:00Z')
  },
  {
    id: 'author_004',
    fullName: 'Ayşe Can',
    title: 'Sanat Eleştirmeni',
    imageUrl: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 12,
    createdAt: new Date('2023-03-10T11:00:00Z')
  },
  {
    id: 'author_005',
    fullName: 'Burak Özdemir',
    title: 'Seyahat Blog Yazarı',
    imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 18,
    createdAt: new Date('2023-04-05T13:45:00Z')
  },
  {
    id: 'author_006',
    fullName: 'Cemre Yıldız',
    title: 'Moda Editörü',
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 7,
    createdAt: new Date('2023-04-22T09:00:00Z')
  },
  {
    id: 'author_007',
    fullName: 'Deniz Akın',
    title: 'Bilim Yazarı',
    imageUrl: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 20,
    createdAt: new Date('2023-05-01T16:00:00Z')
  },
  {
    id: 'author_008',
    fullName: 'Elif Güneş',
    title: 'Yaşam Koçu',
    imageUrl: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 10,
    createdAt: new Date('2023-05-15T10:30:00Z')
  },
  {
    id: 'author_009',
    fullName: 'Furkan Çelik',
    title: 'Oyun İncelemecisi',
    imageUrl: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 14,
    createdAt: new Date('2023-06-01T14:00:00Z')
  },
  {
    id: 'author_010',
    fullName: 'Gizem Erdem',
    title: 'Çevre Aktivisti',
    imageUrl: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentCount: 9,
    createdAt: new Date('2023-06-20T11:15:00Z')
  }
]

const sortedAuthors = computed(() => {
  const sortableAuthors = [...filteredAuthors.value]; // Create a shallow copy to avoid mutating original array
  if (!sortKey.value || !sortOrder.value) {
    // If no sort key or order is set, return as is (initial fetch order or default)
    // For example, sort by createdAt descending as a default "unsorted" order
    return sortableAuthors.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return sortableAuthors.sort((a, b) => {
    let aValue = a[sortKey.value];
    let bValue = b[sortKey.value];

    let comparison = 0;

    // Handle date comparison
    if (sortKey.value === 'createdAt') {
      const dateA = aValue ? new Date(aValue).getTime() : 0;
      const dateB = bValue ? new Date(bValue).getTime() : 0;
      comparison = dateA - dateB;
    } else if (typeof aValue === 'string') {
      // Handle string comparison (case-insensitive)
      const stringA = String(aValue || '').toLowerCase();
      const stringB = String(bValue || '').toLowerCase();
      if (stringA < stringB) {
        comparison = -1;
      } else if (stringA > stringB) {
        comparison = 1;
      }
    } else {
      // Handle numeric comparison
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
    }

    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
});

const filteredAuthors = computed(() => {
  let filtered = authors.value;
  const query = searchQuery.value.toLowerCase();

  // Filter by search query
  if (query) {
    filtered = filtered.filter(author =>
      author.fullName.toLowerCase().includes(query) ||
      (author.title && author.title.toLowerCase().includes(query))
    );
  }

  // Filter by date range
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;

  if (start || end) {
    filtered = filtered.filter(author => {
      const authorCreatedAt = new Date(author.createdAt);
      // Set time to 00:00:00 for start date to include the whole day
      const startOfDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      // Set time to 23:59:59 for end date to include the whole day
      const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

      const isAfterStart = startOfDay ? authorCreatedAt >= startOfDay : true;
      const isBeforeEnd = endOfDay ? authorCreatedAt <= endOfDay : true;

      return isAfterStart && isBeforeEnd;
    });
  }

  return filtered;
})

const totalPages = computed(() => Math.ceil(sortedAuthors.value.length / itemsPerPage.value))

const paginatedAuthors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedAuthors.value.slice(start, end)
})

// Computed property for modern pagination page numbers
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  const maxVisible = 5; // Max number of page buttons to show (e.g., 1 2 3 ... 10)

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Determine start and end of the middle block
    let start = Math.max(2, current - Math.floor(maxVisible / 2) + 1);
    let end = Math.min(total - 1, current + Math.floor(maxVisible / 2) - 1);

    if (current < maxVisible - 1) {
      end = maxVisible - 1;
    } else if (current > total - (maxVisible - 2)) {
      start = total - (maxVisible - 2);
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(total);
  }
  return pages;
});

const showNotification = (message, type) => {
  notification.value = { message, type }
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = setTimeout(() => hideNotification(), 5000)
}

const hideNotification = () => {
  notification.value = { message: '', type: '' }
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
    notificationTimeout = null
  }
}

const fetchAuthors = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 700))
    authors.value = [...mockAuthors]
    showNotification('Yazarlar başarıyla yüklendi!', 'success')
  } catch (error) {
    showNotification('Yazarlar yüklenirken hata oluştu.', 'error')
  } finally {
    isLoading.value = false
  }
}

const openAuthorModal = (mode, author = null) => {
  modalMode.value = mode
  if (mode === 'add') {
    currentAuthor.value = {
      id: 'author_' + Math.random().toString(36).substring(2, 10),
      fullName: '',
      title: '',
      imageUrl: '',
      contentCount: 0,
      createdAt: new Date()
    }
  } else {
    currentAuthor.value = { ...author }
  }
  isAuthorModalOpen.value = true
  // Reset file input when opening modal
  if (avatarFileInput.value) {
    avatarFileInput.value.value = '';
  }
}

const saveAuthor = async () => {
  isSaving.value = true // Set saving state to true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (modalMode.value === 'add') {
      authors.value.push(currentAuthor.value)
      showNotification('Yazar başarıyla eklendi!', 'success')
    } else {
      const index = authors.value.findIndex(a => a.id === currentAuthor.value.id)
      if (index !== -1) {
        authors.value[index] = { ...currentAuthor.value }
        showNotification('Yazar başarıyla güncellendi!', 'success')
      }
    }
    isAuthorModalOpen.value = false
  } catch (error) {
    showNotification('İşlem sırasında hata oluştu.', 'error')
  } finally {
    isSaving.value = false // Reset saving state
  }
}

const confirmDeleteAuthor = (id, name) => {
  authorToDeleteId.value = id
  authorToDeleteName.value = name
  showConfirmDialog.value = true
}

const executeDeleteAuthor = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    authors.value = authors.value.filter(author => author.id !== authorToDeleteId.value)
    showNotification('Yazar başarıyla silindi!', 'success')
  } catch (error) {
    showNotification('Silme işlemi sırasında hata oluştu.', 'error')
  } finally {
    isLoading.value = false
    authorToDeleteId.value = null
    authorToDeleteName.value = ''
  }
}

const cancelDeleteAuthor = () => {
  authorToDeleteId.value = null
  authorToDeleteName.value = ''
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    isTableLoading.value = true; // Set loading
    currentPage.value++;
    setTimeout(() => {
      isTableLoading.value = false;
    }, 300); // Simulate loading time
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    isTableLoading.value = true; // Set loading
    currentPage.value--;
    setTimeout(() => {
      isTableLoading.value = false;
    }, 300); // Simulate loading time
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    isTableLoading.value = true; // Set loading
    currentPage.value = page;
    setTimeout(() => {
      isTableLoading.value = false;
    }, 300); // Simulate loading time
  }
};

// Function to clear search query
const clearSearch = () => {
  searchQuery.value = '';
};

// Function to clear all filters
const clearAllFilters = () => {
  searchQuery.value = '';
  startDate.value = '';
  endDate.value = '';
  // The watch on filter states will handle resetting currentPage and isTableLoading
};

// Function to open Avatar View Modal
const openAvatarViewModal = (url) => {
  avatarToViewUrl.value = url;
  isAvatarViewModalOpen.value = true;
};

// Sorting method
const sortBy = (key) => {
  isTableLoading.value = true; // Start loading
  if (sortKey.value === key) {
    // If clicking the same column
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc';
    } else if (sortOrder.value === 'desc') {
      sortOrder.value = null; // Unsort
      sortKey.value = null; // Clear column as well
    } else {
      // Currently unsorted for this column, start ascending
      sortOrder.value = 'asc';
    }
  } else {
    // If clicking a new column
    sortKey.value = key;
    sortOrder.value = 'asc'; // Default to ascending for a new column
  }
  currentPage.value = 1; // Reset to first page after sorting/unsorting

  setTimeout(() => {
    isTableLoading.value = false; // End loading
  }, 300); // Simulate loading time
};

// Image upload functions
const triggerFileInput = () => {
  avatarFileInput.value.click();
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      showNotification('Lütfen bir resim dosyası seçin.', 'error');
      currentAuthor.value.imageUrl = '';
      if (avatarFileInput.value) avatarFileInput.value.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentAuthor.value.imageUrl = e.target.result;
    };
    reader.onerror = () => {
      showNotification('Dosya okuma hatası.', 'error');
      currentAuthor.value.imageUrl = '';
      if (avatarFileInput.value) avatarFileInput.value.value = '';
    };
    reader.readAsDataURL(file);
  } else {
    currentAuthor.value.imageUrl = '';
  }
};

const clearAvatar = () => {
  currentAuthor.value.imageUrl = '';
  if (avatarFileInput.value) {
    avatarFileInput.value.value = ''; // Clear the file input
  }
};

watch([searchQuery, startDate, endDate], () => {
  currentPage.value = 1
  isTableLoading.value = true; // Set loading on search query change
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
})

onMounted(() => {
  fetchAuthors()
})
</script>
