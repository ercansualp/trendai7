<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
    <div class="bg-card rounded-lg shadow-xl w-full max-w-sm p-6">
      <h3 class="text-xl font-bold text-foreground mb-4">{{ title }}</h3>
      <p class="text-muted-foreground mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="cancel"
          class="inline-flex items-center justify-center px-4 py-2 border border-input text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="confirm"
          :class="['inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white', confirmButtonClass]"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?',
  },
  confirmButtonText: {
    type: String,
    default: 'Confirm',
  },
  confirmButtonClass: {
    type: String,
    default: 'bg-primary hover:bg-primary/90',
  },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue;
});

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue);
});

const confirm = () => {
  isOpen.value = false;
  emit('confirm');
};

const cancel = () => {
  isOpen.value = false;
  emit('cancel');
};
</script>

<style scoped>
/* No specific styles needed, Tailwind handles it */
</style>
