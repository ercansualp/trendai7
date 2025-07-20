import { HubConnectionState } from '@microsoft/signalr'
import * as configs from "~/constants/configs";

export const useSignalR = () => {
  const { $signalR } = useNuxtApp()

  const connectionState = ref<HubConnectionState>()
  const isConnected = computed(() => connectionState.value === HubConnectionState.Connected)

  // Bağlantı durumunu izleme
  const watchConnection = () => {
    if ($signalR.connection) {
      connectionState.value = $signalR.connection.state
      
      $signalR.connection.onreconnecting(() => {
        connectionState.value = HubConnectionState.Reconnecting
      })
      
      $signalR.connection.onreconnected(() => {
        connectionState.value = HubConnectionState.Connected
      })
      
      $signalR.connection.onclose(() => {
        connectionState.value = HubConnectionState.Disconnected
      })
    }
  }

  // Hub'a bağlanma
  const connect = async () => {
    try {
      await $signalR.connect(configs.signalRUrl)
      watchConnection()
      console.log('Hub\'a bağlandı')
    } catch (error) {
      console.error('Bağlantı hatası:', error)
      throw error
    }
  }

  // Bağlantıyı kesme
  const disconnect = async () => {
    await $signalR.disconnect()
    connectionState.value = HubConnectionState.Disconnected
  }

  // Mesaj gönderme
  const invoke = async (methodName: string, ...args: any[]) => {
    return await $signalR.invoke(methodName, ...args)
  }

  // Mesaj dinleme
  const on = (methodName: string, callback: (...args: any[]) => void) => {
    $signalR.on(methodName, callback)
  }

  // Mesaj dinlemeyi durdurma
  const off = (methodName: string, callback?: (...args: any[]) => void) => {
    $signalR.off(methodName, callback)
  }

  // SignalR event handlers
   const handleReceiveMessage = (x: any) => {
    const chatBotStore = useChatbotStore()
    chatBotStore.messages.push(x);
    chatBotStore.isTyping = false;
  }

  watch(connectionState, (newState) => {
    if(newState === HubConnectionState.Disconnected)
    {
      off("chatbot-response", handleReceiveMessage);
    }
    else if(newState === HubConnectionState.Connected)
    {
      on("chatbot-response", handleReceiveMessage);
    }
  }, { immediate: true })

  return {
    connect,
    disconnect,
    invoke,
    on,
    off,
    isConnected: readonly(isConnected),
    connectionState: readonly(connectionState)
  }
}