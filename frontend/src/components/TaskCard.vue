<template>
  <v-card
    class="mx-auto mb-4 hover-elevation rounded-lg"
    elevation="2"
    hover
    variant="elevated"
    :color="task.completed ? 'grey-lighten-4' : 'white'"
  >
    <v-card-item class="pb-2">
      <div class="d-flex justify-space-between align-start w-100 mb-2">
        <v-card-title 
          class="text-h6 font-weight-bold text-wrap lh-1" 
          :class="[task.completed ? 'text-decoration-line-through text-grey' : 'text-primary-darken-1']"
        >
          {{ task.title }}
        </v-card-title>
        
        <v-chip
          :color="task.completed ? 'success' : 'warning'"
          size="small"
          class="font-weight-bold text-uppercase mt-1"
          variant="tonal"
        >
          {{ task.completed ? 'Completada' : 'Pendiente' }}
        </v-chip>
      </div>
      
      <v-card-subtitle class="font-weight-medium text-grey-darken-1">
        Vencimiento: {{ formatDate(task.dueDate) }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="text-body-1 text-medium-emphasis py-3">
      {{ task.description }}
      
      <div v-if="task.tags || task.responsible || task.comments" class="mt-5 d-flex flex-column gap-2 bg-grey-lighten-5 pa-3 rounded">
        
        <div v-if="task.responsible" class="text-caption font-weight-medium text-grey-darken-2">
          Responsable: <span class="text-body-2 font-weight-bold text-black">{{ task.responsible }}</span>
        </div>
        
        <div v-if="task.tags" class="text-caption font-weight-medium text-grey-darken-2">
          Etiquetas: <span class="text-body-2 text-primary">{{ task.tags }}</span>
        </div>

        <div v-if="task.comments" class="text-caption font-weight-medium text-grey-darken-2 mt-1 border-t pt-2">
          "{{ task.comments }}"
        </div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="px-4 py-2">
      <v-spacer></v-spacer>
      <v-btn
        color="info"
        variant="plain"
        class="font-weight-bold letter-spacing-1"
        @click="$emit('edit', task)"
      >
        EDITAR
      </v-btn>
      <v-btn
        color="error"
        variant="plain"
        class="font-weight-bold letter-spacing-1"
        @click="$emit('delete', task.id)"
      >
        ELIMINAR
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.hover-elevation {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0,0,0,0.05);
}
.hover-elevation:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15) !important;
}
.gap-2 {
  gap: 8px;
}
.lh-1 {
  line-height: 1.2;
}
.letter-spacing-1 {
  letter-spacing: 0.5px;
}
</style>
