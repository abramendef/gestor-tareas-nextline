<template>
  <v-card class="task-card rounded-xl mb-4" elevation="0">
    <v-card-title class="d-flex justify-space-between align-center px-5 pt-5 pb-2">
      <div class="d-flex align-center">
        <v-checkbox-btn
          v-model="isCompleted"
          color="success"
          class="mr-3 custom-checkbox"
          @change="toggleStatus"
        ></v-checkbox-btn>
        <span 
          :class="['text-h6 font-weight-medium task-title', { 'text-decoration-line-through text-disabled': isCompleted }]"
        >
          {{ task.title }}
        </span>
      </div>
      
      <div>
        <v-btn icon="mdi-pencil" variant="text" size="small" color="info" class="mr-2 action-icon" @click="$emit('edit', task)"></v-btn>
        <v-btn icon="mdi-delete" variant="text" size="small" color="error" class="action-icon" @click="$emit('delete', task.id)"></v-btn>
      </div>
    </v-card-title>

    <v-card-text class="px-5 pb-5 pt-0">
      <p class="text-body-1 mb-4 task-description" :class="{'text-disabled': isCompleted}">
        {{ task.description }}
      </p>

      <div class="d-flex flex-wrap gap-2 align-center">
        <v-chip size="small" variant="flat" color="rgba(255,255,255,0.1)" class="badge-item" v-if="task.dueDate">
          <v-icon start size="14" icon="mdi-calendar-clock"></v-icon>
          {{ formatDate(task.dueDate) }}
        </v-chip>

        <v-chip size="small" variant="flat" color="rgba(10, 132, 255, 0.15)" text-color="#0A84FF" class="badge-item" v-if="task.responsible">
          <v-icon start size="14" icon="mdi-account-circle"></v-icon>
          {{ task.responsible }}
        </v-chip>

        <v-chip size="small" variant="flat" color="rgba(94, 92, 230, 0.15)" text-color="#5E5CE6" class="badge-item" v-if="task.tags">
          <v-icon start size="14" icon="mdi-tag"></v-icon>
          {{ task.tags }}
        </v-chip>
      </div>

      <div v-if="task.comments" class="mt-4 pa-3 rounded-lg task-comments-box">
        <v-icon size="16" color="rgba(255,255,255,0.5)" class="mr-2" icon="mdi-comment-text-outline"></v-icon>
        <span class="text-caption text-medium-emphasis">{{ task.comments }}</span>
      </div>
    </v-card-text>
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

const emit = defineEmits(['edit', 'delete', 'toggle-status']);
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
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};
</script>

<style scoped>
.task-card {
  background: rgba(28, 28, 30, 0.65) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.6) !important;
  background: rgba(40, 40, 44, 0.75) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.task-title {
  letter-spacing: -0.5px;
  color: #ffffff;
}

.task-description {
  color: rgba(235, 235, 245, 0.7);
  line-height: 1.5;
}

.badge-item {
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.task-comments-box {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
}

:deep(.v-checkbox-btn .v-selection-control__input) {
  border-radius: 50% !important;
}

.action-icon:hover {
  background: rgba(255,255,255,0.1);
}
</style>
