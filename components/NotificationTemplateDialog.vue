<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b border-border">
        <h2 class="text-xl font-semibold">{{ isEditing ? 'Edit Message Template' : 'Add New Message Template' }}</h2>
        <button @click="close" class="text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveTemplate" class="p-6">
        <div class="space-y-4">
          <div>
            <label for="templateName" class="block text-sm font-medium text-foreground mb-1">Template Name <span class="text-destructive">*</span></label>
            <input
              id="templateName"
              v-model="localTemplate.name"
              type="text"
              class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="e.g., WelcomeEmail"
              required
            />
            <p v-if="errors.name" class="text-destructive text-xs mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label for="templateChannel" class="block text-sm font-medium text-foreground mb-1">Channel <span class="text-destructive">*</span></label>
            <select
              id="templateChannel"
              v-model="localTemplate.channel"
              class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              required
            >
              <option value="">Select a channel</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="PushNotification">Push Notification</option>
              <option value="Telegram">Telegram</option>
            </select>
            <p v-if="errors.channel" class="text-destructive text-xs mt-1">{{ errors.channel }}</p>
          </div>

          <div>
            <label for="templateSubject" class="block text-sm font-medium text-foreground mb-1">Subject (for Email/Push)</label>
            <input
              id="templateSubject"
              v-model="localTemplate.subject"
              type="text"
              class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="e.g., Welcome to TrendAI!"
            />
          </div>

          <div>
            <label for="templateDescription" class="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              id="templateDescription"
              v-model="localTemplate.description"
              rows="2"
              class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="A brief description of the template's purpose."
            ></textarea>
          </div>

          <div>
            <label for="templateBody" class="block text-sm font-medium text-foreground mb-1">Body <span class="text-destructive">*</span></label>
            <!-- Tiptap Rich Text Editor -->
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
                
                <button
                  type="button"
                  @click="editor.chain().focus().toggleUnderline().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('underline') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Underline"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l0 0m-7-7a7 7 0 1114 0v7a7 7 0 11-14 0V5a7 7 0 1114 0v7"></path>
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
                
                <button
                  type="button"
                  @click="editor.chain().focus().setParagraph().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('paragraph') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                  title="Paragraph"
                >
                  P
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
                
                <button
                  type="button"
                  @click="editor.chain().focus().toggleOrderedList().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('orderedList') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Numbered List"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                <div class="w-px h-6 bg-border mx-1"></div>

                <button
                  type="button"
                  @click="editor.chain().focus().setTextAlign('left').run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive({ textAlign: 'left' }) }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Align Left"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M3 12h12M3 18h9"></path>
                  </svg>
                </button>
                
                <button
                  type="button"
                  @click="editor.chain().focus().setTextAlign('center').run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive({ textAlign: 'center' }) }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Align Center"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M7 12h10M9 18h6"></path>
                  </svg>
                </button>
                
                <button
                  type="button"
                  @click="editor.chain().focus().setTextAlign('right').run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive({ textAlign: 'right' }) }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Align Right"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M9 12h12M15 18h6"></path>
                  </svg>
                </button>

                <div class="w-px h-6 bg-border mx-1"></div>

                <button
                  type="button"
                  @click="addLink"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('link') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Add Link"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                </button>
              </div>

              <!-- Editor Content -->
              <div class="min-h-[150px] p-3">
                <editor-content :editor="editor" />
              </div>
            </div>
            <p v-if="errors.body" class="text-destructive text-xs mt-1">{{ errors.body }}</p>
          </div>

          <div class="flex items-center">
            <input
              id="isHtml"
              v-model="localTemplate.isHtml"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
            />
            <label for="isHtml" class="ml-2 block text-sm text-foreground">Is HTML Content</label>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button type="button" @click="close" class="btn btn-secondary px-4 py-2">Cancel</button>
          <button type="submit" :disabled="isLoading" class="btn btn-primary px-4 py-2">
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>{{ isEditing ? 'Save Changes' : 'Add Template' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  template: {
    type: Object,
    default: null // When null, it's an add operation
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'close']);

const defaultTemplate = {
  id: null,
  dataType: 'Project', // Assuming 'Project' as default for new templates
  name: '',
  description: '',
  body: '',
  channel: '',
  subject: '',
  isHtml: false,
};

const localTemplate = ref({ ...defaultTemplate });
const isEditing = ref(false);
const errors = reactive({});

// Initialize Tiptap editor
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Enter template content. Use {variable} for dynamic data...',
    }),
    TextStyle,
    Color,
    Highlight,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline cursor-pointer',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Underline,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] text-foreground',
    },
  },
  onUpdate: ({ editor }) => {
    localTemplate.value.body = editor.getHTML();
  },
});

// Add link functionality
const addLink = () => {
  const previousUrl = editor.value.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // update link
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    localTemplate.value = { ...newTemplate };
    isEditing.value = true;
    if (editor.value) {
      editor.value.commands.setContent(newTemplate.body || '');
    }
  } else {
    localTemplate.value = { ...defaultTemplate };
    isEditing.value = false;
    if (editor.value) {
      editor.value.commands.setContent('');
    }
  }
  // Clear errors when template changes or dialog opens/closes
  Object.keys(errors).forEach(key => delete errors[key]);
}, { immediate: true });

watch(() => props.isVisible, (newVal) => {
  if (!newVal) {
    // Clear errors when dialog closes
    Object.keys(errors).forEach(key => delete errors[key]);
  }
});

const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors

  if (!localTemplate.value.name.trim()) {
    errors.name = 'Template Name is required.';
    isValid = false;
  }
  if (!localTemplate.value.channel) {
    errors.channel = 'Channel is required.';
    isValid = false;
  }
  // For Tiptap, check if the content is empty or just whitespace/HTML tags
  if (!localTemplate.value.body || localTemplate.value.body.replace(/<[^>]*>/g, '').trim() === '') {
    errors.body = 'Template Body is required.';
    isValid = false;
  }

  return isValid;
};

const saveTemplate = () => {
  if (!validateForm()) {
    return;
  }
  emit('save', { ...localTemplate.value });
};

const close = () => {
  emit('close');
};

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
/* Tiptap Editor Styles */
:deep(.ProseMirror) {
  outline: none;
  padding: 0.75rem;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
  border-radius: 0 0 0.5rem 0.5rem;
  min-height: 150px;
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

:deep(.ProseMirror a) {
  color: hsl(var(--primary));
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ProseMirror a:hover) {
  color: hsl(var(--primary));
  opacity: 0.8;
}

:deep(.ProseMirror strong) {
  font-weight: 700;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror u) {
  text-decoration: underline;
}

:deep(.ProseMirror [data-text-align="left"]) {
  text-align: left;
}

:deep(.ProseMirror [data-text-align="center"]) {
  text-align: center;
}

:deep(.ProseMirror [data-text-align="right"]) {
  text-align: right;
}

/* Dark mode adjustments */
.dark :deep(.ProseMirror) {
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

.dark :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: hsl(var(--muted-foreground));
}

.dark :deep(.ProseMirror h1),
.dark :deep(.ProseMirror h2),
.dark :deep(.ProseMirror p),
.dark :deep(.ProseMirror li) {
  color: hsl(var(--foreground));
}

.dark :deep(.ProseMirror a) {
  color: hsl(var(--primary));
}
</style>
