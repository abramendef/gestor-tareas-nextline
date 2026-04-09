<template>
  <v-card 
    class="task-card rounded-xl mb-4" 
    elevation="0"
    @click="$emit('view', task.id)"
  >
    <v-card-title class="d-flex justify-space-between align-center px-5 py-4">
      <div class="d-flex align-center overflow-hidden">
        <v-checkbox-btn
          v-model="isCompleted"
          color="success"
          class="mr-3 custom-checkbox"
          @change="toggleStatus"
          @click.stop
        ></v-checkbox-btn>
        <span 
          :class="['text-h6 font-weight-medium task-title-summary text-truncate', { 'text-decoration-line-through text-disabled': isCompleted }]"
        >
          {{ task.title }}
        </span>
      </div>
      
      <div class="d-flex align-center flex-shrink-0 ml-4">
        <v-chip size="x-small" variant="tonal" class="mr-4 badge-item d-none d-sm-flex" v-if="task.dueDate">
          {{ formatDate(task.dueDate) }}
        </v-chip>

        <v-btn icon="mdi-pencil" variant="text" size="small" color="info" class="mr-1 action-icon" @click.stop="$emit('edit', task)"></v-btn>
        <v-btn icon="mdi-delete" variant="text" size="small" color="error" class="action-icon" @click.stop="$emit('delete', task.id)"></v-btn>
      </div>
    </v-card-title>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete', 'toggle-status', 'view']);
const isCompleted = ref(props.task.completed);

watch(() => props.task.completed, (newVal) => {
  isCompleted.value = newVal;
});

const toggleStatus = () => {
  emit('toggle-status', { ...props.task, completed: isCompleted.value });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
</script>

<style scoped>
.task-card {
  background: rgba(28, 28, 30, 0.65) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

.task-card:hover {
  transform: translateY(-2px);
  background: rgba(40, 40, 44, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
}

.task-title-summary {
  letter-spacing: -0.3px;
  color: #ffffff;
}

.badge-item {
  font-weight: 600;
  letter-spacing: 0.5px;
  background: rgba(255,255,255,0.05) !important;
}

.action-icon:hover {
  background: rgba(255,255,255,0.1);
}

:deep(.v-checkbox-btn .v-selection-control__input) {
  border-radius: 50% !important;
}
</style>
