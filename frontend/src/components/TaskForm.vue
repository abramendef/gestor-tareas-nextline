<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="600px" 
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="ios-dialog rounded-xl elevation-24">
      <v-card-title class="d-flex justify-space-between align-center px-6 pt-6 pb-2 text-h5 font-weight-bold ios-heading">
        {{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" color="rgba(255,255,255,0.5)"></v-btn>
      </v-card-title>
      
      <v-card-text class="px-6 pt-4 pb-2">
        <v-form ref="form" v-model="isFormValid" @submit.prevent>
          <v-text-field
            v-model="formData.title"
            label="Título de la tarea *"
            :rules="[v => !!v || 'El título es requerido']"
            variant="solo-filled"
            bg-color="rgba(255, 255, 255, 0.05)"
            rounded="lg"
            class="ios-input mb-2"
            prepend-inner-icon="mdi-format-title"
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Descripción o detalles"
            variant="solo-filled"
            bg-color="rgba(255, 255, 255, 0.05)"
            rounded="lg"
            rows="3"
            class="ios-input mb-2"
            prepend-inner-icon="mdi-text"
          ></v-textarea>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.dueDate"
                label="Fecha límite"
                type="date"
                variant="solo-filled"
                bg-color="rgba(255, 255, 255, 0.05)"
                rounded="lg"
                class="ios-input"
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.responsible"
                label="Responsable"
                variant="solo-filled"
                bg-color="rgba(255, 255, 255, 0.05)"
                rounded="lg"
                class="ios-input"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.tags"
            label="Etiquetas (ej: urgente, casa)"
            variant="solo-filled"
            bg-color="rgba(255, 255, 255, 0.05)"
            rounded="lg"
            class="ios-input mt-2"
            prepend-inner-icon="mdi-tag-multiple"
          ></v-text-field>

          <v-text-field
            v-model="formData.comments"
            label="Notas adicionales"
            variant="solo-filled"
            bg-color="rgba(255, 255, 255, 0.05)"
            rounded="lg"
            class="ios-input"
            prepend-inner-icon="mdi-comment-outline"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-0 d-flex justify-end gap-3">
        <v-btn 
          color="rgba(255,255,255,0.7)" 
          variant="text" 
          @click="close"
          class="font-weight-medium ios-btn px-4"
          rounded="lg"
        >
          Cancelar
        </v-btn>
        <v-btn 
          color="primary" 
          variant="flat" 
          @click="save"
          :loading="loading"
          class="font-weight-bold ios-btn ios-btn-primary px-6"
          rounded="lg"
        >
          {{ isEditing ? 'Guardar Cambios' : 'Crear Tarea' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  initialData: { type: Object, default: null },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = ref(null);
const isFormValid = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const isEditing = computed(() => !!props.initialData);

const getDefaultTask = () => ({
  title: '',
  description: '',
  completed: false,
  dueDate: '',
  comments: '',
  responsible: '',
  tags: '',
});

const formData = ref(getDefaultTask());

watch(isOpen, (newVal) => {
  if (newVal) {
    formData.value = props.initialData ? { ...props.initialData } : getDefaultTask();
    if (form.value) form.value.resetValidation();
  }
});

const close = () => {
  isOpen.value = false;
};

const save = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    emit('save', formData.value);
  }
};
</script>

<style scoped>
.ios-dialog {
  background: rgba(28, 28, 30, 0.95) !important;
  backdrop-filter: blur(40px) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ios-heading {
  letter-spacing: -0.5px;
  color: #ffffff;
}

.ios-input :deep(.v-field) {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.2) !important;
  border: 1px solid rgba(255,255,255,0.03);
  transition: all 0.3s ease;
}

.ios-input :deep(.v-field--focused) {
  border-color: rgba(10, 132, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2) !important;
}

.ios-btn {
  text-transform: none;
  letter-spacing: -0.2px;
}

.ios-btn-primary {
  background: linear-gradient(135deg, #0A84FF 0%, #0066CC 100%) !important;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3) !important;
}
</style>
