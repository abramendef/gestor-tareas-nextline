<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    max-width="600px" 
    persistent
  >
    <v-card class="rounded-lg">
      <v-card-title class="text-h5 font-weight-bold bg-primary text-white pa-4 d-flex align-center">
        {{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}
      </v-card-title>

      <v-card-text class="pt-6 pb-2">
        <v-form ref="form" @submit.prevent="submit">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="task.title"
                label="Título *"
                variant="outlined"
                :rules="[(v) => !!v || 'El título es obligatorio']"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="task.description"
                label="Descripción *"
                variant="outlined"
                rows="3"
                :rules="[(v) => !!v || 'La descripción es obligatoria']"
                required
              ></v-textarea>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="task.dueDate"
                label="Fecha de entrega *"
                type="date"
                variant="outlined"
                :rules="[(v) => !!v || 'La fecha es obligatoria']"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="d-flex align-center">
              <v-checkbox
                v-model="task.completed"
                label="¿Tarea Completada?"
                color="success"
                hide-details
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="task.responsible"
                label="Responsable (Opcional)"
                variant="outlined"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="task.tags"
                label="Etiquetas (Opcional)"
                variant="outlined"
                placeholder="ej: backend, urgente"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-2">
              <v-text-field
                v-model="task.comments"
                label="Comentarios (Opcional)"
                variant="outlined"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          class="font-weight-bold"
          @click="close"
        >
          CANCELAR
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          class="font-weight-bold px-6"
          @click="submit"
        >
          GUARDAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = ref(null);
const isEditing = computed(() => !!props.initialData?.id);

const getDefaultTask = () => ({
  title: '',
  description: '',
  completed: false,
  dueDate: '',
  comments: '',
  responsible: '',
  tags: '',
});

const task = ref(getDefaultTask());

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      if (props.initialData) {
        const formattedDate = props.initialData.dueDate 
          ? new Date(props.initialData.dueDate).toISOString().split('T')[0]
          : '';
        task.value = { ...props.initialData, dueDate: formattedDate };
      } else {
        task.value = getDefaultTask();
      }
    }
  }
);

const close = () => {
  emit('update:modelValue', false);
};

const submit = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  emit('save', { ...task.value });
  close();
};
</script>
