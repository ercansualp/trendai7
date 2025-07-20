import { HubConnection } from '@microsoft/signalr'

export interface SignalRPlugin {
  connect(hubUrl: string): Promise<HubConnection>
  disconnect(): Promise<void>
  invoke(methodName: string, ...args: any[]): Promise<any>
  on(methodName: string, callback: (...args: any[]) => void): void
  off(methodName: string, callback?: (...args: any[]) => void): void
  state: string | undefined
  connection: HubConnection | null
}

declare module '#app' {
  interface NuxtApp {
    $signalR: SignalRPlugin
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $signalR: SignalRPlugin
  }
}

// Hub metodları için tip tanımları
export interface ChatHubMethods {
  SendMessage(user: string, message: string): Promise<void>
  JoinGroup(groupName: string): Promise<void>
  LeaveGroup(groupName: string): Promise<void>
}

export interface ChatHubEvents {
  ReceiveMessage(user: string, message: string): void
  UserCountChanged(count: number): void
  UserJoined(user: string): void
  UserLeft(user: string): void
}