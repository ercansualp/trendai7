<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Role Management</h1>
      <p class="text-muted-foreground">Define and manage user roles within the application.</p>
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
      <p class="ml-3 text-foreground">Loading roles...</p>
    </div>

    <div v-else class="card p-6 mb-6 relative">
      <!-- Filter Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="relative">
          <label for="roleNameFilter" class="block text-sm font-medium text-muted-foreground mb-1">Role Name</label>
          <input
            type="text"
            id="roleNameFilter"
            v-model="roleNameFilter"
            placeholder="Filter by role name..."
            class="w-full px-3 py-2 pr-10 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
          <button
            v-if="roleNameFilter"
            @click="clearRoleNameFilter"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 mt-4 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear role name filter"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div>
          <label for="startDateFilter" class="block text-sm font-medium text-muted-foreground mb-1">Created After</label>
          <input
            type="date"
            id="startDateFilter"
            v-model="startDateFilter"
            class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
        <div>
          <label for="endDateFilter" class="block text-sm font-medium text-muted-foreground mb-1">Created Before</label>
          <input
            type="date"
            id="endDateFilter"
            v-model="endDateFilter"
            class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
      </div>
      <div class="flex justify-between items-center mb-4">
        <button
          @click="clearFilters"
          class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear Filters
        </button>
        <button @click="openRoleModal('add')" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Role
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
                  Role Name
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'name' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'name' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'name' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'name' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                <div class="flex items-center">
                  Description
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Permissions</th>
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
            <tr v-for="role in paginatedRoles" :key="role.id" class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ role.name }}</td>
              <td class="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{{ role.description || 'N/A' }}</td>
              <td class="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                <span v-if="role.permissions && role.permissions.length > 0">
                  {{ role.permissions.map(p => p.name).join(', ') }}
                </span>
                <span v-else>No permissions</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(role.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openRoleModal('edit', role)" class="text-primary hover:text-primary/80 mr-3 font-medium">Edit</button>
                <button @click="openPermissionsViewModal(role)" class="text-blue-500 hover:text-blue-600 mr-3 font-medium">View Permissions</button>
                <button @click="confirmDeleteRole(role.id)" class="text-destructive hover:text-destructive/80 font-medium">Delete</button>
              </td>
            </tr>
            <tr v-if="paginatedRoles.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-muted-foreground">No roles found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination Controls -->
      <div v-if="totalPages > 1 || filteredRoles.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
        <div class="text-sm text-muted-foreground">
          Showing {{ paginatedRoles.length }} of {{ filteredRoles.length }} roles
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
        <p class="ml-3 text-foreground text-lg">Loading roles...</p>
      </div>
    </div>

    <!-- Role Modal (Add/Edit) -->
    <div v-if="isRoleModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-2xl font-bold text-foreground mb-4">{{ modalMode === 'add' ? 'Add New Role' : 'Edit Role' }}</h2>
        <div class="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <form @submit.prevent="saveRole">
            <div class="mb-4">
              <label for="roleName" class="block text-sm font-medium text-muted-foreground mb-1">Role Name</label>
              <input type="text" id="roleName" v-model="currentRole.name" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required />
            </div>
            <div class="mb-4">
              <label for="roleDescription" class="block text-sm font-medium text-muted-foreground mb-1">Description</label>
              <textarea id="roleDescription" v-model="currentRole.description" rows="3" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"></textarea>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-muted-foreground mb-2">Assign Permissions</label>
              <div class="mb-3">
                <input
                  type="text"
                  v-model="permissionSearchQuery"
                  placeholder="Search permissions..."
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>
              <div class="max-h-64 overflow-y-auto pr-2 border border-input rounded-md p-3 bg-background">
                <details v-for="(permissionsInGroup, category) in filteredGroupedPermissions" :key="category" class="mb-3 last:mb-0 group" open>
                  <summary class="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors duration-200 text-foreground font-semibold text-sm">
                    {{ category }}
                    <svg class="w-4 h-4 transform transition-transform duration-200 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </summary>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pl-4">
                    <div v-for="permission in permissionsInGroup" :key="permission.id" class="flex items-start">
                      <input
                        type="checkbox"
                        :id="`perm-${permission.id}`"
                        :value="permission.id"
                        v-model="currentRole.selectedPermissionIds"
                        class="h-4 w-4 text-primary focus:ring-primary border-input rounded mt-1"
                      />
                      <label :for="`perm-${permission.id}`" class="ml-2 text-sm text-foreground cursor-pointer flex-1">
                        {{ permission.name }}
                        <p class="text-xs text-muted-foreground">{{ permission.description }}</p>
                      </label>
                    </div>
                  </div>
                </details>
                <div v-if="Object.keys(filteredGroupedPermissions).length === 0" class="text-center text-sm text-muted-foreground py-4">
                  No permissions found matching your search.
                </div>
              </div>
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" @click="isRoleModalOpen = false" class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">Cancel</button>
              <button type="submit" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">{{ modalMode === 'add' ? 'Add Role' : 'Save Changes' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Permissions View Modal -->
    <div v-if="isPermissionsViewModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-2xl p-6">
        <h2 class="text-2xl font-bold text-foreground mb-4">Permissions for Role: {{ viewingRole.name }}</h2>
        <p class="text-muted-foreground mb-6">{{ viewingRole.description || 'No description provided for this role.' }}</p>

        <div v-if="viewingRole.permissions && viewingRole.permissions.length > 0" class="max-h-96 overflow-y-auto pr-2">
          <div v-for="(permissionsInGroup, category) in groupedViewingPermissions" :key="category" class="mb-4 last:mb-0">
            <h3 class="text-lg font-semibold text-foreground mb-2">{{ category }}</h3>
            <ul class="space-y-3">
              <li v-for="permission in permissionsInGroup" :key="permission.id" class="p-3 bg-muted/30 rounded-md">
                <p class="font-medium text-foreground">{{ permission.name }}</p>
                <p class="text-sm text-muted-foreground">{{ permission.description || 'No description.' }}</p>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="text-center text-muted-foreground py-8">
          <p>This role has no assigned permissions.</p>
        </div>

        <div class="flex justify-end mt-6">
          <button type="button" @click="isPermissionsViewModalOpen = false" class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">Close</button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Confirm Role Deletion"
      :message="`Are you sure you want to delete the role '${roleToDeleteName}'? This action cannot be undone.`"
      confirm-button-text="Delete"
      confirm-button-class="bg-destructive hover:bg-destructive/90"
      @confirm="executeDeleteRole"
      @cancel="cancelDeleteRole"
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
const isTableLoading = ref(false) // For pagination and filter actions
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

// Filter state
const roleNameFilter = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')

// Sorting state
const sortColumn = ref(null); // Default: no sort column
const sortDirection = ref(null); // Default: no sort direction

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(5) // You can adjust this number

// Confirm Dialog state
const showConfirmDialog = ref(false)
const roleToDeleteId = ref(null)
const roleToDeleteName = ref('')

// Mock data for available permissions
const availablePermissions = ref([
  { id: 'perm_001', name: 'ViewUsers', category: 'User Management', description: 'Allows viewing of all user profiles.' },
  { id: 'perm_002', name: 'ManageUsers', category: 'User Management', description: 'Grants full control over user accounts (create, edit, delete).' },
  { id: 'perm_003', name: 'ViewRoles', category: 'Role Management', description: 'Permits viewing of all defined roles.' },
  { id: 'perm_004', name: 'ManageRoles', category: 'Role Management', description: 'Enables creation, editing, and deletion of roles.' },
  { id: 'perm_005', name: 'ViewSessions', category: 'Session Management', description: 'Allows monitoring of active user sessions.' },
  { id: 'perm_006', name: 'RevokeSessions', category: 'Session Management', description: 'Grants the ability to terminate user sessions.' },
  { id: 'perm_007', name: 'AccessReports', category: 'Reporting', description: 'Provides access to system reports and analytics.' },
  { id: 'perm_008', name: 'ConfigureSettings', category: 'System Settings', description: 'Allows modification of application-wide settings.' },
]);

const permissionSearchQuery = ref('');

// Filtered permissions based on search query
const filteredPermissions = computed(() => {
  const query = permissionSearchQuery.value.toLowerCase().trim();
  if (!query) {
    return availablePermissions.value;
  }
  return availablePermissions.value.filter(permission =>
    permission.name.toLowerCase().includes(query) ||
    permission.description.toLowerCase().includes(query) ||
    (permission.category && permission.category.toLowerCase().includes(query))
  );
});

// Group filtered permissions by category for display in the modal
const filteredGroupedPermissions = computed(() => {
  const groups = {};
  filteredPermissions.value.forEach(permission => {
    const category = permission.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
  });
  return groups;
});

const roles = ref([])

const mockRoles = [
  {
    id: 'role_001',
    name: 'Admin',
    description: 'Full administrative access to the system.',
    permissions: availablePermissions.value, // Assign all permissions to Admin
    createdAt: new Date('2023-01-01T08:00:00Z'),
    updatedAt: null
  },
  {
    id: 'role_002',
    name: 'Editor',
    description: 'Can manage content and some user-related data.',
    permissions: [
      availablePermissions.value.find(p => p.id === 'perm_001'), // ViewUsers
      availablePermissions.value.find(p => p.id === 'perm_003'), // ViewRoles
      availablePermissions.value.find(p => p.id === 'perm_007'), // AccessReports
    ].filter(Boolean), // Filter out undefined if find fails
    createdAt: new Date('2023-01-05T09:00:00Z'),
    updatedAt: null
  },
  {
    id: 'role_003',
    name: 'User',
    description: 'Standard user with basic application access.',
    permissions: [], // No special permissions for a basic user
    createdAt: new Date('2023-01-10T10:00:00Z'),
    updatedAt: null
  },
  {
    id: 'role_004',
    name: 'Viewer',
    description: 'Can view data but cannot make any changes.',
    permissions: [
      availablePermissions.value.find(p => p.id === 'perm_001'), // ViewUsers
      availablePermissions.value.find(p => p.id === 'perm_003'), // ViewRoles
      availablePermissions.value.find(p => p.id === 'perm_005'), // ViewSessions
    ].filter(Boolean),
    createdAt: new Date('2023-02-01T11:00:00Z'),
    updatedAt: null
  },
  {
    id: 'role_005',
    name: 'Moderator',
    description: 'Manages user-generated content and community guidelines.',
    permissions: [
      availablePermissions.value.find(p => p.id === 'perm_001'), // ViewUsers
      availablePermissions.value.find(p => p.id === 'perm_005'), // ViewSessions
      availablePermissions.value.find(p => p.id === 'perm_006'), // RevokeSessions
    ].filter(Boolean),
    createdAt: new Date('2023-03-15T12:00:00Z'),
    updatedAt: null
  },
  {
    id: 'role_006',
    name: 'Developer',
    description: 'Access to development-related tools and settings.',
    permissions: [
      availablePermissions.value.find(p => p.id === 'perm_007'), // AccessReports
      availablePermissions.value.find(p => p.id === 'perm_008'), // ConfigureSettings
    ].filter(Boolean),
    createdAt: new Date('2023-04-20T13:00:00Z'),
    updatedAt: null
  },
]

const isRoleModalOpen = ref(false)
const modalMode = ref('add') // 'add' or 'edit'
const currentRole = ref({
  id: '',
  name: '',
  description: '',
  permissions: [], // Store full permission objects
  selectedPermissionIds: [], // For checkbox binding
  createdAt: null,
  updatedAt: null,
})

const isPermissionsViewModalOpen = ref(false)
const viewingRole = ref({
  name: '',
  description: '',
  permissions: [],
})

const groupedViewingPermissions = computed(() => {
  const groups = {};
  if (viewingRole.value.permissions) {
    viewingRole.value.permissions.forEach(permission => {
      const category = permission.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });
  }
  return groups;
});

// Filtered roles based on search and date range
const filteredRoles = computed(() => {
  let filtered = roles.value;

  // Filter by role name
  if (roleNameFilter.value) {
    const query = roleNameFilter.value.toLowerCase();
    filtered = filtered.filter(role =>
      role.name.toLowerCase().includes(query)
    );
  }

  // Filter by creation date range
  if (startDateFilter.value) {
    const start = new Date(startDateFilter.value);
    start.setHours(0, 0, 0, 0); // Set to start of the day
    filtered = filtered.filter(role =>
      role.createdAt && new Date(role.createdAt) >= start
    );
  }
  if (endDateFilter.value) {
    const end = new Date(endDateFilter.value);
    end.setHours(23, 59, 59, 999); // Set to end of the day
    filtered = filtered.filter(role =>
      role.createdAt && new Date(role.createdAt) <= end
    );
  }

  return filtered;
});

// Sorted roles based on sortColumn and sortDirection
const sortedRoles = computed(() => {
  const sortableRoles = [...filteredRoles.value]; // Create a shallow copy to avoid mutating original array
  if (!sortColumn.value || !sortDirection.value) {
    // If no sort column or direction is set, return as is (initial fetch order)
    return sortableRoles;
  }

  return sortableRoles.sort((a, b) => {
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
  return Math.ceil(sortedRoles.value.length / itemsPerPage.value)
})

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedRoles.value.slice(start, end)
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

const fetchRoles = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700))
    // Ensure mockRoles are initially in a consistent order if no sorting is applied by default
    // For example, sort by createdAt descending as a default "unsorted" order
    roles.value = [...mockRoles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    showNotification('Roles loaded successfully!', 'success')
  } catch (error) {
    showNotification('Failed to load roles.', 'error')
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

const openRoleModal = (mode, role = null) => {
  modalMode.value = mode
  if (mode === 'add') {
    currentRole.value = {
      id: 'role_' + Math.random().toString(36).substring(2, 10),
      name: '',
      description: '',
      permissions: [],
      selectedPermissionIds: [],
      createdAt: new Date(),
      updatedAt: null,
    }
  } else {
    currentRole.value = {
      ...role,
      selectedPermissionIds: role.permissions ? role.permissions.map(p => p.id) : [],
    }
  }
  permissionSearchQuery.value = ''; // Clear search query when opening modal
  isRoleModalOpen.value = true
}

const openPermissionsViewModal = (role) => {
  viewingRole.value = { ...role };
  isPermissionsViewModalOpen.value = true;
}

const saveRole = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    // Map selected permission IDs back to full permission objects
    const assignedPermissions = currentRole.value.selectedPermissionIds.map(id =>
      availablePermissions.value.find(p => p.id === id)
    ).filter(Boolean); // Filter out any undefined if an ID doesn't match

    const roleToSave = {
      ...currentRole.value,
      permissions: assignedPermissions,
    };

    if (modalMode.value === 'add') {
      roles.value.push(roleToSave);
      showNotification('Role added successfully!', 'success')
    } else {
      const index = roles.value.findIndex(r => r.id === roleToSave.id);
      if (index !== -1) {
        roles.value[index] = { ...roleToSave, updatedAt: new Date() };
        showNotification('Role updated successfully!', 'success')
      } else {
        showNotification('Role not found for update.', 'error')
      }
    }
    isRoleModalOpen.value = false;
    // After saving, reset pagination to page 1 to ensure new/updated role is visible
    currentPage.value = 1;
  } catch (error) {
    showNotification(`Failed to ${modalMode.value === 'add' ? 'add' : 'update'} role.`, 'error')
  } finally {
    isLoading.value = false
  }
}

