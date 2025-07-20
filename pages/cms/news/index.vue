<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Haber Yönetimi</h1>
      <p class="text-muted-foreground">Haberleri yönetin ve düzenleyin</p>
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
      <p class="ml-3 text-foreground">Haberler yükleniyor...</p>
    </div>

    <div v-else class="relative"> <!-- Added relative positioning here for the overlay -->
      <!-- Filter Controls -->
      <div class="card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Haber ara..."
              class="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full shadow-sm"
              v-model="searchQuery"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label="Clear search"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Status Multi-select Filter -->
          <div class="relative" v-click-outside="() => isStatusDropdownOpen = false">
            <button
              @click="isStatusDropdownOpen = !isStatusDropdownOpen"
              class="flex justify-between items-center w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            >
              <span>{{ selectedStatus.length === 0 ? 'Tüm Durumlar' : `${selectedStatus.length} durum seçildi` }}</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{ 'rotate-180': isStatusDropdownOpen }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="isStatusDropdownOpen" class="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div class="p-2">
                <input
                  type="text"
                  placeholder="Durum ara..."
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                  v-model="statusSearchQuery"
                  @click.stop
                />
              </div>
              <label v-for="statusOption in filteredAvailableStatuses" :key="statusOption.value" class="flex items-center px-4 py-2 hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  :value="statusOption.value"
                  v-model="selectedStatus"
                  class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span class="ml-2 text-foreground">{{ statusOption.text }}</span>
              </label>
              <div v-if="filteredAvailableStatuses.length === 0" class="px-4 py-2 text-muted-foreground text-sm">
                Sonuç bulunamadı.
              </div>
            </div>
          </div>

          <!-- Author Multi-select Filter -->
          <div class="relative" v-click-outside="() => isAuthorDropdownOpen = false">
            <button
              @click="isAuthorDropdownOpen = !isAuthorDropdownOpen"
              class="flex justify-between items-center w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            >
              <span>{{ selectedAuthors.length === 0 ? 'Tüm Yazarlar' : `${selectedAuthors.length} yazar seçildi` }}</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{ 'rotate-180': isAuthorDropdownOpen }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="isAuthorDropdownOpen" class="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div class="p-2">
                <input
                  type="text"
                  placeholder="Yazar ara..."
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                  v-model="authorSearchQuery"
                  @click.stop
                />
              </div>
              <label v-for="author in filteredAvailableAuthors" :key="author.id" class="flex items-center px-4 py-2 hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  :value="author.id"
                  v-model="selectedAuthors"
                  class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <img
                  :src="author.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
                  alt="Author Avatar"
                  class="w-6 h-6 rounded-full object-cover ml-2 mr-2"
                />
                <span class="text-foreground">{{ author.fullName }}</span>
              </label>
              <div v-if="filteredAvailableAuthors.length === 0" class="px-4 py-2 text-muted-foreground text-sm">
                Sonuç bulunamadı.
              </div>
            </div>
          </div>

          <!-- Source Multi-select Filter -->
          <div class="relative" v-click-outside="() => isSourceDropdownOpen = false">
            <button
              @click="isSourceDropdownOpen = !isSourceDropdownOpen"
              class="flex justify-between items-center w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            >
              <span>{{ selectedSources.length === 0 ? 'Tüm Kaynaklar' : `${selectedSources.length} kaynak seçildi` }}</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{ 'rotate-180': isSourceDropdownOpen }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="isSourceDropdownOpen" class="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div class="p-2">
                <input
                  type="text"
                  placeholder="Kaynak ara..."
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                  v-model="sourceSearchQuery"
                  @click.stop
                />
              </div>
              <label v-for="source in filteredSources" :key="source.id" class="flex items-center px-4 py-2 hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  :value="source.id"
                  v-model="selectedSources"
                  class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <img
                  :src="source.logo || 'https://via.placeholder.com/20x20?text=?'"
                  alt="Source Logo"
                  class="w-6 h-6 object-contain ml-2 mr-2"
                />
                <span class="text-foreground">{{ source.name }}</span>
              </label>
              <div v-if="filteredSources.length === 0" class="px-4 py-2 text-muted-foreground text-sm">
                Sonuç bulunamadı.
              </div>
            </div>
          </div>

          <!-- Category Multi-select Filter -->
          <div class="relative" v-click-outside="() => isCategoryDropdownOpen = false">
            <button
              @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
              class="flex justify-between items-center w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            >
              <span>{{ selectedCategories.length === 0 ? 'Tüm Kategoriler' : `${selectedCategories.length} kategori seçildi` }}</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{ 'rotate-180': isCategoryDropdownOpen }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="isCategoryDropdownOpen" class="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div class="p-2">
                <input
                  type="text"
                  placeholder="Kategori ara..."
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                  v-model="categorySearchQuery"
                  @click.stop
                />
              </div>
              <label v-for="category in filteredCategories" :key="category.id" class="flex items-center px-4 py-2 hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  :value="category.id"
                  v-model="selectedCategories"
                  class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span class="ml-2 text-foreground">{{ category.name }}</span>
              </label>
              <div v-if="filteredCategories.length === 0" class="px-4 py-2 text-muted-foreground text-sm">
                Sonuç bulunamadı.
              </div>
            </div>
          </div>

          <!-- Tags Multi-select Filter -->
          <div class="relative" v-click-outside="() => isTagDropdownOpen = false">
            <button
              @click="isTagDropdownOpen = !isTagDropdownOpen"
              class="flex justify-between items-center w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            >
              <span>{{ selectedTags.length === 0 ? 'Tüm Etiketler' : `${selectedTags.length} etiket seçildi` }}</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{ 'rotate-180': isTagDropdownOpen }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="isTagDropdownOpen" class="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div class="p-2">
                <input
                  type="text"
                  placeholder="Etiket ara..."
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                  v-model="tagSearchQuery"
                  @click.stop
                />
              </div>
              <label v-for="tag in filteredAvailableTags" :key="tag.name" class="flex items-center px-4 py-2 hover:bg-muted cursor-pointer">
                <input
                  type="checkbox"
                  :value="tag.name"
                  v-model="selectedTags"
                  class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span class="ml-2 text-foreground">{{ tag.name }}</span>
              </label>
              <div v-if="filteredAvailableTags.length === 0" class="px-4 py-2 text-muted-foreground text-sm">
                Sonuç bulunamadı.
              </div>
            </div>
          </div>

          <!-- Date Range Filters -->
          <input
            type="date"
            v-model="startDate"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full"
            title="Başlangıç Tarihi"
          />
          <input
            type="date"
            v-model="endDate"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full"
            title="Bitiş Tarihi"
          />

          <div class="flex space-x-2 col-span-full md:col-span-2">
            <button @click="clearFilters" class="inline-flex items-center justify-center px-3 py-1.5 text-sm border border-input rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full">
              Filtreleri Temizle
            </button>
            <NuxtLink to="/cms/news/add" class="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 w-full">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Yeni Haber
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- News Cards Grid -->
      <div v-if="paginatedNews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div v-for="news in paginatedNews" :key="news.id" class="card overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
          <!-- News Image -->
          <div class="relative h-48 bg-muted">
            <img
              :src="news.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
              :alt="news.title"
              class="w-full h-full object-cover"
            />
            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span :class="getStatusColor(news.contentStatus)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getStatusText(news.contentStatus) }}
              </span>
            </div>
            <!-- Type Badge -->
            <div class="absolute top-3 left-3">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
                {{ getTypeText(news.contentType) }}
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-6 flex flex-col flex-grow">
            <!-- Title -->
            <h3 class="text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-tight" :title="news.title">
              {{ news.title }}
            </h3>

            <!-- Author, Source and Reading Time -->
            <div class="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div class="flex items-center">
                <img
                  :src="news.author?.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
                  alt="Author Avatar"
                  class="w-6 h-6 rounded-full object-cover mr-2 cursor-pointer"
                  @click="openAvatarViewModal(news.author?.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"
                />
                <span>{{ news.author?.fullName || 'Bilinmiyor' }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ news.readingDuration }} dk</span>
              </div>
            </div>

            <!-- Source -->
            <div class="flex items-center text-sm text-muted-foreground mb-4">
              <img
                :src="getSourceLogo(news.sourceId)"
                alt="Source Logo"
                class="w-5 h-5 object-contain mr-2 cursor-pointer"
                @click="openAvatarViewModal(getSourceLogo(news.sourceId))"
              />
              <span>{{ getSourceName(news.sourceId) }}</span>
            </div>

            <!-- Category -->
            <div class="flex items-center text-sm text-muted-foreground mb-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span>{{ getCategoryName(news.categoryId) }}</span>
            </div>

            <!-- Published Date -->
            <div class="flex items-center text-sm text-muted-foreground mb-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ formatDate(news.publishedDate) }}</span>
            </div>

            <!-- Tags (if any) -->
            <div v-if="news.tags && news.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="tag in news.tags.slice(0, 3)"
                :key="tag.name"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {{ tag.name }}
              </span>
              <span v-if="news.tags.length > 3" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                +{{ news.tags.length - 3 }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center pt-4 border-t border-border mt-auto">
              <button
                @click="previewNews(news.id)"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-100 rounded-md transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Önizle
              </button>
              <button
                @click="editNews(news)"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Düzenle
              </button>
              <button
                @click="confirmDeleteNews(news.id, news.title)"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Sil
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
        </svg>
        <h3 class="text-lg font-medium text-foreground mb-2">Haber bulunamadı</h3>
        <p class="text-muted-foreground mb-4">Arama kriterlerinize uygun haber bulunmuyor.</p>
        <button @click="clearFilters" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-input rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-colors duration-200">
          Filtreleri Temizle
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 || filteredNews.length > 0" class="card p-4">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div class="text-sm text-muted-foreground">
            {{ paginatedNews.length }} / {{ filteredNews.length }} haber gösteriliyor
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
      </div>

      <!-- Loading Overlay for Table Content -->
      <div v-if="isTableLoading" class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
        <svg class="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="ml-3 text-foreground text-lg">Haberler yükleniyor...</p>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Haberi Sil"
      :message="`'${newsToDeleteTitle}' adlı haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`"
      confirm-button-text="Sil"
      confirm-button-class="bg-destructive hover:bg-destructive/90"
      @confirm="executeDeleteNews"
      @cancel="cancelDeleteNews"
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

// Directive to close dropdowns when clicking outside
const vClickOutside = {
  mounted(el, binding) {
    el.__ClickOutsideHandler__ = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.__ClickOutsideHandler__);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.__ClickOutsideHandler__);
  },
};

