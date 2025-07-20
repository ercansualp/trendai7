<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">User Management</h1>
      <p class="text-muted-foreground">Manage application users, their details, and roles.</p>
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
      <p class="ml-3 text-foreground">Loading users...</p>
    </div>

    <!-- Main content with table and filters -->
    <div v-else class="card p-6 mb-6 relative"> <!-- Added relative positioning here -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
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
          <select
            v-model="selectedRole"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full sm:w-40"
          >
            <option value="">All Roles</option>
            <option v-for="role in availableRoles" :key="role.id" :value="role.name">{{ role.name }}</option>
          </select>

          <select
            v-model="selectedStatus"
            class="px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm w-full sm:w-40"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

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

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortTable('fullName')"
              >
                <div class="flex items-center">
                  User
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'fullName' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'fullName' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'fullName' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'fullName' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
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
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground flex items-center">
                <img
                  :src="user.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full object-cover mr-3 cursor-pointer"
                  @click="openAvatarViewModal(user.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"
                />
                <span>{{ user.firstName }} {{ user.lastName }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ user.phoneNumber || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <span
                  v-if="user.role"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mr-2"
                >
                  {{ user.role }}
                </span>
                <span v-else class="text-muted-foreground">N/A</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', {
                  'bg-green-100 text-green-800': user.isActive,
                  'bg-red-100 text-red-800': !user.isActive
                }]">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openUserModal('edit', user)" class="text-primary hover:text-primary/80 mr-3 font-medium">Assign Role</button>
                <button @click="prepareToggleUserStatus(user.id)" :class="['font-medium', user.isActive ? 'text-destructive hover:text-destructive/80' : 'text-green-600 hover:text-green-500']">
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-muted-foreground">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination Controls -->
      <div v-if="totalPages > 1 || filteredUsers.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
        <div class="text-sm text-muted-foreground">
          Showing {{ paginatedUsers.length }} of {{ filteredUsers.length }} users
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
        <p class="ml-3 text-foreground text-lg">Loading users...</p>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="isUserModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-2xl font-bold text-foreground mb-4">Edit User Role</h2>
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label for="firstName" class="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
            <input type="text" id="firstName" v-model="currentUser.firstName" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required disabled />
          </div>
          <div class="mb-4">
            <label for="lastName" class="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
            <input type="text" id="lastName" v-model="currentUser.lastName" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required disabled />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input type="email" id="email" v-model="currentUser.email" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required disabled />
          </div>
          <div class="mb-4">
            <label for="phoneNumber" class="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
            <input type="text" id="phoneNumber" v-model="currentUser.phoneNumber" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" disabled />
          </div>
          <!-- Removed password field as user creation is not allowed -->
          <div class="mb-4">
            <label for="role" class="block text-sm font-medium text-muted-foreground mb-1">Role</label>
            <div class="flex items-center space-x-2">
              <select id="role" v-model="currentUser.role" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" required>
                <option value="" disabled>Select a role</option>
                <option v-for="role in availableRoles" :key="role.id" :value="role.name">{{ role.name }}</option>
              </select>
              <button
                type="button"
                @click="openPermissionsViewModalFromSelectedRole()"
                :disabled="!currentUser.role"
                :class="[
                  'inline-flex items-center justify-center px-3 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200',
                  !currentUser.role ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                View Permissions
              </button>
            </div>
            <p v-if="selectedRoleDescription" class="text-sm text-muted-foreground mt-2">{{ selectedRoleDescription }}</p>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="isUserModalOpen = false" class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">Cancel</button>
            <button type="submit" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200">Save Changes</button>
          </div>
        </form>
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

    <!-- Avatar View Modal -->
    <div v-if="isAvatarViewModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4" @click.self="isAvatarViewModalOpen = false">
      <div class="relative bg-card rounded-lg shadow-xl p-4 max-w-full max-h-full overflow-hidden flex flex-col items-center justify-center">
        <button @click="isAvatarViewModalOpen = false" class="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img :src="avatarToViewUrl" alt="Full size user avatar" class="max-w-full max-h-[80vh] object-contain rounded-md" />
      </div>
    </div>

    <!-- Custom Confirmation Dialog -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      :confirmButtonText="confirmDialogButtonText"
      :confirmButtonClass="confirmDialogButtonClass"
      @confirm="executeToggleUserStatus"
      @cancel="cancelToggleUserStatus"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'; // Import the new component
