<script setup lang="ts">
import { useSessionStore } from '../../store/SessionStore';
import { SessionValidator } from "../../utils/SessionValidator";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';

const props = defineProps<{ sessionId?: string }>();

const session = reactive({
    token: "",
    expiration: new Date().toISOString(),
    FACode: "",
    state: "",
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const successMessage = ref("");
const store = useSessionStore();
const router = useRouter();

const validateField = (field: keyof typeof session) => {
    const result = SessionValidator.validateField(field, session[field]);

    if (!result.success) {
        errors[field] = result.error.errors[0].message;
    } else {
        delete errors[field]; // Borra el error si es válido
    }
};
const validateAllFields = () => {
    Object.keys(session).forEach((field) => {
        validateField(field as keyof typeof session);
    });
};

// Cargar sesión si se pasa un sessionId
onMounted(async () => {
    if (props.sessionId) {
        try {
            const response = await store.getSession(props.sessionId);
            if (response.status == 200) {
                let fetchedSession = response.data;
                // Asegura que expiration sea string
                if (fetchedSession.expiration && typeof fetchedSession.expiration !== 'string') {
                    fetchedSession.expiration = new Date(fetchedSession.expiration)
                }
                Object.assign(session, fetchedSession);
            }
        } catch (error) {
            console.error("Error al cargar sesión:", error);
        }
    }
});

// Enviar formulario (crear o actualizar sesión)
const submitForm = async () => {
    validateAllFields();


    isSubmitting.value = true;
    successMessage.value = "";

    try {
        const sessionToSend = {
            ...session,
            expiration: new Date(session.expiration)
        };
        let response;
        if (props.sessionId) {
            response = await store.editSession(props.sessionId, sessionToSend);
        } else {
            response = await store.addSession(sessionToSend);
        }

        if (response.status === 200 || response.status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Sesión guardada correctamente',
            });
            successMessage.value = "Sesión guardada correctamente";
            router.push({ name: 'sessions' });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la sesión',
            });
        }
    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar la sesión',
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
        {{ props.sessionId ? "Editar Usuario" : "Crear Usuario" }}
      </h2>

        
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Token:</label>
          <input v-model="session.token" type="text" @input="validateField('token')" @blur="validateField('token')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.token">{{ errors.token }}</span>
        </div>  

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Fecha de Inicio:</label>
          <input v-model="session.expiration" type="date" @input="validateField('expiration')" @blur="validateField('expiration')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.expiration">{{ errors.expiration }}</span>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">FACode:</label>
          <input v-model="session.FACode" type="text" @input="validateField('FACode')" @blur="validateField('FACode')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.FACode">{{ errors.FACode }}</span>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Estado:</label>
          <select v-model="session.state" @change="validateField('state')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccione un estado</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.state">{{ errors.state }}</span>
        </div>

        <div class="col-span-1 md:col-span-2">
          <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            {{ isSubmitting ? "Enviando..." : props.sessionId ? "Actualizar" : "Crear" }}
          </button>
        </div>
    </div>
  </div>
</template>