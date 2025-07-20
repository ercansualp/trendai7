<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Etiket Yönetimi</h1>
      <p class="text-muted-foreground">Haber etiketlerini yönetin ve düzenleyin</p>
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
      <p class="ml-3 text-foreground">Etiketler yükleniyor...</p>
    </div>

    <div v-else class="card p-6 mb-6 relative">
      <!-- Filter Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Etiket ara..."
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

        <button @click="openTagModal('add')" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Yeni Etiket Ekle
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
                @click="sortBy('name')"
              >
                <div class="flex items-center">
                  Etiket
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'name' && sortOrder === 'asc', 'text-muted-foreground/50': !(sortKey === 'name' && sortOrder === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'name' && sortOrder === 'desc', 'text-muted-foreground/50': !(sortKey === 'name' && sortOrder === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortBy('usageCount')"
              >
                <div class="flex items-center">
                  Kullanım Sayısı
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'usageCount' && sortOrder === 'asc', 'text-muted-foreground/50': !(sortKey === 'usageCount' && sortOrder === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortKey === 'usageCount' && sortOrder === 'desc', 'text-muted-foreground/50': !(sortKey === 'usageCount' && sortOrder === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
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
            <tr v-for="tag in paginatedTags" :key="tag.id" class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {{ tag.name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ tag.usageCount || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(tag.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openTagModal('edit', tag)" class="text-primary hover:text-primary/80 mr-3 font-medium">Düzenle</button>
                <button @click="confirmDeleteTag(tag.id, tag.name)" class="text-destructive hover:text-destructive/80 font-medium">Sil</button>
              </td>
            </tr>
            <tr v-if="paginatedTags.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-muted-foreground">Etiket bulunamadı.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination Controls -->
      <div v-if="totalPages > 1 || filteredTags.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
        <div class="text-sm text-muted-foreground">
          {{ paginatedTags.length }} / {{ filteredTags.length }} etiket gösteriliyor
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
        <p class="ml-3 text-foreground text-lg">Etiketler yükleniyor...</p>
      </div>
    </div>

    <!-- Tag Modal -->
    <div v-if="isTagModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-2xl font-bold text-foreground mb-4">{{ modalMode === 'add' ? 'Yeni Etiket Ekle' : 'Etiket Düzenle' }}</h2>
        <form @submit.prevent="saveTag">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-muted-foreground mb-1">Etiket Adı *</label>
            <input type="text" id="name" v-model="currentTag.name" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required />
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="isTagModalOpen = false" :disabled="isSaving" class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">İptal</button>
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
      title="Etiketi Sil"
      :message="`'${tagToDeleteName}' adlı etiketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`"
      confirm-button-text="Sil"
      confirm-button-class="bg-destructive hover:bg-destructive/90"
      @confirm="executeDeleteTag"
      @cancel="cancelDeleteTag"
    />
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

const tags = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// New filter states for date
const startDate = ref('')
const endDate = ref('')

// Sorting states
const sortKey = ref(null) // Default sort key, null for unsorted
const sortOrder = ref(null) // 'asc', 'desc', or null for unsorted

const isTagModalOpen = ref(false)
const modalMode = ref('add')
const currentTag = ref({
  id: '',
  name: '',
  usageCount: 0,
  createdAt: null
})

const showConfirmDialog = ref(false)
const tagToDeleteId = ref(null)
const tagToDeleteName = ref('')

// Mock data
const mockTags = [
  {
    id: 'tag_001',
    name: 'yapay-zeka',
    usageCount: 15,
    createdAt: new Date('2023-01-15T10:00:00Z')
  },
  {
    id: 'tag_002',
    name: 'blockchain',
    usageCount: 8,
    createdAt: new Date('2023-02-20T14:30:00Z')
  },
  {
    id: 'tag_003',
    name: 'kripto-para',
    usageCount: 23,
    createdAt: new Date('2023-03-01T09:15:00Z')
  },
  {
    id: 'tag_004',
    name: 'mobil-uygulama',
    usageCount: 12,
    createdAt: new Date('2023-03-15T16:20:00Z')
  },
  {
    id: 'tag_005',
    name: 'siber-güvenlik',
    usageCount: 19,
    createdAt: new Date('2023-04-01T11:30:00Z')
  },
  {
    id: 'tag_006',
    name: 'veri-bilimi',
    usageCount: 7,
    createdAt: new Date('2023-04-20T10:00:00Z')
  },
  {
    id: 'tag_007',
    name: 'nesnelerin-interneti',
    usageCount: 10,
    createdAt: new Date('2023-05-05T14:30:00Z')
  },
  {
    id: 'tag_008',
    name: 'bulut-bilişim',
    usageCount: 14,
    createdAt: new Date('2023-05-18T09:15:00Z')
  },
  {
    id: 'tag_009',
    name: 'oyun-geliştirme',
    usageCount: 6,
    createdAt: new Date('2023-06-01T16:20:00Z')
  },
  {
    id: 'tag_010',
    name: 'web-tasarımı',
    usageCount: 25,
    createdAt: new Date('2023-06-10T11:30:00Z')
  },
  {
    id: 'tag_011',
    name: 'e-ticaret',
    usageCount: 18,
    createdAt: new Date('2023-07-01T10:00:00Z')
  },
  {
    id: 'tag_012',
    name: 'dijital-pazarlama',
    usageCount: 21,
    createdAt: new Date('2023-07-15T14:30:00Z')
  },
  {
    id: 'tag_013',
    name: 'robotik',
    usageCount: 9,
    createdAt: new Date('2023-08-01T09:15:00Z')
  },
  {
    id: 'tag_014',
    name: 'sanal-gerçeklik',
    usageCount: 5,
    createdAt: new Date('2023-08-10T16:20:00Z')
  },
  {
    id: 'tag_015',
    name: 'artırılmış-gerçeklik',
    usageCount: 4,
    createdAt: new Date('2023-09-01T11:30:00Z')
  },
  {
    id: 'tag_016',
    name: 'büyük-veri',
    usageCount: 13,
    createdAt: new Date('2023-09-15T10:00:00Z')
  },
  {
    id: 'tag_017',
    name: 'makine-öğrenimi',
    usageCount: 17,
    createdAt: new Date('2023-10-01T14:30:00Z')
  },
  {
    id: 'tag_018',
    name: 'derin-öğrenme',
    usageCount: 11,
    createdAt: new Date('2023-10-10T09:15:00Z')
  },
  {
    id: 'tag_019',
    name: 'doğal-dil-işleme',
    usageCount: 8,
    createdAt: new Date('2023-11-01T16:20:00Z')
  },
  {
    id: 'tag_020',
    name: 'görüntü-işleme',
    usageCount: 7,
    createdAt: new Date('2023-11-15T11:30:00Z')
  }
]

const sortedTags = computed(() => {
  const sortableTags = [...filteredTags.value]; // Create a shallow copy to avoid mutating original array
  if (!sortKey.value || !sortOrder.value) {
    // If no sort key or order is set, return as is (initial fetch order or default)
    // For example, sort by createdAt descending as a default "unsorted" order
    return sortableTags.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return sortableTags.sort((a, b) => {
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

const filteredTags = computed(() => {
  let filtered = tags.value;
  const query = searchQuery.value.toLowerCase();

  // Filter by search query
  if (query) {
    filtered = filtered.filter(tag =>
      tag.name.toLowerCase().includes(query)
    );
  }

  // Filter by date range
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;

  if (start || end) {
    filtered = filtered.filter(tag => {
      const tagCreatedAt = new Date(tag.createdAt);
      // Set time to 00:00:00 for start date to include the whole day
      const startOfDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      // Set time to 23:59:59 for end date to include the whole day
      const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

      const isAfterStart = startOfDay ? tagCreatedAt >= startOfDay : true;
      const isBeforeEnd = endOfDay ? tagCreatedAt <= endOfDay : true;

      return isAfterStart && isBeforeEnd;
    });
  }

  return filtered;
})

const totalPages = computed(() => Math.ceil(sortedTags.value.length / itemsPerPage.value))

const paginatedTags = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedTags.value.slice(start, end)
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

const fetchTags = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 700))
    tags.value = [...mockTags]
    showNotification('Etiketler başarıyla yüklendi!', 'success')
  } catch (error) {
    showNotification('Etiketler yüklenirken hata oluştu.', 'error')
  } finally {
    isLoading.value = false
  }
}

const openTagModal = (mode, tag = null) => {
  modalMode.value = mode
  if (mode === 'add') {
    currentTag.value = {
      id: 'tag_' + Math.random().toString(36).substring(2, 10),
      name: '',
      usageCount: 0,
      createdAt: new Date()
    }
  } else {
    currentTag.value = { ...tag }
  }
  isTagModalOpen.value = true
}

const saveTag = async () => {
  isSaving.value = true // Set saving state to true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    if (modalMode.value === 'add') {
      tags.value.push(currentTag.value)
      showNotification('Etiket başarıyla eklendi!', 'success')
    } else {
      const index = tags.value.findIndex(t => t.id === currentTag.value.id)
      if (index !== -1) {
        tags.value[index] = { ...currentTag.value }
        showNotification('Etiket başarıyla güncellendi!', 'success')
      }
    }
    isTagModalOpen.value = false
  } catch (error) {
    showNotification('İşlem sırasında hata oluştu.', 'error')
  } finally {
    isSaving.value = false // Reset saving state
  }
}

const confirmDeleteTag = (id, name) => {
  tagToDeleteId.value = id
  tagToDeleteName.value = name
  showConfirmDialog.value = true
}

const executeDeleteTag = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    tags.value = tags.value.filter(tag => tag.id !== tagToDeleteId.value)
    showNotification('Etiket başarıyla silindi!', 'success')
  } catch (error) {
    showNotification('Silme işlemi sırasında hata oluştu.', 'error')
  } finally {
    isLoading.value = false
    tagToDeleteId.value = null
    tagToDeleteName.value = ''
  }
}

const cancelDeleteTag = () => {
  tagToDeleteId.value = null
  tagToDeleteName.value = ''
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

watch([searchQuery, startDate, endDate], () => {
  currentPage.value = 1
  isTableLoading.value = true; // Set loading on search query change
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
})

onMounted(() => {
  fetchTags()
})
</script>
