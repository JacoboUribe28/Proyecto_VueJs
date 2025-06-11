<script setup lang="ts">
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import ProfileService from "../../service/ProfileService";
import UserService from "../../service/UserService";
import { useRouter } from 'vue-router';

const userId = ref<number | null>(null);
const phone = ref("");
const photo = ref<File | null>(null);
const photoPreview = ref<string | null>(null);
const isSubmitting = ref(false);
const users = ref<{ id: number; name: string }[]>([]);

const props = defineProps<{ profileId?: number }>();
const router = useRouter();

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Error",
        text: "La imagen no debe superar los 5MB",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    photo.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  if (!userId.value) {
    Swal.fire({ title: "Error", text: "Debe seleccionar un usuario", icon: "error", confirmButtonText: "OK" });
    return;
  }
  if (!phone.value) {
    Swal.fire({ title: "Error", text: "Debe ingresar un teléfono", icon: "error", confirmButtonText: "OK" });
    return;
  }
  if (!photo.value) {
    Swal.fire({ title: "Error", text: "Debe seleccionar una foto", icon: "error", confirmButtonText: "OK" });
    return;
  }  // Crear el FormData con los datos del perfil
  const formData = new FormData();
  formData.append("phone", phone.value);
  
  // Asegurarse de que la foto sea un archivo válido
  if (photo.value instanceof File) {
    const photoFile = photo.value;
    // Verificar el tipo MIME del archivo
    if (!photoFile.type.startsWith('image/')) {
      Swal.fire({ 
        title: "Error", 
        text: "El archivo debe ser una imagen", 
        icon: "error", 
        confirmButtonText: "OK" 
      });
      return;
    }
    formData.append("photo", photoFile);
  }

  // Log de depuración
  console.log('Datos a enviar:');
  console.log('userId:', userId.value);
  console.log('phone:', phone.value);
  console.log('photo:', photo.value instanceof File ? photo.value.name : 'No file');
  
  isSubmitting.value = true;
  try {
    let response;
    if (props.profileId) {
            response = await ProfileService.updateProfile(props.profileId, formData as any);
    } else {
      response = await ProfileService.createProfile(userId.value!, formData);
    }
    if (response.status === 201 || response.status === 200) {
      Swal.fire({
        title: "Éxito",
        text: props.profileId ? 'Perfil actualizado con éxito ✅' : 'Perfil creado con éxito ✅',
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000
      }).then(() => {
        router.push('/profile/list');
      });
    }  } catch (error: any) {
    console.error("Error al enviar el perfil:", error);
    
    // Obtener un mensaje de error más específico
    let errorMessage = "Ocurrió un error al enviar el perfil";
    if (error.response) {
      console.error('Datos del error:', error.response.data);
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }

    Swal.fire({ 
      title: "Error", 
      text: errorMessage, 
      icon: "error", 
      confirmButtonText: "OK" 
    });
  } finally {
    isSubmitting.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const response = await UserService.getUsers();
    if (response.status === 200) {
      users.value = response.data.map((user: any) => ({ id: user.id, name: user.name }));
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    Swal.fire({ title: "Error", text: "No se pudieron cargar los usuarios", icon: "error", confirmButtonText: "OK" });
  }
};

const fetchProfile = async () => {
  if (props.profileId) {
    try {
      const response = await ProfileService.getProfile(props.profileId);
      if (response.status === 200) {
        const profileData = response.data;
        userId.value = profileData.user_id !== undefined ? profileData.user_id : null;
        phone.value = profileData.phone ?? "";
        if (profileData.photo) {
          photoPreview.value = profileData.photo;
        }
      }
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar el perfil",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  }
};

onMounted(async () => {
  await fetchUsers();
  await fetchProfile();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.profileId ? "Editar Perfil" : "Crear Perfil" }}
      </h2>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Usuario:</label>
          <select v-model="userId" class="mt-1 block w-full border border-gray-300 rounded-lg p-2">
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Teléfono:</label>
          <input v-model="phone" type="text" class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Foto:</label>
          <input type="file" accept="image/*" @change="handleFileChange" class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <div v-if="photoPreview" class="mt-2">
            <img :src="photoPreview" alt="Vista previa" class="h-24 rounded-lg border" />
          </div>
        </div>
        <div class="col-span-1">
          <button type="submit" :disabled="isSubmitting" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            {{ isSubmitting ? "Enviando..." : props.profileId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>a