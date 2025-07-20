import * as backendForAdminClient from '~/clients/api/bfaClient'

export const useChatbotStore = defineStore('chatbot', () => {
    const aiModels = ref([]);
    const chatBotSettings = ref({
        aiModel: '',
        aiRole: '',
    })
    const isTyping = ref(false);
    const messages = ref([]);
    const chatSessionId = ref(null)
    const chatSessions = ref([])

    const getAiModelsAsync = async () => {
        const response = await backendForAdminClient.getChatBotApiGetAIModels();
        if(response.success){
            aiModels.value = response.data;
        }
    }

    const getChatbotSettingsAsync = async () => {
        const response = await backendForAdminClient.getChatBotApiGetChatSettings();
        if(response.success){
            chatBotSettings.value = response.data;
        }
    }

    const updateChatBotSettingsAsync = async () => {
        const response = await backendForAdminClient.postChatBotApiUpdateChatSettings(chatBotSettings.value);
        if(response.success)
        {
            push.success({
                message:
                    'Chatbot ayarları güncellendi!',
            });
        }
        await getChatbotSettingsAsync();
    }

    const sendMessageAsync = async (message) => {
        const response = await backendForAdminClient.postChatBotApiSendMessage({
            message,
            sessionId: chatSessionId.value,
        });
        if(response.success)
        {
            messages.value.push({
                content: message,
                senderType: 'User',
                createdAt: new Date(),
                retryCount: 0,
            });
            chatSessionId.value = response.data;
            push.success({ message: 'Mesaj gönderildi!' });
            // Show typing indicator
            isTyping.value = true
        }
    }

    const getAllSessionsAsync = async () => {
        const response = await backendForAdminClient.getChatBotApiGetAllSessions();
        if(response.success){
            chatSessions.value = response.data;
        }
    }

    return {
        chatBotSettings,
        updateChatBotSettingsAsync,
        getChatbotSettingsAsync,
        aiModels,
        getAiModelsAsync,
        sendMessageAsync,
        isTyping,
        messages,
        getAllSessionsAsync,
        chatSessions,
    }
})