const isLoading = ref(true)
const isTableLoading = ref(false) // For filtering and pagination
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const news = ref([])
const searchQuery = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(9) // 3x3 grid için 9 item

const showConfirmDialog = ref(false)
const newsToDeleteId = ref(null)
const newsToDeleteTitle = ref('')

// New state for Avatar View Modal
const isAvatarViewModalOpen = ref(false);
const avatarToViewUrl = ref('');

// Multi-select filter states
const selectedAuthors = ref([]);
const selectedSources = ref([]);
const selectedStatus = ref([]); // Changed to array for multi-select
const selectedCategories = ref([]); // New state for multi-select categories
const selectedTags = ref([]); // New state for multi-select tags
const isAuthorDropdownOpen = ref(false);
const isSourceDropdownOpen = ref(false);
const isStatusDropdownOpen = ref(false); // New state for status dropdown
const isCategoryDropdownOpen = ref(false); // New state for category dropdown
const isTagDropdownOpen = ref(false); // New state for tag dropdown

// Date range filter states
const startDate = ref('');
const endDate = ref('');

// Search queries for dropdowns
const statusSearchQuery = ref('');
const authorSearchQuery = ref('');
const sourceSearchQuery = ref('');
const categorySearchQuery = ref('');
const tagSearchQuery = ref(''); // New state for tag search

