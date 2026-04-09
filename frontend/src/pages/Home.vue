<template>
  <v-container class="py-12" max-width="1000">
    <v-row class="mb-10 align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h3 font-weight-black gradient-title tracking-tight mb-2">
          Sinergia
        </h1>
        <p class="text-h6 text-medium-emphasis font-weight-regular mt-n2">Tu ecosistema de organización.</p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="primary"
          variant="flat"
          class="btn-create-task font-weight-bold"
          rounded="xl"
          size="x-large"
          prepend-icon="mdi-plus-circle"
          @click="openCreateModal"
        >
          NUEVA TAREA
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="loading" justify="center" class="mt-12">
      <v-progress-circular indeterminate color="primary" size="64" width="4"></v-progress-circular>
    </v-row>

    <v-row v-else-if="error" class="mt-4">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          class="rounded-xl alert-box border-error"
          icon="mdi-wifi-off"
          elevation="0"
        >
          <div class="text-subtitle-1 font-weight-bold mb-1">Fallo de conexión o servidor inactivo.</div>
          <div class="text-body-2 text-medium-emphasis">{{ error }}</div>
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="tasks.length === 0" justify="center" class="mt-16">
      <v-col cols="12" sm="8" class="text-center">
        <v-icon size="100" color="rgba(255,255,255,0.05)" class="mb-6">mdi-inbox-multiple</v-icon>
        <h2 class="text-h4 font-weight-bold mb-3 text-high-emphasis">¡Lienzo en blanco!</h2>
        <p class="text-h6 text-medium-emphasis mb-8">No tienes ninguna tarea registrada. Haz clic en "Nueva Tarea" para materializar tus ideas.</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <transition-group name="list" tag="div" class="d-flex flex-column gap-3">
          <TaskCard
            v-for="task in sortedTasks"
            :key="task.id"
            :task="task"
            @edit="openEditModal"
            @delete="handleDeleteTask"
            @toggle-status="handleToggleStatus"
            @view="handleOpenDetail"
          />
        </transition-group>
      </v-col>
    </v-row>

    <TaskForm
      v-model="isModalOpen"
      :initial-data="selectedTask"
      :loading="saving"
      @save="handleSaveTask"
    />

    <TaskDetail
      v-model="isDetailOpen"
      :task-id="detailTaskId"
    />

    <v-snackbar v-model="toast.show" :color="toast.color" class="notification-toast" rounded="pill" elevation="24">
      <div class="d-flex align-center justify-center w-100">
        <v-icon start :icon="toast.icon" class="mr-2"></v-icon>
        <span class="font-weight-medium">{{ toast.message }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';
import TaskCard from '../components/TaskCard.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskDetail from '../components/TaskDetail.vue';

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);
const saving = ref(false);

const isModalOpen = ref(false);
const selectedTask = ref(null);

const isDetailOpen = ref(false);
const detailTaskId = ref(null);

const toast = ref({ show: false, message: '', color: 'success', icon: 'mdi-check-circle' });

const showToast = (message, color = 'success', icon = 'mdi-check-circle') => {
  toast.value = { show: true, message, color, icon };
};

// Algoritmo de organización: Tareas pendientes primero, luego orden cronológico
const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
});

// Obtención de datos iniciales mapeando errores de conexión
const loadTasks = async () => {
  loading.value = true;
  error.value = null;
  try {
    tasks.value = await api.getTasks();
  } catch (err) {
    error.value = err.message || 'Por favor, asegúrate de haber encendido tu servidor Backend.';
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  selectedTask.value = null;
  isModalOpen.value = true;
};

const openEditModal = async (task) => {
  try {
    const fullTask = await api.getTask(task.id);
    selectedTask.value = { ...fullTask };
    isModalOpen.value = true;
  } catch (err) {
    showToast('Error al sincronizar datos de la tarea.', 'error', 'mdi-alert-circle');
  }
};

const handleOpenDetail = (id) => {
  detailTaskId.value = id;
  isDetailOpen.value = true;
};

// Discriminador lógico: Realiza Update o Create dependiendo de si existe un 'selectedTask'
const handleSaveTask = async (taskData) => {
  saving.value = true;
  try {
    if (selectedTask.value) {
      const updatedTask = await api.updateTask(selectedTask.value.id, taskData);
      const index = tasks.value.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) tasks.value[index] = updatedTask;
      showToast('Tarea actualizada magistralmente', 'info', 'mdi-information-outline');
    } else {
      const newTask = await api.createTask(taskData);
      tasks.value.push(newTask);
      showToast('Tarea creada y sincronizada', 'primary', 'mdi-rocket-launch');
    }
    isModalOpen.value = false;
  } catch (err) {
    showToast('Houston, hubo un problema al sincronizar.', 'error', 'mdi-alert-circle');
  } finally {
    saving.value = false;
  }
};

const handleDeleteTask = async (id) => {
  try {
    await api.deleteTask(id);
    tasks.value = tasks.value.filter(t => t.id !== id);
    showToast('Tarea destruida', 'error', 'mdi-delete-alert');
  } catch (err) {
    showToast('Fallo al eliminar.', 'error', 'mdi-alert-circle');
  }
};

const handleToggleStatus = async (taskData) => {
  try {
    const updatedTask = await api.updateTask(taskData.id, taskData);
    const index = tasks.value.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) tasks.value[index] = updatedTask;
  } catch (err) {
    showToast('Falla en los escudos. No se pudo cambiar el estado.', 'error', 'mdi-alert-circle');
  }
};

onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
.gradient-title {
  background: linear-gradient(135deg, #ffffff 0%, #a1a1a6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.tracking-tight {
  letter-spacing: -2px;
}

.btn-create-task {
  background: #0A84FF !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-transform: none;
  letter-spacing: -0.2px;
}

.btn-create-task:hover {
  transform: scale(1.01) translateY(-1px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5) !important;
}

.alert-box {
  background: rgba(255, 69, 58, 0.1) !important;
  backdrop-filter: blur(10px);
}
.border-error {
  border: 1px solid rgba(255, 69, 58, 0.2) !important;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
