import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/store/Auth';
import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                // RUTAS DE LISTAR

                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/pages/users/UserListView.vue'),
                    meta: {
                        // requiresAuth: true // Esta ruta requiere autenticación
                    }
                },
                {
                    path: '/devices',
                    name: 'devices',
                    component: () => import('@/views/pages/devices/DeviceList.vue'),
                },
                {
                    path: '/security',
                    name: 'security',
                    component: () => import('@/views/pages/securityQuestions/SecurityQuestionsList.vue'),
                },
                {
                    path: '/answers',
                    name: 'answers',
                    component: () => import('@/views/pages/answers/AnswerList.vue'),
                },
                {
                    path: 'signatures',
                    name: 'signatures',
                    component: () => import('@/views/pages/digitalSignatures/DigitalSignatureList.vue'),
                },
                {
                    path: '/roles',
                    name: 'roles',
                    component: () => import('@/views/pages/roles/RoleList.vue'),
                },
                {
                    path: '/userroles',
                    name: 'userroles',
                    component: () => import('@/views/pages/userroles/UserRoleList.vue'),
                },
                {
                    path: '/passwords',
                    name: 'passwords',
                    component: () => import('@/views/pages/passwords/PasswordList.vue'),
                },
                {
                    path: '/address',
                    name: 'address',
                    component: () => import('@/views/pages/address/AddressList.vue'),
                },

                // RUTAS DE CREAR

                {
                    path: '/device/create',
                    name: 'create-device',
                    component: () => import('@/views/pages/devices/DeviceCreate.vue'),
                },
                {
                    path: '/security/create',
                    name: 'create-security-question',
                    component: () => import('@/views/pages/securityQuestions/SecurityQuestionCreate.vue'),
                },
                {
                    path: '/users/create',
                    name: 'users create',
                    component: () => import('@/views/pages/users/UserCreate.vue')
                },
                {
                    path: '/answer/create',
                    name: 'create-answer',
                    component: () => import('@/views/pages/answers/AnswerCreate.vue')
                },
                {
                    path: '/signature/create',
                    name: 'create-signature',
                    component: () => import('@/views/pages/digitalSignatures/DigitalSignatureCreate.vue')
                },
                {
                    path: '/role/create',
                    name: 'create-role',
                    component: () => import('@/views/pages/roles/RoleCreate.vue'),
                },
                {
                    path: '/userrole/create',
                    name: 'create-userrole',
                    component: () => import('@/views/pages/userroles/UserRoleCreate.vue'),
                },
                {
                    path: '/password/create',
                    name: 'create-password',
                    component: () => import('@/views/pages/passwords/PasswordCreate.vue'),
                },
                {
                    path: '/address/create',
                    name: 'create-address',
                    component: () => import('@/views/pages/address/AddressCreate.vue'),
                },

                // RUTAS DE ACTUALIZAR 

                {
                    path: '/device/update/:id',
                    name: 'update-device',
                    component: () => import('@/views/pages/devices/DeviceUpdate.vue'),
                },
                {
                    path: '/security/update/:id',
                    name: 'update-security-question',
                    component: () => import('@/views/pages/securityQuestions/SecurityQuestionUpdate.vue'),
                },
                {
                    path: '/users/update/:id',
                    name: 'users update',
                    component: () => import('@/views/pages/users/UserUpdate.vue')
                },
                {
                    path: '/answer/update/:id',
                    name: 'update-answer',
                    component: () => import('@/views/pages/answers/AnswerUpdate.vue')
                },
                {
                    path: '/signature/update/:id',
                    name: 'update-signature',
                    component: () => import('@/views/pages/digitalSignatures/DigitalSignatureUpdate.vue')
                },
                {
                    path: '/role/update/:id',
                    name: 'update-role',
                    component: () => import('@/views/pages/roles/RoleUpdate.vue'),
                },
                {
                    path: '/userrole/update/:id',
                    name: 'update-userrole',
                    component: () => import('@/views/pages/userroles/UserRoleUpdate.vue'),
                },
                {
                    path: '/password/update/:id',
                    name: 'update-password',
                    component: () => import('@/views/pages/passwords/PasswordUpdate.vue'),
                },
                {
                    path: '/address/update/:id',
                    name: 'update-address',
                    component: () => import('@/views/pages/address/AddressUpdate.vue'),
                },

                // RUTAS DE VISUALIZAR 1 OBJETO

                {
                    path: '/device/view/:id',
                    name: 'view-device',
                    component: () => import('@/views/pages/devices/DeviceView.vue'),
                },
                {
                    path: '/security/view/:id',
                    name: 'security-view',
                    component: () => import('@/views/pages/securityQuestions/SecurityQuestionView.vue'),
                },
                {
                    path: '/answer/view/:id',
                    name: 'answer-view',
                    component: () => import('@/views/pages/answers/AnswerView.vue'),
                },
                {
                    path: '/signature/view/:id',
                    name: 'signature-view',
                    component: () => import('@/views/pages/digitalSignatures/DigitalSignatureView.vue')
                },
                {
                    path: '/role/view/:id',
                    name: 'view-role',
                    component: () => import('@/views/pages/roles/RoleView.vue'),
                },
                {
                    path: '/userrole/view/:id',
                    name: 'view-userrole',
                    component: () => import('@/views/pages/userroles/UserRoleView.vue'),
                },
                {
                    path: '/password/view/:id',
                    name: 'view-password',
                    component: () => import('@/views/pages/passwords/PasswordView.vue'),
                },
                {
                    path: '/address/view/:id',
                    name: 'view-address',
                    component: () => import('@/views/pages/address/AddressView.vue'),
                },




                {
                    path: '/login2',
                    name: 'login2',
                    component: () => import('@/views/pages/auth/Login2.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },                {
                    path: '/passwords',
                    name: 'passwords',
                    component: () => import('@/views/pages/passwords/PasswordList.vue'),
                },
                {   
                    path: '/permission/list',
                    name: 'permissions list',
                    component: () => import('@/views/pages/Permission/PermissionList.vue'),
                },
                {
                    path: '/permission/create',
                    name: 'create-permission',
                    component: () => import('@/views/pages/Permission/PermissionCreate.vue'),
                },
                {
                    path: '/permission/update/:id',
                    name: 'update-permission',
                    component: () => import('@/views/pages/Permission/PermissionUpdate.vue'),
                },
                {
                    path: '/permission/view/:id',
                    name: 'view-permission',
                    component: () => import('@/views/pages/Permission/PermissionView.vue'),
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
                {
                    path: '/profile/create',
                    name: 'profile create',
                    component: () => import('@/views/pages/Profile/ProfileCreate.vue')

                },
                {
                    path: '/profile/update',
                    name: 'profile update',
                    component: () => import('@/views/pages/Profile/ProfileUpdate.vue')
                },
                {
                    path: '/profile/list',
                    name: 'profile list',
                    component: () => import('@/views/pages/Profile/ProfileListView.vue')
                },
                {
                    path: '/rolepermission/create',
                    name: 'rolepermission create',
                    component: () => import('@/views/pages/rolePermission/rolePermissionCreate.vue')
                },
                {
                    path: '/rolepermission/update',
                    name: 'rolepermission update',
                    component: () => import('@/views/pages/rolePermission/rolePermissionUpdate.vue')
                },
                {
                    path: '/rolepermission/list',
                    name: 'rolepermission list',
                    component: () => import('@/views/pages/rolePermission/RolePermissionList.vue')
                },
                {
                    path: '/rolepermission/view',
                    name: 'rolepermission view',
                    component: () => import('@/views/pages/rolePermission/rolePermissionView.vue')
                },
                {
                    path: '/sesion/create',
                    name: 'sesion create',
                    component: () => import('@/views/pages/session/sessionCreate.vue')
                },
                {
                    path: '/sesion/update',
                    name: 'sesion update',
                    component: () => import('@/views/pages/session/sessionUpdate.vue')
                },
                {
                    path: '/sesion/list',
                    name: 'sesion list',
                    component: () => import('@/views/pages/session/sessionList.vue')
                },

            ]
                
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

// Configurar el guardián de ruta
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();  // Obtener el estado de autenticación desde Pinia
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Si la ruta requiere autenticación y el usuario no está logueado, redirigir al login
        next({ path: '/login2' });
    } else {
        // Si no requiere autenticación o el usuario está logueado, continuar con la ruta
        next();
    }
});


export default router;
