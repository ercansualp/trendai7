import * as backendForAdminClient from '~/clients/api/bfaClient'

export const useNotificationApiStore = defineStore('notification-api', () => {
    const isLoading = ref(false);
    const errorMessage = ref('');
    const messageTemplates = ref([]);
    const messageTemplate = ref(null);
    const smsSettings = ref(null);
    const emailSettings = ref({
        smtpHost: '',
        smtpPort: 0,
        useSsl: false,
        senderEmail: '',
        senderName: '',
        username: '',
        password: ''
    });
    const telegramSettings = ref(null);
    const pushNotificationSettings = ref(null);
    const sentNotifications = ref([]);

    const createMessageTemplateAsync = async (messageTemplate) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.postNotificationApiCreateTemplate(messageTemplate);
            if (response.success) {
                messageTemplates.value.push(response.data);
                return true;
            } else {
                errorMessage.value = 'Mesaj şablonu oluşturulamadı. Lütfen tekrar deneyin.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Mesaj şablonu oluşturulamadı. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const updateMessageTemplateAsync = async (messageTemplate) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.putNotificationApiUpdateTemplate(messageTemplate);
            if (response.success) {
                messageTemplates.value = messageTemplates.value.map(t => t.id === messageTemplate.id ? messageTemplate : t);
                return true;
            } else {
                errorMessage.value = 'Mesaj şablonu güncellenemedi. Lütfen tekrar deneyin.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Mesaj şablonu güncellenemedi. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const getTemplatesAsync = async () => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.getNotificationApiGetTemplates();
            if (response.success) {
                messageTemplates.value = response.data;
                return true;
            } else {
                errorMessage.value = 'Mesaj şablonları yüklenemedi. Lütfen tekrar deneyin.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Mesaj şablonları yüklenemedi. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const deleteTemplateAsync = async (templateId) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.getNotificationApiDeleteTemplate({
                id: templateId
            });
            if (response.success) {
                messageTemplates.value = messageTemplates.value.filter(t => t.id !== templateId)
                return true;
            } else {
                errorMessage.value = 'Mesaj şablonu silinemedi. Lütfen tekrar deneyin.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Mesaj şablonu silinemedi. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const getSmsSettingsAsync = async () => {
        const response = await backendForAdminClient.getNotificationApiGetSmsSettings();
        if (response.success) {
            smsSettings.value = response.data;
        }
    }

    const getEmailSettingsAsync = async () => {
        const response = await backendForAdminClient.getNotificationApiGetEmailSettings();
        if (response.success) {
            emailSettings.value = response.data;
        }
    }

    const updateEmailSettingsAsync = async () => {
        const response = await backendForAdminClient.postNotificationApiUpdateEmailSettings(emailSettings.value);
        if (response.success) {
            push.success({
                message:
                    'E-posta ayarları güncellendi!',
            });
        }
        await getEmailSettingsAsync();
    }

    const updateSmsSettingsAsync = async (smsSettings) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.putNotificationApiUpdateSmsSettings(smsSettings);
            if (response.success) {
                smsSettings.value = response.data;
                return true;
            } else {
                errorMessage.value = 'SMS ayarları güncellenemedi. Lütfen tekrar deneyin.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'SMS ayarları güncellenemedi. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const getTelegramSettingsAsync = async () => {
        const response = await backendForAdminClient.getNotificationApiGetTelegramSettings();
        if (response.success) {
            telegramSettings.value = response.data;
        }
    }

    const updateTelegramSettingsAsync = async (telegramSettings) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.putNotificationApiUpdateTelegramSettings(telegramSettings);
            if (response.success) {
                telegramSettings.value = response.data;
                return true;
            } else {
                errorMessage.value = 'Telegram ayarları güncellenemedi. Lütfen tekrar deneyin.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Telegram ayarları güncellenemedi. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const getPushNotificationSettingsAsync = async () => {
        const response = await backendForAdminClient.getNotificationApiGetPushNotificationSettings();
        if (response.success) {
            pushNotificationSettings.value = response.data;
        }
    }

    const updatePushNotificationSettingsAsync = async () => {
        const response = await backendForAdminClient.putNotificationApiUpdatePushNotification(pushNotificationSettings.value);
        if (response.success) {
            push.success({
                message:
                    'Push Notification ayarları güncellendi!',
            });
            await getPushNotificationSettingsAsync();
        }
    }

    const sendTestNotificationAsync = async (notificationData) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            let response;
            if (notificationData.eventType === 'Email') {
                const projectStore = useProjectStore();
                notificationData.projectId = projectStore.project?.id;
                response = await backendForAdminClient.postNotificationApiSendTestEmail(notificationData);
            }
            else if (notificationData.eventType === 'Sms') {
                response = true;
            }
            else if (notificationData.eventType === 'Telegram') {
                response = true;
            }
            else if (notificationData.eventType === 'PushNotification') {
                response = true;
            }

            if (!response.success) {
                errorMessage.value = 'Test mesajı gönderilemedi. Lütfen tekrar deneyin.';
            }
            return response;
        } catch (error) {
            errorMessage.value = 'Test mesajı gönderilemedi. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    const getSentNotificationsAsync = async () => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            
            const response = await backendForAdminClient.getNotificationApiGetNotificationRecordsByPagination();
            if (response.success) {
                sentNotifications.value = response.data.items;
                return true;
            } else {
                errorMessage.value = 'Gönderilen bildirimler yüklenemedi. Lütfen tekrar deneyin.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Gönderilen bildirimler yüklenemedi. Lütfen tekrar deneyin.';
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        errorMessage,
        messageTemplates,
        messageTemplate,
        createMessageTemplateAsync,
        getTemplatesAsync,
        deleteTemplateAsync,
        smsSettings,
        getSmsSettingsAsync,
        emailSettings,
        getEmailSettingsAsync,
        updateEmailSettingsAsync,
        updateSmsSettingsAsync,
        updateMessageTemplateAsync,
        getTelegramSettingsAsync,
        updateTelegramSettingsAsync,
        telegramSettings,
        pushNotificationSettings,
        getPushNotificationSettingsAsync,
        updatePushNotificationSettingsAsync,
        sendTestNotificationAsync,
        getSentNotificationsAsync,
        sentNotifications,
    }
})
