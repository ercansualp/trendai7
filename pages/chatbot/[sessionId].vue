<template>
  <div class="h-full flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Chat Session Details</h1>
        <p class="text-muted-foreground">Review the full conversation for this session</p>
      </div>
      <NuxtLink
        to="/chatbot"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Sessions
      </NuxtLink>
    </div>

    <div v-if="session" class="flex-1 card flex flex-col" style="height: calc(100vh - 200px);">
      <!-- Session Header -->
      <div class="px-6 py-4 border-b border-border bg-muted rounded-t-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img
              :src="getUserAvatar(session.userId)"
              alt="User Avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 class="font-semibold text-foreground">{{ getUserFullName(session.userId) }}</h3>
              <p class="text-sm text-muted-foreground">Session created: {{ formatDate(session.createdAt) }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <img
                :src="getAiModelLogo(getAiModelForSession(session))"
                alt="AI Model Logo"
                class="w-6 h-6 rounded-full object-cover mr-2"
              />
              <span class="text-sm text-muted-foreground">{{ getAiModelForSession(session) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
        <div v-if="session.messages.length === 0" class="text-center text-muted-foreground mt-20">
          <svg class="w-16 h-16 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p class="text-lg font-medium">No messages in this session</p>
          <p class="text-sm">This session might be empty or an error occurred.</p>
        </div>

        <template v-for="(item, index) in groupedMessages" :key="item.id || `date-${index}`">
          <div v-if="item.type === 'dateSeparator'" class="flex justify-center my-4">
            <span class="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground shadow-sm">
              {{ item.date }}
            </span>
          </div>
          <div
            v-else-if="item.type === 'message'"
            class="flex"
            :class="item.isUser ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm"
              :class="item.isUser 
                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                : 'bg-secondary text-secondary-foreground rounded-bl-sm'"
            >
              <div v-if="!item.isUser" class="flex items-center mb-1">
                <img
                  :src="getAiModelLogo(item.aiModel)"
                  alt="AI Model Logo"
                  class="w-4 h-4 rounded-full object-cover mr-2"
                />
                <span class="text-xs font-medium text-muted-foreground">{{ item.aiModel }}</span>
                <span 
                  v-if="item.isProcessed"
                  class="ml-2 w-2 h-2 bg-green-500 rounded-full"
                  title="Processed"
                ></span>
                <span 
                  v-else
                  class="ml-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
                  title="Processing"
                ></span>
              </div>
              
              <p class="text-sm whitespace-pre-wrap">{{ item.content }}</p>
              
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs opacity-75">
                  {{ formatTime(item.createdAt) }}
                </span>
                <div v-if="item.retryCount > 0" class="text-xs opacity-75 text-destructive">
                  Retry: {{ item.retryCount }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="flex-1 flex items-center justify-center text-muted-foreground">
      <p class="text-lg">Loading session details or session not found...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { mockSessions } from '~/data/mockSessions.js';
import { mockUsers } from '~/data/mockUsers.js'; // Import mockUsers

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const sessionId = route.params.sessionId
const session = ref(null)
const messagesContainer = ref(null)

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

const getUserFullName = (userId) => {
  const user = usersMap.value.get(userId);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
};

const getUserAvatar = (userId) => {
  const user = usersMap.value.get(userId);
  return user && user.avatar ? user.avatar : 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
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

// Date utility functions
const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const getDayLabel = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return 'Bugün';
  } else if (isSameDay(date, yesterday)) {
    return 'Dün';
  } else {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
};

// Group messages by date
const groupedMessages = computed(() => {
  if (!session.value || !session.value.messages) {
    return [];
  }

  const groups = [];
  let lastDate = null;

  session.value.messages.forEach(message => {
    const messageDate = new Date(message.createdAt);
    
    if (!lastDate || !isSameDay(messageDate, lastDate)) {
      groups.push({
        type: 'dateSeparator',
        date: getDayLabel(messageDate)
      });
      lastDate = messageDate;
    }
    groups.push({ type: 'message', ...message });
  });

  return groups;
});


onMounted(() => {
  // Find the session directly from mockSessions
  session.value = mockSessions.find(s => s.id === sessionId);
  nextTick(() => {
    scrollToBottom();
  });
});

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>
