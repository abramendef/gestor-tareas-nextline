<template>
  <v-container class="py-10" max-width="900">
    <!-- Cabecera de la página -->
    <div class="d-flex justify-space-between align-center mb-8">
      <h1 class="text-h3 font-weight-bold text-primary-darken-3">Mis Tareas</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        elevation="3"
        class="font-weight-bold letter-spacing-1 rounded-pill"
        @click="openCreateForm"
      >
        NUEVA TAREA
      </v-btn>
    </div>

    <!-- Estado de carga -->
    <v-row v-if="loading" justify="center" class="mt-16">
      <v-progress-circular indeterminate color="primary" size="80" width="6"></v-progress-circular>
    </v-row>

    <!-- Estado de Error de Servidor -->
    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6 font-weight-medium text-body-1">
      <v-icon start icon="mdi-alert-circle"></v-icon>
      {{ error }}
    </v-alert>

    <!-- Estado Vacío (Sin tareas) -->
    <v-card v-else-if="tasks.length === 0" variant="outlined" class="text-center pa-16 bg-white border-dashed rounded-xl elevation-1">
      <v-icon icon="mdi-clipboard-check-outline" size="80" color="grey-lighten-2" class="mb-6"></v-icon>
      <div class="text-h5 font-weight-bold text-grey-darken-2 mb-2">¡Todo al día!</div>
      <div class="text-body-1 text-grey font-weight-medium">No tienes ninguna tarea registrada. Haz clic en "Nueva Tarea" para organizarte.</div>
    </v-card>

    <!-- Lista de Tareas (Con transiciones integradas de Vue) -->
    <TransitionGroup v-else name="list" tag="div" class="d-flex flex-column gap-4">
      <TaskCard 
        v-for="task in sortedTasks" 
        :key="task.id" 
        :task="task" 
        @edit="openEditForm"
        @delete="handleDelete"
      />
    </TransitionGroup>

    <!-- Formulario Modal -->
    <TaskForm 
      v-model="isFormOpen" 
      :initial-data="editingTask" 
      @save="handleSaveTask" 
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../services/api';
import TaskCard from '../components/TaskCard.vue';
import TaskForm from '../components/TaskForm.vue';

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);

const isFormOpen = ref(false);
const editingTask = ref(null);

// Lógica de ordenador visual: Las terminadas van al fondo automáticamente
const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return a.completed ? 1 : -1;
  });
});

const loadTasks = async () => {
  loading.value = true;
  error.value = null;
  try {
    tasks.value = await api.getTasks();
  } catch (err) {
    error.value = 'Fallo de conexión. Por favor, asegúrate de haber encendido tu servidor Backend.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const openCreateForm = () => {
  editingTask.value = null;
  isFormOpen.value = true;
};

// Obtener el detalle individual de la base de datos (según demanda del plan)
const openEditForm = async (taskFromCard) => {
  try {
    const fullTaskDetails = await api.getTask(taskFromCard.id);
    editingTask.value = fullTaskDetails;
    isFormOpen.value = true;
  } catch (err) {
    alert('Error de conectividad extrayendo detalles de la base de datos.');
  }
};

const handleSaveTask = async (taskData) => {
  try {
    if (taskData.id) {
      await api.updateTask(taskData.id, taskData);
    } else {
      await api.createTask(taskData);
    }
    await loadTasks();
  } catch (err) {
    alert('Houston, tenemos un problema. No se pudo guardar la información.');
  }
};

const handleDelete = async (taskId) => {
  // Validacion obligatoria de borrado estandarizada
  if (confirm('¿Precaución: Seguro que quieres eliminar esta tarea permanentemente?')) {
    try {
      await api.deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      alert('Error eliminando el registro del servidor.');
    }
  }
};

onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
.border-dashed {
  border-style: dashed !important;
  border-width: 2px !important;
  border-color: #e0e0e0 !important;
}
.letter-spacing-1 {
  letter-spacing: 0.5px;
}
/* Micro-animaciones para el momento en que se crean o borran tarjetas */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
