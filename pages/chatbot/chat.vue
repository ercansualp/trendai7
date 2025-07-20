<template>
  <div class="h-full flex flex-col">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-foreground mb-2">Live Chat</h1>
      <p class="text-muted-foreground">Chat directly with the AI assistant</p>
    </div>

    <!-- Chat Container -->
    <div class="flex-1 card flex flex-col" style="height: calc(100vh - 200px);">
      <!-- Chat Header -->
      <div class="px-6 py-4 border-b border-border bg-secondary rounded-t-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-foreground">TrendAI Assistant</h3>
              <p class="text-sm text-muted-foreground">{{ isTyping ? 'Typing...' : 'Online' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-if="messages.length === 0" class="text-center text-muted-foreground mt-20">
          <svg class="w-16 h-16 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p class="text-lg font-medium">Start a conversation</p>
          <p class="text-sm">Type a message below to begin chatting with the AI assistant</p>
        </div>

        <div
          v-for="(message, index) in chatbotStore.messages"
          :key="index"
          class="flex"
          :class="message.senderType !== 'AI' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl"
            :class="message.senderType !== 'AI' 
              ? 'bg-primary text-primary-foreground rounded-br-sm' 
              : 'bg-secondary text-secondary-foreground rounded-bl-sm'"
          >
            <div v-if="message.senderType !== 'AI'" class="flex items-center mb-1">
              <span class="text-xs font-medium text-muted-foreground">{{ message.aiModel }}</span>
            </div>
            
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs opacity-75">
                {{ formatTime(message.createdAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="border-t border-border p-4">
        <form @submit.prevent="sendMessage" class="flex space-x-3">
          <div class="flex-1 relative">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type your message..."
              class="w-full px-4 py-3 border border-input rounded-full focus:ring-2 focus:ring-ring focus:border-primary pr-12 bg-background text-foreground"
              :disabled="isTyping"
            />
            <button
              type="button"
              @click="toggleEmojiPicker"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
          
          <button
            type="submit"
            :disabled="!newMessage.trim() || isTyping"
            class="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="quickAction in quickActions"
        :key="quickAction.text"
        @click="sendQuickMessage(quickAction.text)"
        class="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
      >
        {{ quickAction.text }}
      </button>
    </div>
  </div>
</template>

<script setup>
const { on, off, connectionState } = useSignalR()
import { HubConnectionState } from '@microsoft/signalr'

definePageMeta({
  layout: 'admin'
})

const chatbotStore = useChatbotStore();
const { isTyping } = storeToRefs(chatbotStore);

const newMessage = ref('')
const messages = ref([])
const selectedModel = ref('GPT-4')
const messagesContainer = ref(null)

const quickActions = [
  { text: 'Hello, how can you help me?' },
  { text: 'What are your capabilities?' },
  { text: 'Explain machine learning' },
  { text: 'Help me with coding' },
  { text: 'What is the weather like?' }
]

const generateMessageId = () => {
  return 'msg-' + Math.random().toString(36).substr(2, 9)
}

const addMessage = (messageData) => {
  const message = {
    id: generateMessageId(),
    timestamp: new Date(),
    retryCount: 0,
    ...messageData
  }
  messages.value.push(message)
  nextTick(() => {
    scrollToBottom()
  })
  return message
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return

  const userMessage = newMessage.value.trim()
  newMessage.value = ''

  await chatbotStore.sendMessageAsync(userMessage);
}

const sendQuickMessage = (message) => {
  newMessage.value = message
  sendMessage()
}

const toggleEmojiPicker = () => {
  // Emoji picker functionality would go here
  console.log('Toggle emoji picker')
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date) => {
  const _date = new Date(date);
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(_date)
}

// Watch for model changes
watch(selectedModel, (newModel) => {
  addMessage({
    content: `AI model switched to ${newModel}`,
    isUser: false,
    aiModel: newModel,
    isProcessed: true
  })
})
</script>
