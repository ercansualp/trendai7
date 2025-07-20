<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">User Sessions</h1>
      <p class="text-muted-foreground">Monitor and manage active user sessions.</p>
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
      <p class="ml-3 text-foreground">Loading sessions...</p>
    </div>

    <div v-else class="card p-6 mb-6 relative">
      <!-- Filter Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="relative">
          <label for="sessionSearchFilter" class="block text-sm font-medium text-muted-foreground mb-1">Search Sessions</label>
          <input
            type="text"
            id="sessionSearchFilter"
            v-model="searchQuery"
            placeholder="Search by User, IP, or User Agent..."
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
          <label for="loginTimeStartFilter" class="block text-sm font-medium text-muted-foreground mb-1">Login Time After</label>
          <input
            type="date"
            id="loginTimeStartFilter"
            v-model="startDate"
            class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
        <div>
          <label for="loginTimeEndFilter" class="block text-sm font-medium text-muted-foreground mb-1">Login Time Before</label>
          <input
            type="date"
            id="loginTimeEndFilter"
            v-model="endDate"
            class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div class="flex justify-end items-center mb-4">
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
                @click="sortTable('userId')"
              >
                <div class="flex items-center">
                  User
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'userId' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'userId' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'userId' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'userId' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                @click="sortTable('loginTime')"
              >
                <div class="flex items-center">
                  Login Time
                  <span class="ml-2 flex flex-row space-x-1">
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'loginTime' && sortDirection === 'asc', 'text-muted-foreground/50': !(sortColumn === 'loginTime' && sortDirection === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    <svg class="w-4 h-4" :class="{'text-primary': sortColumn === 'loginTime' && sortDirection === 'desc', 'text-muted-foreground/50': !(sortColumn === 'loginTime' && sortDirection === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expiry Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">IP Address</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User Agent</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="session in paginatedSessions" :key="session.sessionId" class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground flex items-center">
                <img
                  :src="session.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full object-cover mr-3 cursor-pointer"
                  @click="openAvatarViewModal(session.avatar || 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')"
                />
                <span>{{ session.firstName }} {{ session.lastName }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(session.loginTime) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(session.refreshTokenExpiryTime) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{{ session.ipAddress }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground truncate max-w-xs">{{ session.userAgent }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="confirmRevokeSession(session.sessionId, session.firstName, session.lastName)" class="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200">Revoke</button>
              </td>
            </tr>
            <tr v-if="paginatedSessions.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-muted-foreground">No sessions found.</td>
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

    <!-- Confirm Revoke Dialog -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="Confirm Session Revocation"
      :message="`Are you sure you want to revoke the session for ${sessionToRevokeInfo}? This will log the user out from this session.`"
      confirm-button-text="Revoke Session"
      confirm-button-class="bg-destructive hover:bg-destructive/90"
      @confirm="executeRevokeSession"
      @cancel="cancelRevokeSession"
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
const isTableLoading = ref(false) // For filtering and pagination
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const sessions = ref([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(5) // You can adjust this number

// Filter state
const searchQuery = ref('')
const startDate = ref('') // New filter state for start date
const endDate = ref('') // New filter state for end date

// Sorting state
const sortColumn = ref('loginTime'); // Default sort by loginTime
const sortDirection = ref('desc'); // Default sort descending

// New state for Avatar View Modal
const isAvatarViewModalOpen = ref(false);
const avatarToViewUrl = ref('');

// Confirm Dialog state for session revocation
const showConfirmDialog = ref(false);
const sessionToRevokeId = ref(null);
const sessionToRevokeInfo = ref(''); // To display user name/session ID in the modal

// Mock user data (simplified for sessions page)
const mockUsersData = [
  {
    id: 'user_001',
    firstName: 'Admin',
    lastName: 'User',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_002',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_003',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_004',
    firstName: 'Peter',
    lastName: 'Jones',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_005',
    firstName: 'Alice',
    lastName: 'Wong',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_006',
    firstName: 'Bob',
    lastName: 'Brown',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_007',
    firstName: 'Charlie',
    lastName: 'Davis',
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_008',
    firstName: 'Diana',
    lastName: 'Evans',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_009',
    firstName: 'Frank',
    lastName: 'Green',
    avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_010',
    firstName: 'Grace',
    lastName: 'Hall',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_011',
    firstName: 'Helen',
    lastName: 'King',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 'user_012',
    firstName: 'Ivan',
    lastName: 'Lee',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
];

const mockSessions = [
  {
    userId: 'user_001',
    sessionId: 'sess_abc123',
    refreshToken: 'refresh_token_1',
    refreshTokenExpiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    loginTime: new Date('2023-10-26T10:00:00Z'), // 2 hours ago
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
  },
  {
    userId: 'user_002',
    sessionId: 'sess_def456',
    refreshToken: 'refresh_token_2',
    refreshTokenExpiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    loginTime: new Date('2023-10-25T14:30:00Z'), // 1 day ago
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
  },
  {
    userId: 'user_001',
    sessionId: 'sess_ghi789',
    refreshToken: 'refresh_token_3',
    refreshTokenExpiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day from now
    loginTime: new Date('2023-10-26T09:30:00Z'), // 30 minutes ago
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36',
  },
  {
    userId: 'user_003',
    sessionId: 'sess_jkl012',
    refreshToken: 'refresh_token_4',
    refreshTokenExpiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    loginTime: new Date('2023-10-24T22:00:00Z'), // 12 hours ago
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/83.0.4103.88 Mobile/15E148 Safari/604.1',
  },
  {
    userId: 'user_004',
    sessionId: 'sess_mno345',
    refreshToken: 'refresh_token_5',
    refreshTokenExpiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    loginTime: new Date('2023-10-26T04:00:00Z'), // 6 hours ago
    ipAddress: '172.16.0.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/100.0.100.0',
  },
  {
    userId: 'user_001',
    sessionId: 'sess_pqr678',
    refreshToken: 'refresh_token_6',
    refreshTokenExpiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // 4 days from now
    loginTime: new Date('2023-10-26T09:45:00Z'), // 15 minutes ago
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  },
]

const filteredSessions = computed(() => {
  let filtered = sessions.value;
  const query = searchQuery.value.toLowerCase();

  // Filter by search query (User ID, IP Address, User Agent, First Name, Last Name)
  if (query) {
    filtered = filtered.filter(session =>
      session.userId.toLowerCase().includes(query) ||
      session.ipAddress.toLowerCase().includes(query) ||
      session.userAgent.toLowerCase().includes(query) ||
      (session.firstName && session.firstName.toLowerCase().includes(query)) ||
      (session.lastName && session.lastName.toLowerCase().includes(query))
    );
  }

  // Filter by date range (loginTime)
  const start = startDate.value ? new Date(startDate.value) : null;
  const end = endDate.value ? new Date(endDate.value) : null;

  if (start || end) {
    filtered = filtered.filter(session => {
      const sessionLoginTime = new Date(session.loginTime);
      // Set time to 00:00:00 for start date to include the whole day
      const startOfDay = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      // Set time to 23:59:59 for end date to include the whole day
      const endOfDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null;

      const isAfterStart = startOfDay ? sessionLoginTime >= startOfDay : true;
      const isBeforeEnd = endOfDay ? sessionLoginTime <= endOfDay : true;

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

    // If sorting by 'userId', we'll use the full name for comparison
    if (sortColumn.value === 'userId') {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    } else {
      aValue = a[sortColumn.value];
      bValue = b[sortColumn.value];
    }

    let comparison = 0;

    // Handle date comparison for loginTime
    if (sortColumn.value === 'loginTime') {
      const dateA = aValue ? new Date(aValue).getTime() : 0;
      const dateB = bValue ? new Date(bValue).getTime() : 0;
      comparison = dateA - dateB;
    } else {
      // Handle string comparison (case-insensitive) for userId (now full name)
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
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700))
    // Enrich mockSessions with user details
    const enrichedSessions = mockSessions.map(session => {
      const user = mockUsersData.find(u => u.id === session.userId);
      return {
        ...session,
        firstName: user ? user.firstName : 'Unknown',
        lastName: user ? user.lastName : 'User',
        avatar: user ? user.avatar : 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', // Default avatar
      };
    });
    // Ensure sessions are initially sorted by loginTime descending
    sessions.value = enrichedSessions.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
    showNotification('Sessions loaded successfully!', 'success')
  } catch (error) {
    showNotification('Failed to load sessions.', 'error')
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

const confirmRevokeSession = (sessionId, firstName, lastName) => {
  sessionToRevokeId.value = sessionId;
  sessionToRevokeInfo.value = `${firstName} ${lastName} (ID: ${sessionId.substring(0, 8)}...)`;
  showConfirmDialog.value = true;
};

const executeRevokeSession = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    sessions.value = sessions.value.filter(session => session.sessionId !== sessionToRevokeId.value)
    showNotification(`Session ${sessionToRevokeId.value.substring(0, 8)}... revoked successfully!`, 'success')
    // After deleting, adjust current page if it's now empty
    if (paginatedSessions.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    showNotification('Failed to revoke session.', 'error')
  } finally {
    isLoading.value = false
    sessionToRevokeId.value = null;
    sessionToRevokeInfo.value = '';
  }
}

const cancelRevokeSession = () => {
  sessionToRevokeId.value = null;
  sessionToRevokeInfo.value = '';
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
  startDate.value = '';
  endDate.value = '';
  // The watch on filter states will handle resetting currentPage and isTableLoading
};

// Watch for changes in filter inputs and apply filters
watch([searchQuery, startDate, endDate], () => {
  currentPage.value = 1; // Reset page on filter change
  isTableLoading.value = true;
  setTimeout(() => {
    isTableLoading.value = false;
  }, 300); // Simulate loading time
});

// Function to open Avatar View Modal
const openAvatarViewModal = (url) => {
  avatarToViewUrl.value = url;
  isAvatarViewModalOpen.value = true;
};

onMounted(() => {
  fetchSessions()
})
</script>

<style scoped>
/* Add any specific styles for this page if needed */
</style>
