<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Chatbot Management</h1>
      <p class="text-muted-foreground">Manage chat sessions, messages, and AI interactions</p>
    </div>

    <div
      v-if="notification.message"
      class="p-4 mb-4 rounded-md text-white flex justify-between items-center"
      :class="{
        'bg-green-500': notification.type === 'success',
        'bg-red-500': notification.type === 'error',
        'bg-blue-500': notification.type === 'info'
      }"
    >
      <span>{{ notification.message }}</span>
      <button @click="hideNotification" class="ml-4 text-white font-bold">&times;</button>
    </div>

    <!-- Initial page loading spinner -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="ml-3 text-foreground">Loading chat sessions...</p>
    </div>

    <!-- Main content with table and filters -->
    <div v-else class="card p-6 mb-6 relative">
      <!-- Filters and Search -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search sessions by user or ID..."
            class="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full shadow-sm"
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
          <!-- Multi-select AI Model Filter -->
          <div class="relative w-full sm:w-48" v-click-outside="() => isModelDropdownOpen = false">
            <button
              @click="isModelDropdownOpen = !isModelDropdownOpen"
              class="flex justify-between items-center px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full"
            >
              <span>{{ selectedModelDisplay }}</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              v-if="isModelDropdownOpen"
              class="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              <div class="relative px-4 py-2">
                <input
                  v-model="modelSearchQuery"
                  type="text"
                  placeholder="Search models..."
                  class="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full shadow-sm"
                  @click.stop
                />
                <svg class="absolute left-7 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <label class="flex items-center px-4 py-2 hover:bg-muted cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  :checked="selectedModel.length === availableAiModels.length"
                  @change="toggleAllModels"
                  class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary mr-2"
                />
                <span>All Models</span>
              </label>
              <label
                v-for="model in filteredAvailableAiModels"
                :key="model"
                class="flex items-center px-4 py-2 hover:bg-muted cursor-pointer text-foreground"
              >
                <input
                  type="checkbox"
                  :value="model"
                  v-model="selectedModel"
                  class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary mr-2"
                />
                <img :src="getAiModelLogo(model)" alt="AI Model Logo" class="w-5 h-5 rounded-full object-cover mr-2" />
                <span>{{ model }}</span>
              </label>
              <div v-if="filteredAvailableAiModels.length === 0" class="px-4 py-2 text-muted-foreground text-sm">
                No models found.
              </div>
            </div>
          </div>

          <input
            type="date"
            v-model="startDate"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full sm:w-40"
            title="Start Date"
          />
          <input
            type="date"
            v-model="endDate"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full sm:w-40"
            title="End Date"
          />
        </div>
      </div>

      <div class="flex justify-end mb-4">
        <button
          @click="clearAllFilters"
          class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear Filters
        </button>
      </div>

      <!-- Sessions List Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortTable('userFullName')"
              >
                <div class="flex items-center">
                  User
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'userFullName' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'userFullName' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'userFullName' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'userFullName' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Messages</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Model</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortTable('createdAt')"
              >
                <div class="flex items-center">
                  Created
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'createdAt' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'createdAt' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'createdAt' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'createdAt' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-card divide-y divide-border">
            <tr 
              v-for="session in chatSessions" 
              :key="session.id"
              class="hover:bg-accent transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground flex items-center">
                <img
                  :src="getUserAvatar(session.user.id)"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full object-cover mr-3 cursor-pointer"
                  @click="openImageViewModal(getUserAvatar(session.user.avatar))"
                />
                <span>{{ getUserFullName(session.user.firstName, session.user.lastName) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-foreground">{{ session.messageCount }} messages</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <div class="flex items-center">
                  <img
                    :src="getAiModelLogo(getAiModelForSession(session))"
                    alt="AI Model Logo"
                    class="w-6 h-6 rounded-full object-cover mr-2 cursor-pointer"
                    @click="openImageViewModal(getAiModelLogo(getAiModelForSession(session)))"
                  />
                  <span>{{ getAiModelForSession(session) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-foreground">{{ formatDate(session.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <NuxtLink
                  :to="`/chatbot/${session.id}`"
                  class="text-primary hover:text-primary-foreground"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="paginatedSessions.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-muted-foreground">No chat sessions found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination Controls -->
      <div v-if="totalPages > 1 || filteredSessions.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
        <div class="text-sm text-muted-foreground">
          Showing {{ paginatedSessions.length }} of {{ filteredSessions.length }} sessions
        </div>
        <div class="flex justify-center items-center space-x-2">
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <span class="hidden sm:inline">First</span>
            <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <span class="hidden sm:inline">Previous</span>
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
            <span class="hidden sm:inline">Next</span>
            <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <span class="hidden sm:inline">Last</span>
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
        <p class="ml-3 text-foreground text-lg">Loading sessions...</p>
      </div>
    </div>

    <!-- Generic Image View Modal (reused for avatars and AI logos) -->
    <div v-if="isImageViewModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4" @click.self="isImageViewModalOpen = false">
      <div class="relative bg-card rounded-lg shadow-xl p-4 max-w-full max-h-full overflow-hidden flex flex-col items-center justify-center">
        <button @click="isImageViewModalOpen = false" class="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img :src="imageUrlToView" alt="Full size image" class="max-w-full max-h-[80vh] object-contain rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { mockUsers } from '~/data/mockUsers.js'; // Import mockUsers

definePageMeta({
  layout: 'admin'
})

const chatbotStore = useChatbotStore();
const { chatSessions } = storeToRefs(chatbotStore);

// Custom directive to close dropdowns when clicking outside
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

const isLoading = ref(true) // For initial page load
const isTableLoading = ref(false) // For filtering and pagination
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const sessions = ref([]); // Will be populated by fetchSessions

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10) // You can adjust this number

// Filter state
const searchQuery = ref('')
const selectedModel = ref([]) // Changed to an array for multi-select
const startDate = ref('') // New filter state for start date
const endDate = ref('') // New filter state for end date

// Sorting state
const sortColumn = ref(null); // Default: no sort column
const sortDirection = ref(null); // Default: no sort direction

// Generic Image View Modal state (reused for avatars and AI logos)
const isImageViewModalOpen = ref(false);
const imageUrlToView = ref('');

// State for AI Model multi-select dropdown
const isModelDropdownOpen = ref(false);
const modelSearchQuery = ref(''); // New state for AI Model search
const availableAiModels = ref(['GPT-4', 'GPT-3.5', 'Claude', 'Bard', 'DALL-E', 'Midjourney', 'Stable Diffusion']); // Explicitly list available models

// Computed property to filter available AI models based on search query
const filteredAvailableAiModels = computed(() => {
  const query = modelSearchQuery.value.toLowerCase();
  if (!query) {
    return availableAiModels.value;
  }
  return availableAiModels.value.filter(model =>
    model.toLowerCase().includes(query)
  );
});

// Create a map for quick user lookup
const usersMap = computed(() => {
  const map = new Map();
  mockUsers.forEach(user => {
    map.set(user.id, user);
  });
  return map;
});

// AI Model Logos mapping
const aiModelLogos = {
  'GPT-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/240px-ChatGPT_logo.svg.png', // Placeholder for GPT-4
  'GPT-3.5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/240px-ChatGPT_logo.svg.png', // Placeholder for GPT-3.5
  'Claude': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Anthropic_logo.svg/240px-Anthropic_logo.svg.png', // Placeholder for Claude
  'Bard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Google_Bard_logo.svg/240px-Google_Bard_logo.svg.png', // Placeholder for Bard
  'DALL-E': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/DALL-E_logo.svg/240px-DALL-E_logo.svg.png', // Placeholder for DALL-E
  'Midjourney': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Midjourney_Logo.svg/240px-Midjourney_Logo.svg.png', // Placeholder for Midjourney
  'Stable Diffusion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Stable_Diffusion_logo.svg/240px-Stable_Diffusion_logo.svg.png', // Placeholder for Stable Diffusion
  'Mixed': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', // Placeholder for mixed models
  'N/A': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' // Placeholder for N/A
};

const getUserFullName = (firstName, lastName) => {
  if(firstName && lastName)
  {
    return firstName + " " + lastName
  }
  else if(firstName)
  {
    return firstName;
  }
  return null;
};

const getUserAvatar = (userId) => {
  const user = usersMap.value.get(userId);
  return user && user.avatar ? user.avatar : 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
};

// Function to open generic Image View Modal
const openImageViewModal = (url) => {
  imageUrlToView.value = url;
  isImageViewModalOpen.value = true;
};

// Function to get AI Model for a session
const getAiModelForSession = (session) => {
  if (session.messages && session.messages.length > 0) {
    // Get all unique AI models used in the session
    const models = [...new Set(session.messages.map(msg => msg.aiModel))];
    if (models.length === 1) {
      return models[0];
    } else if (models.length > 1) {
      return 'Mixed'; // Or list them, e.g., models.join(', ')
    }
  }
  return 'N/A';
};

// Function to get AI Model Logo
const getAiModelLogo = (modelName) => {
  return aiModelLogos[modelName] || aiModelLogos['N/A']; // Return specific logo or default N/A logo
};

// Computed property for displaying selected models in the filter button
const selectedModelDisplay = computed(() => {
  if (selectedModel.value.length === 0) {
    return 'All Models';
  } else if (selectedModel.value.length === availableAiModels.value.length) {
    return 'All Models';
  } else if (selectedModel.value.length === 1) {
    return selectedModel.value[0];
  } else {
    return `${selectedModel.value.length} Models Selected`;
  }
});

// Toggle all models in the multi-select
const toggleAllModels = (event) => {
  if (event.target.checked) {
    selectedModel.value = [...availableAiModels.value];
  } else {
    selectedModel.value = [];
  }
};

const filteredSessions = computed(() => {
  let filtered = sessions.value.map(session => ({
    ...session,
    userFullName: getUserFullName(session.userId) // Add full name for easier searching/sorting
  }));
  const query = searchQuery.value.toLowerCase();

  // Filter by search query
  if (query) {
    filtered = filtered.filter(session =>
      session.id.toLowerCase().includes(query) ||
      session.userId.toLowerCase().includes(query) ||
      session.userFullName.toLowerCase().includes(query)
    );
  }
  
  // Filter by selected models (multi-select)
  if (selectedModel.value.length > 0 && selectedModel.value.length < availableAiModels.value.length) {
    filtered = filtered.filter(session => {
      // Check if any message in the session uses one of the selected AI models
      return session.messages.some(msg => selectedModel.value.includes(msg.aiModel));
    });
  }

  // Filter by date range
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;

  if (start || end) {
    filtered = filtered.filter(session => {
      const sessionCreatedAt = new Date(session.createdAt);
      // Set time to 00:00:00 for start date to include the whole day
      const startOfDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      // Set time to 23:59:59 for end date to include the whole day
      const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

      const isAfterStart = startOfDay ? sessionCreatedAt >= startOfDay : true;
      const isBeforeEnd = endOfDay ? sessionCreatedAt <= endOfDay : true;

      return isAfterStart && isBeforeEnd;
    });
  }
  
  return filtered;
});

// Sorted sessions based on sortColumn and sortDirection
const sortedSessions = computed(() => {
  const sortableSessions = [...filteredSessions.value]; // Create a shallow copy to avoid mutating original array
  if (!sortColumn.value || !sortDirection.value) {
    // If no sort column or direction is set, return as is (initial fetch order)
    return sortableSessions;
  }

  return sortableSessions.sort((a, b) => {
    let aValue, bValue;

    if (sortColumn.value === 'userFullName') {
      aValue = a.userFullName;
      bValue = b.userFullName;
    } else {
      aValue = a[sortColumn.value];
      bValue = b[sortColumn.value];
    }

    let comparison = 0;

    // Handle date comparison
    if (sortColumn.value === 'createdAt') {
      const dateA = aValue ? new Date(aValue).getTime() : 0;
      const dateB = bValue ? new Date(bValue).getTime() : 0;
      comparison = dateA - dateB;
    } else {
      // Handle string comparison (case-insensitive)
      const stringA = String(aValue || '').toLowerCase();
      const stringB = String(bValue || '').toLowerCase();
      if (stringA < stringB) {
        comparison = -1;
      } else if (stringA > stringB) {
        comparison = 1;
      }
    }

    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

const totalPages = computed(() => {
  return Math.ceil(sortedSessions.value.length / itemsPerPage.value)
})

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedSessions.value.slice(start, end)
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
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }
  notificationTimeout = setTimeout(() => {
    hideNotification()
  }, 5000)
}

const hideNotification = () => {
  notification.value = { message: '', type: '' }
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
    notificationTimeout = null
  }
}

const fetchSessions = async () => {
  isLoading.value = true
  await chatbotStore.getAllSessionsAsync();
  isLoading.value = false
}

// Sorting method
const sortTable = (column) => {
  isTableLoading.value = true; // Start loading
  if (sortColumn.value === column) {
    // If clicking the same column
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc';
    } else if (sortDirection.value === 'desc') {
      sortDirection.value = null; // Unsort
      sortColumn.value = null; // Clear column as well
    } else {
      // Currently unsorted for this column, start ascending
      sortDirection.value = 'asc';
    }
  } else {
    // If clicking a new column
    sortColumn.value = column;
    sortDirection.value = 'asc'; // Default to ascending for a new column
  }
  currentPage.value = 1; // Reset to first page after sorting/unsorting

  setTimeout(() => {
    isTableLoading.value = false; // End loading
  }, 300); // Simulate loading time
};

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

// Watch for changes in filters to reset pagination and show table loading
watch([searchQuery, selectedModel, startDate, endDate, modelSearchQuery], () => {
  currentPage.value = 1; // Reset page on filter change
  isTableLoading.value = true;
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Function to clear search query
const clearSearch = () => {
  searchQuery.value = '';
};

// Function to clear all filters
const clearAllFilters = () => {
  searchQuery.value = '';
  selectedModel.value = []; // Reset to empty array for multi-select
  startDate.value = '';
  endDate.value = '';
  modelSearchQuery.value = ''; // Clear model search query
  // The watch on filter states will handle resetting currentPage and isTableLoading
};

onMounted(() => {
  fetchSessions()
})
</script>