import { mockUsers } from '~/data/mockUsers.js'; // Import mockUsers

definePageMeta({
  layout: 'admin'
})

const isLoading = ref(true) // For initial page load
const isTableLoading = ref(false) // For filtering and pagination
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const users = ref([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(5) // You can adjust this number

// Filter state
const searchQuery = ref('')
const selectedRole = ref('') // New filter state for role
const selectedStatus = ref('') // New filter state for status
const startDate = ref('') // New filter state for start date
const endDate = ref('') // New filter state for end date

// Sorting state
const sortColumn = ref(null); // Default: no sort column
const sortDirection = ref(null); // Default: no sort direction

// Mock data for available permissions (copied from roles.vue for consistency)
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

// Mock roles with permissions (aligned with roles.vue)
const availableRoles = ref([
  {
    id: 'role_001',
    name: 'Admin',
    description: 'Full access to all administrative features and settings.',
    permissions: availablePermissions.value, // Assign all permissions to Admin
  },
  {
    id: 'role_002',
    name: 'Editor',
    description: 'Can create, edit, and publish content, but limited administrative access.',
    permissions: [
      availablePermissions.value.find(p => p.id === 'perm_001'), // ViewUsers
      availablePermissions.value.find(p => p.id === 'perm_003'), // ViewRoles
      availablePermissions.value.find(p => p.id === 'perm_007'), // AccessReports
    ].filter(Boolean),
  },
  {
    id: 'role_003',
    name: 'User',
    description: 'Standard user with access to basic application features.',
    permissions: [],
  },
  {
    id: 'role_004',
    name: 'Viewer',
    description: 'Can view content and data, but cannot make any changes.',
    permissions: [
      availablePermissions.value.find(p => p.id === 'perm_001'), // ViewUsers
      availablePermissions.value.find(p => p.id === 'perm_003'), // ViewRoles
      availablePermissions.value.find(p => p.id === 'perm_005'), // ViewSessions
    ].filter(Boolean),
  },
])

const isUserModalOpen = ref(false)
const modalMode = ref('edit') // Only 'edit' mode is supported now
const currentUser = ref({
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '', // Added phone number
  role: '', // Changed to single role string
  createdAt: null,
  updatedAt: null,
  isActive: true, // Added isActive status
})

const isPermissionsViewModalOpen = ref(false)
const viewingRole = ref({
  name: '',
  description: '',
  permissions: [],
})

// New state for Avatar View Modal
const isAvatarViewModalOpen = ref(false);
const avatarToViewUrl = ref('');

// State for custom confirmation dialog
const showConfirmDialog = ref(false);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
const confirmDialogButtonText = ref('');
const confirmDialogButtonClass = ref('');
const userIdToToggle = ref(null); // To store the ID of the user whose status is being toggled

const filteredUsers = computed(() => {
  let filtered = users.value;
  const query = searchQuery.value.toLowerCase();

  // Filter by search query
  if (query) {
    filtered = filtered.filter(user =>
      user.email.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      (user.role && user.role.toLowerCase().includes(query)) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(query)) || // Filter by phone number
      (user.isActive ? 'active' : 'inactive').includes(query)
    );
  }

  // Filter by selected role
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value);
  }

  // Filter by selected status
  if (selectedStatus.value !== '') {
    const isActive = selectedStatus.value === 'active';
    filtered = filtered.filter(user => user.isActive === isActive);
  }

  // Filter by date range
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;

  if (start || end) {
    filtered = filtered.filter(user => {
      const userCreatedAt = new Date(user.createdAt);
      // Set time to 00:00:00 for start date to include the whole day
      const startOfDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      // Set time to 23:59:59 for end date to include the whole day
      const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

      const isAfterStart = startOfDay ? userCreatedAt >= startOfDay : true;
      const isBeforeEnd = endOfDay ? userCreatedAt <= endOfDay : true;

      return isAfterStart && isBeforeEnd;
    });
  }

  return filtered;
});

