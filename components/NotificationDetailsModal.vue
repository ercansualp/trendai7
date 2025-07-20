<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b border-border">
        <h2 class="text-xl font-semibold">Notification Details</h2>
        <button @click="close" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="notification" class="p-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Event Type</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm font-medium text-foreground">{{ notification.eventType }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Recipient</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm text-foreground">{{ notification.to }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Channel</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm text-foreground">{{ getChannelFromEventType(notification.eventType) }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Template Used</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span 
                  class="text-sm font-medium"
                  :class="notification.useTemplate ? 'text-success' : 'text-warning'"
                >
                  {{ notification.useTemplate ? 'Yes' : 'No' }}
                </span>
                <span v-if="notification.templateName" class="text-sm text-muted-foreground ml-2">
                  ({{ notification.templateName }})
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Sent At</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm text-foreground">{{ formatDateTime(notification.createdAt) }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Status</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                  Delivered
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Content Type</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm text-foreground">{{ notification.isHtml ? 'HTML' : 'Plain Text' }}</span>
              </div>
            </div>

            <div v-if="notification.retryCount">
              <label class="block text-sm font-medium text-muted-foreground mb-1">Retry Count</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm text-warning font-medium">{{ notification.retryCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Subject (if exists) -->
        <div v-if="notification.subject" class="mb-6">
          <label class="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
          <div class="px-4 py-3 bg-muted rounded-lg border-l-4 border-primary">
            <p class="text-sm font-medium text-foreground">{{ notification.subject }}</p>
          </div>
        </div>

        <!-- Message Body -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-muted-foreground mb-2">Message Content</label>
          <div class="border border-border rounded-lg bg-background">
            <div class="px-4 py-2 bg-secondary border-b border-border rounded-t-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-secondary-foreground">Message Body</span>
                <div class="flex items-center space-x-2">
                  <button
                    @click="copyToClipboard(notification.body)"
                    class="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1"
                    title="Copy to clipboard"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Copy</span>
                  </button>
                  <button
                    @click="togglePreviewMode"
                    class="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1"
                  >
                    <svg v-if="!isPreviewMode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    <span>{{ isPreviewMode ? 'Code' : 'Preview' }}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              <div v-if="!isPreviewMode" class="font-mono text-sm text-foreground whitespace-pre-wrap">{{ notification.body }}</div>
              <div v-else-if="notification.isHtml" class="prose prose-sm max-w-none" v-html="notification.body"></div>
              <div v-else class="text-sm text-foreground whitespace-pre-wrap">{{ notification.body }}</div>
            </div>
          </div>
        </div>

        <!-- Metadata -->
        <div class="border-t border-border pt-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">Additional Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Notification ID</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm font-mono text-foreground">{{ notification.id }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Processing Time</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm text-foreground">{{ getProcessingTime() }}ms</span>
              </div>
            </div>

            <div v-if="notification.errorMessage">
              <label class="block text-sm font-medium text-muted-foreground mb-1">Error Message</label>
              <div class="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                <span class="text-sm text-destructive">{{ notification.errorMessage }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted-foreground mb-1">Message Size</label>
              <div class="px-3 py-2 bg-muted rounded-lg">
                <span class="text-sm text-foreground">{{ getMessageSize(notification.body) }} characters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end p-6 border-t border-border bg-muted/30">
        <button @click="close" class="btn btn-secondary px-6 py-2">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  notification: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const isPreviewMode = ref(false);

const close = () => {
  emit('close');
};

const togglePreviewMode = () => {
  isPreviewMode.value = !isPreviewMode.value;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log('Copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const formatDateTime = (dateString) => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(dateString));
};

const getChannelFromEventType = (eventType) => {
  // Map event types to channels based on common patterns
  const channelMap = {
    'UserRegistered': 'Email',
    'PasswordReset': 'SMS',
    'SystemAlert': 'Email',
    'NewFeature': 'Push Notification',
    'SecurityAlert': 'Email',
    'MaintenanceNotice': 'Email'
  };
  return channelMap[eventType] || 'Unknown';
};

const getProcessingTime = () => {
  // Simulate processing time (in real app, this would come from the notification data)
  return Math.floor(Math.random() * 500) + 100;
};

const getMessageSize = (message) => {
  return message ? message.length : 0;
};
</script>

<style scoped>
/* Custom styles for the modal */
.prose {
  color: hsl(var(--foreground));
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: hsl(var(--foreground));
}

.prose p {
  color: hsl(var(--foreground));
}

.prose a {
  color: hsl(var(--primary));
}

.prose strong {
  color: hsl(var(--foreground));
}

.prose em {
  color: hsl(var(--foreground));
}

.prose ul, .prose ol {
  color: hsl(var(--foreground));
}

.prose li {
  color: hsl(var(--foreground));
}

.prose blockquote {
  color: hsl(var(--muted-foreground));
  border-left-color: hsl(var(--border));
}

.prose code {
  color: hsl(var(--foreground));
  background-color: hsl(var(--muted));
}

.prose pre {
  background-color: hsl(var(--muted));
  color: hsl(var(--foreground));
}
</style>
