<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="600px" 
    transition="dialog-bottom-transition"
  >
    <v-card class="detail-dialog rounded-xl elevation-24" :loading="loading">
      <v-card-title class="d-flex justify-space-between align-center px-6 pt-6 pb-2">
        <h2 class="text-h5 font-weight-bold gradient-title">{{ task?.title || 'Detalle de Tarea' }}</h2>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" color="rgba(255,255,255,0.5)"></v-btn>
      </v-card-title>
      
      <v-divider class="mx-6 opacity-10"></v-divider>

      <v-card-text class="px-6 py-6" v-if="task">
        <div class="mb-6">
          <p class="text-h6 font-weight-regular detail-description">
            {{ task.description || 'Sin descripción disponible.' }}
          </p>
        </div>

        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <div class="info-group">
              <span class="text-overline d-block mb-1 text-medium-emphasis">Responsable</span>
              <div class="d-flex align-center">
                <v-avatar size="28" color="primary" class="mr-2">
                  <v-icon size="18" icon="mdi-account"></v-icon>
                </v-avatar>
                <span class="text-body-1 font-weight-medium">{{ task.responsible || 'No asignado' }}</span>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="info-group">
              <span class="text-overline d-block mb-1 text-medium-emphasis">Fecha Límite</span>
              <div class="d-flex align-center">
                <v-icon size="20" color="info" class="mr-2" icon="mdi-calendar-check"></v-icon>
                <span class="text-body-1">{{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
          </v-col>
        </v-row>

        <div class="mb-6">
          <span class="text-overline d-block mb-2 text-medium-emphasis">Etiquetas</span>
          <div class="d-flex flex-wrap gap-2">
            <v-chip 
              v-for="tag in splitTags(task.tags)" 
              :key="tag"
              size="small" 
              variant="flat" 
              color="rgba(10, 132, 255, 0.1)"
              text-color="primary"
              class="font-weight-bold"
            >
              {{ tag }}
            </v-chip>
            <span v-if="!task.tags" class="text-caption text-disabled">Sin etiquetas</span>
          </div>
        </div>

        <div class="pa-4 rounded-lg comments-box" v-if="task.comments">
          <span class="text-overline d-block mb-1 text-medium-emphasis">Notas Adicionales</span>
          <p class="text-body-2">{{ task.comments }}</p>
        </div>
      </v-card-text>

      <v-card-text v-else-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4 text-caption text-medium-emphasis">Consultando base de datos...</p>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer></v-spacer>
        <v-btn 
          color="rgba(255,255,255,0.7)" 
          variant="text" 
          @click="close"
          class="text-none px-6"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { api } from '../services/api';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  taskId: { type: [Number, String], default: null }
});

const emit = defineEmits(['update:modelValue']);

const task = ref(null);
const loading = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const fetchDetail = async () => {
  if (!props.taskId) return;
  loading.value = true;
  try {
    task.value = await api.getTask(props.taskId);
  } catch (err) {
    console.error('Error al cargar detalle:', err);
  } finally {
    loading.value = false;
  }
};

watch(() => props.taskId, (newId) => {
  if (newId) fetchDetail();
}, { immediate: true });

const close = () => {
  isOpen.value = false;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  return new Date(dateString).toLocaleDateString('es-ES', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });
};

const splitTags = (tags) => {
  if (!tags) return [];
  return tags.split(',').map(tag => tag.trim()).filter(t => t);
};
</script>

<style scoped>
.detail-dialog {
  background: rgba(28, 28, 30, 0.98) !important;
  backdrop-filter: blur(40px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gradient-title {
  background: linear-gradient(135deg, #ffffff 0%, #a1a1a6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.detail-description {
  color: rgba(235, 235, 245, 0.85);
  line-height: 1.6;
}

.comments-box {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255,255,255,0.05);
}

.info-group {
  padding: 8px 0;
}
</style>
