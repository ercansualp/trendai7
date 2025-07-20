import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from '@microsoft/signalr'

export default defineNuxtPlugin(() => {
  let connection: HubConnection | null = null

  const signalR = {
    async connect(hubUrl: string) {
      try {
          // Token'ı localStorage'dan al
          const token = useCookie('accessToken')?.value;
          if (!token) {
              throw new Error('Access token bulunamadı');
          }

          // SignalR bağlantısını yapılandır
          connection = new HubConnectionBuilder()
          .withUrl(hubUrl, {
                  // JWT token'ınızı buraya ekleyin
                  accessTokenFactory: () => {
                    return token || ''
                  },
                })
              .withAutomaticReconnect()
              .withStatefulReconnect()
              .configureLogging(LogLevel.Information)
              .build();

          // Bağlantıyı başlat
          await connection.start();
          console.log('SignalR bağlantısı kuruldu');
          return connection;
      } catch (error) {
          console.error('SignalR bağlantı hatası:', error);
          throw error;
      }
  },

    // Bağlantıyı kesme
    async disconnect() {
      if (connection) {
        try {
          await connection.stop()
          console.log('SignalR bağlantısı kesildi')
        } catch (error) {
          console.error('SignalR bağlantısı kesme hatası:', error)
        } finally {
          connection = null
        }
      }
    },

    // Mesaj gönderme
    async invoke(methodName: string, ...args: any[]) {
      if (!connection) {
        throw new Error('SignalR bağlantısı yok')
      }
      
      // Bağlantı durumunu kontrol et
      if (connection.state !== 'Connected') {
        throw new Error(`SignalR bağlantısı aktif değil. Durum: ${connection.state}`)
      }
      
      try {
        return await connection.invoke(methodName, ...args)
      } catch (error) {
        console.error(`SignalR invoke hatası (${methodName}):`, error)
        throw error
      }
    },

    // Mesaj dinleme
    on(methodName: string, callback: (...args: any[]) => void) {
      if (!connection) {
        throw new Error('SignalR bağlantısı yok')
      }
      connection.on(methodName, callback)
    },

    // Mesaj dinlemeyi durdurma
    off(methodName: string, callback?: (...args: any[]) => void) {
      if (!connection) {
        throw new Error('SignalR bağlantısı yok')
      }
      connection.off(methodName, callback)
    },

    // Bağlantı durumunu kontrol etme
    get state() {
      return connection?.state
    },

    // Raw connection'ı döndürme (gelişmiş kullanım için)
    get connection() {
      return connection
    }
  }

  return {
    provide: {
      signalR
    }
  }
})