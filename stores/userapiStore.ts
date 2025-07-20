import * as backendForAdminClient from '~/clients/api/bfaClient';
import type { AddPermissionToRoleRequest, AssignRoleRequest, CreateRoleWithPermissionsRequest, GetUserApiGetAllUsersParams, GetUserApiGetUsersWithFullRoleObjectsParams, ReplacePermissionsRequest, UserProfileInfoDtoListPaginationResponseApiResponse, UserWithRolesListPaginationResponse } from '~/types/api/bfaModels.ts';

export const useUserApiStore = defineStore('user-api', () => {
  const isLoading = ref(false);
  const errorMessage = ref('');

  const roles = ref([]);
  const users = ref([])
  const permissions = ref<string[]>([]);
  const permissionDescriptions = ref<Record<string, string>>({});
  const userAuthorizationInfo = ref<string[]>([]);
  const pingResult = ref<string | null>(null);

  // 🔸 Get Permissions
  const getPermissionsAsync = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.getUserApiGetAllPermissions();
      if (response.success) {
        permissions.value = response.data ?? [];
        return true;
      } else {
        errorMessage.value = 'Yetkiler alınamadı.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Yetkiler alınırken bir hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Get Permission Descriptions
  const getPermissionDescriptionsAsync = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.getAdminGetAppAdminPermissionsWithDescription();
      if (response.success) {
        permissionDescriptions.value = response.data ?? {};
        return true;
      } else {
        errorMessage.value = 'Yetki açıklamaları alınamadı.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Yetki açıklamaları alınırken hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Get Authorization Info for User
  const getUserAuthorizationInfoAsync = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.getAdminGetUserAuthorizationInfo();
      if (response.success) {
        userAuthorizationInfo.value = response.data ?? [];
        return true;
      } else {
        errorMessage.value = 'Kullanıcı yetki bilgileri alınamadı.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Yetki bilgileri alınırken hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Ping Server
  const pingAsync = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.getAdminPing();
      if (response.success) {
        pingResult.value = response.data ?? null;
        return true;
      } else {
        errorMessage.value = 'Ping başarısız.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Ping sırasında hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const getAllUsers = async (request:GetUserApiGetAllUsersParams) : Promise<UserProfileInfoDtoListPaginationResponseApiResponse | null> => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.getUserApiGetAllUsers(request);
      if (response.success) {
        users.value = response.data?.items ?? [];
        return response.data;
      } else {
        errorMessage.value = 'Users cannot be fetched';
        return null;
      }
    } catch (error) {
      errorMessage.value = 'Users cannot be fetched';
      return null;
    } finally {
      isLoading.value = false;
    }
  }

    const getUsersWithFullRoleObjects = async (request:GetUserApiGetUsersWithFullRoleObjectsParams) : Promise<UserWithRolesListPaginationResponse | null> => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.getUserApiGetUsersWithFullRoleObjects(request);
      if (response.success) {
        users.value = response.data?.items ?? [];
        return response.data;
      } else {
        errorMessage.value = 'Users cannot be fetched';
        return null;
      }
    } catch (error) {
      errorMessage.value = 'Users cannot be fetched';
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  // 🔸 Get All Roles
  const getRolesAsync = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.getUserApiGetRolesWithUsers();
      if (response.success) {
        roles.value = response.data ?? [];
        return true;
      } else {
        errorMessage.value = 'Roller alınamadı.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Roller alınırken hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Create Role with Permissions
  const createRoleAsync = async (request: CreateRoleWithPermissionsRequest) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.postUserApiCreateRoleWithPermissions(request);
      if (response.success) {
        await getRolesAsync();
        return true;
      } else {
        errorMessage.value = 'Rol oluşturulamadı.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Rol oluşturulurken hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Delete Role
  const deleteRoleAsync = async (roleName: string) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.deleteUserApiDeleteRole({ roleName: roleName });
      if (response.success) {
        return true;
      } else {
        errorMessage.value = 'Rol silinemedi.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Rol silinirken hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Delete Permission
  const deletePermissionAsync = async (name: string) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.deleteUserApiDeletePermission({ permissionName: name });
      if (response.success) {
        return true;
      } else {
        errorMessage.value = 'İzin silinemedi.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'İzin silinirken hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Assign Role to User
  const assignRoleAsync = async (request:AssignRoleRequest) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.postUserApiAssignUserToRole(request);
      if (response.success) {
        return true;
      } else {
        errorMessage.value = 'Rol atanamadı.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Rol atama sırasında hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Add Permission to Role
  const addPermissionToRoleAsync = async (request: AddPermissionToRoleRequest) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.postUserApiAddPermissionToRole(request);
      if (response.success) {
        return true;
      } else {
        errorMessage.value = 'Yetki role eklenemedi.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Yetki ekleme sırasında hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // 🔸 Replace Role Permissions
  const replaceRolePermissionsAsync = async (request: ReplacePermissionsRequest) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await backendForAdminClient.putUserApiReplacePermissions(request);
      if (response.success) {
        return true;
      } else {
        errorMessage.value = 'Yetkiler güncellenemedi.';
        return false;
      }
    } catch (error) {
      errorMessage.value = 'Yetkiler güncellenirken hata oluştu.';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    errorMessage,
    roles,
    users,
    permissions,
    permissionDescriptions,
    userAuthorizationInfo,
    pingResult,
    getPermissionsAsync,
    getPermissionDescriptionsAsync,
    getUserAuthorizationInfoAsync,
    pingAsync,
    getRolesAsync,
    createRoleAsync,
    deleteRoleAsync,
    deletePermissionAsync,
    assignRoleAsync,
    addPermissionToRoleAsync,
    replaceRolePermissionsAsync,
    getAllUsers,
    getUsersWithFullRoleObjects
  };
});
