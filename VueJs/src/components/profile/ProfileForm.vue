<script setup lang="ts">
import { useProfileStore } from "../../store/ProfileStore";
import { ProfileValidator } from "../../utils/ProfileValidator";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';

const props = defineProps<{ profileId?: number }>();

const profile = reactive({
  phone: "",
  photo: "",
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const store = useProfileStore();
const router = useRouter();

const photoPreview = ref<string | null>(null);

const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string;
      profile.photo = photoPreview.value || "";
      validateField('photo');
    };
    reader.readAsDataURL(file);
  }
};

const validateField = (field: keyof typeof profile) => {
  const result = ProfileValidator.schema.safeParse({ [field]: profile[field] });

  if (!result.success) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field];
  }
};

const validateAllFields = () => {
  Object.keys(profile).forEach((field) => {
    validateField(field as keyof typeof profile);
  });
};

onMounted(async () => {
  if (props.profileId) {
    try {
      const response = await store.getProfile(props.profileId);
      if (response.status === 200) {
        Object.assign(profile, response.data);
        photoPreview.value = profile.photo;
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  }
});

const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) return;

  isSubmitting.value = true;

  try {
    let response;
    if (props.profileId) {
      response = await store.editProfile(props.profileId, profile);
    } else {
      response = await store.addProfile(profile);
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: 'Éxito',
        text: props.profileId ? 'Perfil actualizado con éxito ✅' : 'Perfil creado con éxito ✅',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000
      });
      router.push('/profile/list');
    } else {
      Swal.fire({
        title: 'Error',
        text: `❌ Código ${response.status}: ${typeof response.data === 'object' && 'message' in response.data ? (response.data as any).message : 'Ocurrió un error'}`,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        timer: 3000
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: '❌ Error inesperado en la operación.',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.profileId ? "Editar Perfil" : "Crear Perfil" }}
      </h2>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Teléfono:</label>
          <input v-model="profile.phone" type="text" @input="validateField('phone')" @blur="validateField('phone')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.phone">{{ errors.phone }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Foto:</label>
          <input type="file" accept="image/*" @change="handlePhotoChange"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.photo">{{ errors.photo }}</span>
          <div v-if="photoPreview" class="mt-2">
            <img :src="photoPreview" alt="Vista previa" class="h-24 rounded-lg border" />
          </div>
        </div>

        <div class="col-span-1">
          <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            {{ isSubmitting ? "Enviando..." : props.profileId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