const confirmDeleteRole = (id) => {
  const role = roles.value.find(r => r.id === id);
  if (role) {
    roleToDeleteId.value = id;
    roleToDeleteName.value = role.name;
    showConfirmDialog.value = true;
  }
};

const executeDeleteRole = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    roles.value = roles.value.filter(role => role.id !== roleToDeleteId.value)
    showNotification('Role deleted successfully!', 'success')
    // After deleting, adjust current page if it's now empty
    if (paginatedRoles.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    showNotification('Failed to delete role.', 'error')
  } finally {
    isLoading.value = false
    roleToDeleteId.value = null;
    roleToDeleteName.value = '';
  }
}

const cancelDeleteRole = () => {
  roleToDeleteId.value = null;
  roleToDeleteName.value = '';
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

const applyFilters = () => {
  isTableLoading.value = true;
  currentPage.value = 1; // Reset to first page on filter change
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
};

const clearFilters = () => {
  roleNameFilter.value = '';
  startDateFilter.value = '';
  endDateFilter.value = '';
  applyFilters(); // Re-apply filters (which will now be empty)
};

// Function to clear role name filter
const clearRoleNameFilter = () => {
  roleNameFilter.value = '';
};

// Watch for changes in filter inputs and apply filters
watch([roleNameFilter, startDateFilter, endDateFilter], () => {
  applyFilters();
});

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
/* Add any specific styles for this page if needed */
</style>
