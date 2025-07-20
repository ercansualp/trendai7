<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Permission Management</h1>
      <p class="text-muted-foreground">Define and manage application permissions.</p>
    </div>

    <div v-if="notification.message" :class="['p-4 mb-4 rounded-md text-white flex justify-between items-center', {
      'bg-green-500': notification.type === 'success',
      'bg-red-500': notification.type === 'error',
      'bg-blue-500': notification.type === 'info'
    }]">
      <span>{{ notification.message }}</span>
      <button @click="hideNotification" class="ml-4 text-white font-bold">&times;</button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="ml-3 text-foreground">Loading permissions...</p>
    </div>

    <div v-else class="card p-6 mb-6 relative">
      <!-- Filter Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="relative">
          <label for="permissionNameFilter" class="block text-sm font-medium text-muted-foreground mb-1">Permission Name</label>
          <input
            type="text"
            id="permissionNameFilter"
            v-model="searchQuery"
            placeholder="Filter by permission name..."
            class="w-full px-3 py-2 pr-10 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear search"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div>
          <label for="categoryFilter" class="block text-sm font-medium text-muted-foreground mb-1">Category</label>
          <select
            id="categoryFilter"
            v-model="selectedCategory"
            class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          >
            <option value="">All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div>
          <label for="startDateFilter" class="block text-sm font-medium text-muted-foreground mb-1">Created After</label>
          <input
            type="date"
            id="startDateFilter"
            v-model="startDate"
            class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
        <div>
          <label for="endDateFilter" class="block text-sm font-medium text-muted-foreground mb-1">Created Before</label>
          <input
            type="date"
            id="endDateFilter"
            v-model="endDate"
            class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div class="flex justify-between items-center mb-4">
        <button
          @click="clearAllFilters"
          class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear Filters
        </button>
        <button @click="openPermissionModal('add')" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Permission
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortTable('name')"
              >
                <div class="flex items-center">
                  Permission Name
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'name' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'name' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'name' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'name' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortTable('createdAt')"
              >
                <div class="flex items-center">
                  Created At
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'createdAt' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'createdAt' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'createdAt' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'createdAt' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="permission in paginatedPermissions" :key="permission.id" class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ permission.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ permission.category || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{{ permission.description || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(permission.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openPermissionModal('edit', permission)" class="text-primary hover:text-primary/80 mr-3 font-medium">Edit</button>
                <button @click="confirmDeletePermission(permission.id, permission.name)" class="text-destructive hover:text-destructive/80 font-medium">Delete</button>
              </td>
            </tr>
            <tr v-if="paginatedPermissions.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-muted-foreground">No permissions found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination Controls -->
      <div v-if="totalPages > 1 || filteredPermissions.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
        <div class="text-sm text-muted-foreground">
          Showing {{ paginatedPermissions.length }} of {{ filteredPermissions.length }} permissions
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
        <p class="ml-3 text-foreground text-lg">Loading permissions...</p>
      </div>
    </div>

    <!-- Permission Modal -->
    <div v-if="isPermissionModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <h2 class="text-2xl font-bold text-foreground mb-4">{{ modalMode === 'add' ? 'Add New Permission' : 'Edit Permission' }}</h2>
        <form @submit.prevent="savePermission">
          <div class="mb-4">
            <label for="permissionName" class="block text-sm font-medium text-muted-foreground mb-1">Permission Name</label>
            <input type="text" id="permissionName" v-model="currentPermission.name" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required />
          </div>
          <div class="mb-4">
            <label for="permissionCategory" class="block text-sm font-medium text-muted-foreground mb-1">Category</label>
            <input type="text" id="permissionCategory" v-model="currentPermission.category" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
          </div>
          <div class="mb-4">
            <label for="permissionDescription" class="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea id="permissionDescription" v-model="currentPermission.description" rows="3" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="isPermissionModalOpen = false" class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">Cancel</button>
            <button type="submit" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">{{ modalMode === 'add' ? 'Add Permission' : 'Save Changes' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Confirm Permission Deletion"
      :message="`Are you sure you want to delete the permission '${permissionToDeleteName}'? This action cannot be undone.`"
      confirm-button-text="Delete"
      confirm-button-class="bg-destructive hover:bg-destructive/90"
      @confirm="executeDeletePermission"
      @cancel="cancelDeletePermission"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

definePageMeta({
  layout: 'admin'
})

const isLoading = ref(true) // For initial page load
const isTableLoading = ref(false) // For filtering and pagination
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const permissions = ref([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(5) // You can adjust this number

// Filter state
const searchQuery = ref('')
const selectedCategory = ref('') // New filter state for category
const startDate = ref('') // New filter state for start date
const endDate = ref('') // New filter state for end date

// Sorting state
const sortColumn = ref(null); // Default: no sort column
const sortDirection = ref(null); // Default: no sort direction

// Confirm Dialog state
const showConfirmDialog = ref(false)
const permissionToDeleteId = ref(null)
const permissionToDeleteName = ref('') // Changed to ref('')

const mockPermissions = [
  { id: 'perm_001', name: 'ViewUsers', category: 'User Management', description: 'Allows viewing of all user profiles.', createdAt: new Date('2023-01-01T08:00:00Z') },
  { id: 'perm_002', name: 'ManageUsers', category: 'User Management', description: 'Grants full control over user accounts (create, edit, delete).', createdAt: new Date('2023-01-01T08:05:00Z') },
  { id: 'perm_003', name: 'ViewRoles', category: 'Role Management', description: 'Permits viewing of all defined roles.', createdAt: new Date('2023-01-01T08:10:00Z') },
  { id: 'perm_004', name: 'ManageRoles', category: 'Role Management', description: 'Enables creation, editing, and deletion of roles.', createdAt: new Date('2023-01-01T08:15:00Z') },
  { id: 'perm_005', name: 'ViewSessions', category: 'Session Management', description: 'Allows monitoring of active user sessions.', createdAt: new Date('2023-01-01T08:20:00Z') },
  { id: 'perm_006', name: 'RevokeSessions', category: 'Session Management', description: 'Grants the ability to terminate user sessions.', createdAt: new Date('2023-01-01T08:25:00Z') },
  { id: 'perm_007', name: 'AccessReports', category: 'Reporting', description: 'Provides access to system reports and analytics.', createdAt: new Date('2023-01-01T08:30:00Z') },
  { id: 'perm_008', name: 'ConfigureSettings', category: 'System Settings', description: 'Allows modification of application-wide settings.', createdAt: new Date('2023-01-01T08:35:00Z') },
];

const isPermissionModalOpen = ref(false)
const modalMode = ref('add') // 'add' or 'edit'
const currentPermission = ref({
  id: '',
  name: '',
  category: '', // Initialize category for new permission
  description: '',
  createdAt: null,
  updatedAt: null,
})

// Computed property for unique categories for the filter dropdown
const availableCategories = computed(() => {
  const categories = new Set();
  mockPermissions.forEach(p => {
    if (p.category) {
      categories.add(p.category);
    }
  });
  return Array.from(categories).sort();
});

const filteredPermissions = computed(() => {
  let filtered = permissions.value;
  const query = searchQuery.value.toLowerCase();

  // Filter by search query (name or description)
  if (query) {
    filtered = filtered.filter(permission =>
      permission.name.toLowerCase().includes(query) ||
      permission.description.toLowerCase().includes(query)
    );
  }

  // Filter by selected category
  if (selectedCategory.value) {
    filtered = filtered.filter(permission => permission.category === selectedCategory.value);
  }

  // Filter by date range
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;

  if (start || end) {
    filtered = filtered.filter(permission => {
      const permissionCreatedAt = new Date(permission.createdAt);
      // Set time to 00:00:00 for start date to include the whole day
      const startOfDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      // Set time to 23:59:59 for end date to include the whole day
      const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

      const isAfterStart = startOfDay ? permissionCreatedAt >= startOfDay : true;
      const isBeforeEnd = endOfDay ? permissionCreatedAt <= endOfDay : true;

      return isAfterStart && isBeforeEnd;
    });
  }

  return filtered;
});

// Sorted permissions based on sortColumn and sortDirection
const sortedPermissions = computed(() => {
  const sortablePermissions = [...filteredPermissions.value]; // Create a shallow copy to avoid mutating original array
  if (!sortColumn.value || !sortDirection.value) {
    // If no sort column or direction is set, return as is (initial fetch order)
    return sortablePermissions;
  }

  return sortablePermissions.sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];

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
  return Math.ceil(sortedPermissions.value.length / itemsPerPage.value)
})

const paginatedPermissions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedPermissions.value.slice(start, end)
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

const fetchPermissions = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700))
    // Ensure mockPermissions are initially in a consistent order if no sorting is applied by default
    permissions.value = [...mockPermissions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    showNotification('Permissions loaded successfully!', 'success')
  } catch (error) {
    showNotification('Failed to load permissions.', 'error')
  } finally {
    isLoading.value = false
  }
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

const openPermissionModal = (mode, permission = null) => {
  modalMode.value = mode
  if (mode === 'add') {
    currentPermission.value = {
      id: 'perm_' + Math.random().toString(36).substring(2, 10),
      name: '',
      category: '', // Initialize category for new permission
      description: '',
      createdAt: new Date(),
      updatedAt: null,
    }
  } else {
    currentPermission.value = { ...permission }
  }
  isPermissionModalOpen.value = true
}

const savePermission = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    if (modalMode.value === 'add') {
      permissions.value.push(currentPermission.value);
      showNotification('Permission added successfully!', 'success')
    } else {
      const index = permissions.value.findIndex(p => p.id === currentPermission.value.id);
      if (index !== -1) {
        permissions.value[index] = { ...currentPermission.value, updatedAt: new Date() };
        showNotification('Permission updated successfully!', 'success')
      } else {
        showNotification('Permission not found for update.', 'error')
      }
    }
    isPermissionModalOpen.value = false;
    // After saving, reset pagination to page 1 to ensure new/updated permission is visible
    currentPage.value = 1;
  } catch (error) {
    showNotification(`Failed to ${modalMode.value === 'add' ? 'add' : 'update'} permission.`, 'error')
  } finally {
    isLoading.value = false
  }
}

const confirmDeletePermission = (id, name) => {
  permissionToDeleteId.value = id;
  permissionToDeleteName.value = name;
  showConfirmDialog.value = true;
};

const executeDeletePermission = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    permissions.value = permissions.value.filter(permission => permission.id !== permissionToDeleteId.value)
    showNotification('Permission deleted successfully!', 'success')
    // After deleting, adjust current page if it's now empty
    if (paginatedPermissions.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    showNotification('Failed to delete permission.', 'error')
  } finally {
    isLoading.value = false
    permissionToDeleteId.value = null;
    permissionToDeleteName.value = '';
  }
}

const cancelDeletePermission = () => {
  permissionToDeleteId.value = null;
  permissionToDeleteName.value = '';
};

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
  selectedCategory.value = '';
  startDate.value = '';
  endDate.value = '';
  // The watch on filter states will handle resetting currentPage and isTableLoading
};

// Watch for changes in filter inputs and apply filters
watch([searchQuery, selectedCategory, startDate, endDate], () => {
  currentPage.value = 1; // Reset page on filter change
  isTableLoading.value = true;
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
});

onMounted(() => {
  fetchPermissions()
})
</script>

<style scoped>
/* Add any specific styles for this page if needed */
</style>