// Sorted users based on sortColumn and sortDirection
const sortedUsers = computed(() => {
  const sortableUsers = [...filteredUsers.value]; // Create a shallow copy to avoid mutating original array
  if (!sortColumn.value || !sortDirection.value) {
    // If no sort column or direction is set, return as is (initial fetch order)
    return sortableUsers;
  }

  return sortableUsers.sort((a, b) => {
    let aValue, bValue;

    if (sortColumn.value === 'fullName') {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
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
  return Math.ceil(sortedUsers.value.length / itemsPerPage.value)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedUsers.value.slice(start, end)
})

const selectedRoleDescription = computed(() => {
  const selectedRole = availableRoles.value.find(role => role.name === currentUser.value.role)
  return selectedRole ? selectedRole.description : ''
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

const fetchUsers = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700))
    // Ensure mockUsers are initially in a consistent order if no sorting is applied by default
    // For example, sort by createdAt descending as a default "unsorted" order
    users.value = [...mockUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    showNotification('Users loaded successfully!', 'success')
  } catch (error) {
    showNotification('Failed to load users.', 'error')
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

// Watch for changes in filters to reset pagination and show table loading
watch([searchQuery, selectedRole, selectedStatus, startDate, endDate], () => {
  currentPage.value = 1; // Reset page on filter change
  isTableLoading.value = true;
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
})

// openUserModal now only supports 'edit' mode
const openUserModal = (mode, user = null) => {
  if (mode !== 'edit' || !user) {
    console.warn('User creation is not supported on this page. Only editing existing users is allowed.')
    return;
  }
  modalMode.value = mode
  // Ensure currentUser.role is a string, even if user.role is undefined
  currentUser.value = { ...user, role: user.role || '' }
  isUserModalOpen.value = true
}

const openPermissionsViewModal = (role) => {
  viewingRole.value = { ...role };
  isPermissionsViewModalOpen.value = true;
}

const openPermissionsViewModalFromSelectedRole = () => {
  const selectedRole = availableRoles.value.find(role => role.name === currentUser.value.role);
  if (selectedRole) {
    openPermissionsViewModal(selectedRole);
  }
};

// New function to open Avatar View Modal
const openAvatarViewModal = (url) => {
  avatarToViewUrl.value = url;
  isAvatarViewModalOpen.value = true;
};

const saveUser = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    // Only update existing user, no 'add' logic
    const index = users.value.findIndex(u => u.id === currentUser.value.id)
    if (index !== -1) {
      users.value[index] = { ...currentUser.value, updatedAt: new Date() }
      showNotification('User updated successfully!', 'success')
    } else {
      showNotification('User not found for update.', 'error')
    }
    isUserModalOpen.value = false
  } catch (error) {
    showNotification('Failed to update user.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Prepare the custom confirmation dialog
const prepareToggleUserStatus = (id) => {
  const userToToggle = users.value.find(user => user.id === id);
  if (!userToToggle) {
    showNotification('User not found.', 'error');
    return;
  }

  userIdToToggle.value = id;
  const action = userToToggle.isActive ? 'deactivate' : 'activate';
  confirmDialogTitle.value = `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)} User`;
  confirmDialogMessage.value = `Are you sure you want to ${action} user ${userToToggle.email}?`;
  confirmDialogButtonText.value = action.charAt(0).toUpperCase() + action.slice(1);
  confirmDialogButtonClass.value = userToToggle.isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-green-600 hover:bg-green-500';
  showConfirmDialog.value = true;
};

// Execute the toggle action after confirmation
const executeToggleUserStatus = async () => {
  const id = userIdToToggle.value;
  const userToToggle = users.value.find(user => user.id === id);

  if (!userToToggle) {
    showNotification('User not found.', 'error');
    return;
  }

  const newStatus = !userToToggle.isActive;
  const action = newStatus ? 'activate' : 'deactivate';

  isLoading.value = true; // Use main isLoading for this action as it's a data modification
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index].isActive = newStatus;
      users.value[index].updatedAt = new Date();
      showNotification(`User ${action}d successfully!`, 'success');
    } else {
      showNotification('User not found for status update.', 'error');
    }
  } catch (error) {
    showNotification(`Failed to ${action} user.`, 'error');
  } finally {
    isLoading.value = false;
    userIdToToggle.value = null; // Clear the stored ID
  }
};

// Handle cancellation from the custom confirmation dialog
const cancelToggleUserStatus = () => {
  userIdToToggle.value = null; // Clear the stored ID
  showNotification('User status change cancelled.', 'info');
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
  selectedRole.value = '';
  selectedStatus.value = '';
  startDate.value = '';
  endDate.value = '';
  // The watch on filter states will handle resetting currentPage and isTableLoading
};

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* Add any specific styles for this page if needed */
</style>