// Available status options
const availableStatuses = ref([
  { value: 'Draft', text: 'Taslak' },
  { value: 'Published', text: 'Yayınlandı' },
  { value: 'Archived', text: 'Arşivlendi' }
]);

// Mock data for authors
const authors = ref([
  { id: 'author_001', fullName: 'Ahmet Yılmaz', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_002', fullName: 'Fatma Demir', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_003', fullName: 'Mehmet Kaya', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_004', fullName: 'Ayşe Kara', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_005', fullName: 'Zeynep Can', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_006', fullName: 'Ali Veli', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
  { id: 'author_007', fullName: 'Deniz Ak', avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
]);

// Mock data for sources (aligned with add.vue)
const sources = ref([
  { id: 'source_001', name: 'TechCrunch', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TechCrunch_logo.svg/2560px-TechCrunch_logo.svg.png' },
  { id: 'source_002', name: 'BBC News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/BBC_News_2022.svg/1200px-BBC_News_2022.svg.png' },
  { id: 'source_003', name: 'Reuters', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Reuters_logo.svg/1280px-Reuters_logo.svg.png' },
  { id: 'source_004', name: 'Bloomberg HT', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Bloomberg_HT_logo.svg/1280px-Bloomberg_HT_logo.svg.png' },
  { id: 'source_005', name: 'Anadolu Ajansı', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Anadolu_Ajans%C4%B1_logo.svg/1280px-Anadolu_Ajans%C4%B1_logo.svg.png' }
])

// Mock data for categories
const categories = ref([
  { id: 'cat_001', name: 'Teknoloji' },
  { id: 'cat_002', name: 'Ekonomi' },
  { id: 'cat_003', name: 'Sağlık' },
  { id: 'cat_004', name: 'Spor' },
  { id: 'cat_005', name: 'Yaşam' },
  { id: 'cat_006', name: 'Bilim' },
  { id: 'cat_007', name: 'Eğitim' }
]);

// Mock data for news
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

const availableAuthors = computed(() => {
  // Get unique authors from mockNews, or use a predefined list if available
  const uniqueAuthors = new Map();
  mockNews.forEach(newsItem => {
    if (newsItem.author && !uniqueAuthors.has(newsItem.author.id)) {
      uniqueAuthors.set(newsItem.author.id, newsItem.author);
    }
  });
  return Array.from(uniqueAuthors.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
});

// Computed property for unique tags from mockNews
const availableTags = computed(() => {
  const uniqueTags = new Map();
  mockNews.forEach(newsItem => {
    if (newsItem.tags) {
      newsItem.tags.forEach(tag => {
        if (!uniqueTags.has(tag.name)) {
          uniqueTags.set(tag.name, tag);
        }
      });
    }
  });
  return Array.from(uniqueTags.values()).sort((a, b) => a.name.localeCompare(b.name));
});

// Filtered computed properties for dropdowns
const filteredAvailableStatuses = computed(() => {
  if (!statusSearchQuery.value) {
    return availableStatuses.value;
  }
  const query = statusSearchQuery.value.toLowerCase();
  return availableStatuses.value.filter(status =>
    status.text.toLowerCase().includes(query)
  );
});

const filteredAvailableAuthors = computed(() => {
  if (!authorSearchQuery.value) {
    return availableAuthors.value;
  }
  const query = authorSearchQuery.value.toLowerCase();
  return availableAuthors.value.filter(author =>
    author.fullName.toLowerCase().includes(query)
  );
});

const filteredSources = computed(() => {
  if (!sourceSearchQuery.value) {
    return sources.value;
  }
  const query = sourceSearchQuery.value.toLowerCase();
  return sources.value.filter(source =>
    source.name.toLowerCase().includes(query)
  );
});

const filteredCategories = computed(() => {
  if (!categorySearchQuery.value) {
    return categories.value;
  }
  const query = categorySearchQuery.value.toLowerCase();
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(query)
  );
});

const filteredAvailableTags = computed(() => {
  if (!tagSearchQuery.value) {
    return availableTags.value;
  }
  const query = tagSearchQuery.value.toLowerCase();
  return availableTags.value.filter(tag =>
    tag.name.toLowerCase().includes(query)
  );
});


const filteredNews = computed(() => {
  let filtered = news.value

  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.author?.fullName && item.author.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (getSourceName(item.sourceId).toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (getCategoryName(item.categoryId).toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // Filter by selected status (multi-select)
  if (selectedStatus.value.length > 0) {
    filtered = filtered.filter(item => selectedStatus.value.includes(item.contentStatus));
  }

  if (selectedType.value) {
    filtered = filtered.filter(item => item.contentType === selectedType.value)
  }

  // Filter by selected authors
  if (selectedAuthors.value.length > 0) {
    filtered = filtered.filter(item => selectedAuthors.value.includes(item.author?.id));
  }

  // Filter by selected sources
  if (selectedSources.value.length > 0) {
    filtered = filtered.filter(item => selectedSources.value.includes(item.sourceId));
  }

  // Filter by selected categories
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(item => selectedCategories.value.includes(item.categoryId));
  }

  // Filter by selected tags
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(item =>
      item.tags && item.tags.some(tag => selectedTags.value.includes(tag.name))
    );
  }

  // Filter by date range
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;

  if (start || end) {
    filtered = filtered.filter(item => {
      const itemPublishedDate = new Date(item.publishedDate);
      // Set time to 00:00:00 for start date to include the whole day
      const startOfDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      // Set time to 23:59:59 for end date to include the whole day
      const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

      const isAfterStart = startOfDay ? itemPublishedDate >= startOfDay : true;
      const isBeforeEnd = endOfDay ? itemPublishedDate <= endOfDay : true;

      return isAfterStart && isBeforeEnd;
    });
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredNews.value.length / itemsPerPage.value))

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredNews.value.slice(start, end)
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

const fetchNews = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 700))
    news.value = [...mockNews]
    showNotification('Haberler başarıyla yüklendi!', 'success')
  } catch (error) {
    showNotification('Haberler yüklenirken hata oluştu.', 'error')
  } finally {
    isLoading.value = false
  }
}

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

const editNews = (newsItem) => {
  // Navigate to edit page
  navigateTo(`/cms/news/edit/${newsItem.id}`)
}

const previewNews = (newsId) => {
  // Navigate to preview page
  navigateTo(`/cms/news/preview/${newsId}`)
}

const confirmDeleteNews = (id, title) => {
  newsToDeleteId.value = id
  newsToDeleteTitle.value = title
  showConfirmDialog.value = true
}

const executeDeleteNews = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    news.value = news.value.filter(item => item.id !== newsToDeleteId.value)
    showNotification('Haber başarıyla silindi!', 'success')
  } catch (error) {
    showNotification('Silme işlemi sırasında hata oluştu.', 'error')
  } finally {
    isLoading.value = false
    newsToDeleteId.value = null
    newsToDeleteTitle.value = ''
  }
}

const cancelDeleteNews = () => {
  newsToDeleteId.value = null
  newsToDeleteTitle.value = ''
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = [] // Reset to empty array
  selectedType.value = ''
  selectedAuthors.value = []
  selectedSources.value = []
  selectedCategories.value = [] // Reset categories
  selectedTags.value = [] // Reset tags
  startDate.value = ''; // Reset start date
  endDate.value = ''; // Reset end date
  currentPage.value = 1
  // Also clear internal search queries for dropdowns
  statusSearchQuery.value = '';
  authorSearchQuery.value = '';
  sourceSearchQuery.value = '';
  categorySearchQuery.value = '';
  tagSearchQuery.value = '';
}

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

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    isTableLoading.value = true;
    currentPage.value++;
    setTimeout(() => {
      isTableLoading.value = false;
    }, 300);
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    isTableLoading.value = true;
    currentPage.value--;
    setTimeout(() => {
      isTableLoading.value = false;
    }, 300);
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    isTableLoading.value = true;
    currentPage.value = page;
    setTimeout(() => {
      isTableLoading.value = false;
    }, 300);
  }
};

// Function to open Avatar View Modal
const openAvatarViewModal = (url) => {
  avatarToViewUrl.value = url;
  isAvatarViewModalOpen.value = true;
};

watch([searchQuery, selectedStatus, selectedType, selectedAuthors, selectedSources, selectedCategories, selectedTags, startDate, endDate], () => {
  currentPage.value = 1; // Reset page on filter change
  isTableLoading.value = true;
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
})

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
