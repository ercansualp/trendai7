<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Yeni Haber Ekle</h1>
      <p class="text-muted-foreground">Yeni bir haber oluşturun ve yayınlayın</p>
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

    <form @submit.prevent="saveNews" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Haber Başlığı</h3>
            <input
              type="text"
              v-model="newsData.title"
              placeholder="Haber başlığını girin..."
              class="w-full px-4 py-3 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-lg"
              required
            />
          </div>

          <!-- Content -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">İçerik</h3>
            <div class="border border-input rounded-lg bg-background">
              <!-- Toolbar -->
              <div v-if="editor" class="border-b border-border p-2 flex flex-wrap gap-1 bg-secondary rounded-t-lg">
                <button
                  type="button"
                  @click="editor.chain().focus().toggleBold().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('bold') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Bold"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                  </svg>
                </button>
                
                <button
                  type="button"
                  @click="editor.chain().focus().toggleItalic().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('italic') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Italic"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4h-9M14 20H5M15 4L9 20"></path>
                  </svg>
                </button>

                <div class="w-px h-6 bg-border mx-1"></div>

                <button
                  type="button"
                  @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('heading', { level: 1 }) }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                  title="Heading 1"
                >
                  H1
                </button>
                
                <button
                  type="button"
                  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('heading', { level: 2 }) }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                  title="Heading 2"
                >
                  H2
                </button>

                <div class="w-px h-6 bg-border mx-1"></div>

                <button
                  type="button"
                  @click="editor.chain().focus().toggleBulletList().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('bulletList') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Bullet List"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
                  </svg>
                </button>
              </div>

              <!-- Editor Content -->
              <div class="min-h-[300px] p-4">
                <editor-content :editor="editor" />
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Görsel</h3>
            <div class="flex items-center space-x-4 mb-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="url"
                  v-model="imageUploadMethod"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-foreground">URL ile Yükle</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="file"
                  v-model="imageUploadMethod"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-foreground">Cihazdan Seç</span>
              </label>
            </div>

            <div v-if="imageUploadMethod === 'url'">
              <input
                type="url"
                v-model="newsData.imageUrl"
                placeholder="Görsel URL'si girin..."
                class="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
            </div>
            <div v-else-if="imageUploadMethod === 'file'">
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="w-full text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
              />
            </div>

            <div v-if="newsData.imageUrl" class="mt-4">
              <img :src="newsData.imageUrl" alt="Preview" class="w-full h-48 object-cover rounded-md" />
            </div>
            <div v-else-if="imageUploadMethod === 'file' && !newsData.imageUrl" class="mt-4 text-muted-foreground text-sm">
              Görsel seçilmedi.
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Publish Settings -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Yayın Ayarları</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">Durum</label>
                <select v-model="newsData.contentStatus" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm">
                  <option value="Draft">Taslak</option>
                  <option value="Published">Yayınla</option>
                  <option value="Archived">Arşivle</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">İçerik Türü</label>
                <select v-model="newsData.contentType" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm">
                  <option value="News">Haber</option>
                  <option value="Article">Makale</option>
                  <option value="Blog">Blog</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">Yayın Tarihi</label>
                <input
                  type="datetime-local"
                  v-model="publishedDateLocal"
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">Okuma Süresi (dakika)</label>
                <input
                  type="number"
                  v-model.number="newsData.readingDuration"
                  min="1"
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  v-model="newsData.featured"
                  class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label for="featured" class="ml-2 block text-sm text-foreground">Öne Çıkan Haber</label>
              </div>
            </div>
          </div>

          <!-- Author -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Yazar</h3>
            <select v-model="newsData.authorId" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm">
              <option value="">Yazar seçin</option>
              <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.fullName }}</option>
            </select>
          </div>

          <!-- Source -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Kaynak</h3>
            <select v-model="newsData.sourceId" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm mb-3">
              <option value="">Kaynak seçin</option>
              <option v-for="source in sources" :key="source.id" :value="source.id">{{ source.name }}</option>
            </select>
            <input
              type="url"
              v-model="newsData.sourceUrl"
              placeholder="Kaynak URL (opsiyonel)"
              class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
          </div>

          <!-- Tags -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Etiketler</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div v-for="tag in availableTags" :key="tag.id" class="flex items-center">
                <input
                  type="checkbox"
                  :id="`tag-${tag.id}`"
                  :value="tag.id"
                  v-model="newsData.selectedTags"
                  class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label :for="`tag-${tag.id}`" class="ml-2 block text-sm text-foreground">{{ tag.name }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end items-center pt-6 border-t border-border">
        <div class="flex space-x-3">
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kaydediliyor...
            </span>
            <span v-else>{{ submitButtonText }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

definePageMeta({
  layout: 'admin'
})

const isLoading = ref(false)
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const newsData = ref({
  title: '',
  contentText: '',
  imageUrl: '', // This will hold the URL or Data URL for preview
  sourceUrl: '',
  contentStatus: 'Draft', // Default to Draft
  contentType: 'News',
  readingDuration: 5,
  publishedDate: new Date(),
  featured: false,
  authorId: '',
  sourceId: '',
  selectedTags: []
})

const imageUploadMethod = ref('url'); // 'url' or 'file'
const selectedFile = ref(null); // Holds the File object

const publishedDateLocal = computed({
  get() {
    return newsData.value.publishedDate.toISOString().slice(0, 16)
  },
  set(value) {
    newsData.value.publishedDate = new Date(value)
  }
})

// Computed property for dynamic submit button text
const submitButtonText = computed(() => {
  return newsData.value.contentStatus === 'Published' ? 'Yayınla' : 'Kaydet ve Yayınla';
});

// Mock data
const authors = ref([
  { id: 'author_001', fullName: 'Ahmet Yılmaz' },
  { id: 'author_002', fullName: 'Fatma Demir' },
  { id: 'author_003', fullName: 'Mehmet Kaya' }
])

const sources = ref([
  { id: 'source_001', name: 'TechCrunch' },
  { id: 'source_002', name: 'BBC News' },
  { id: 'source_003', name: 'Reuters' }
])

const availableTags = ref([
  { id: 'tag_001', name: 'yapay-zeka' },
  { id: 'tag_002', name: 'blockchain' },
  { id: 'tag_003', name: 'kripto-para' },
  { id: 'tag_004', name: 'mobil-uygulama' },
  { id: 'tag_005', name: 'siber-güvenlik' }
])

// Initialize Tiptap editor
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Haber içeriğini buraya yazın...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[250px] text-foreground',
    },
  },
  onUpdate: ({ editor }) => {
    newsData.value.contentText = editor.getHTML()
  },
})

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

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      newsData.value.imageUrl = e.target.result; // Set Data URL for preview
    };
    reader.readAsDataURL(file);
  } else {
    selectedFile.value = null;
    newsData.value.imageUrl = '';
  }
};

