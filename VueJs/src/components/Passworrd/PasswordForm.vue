<script setup lang="ts">
import { PasswordValidator } from "../../utils/PasswordValidators";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import PasswordService from "../../service/PasswordService";

const props = defineProps<{ passwordId?: number }>();

const password = reactive({
    cont: "",
    startAt: "",
    endAt: "",
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const router = useRouter();
const route = useRoute();

const validateField = (field: keyof typeof password) => {
    const result = PasswordValidator.validateField(field, password[field]);
    if (!result.success) {
        errors[field] = result.error.errors[0].message;
    } else {
        delete errors[field];
    }
};

const validateAllFields = () => {
    Object.keys(password).forEach((field) => {
        validateField(field as keyof typeof password);
    });
};

onMounted(async () => {
    if (props.passwordId) {
        try {
            const response = await PasswordService.getPassword(props.passwordId);
            if (response.status == 200) {
                Object.assign(password, response.data);
            }
        } catch (error) {
            console.error("Error al cargar contraseña:", error);
        }
    }
    // Si hay userId en la query, lo guardamos en el objeto password
    if (route.query.userId) {
        password.user_id = Number(route.query.userId);
    }
});

const submitForm = async () => {
    validateAllFields();
    if (Object.keys(errors).length > 0) return;
    isSubmitting.value = true;
    try {
        let response;
        if (props.passwordId) {
            response = await PasswordService.updatePassword(props.passwordId, password);
        } else if (password.user_id) {
            // Si hay user_id, usar endpoint custom
            response = await PasswordService.createPasswordForUser(password.user_id, password);
        } else {
            response = await PasswordService.createPassword(password);
        }
        if (response.status === 200 || response.status === 201) {
            Swal.fire({
                title: 'Éxito',
                text: props.passwordId ? 'Contraseña actualizada con éxito ✅' : 'Contraseña creada con éxito ✅',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: `❌ Código ${response.status}: ${response.data?.message || 'Ocurrió un error'}`,
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
    router.push('/passwords');
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
                {{ props.passwordId ? "Editar Contraseña" : "Crear Contraseña" }}
            </h2>
            <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">Contraseña:</label>
                    <input v-model="password.cont" type="password" @input="validateField('cont')"
                        @blur="validateField('cont')"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    <span class="text-red-500 text-sm" v-if="errors.cont">{{ errors.cont }}</span>
                </div>
                <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">Fecha de inicio:</label>
                    <input v-model="password.startAt" type="date" @input="validateField('startAt')"
                        @blur="validateField('startAt')"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    <span class="text-red-500 text-sm" v-if="errors.startAt">{{ errors.startAt }}</span>
                </div>
                <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">Fecha de fin:</label>
                    <input v-model="password.endAt" type="date" @input="validateField('endAt')"
                        @blur="validateField('endAt')"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    <span class="text-red-500 text-sm" v-if="errors.endAt">{{ errors.endAt }}</span>
                </div>
                <div class="col-span-1 md:col-span-2">
                    <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                        {{ isSubmitting ? "Enviando..." : props.passwordId ? "Actualizar" : "Crear" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
