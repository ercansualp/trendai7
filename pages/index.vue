<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
      <p class="text-muted-foreground">Welcome to the TrendAI Admin Panel</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total Sessions</p>
            <p class="text-3xl font-bold text-foreground">{{ stats.totalSessions }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total Messages</p>
            <p class="text-3xl font-bold text-foreground">{{ stats.totalMessages }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Processed Messages</p>
            <p class="text-3xl font-bold text-foreground">{{ stats.processedMessages }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Active Users</p>
            <p class="text-3xl font-bold text-foreground">{{ stats.activeUsers }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Recent Sessions</h3>
        <div class="space-y-4">
          <div v-for="session in recentSessions" :key="session.id" class="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-foreground">User {{ session.userId.substring(0, 8) }}</p>
                <p class="text-xs text-muted-foreground">{{ formatDate(session.createdAt) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-foreground">{{ session.messageCount }} messages</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">AI Model Usage</h3>
        <div class="space-y-4">
          <div v-for="model in modelUsage" :key="model.model" class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 rounded-full" :class="getModelColor(model.model)"></div>
              <span class="text-sm font-medium text-foreground">{{ model.model }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-24 bg-muted rounded-full h-2">
                <div class="h-2 rounded-full" :class="getModelColor(model.model)" :style="{ width: model.percentage + '%' }"></div>
              </div>
              <span class="text-sm text-muted-foreground">{{ model.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

// Mock data - replace with actual API calls
const stats = ref({
  totalSessions: 1247,
  totalMessages: 8934,
  processedMessages: 8721,
  activeUsers: 342
})

const recentSessions = ref([
  {
    id: '1',
    userId: 'user123456789',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    messageCount: 15
  },
  {
    id: '2',
    userId: 'user987654321',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    messageCount: 8
  },
  {
    id: '3',
    userId: 'user456789123',
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
    messageCount: 22
  }
])

const modelUsage = ref([
  { model: 'GPT-4', percentage: 45 },
  { model: 'GPT-3.5', percentage: 35 },
  { model: 'Claude', percentage: 20 }
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getModelColor = (model) => {
  const colors = {
    'GPT-4': 'bg-blue-500',
    'GPT-3.5': 'bg-green-500',
    'Claude': 'bg-purple-500'
  }
  return colors[model] || 'bg-gray-500'
}
</script>