// Watch for changes in imageUploadMethod to clear the other input's value
watch(imageUploadMethod, (newMethod) => {
  if (newMethod === 'url') {
    selectedFile.value = null;
    // newsData.value.imageUrl will be bound to the URL input
  } else if (newMethod === 'file') {
    newsData.value.imageUrl = ''; // Clear URL if switching to file upload
  }
});

// The saveDraft function is no longer needed as the main submit button handles both save and publish based on status.
// const saveDraft = async () => {
//   const originalStatus = newsData.value.contentStatus
//   newsData.value.contentStatus = 'Draft'
//   await saveNews()
//   newsData.value.contentStatus = originalStatus
// }

const saveNews = async () => {
  if (!newsData.value.title.trim()) {
    showNotification('Haber başlığı gereklidir.', 'error')
    return
  }

  if (!newsData.value.contentText.trim()) {
    showNotification('Haber içeriği gereklidir.', 'error')
    return
  }

  if (!newsData.value.imageUrl) {
    showNotification('Haber görseli gereklidir.', 'error')
    return
  }

  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real application, you would handle file upload here:
    // if (imageUploadMethod.value === 'file' && selectedFile.value) {
    //   // Upload selectedFile.value to your storage service (e.g., Supabase Storage)
    //   // Get the public URL and assign it to newsData.value.imageUrl
    //   console.log('Uploading file:', selectedFile.value.name);
    // } else if (imageUploadMethod.value === 'url' && newsData.value.imageUrl) {
    //   // Use the provided URL directly
    //   console.log('Using URL:', newsData.value.imageUrl);
    // }

    const action = newsData.value.contentStatus === 'Published' ? 'yayınlandı' : 'kaydedildi'
    showNotification(`Haber başarıyla ${action}!`, 'success')
    
    // Redirect to news list after successful save
    setTimeout(() => {
      navigateTo('/cms/news')
    }, 1500)
  } catch (error) {
    showNotification('Haber kaydedilirken hata oluştu.', 'error')
  } finally {
    isLoading.value = false
  }
}

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
/* Tiptap Editor Styles */
:deep(.ProseMirror) {
  outline: none;
  padding: 1rem;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
  border-radius: 0 0 0.5rem 0.5rem;
  min-height: 250px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
  color: hsl(var(--foreground));
}

:deep(.ProseMirror h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.75rem 0 0.5rem 0;
  color: hsl(var(--foreground));
}

:deep(.ProseMirror p) {
  margin: 0.5rem 0;
  color: hsl(var(--foreground));
}

:deep(.ProseMirror ul, .ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror li) {
  margin: 0.25rem 0;
  color: hsl(var(--foreground));
}
</style>
