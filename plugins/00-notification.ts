import type { INotificationService } from '~/services/notificationService';
import { NotificationService } from '~/services/notificationService';

export default defineNuxtPlugin(() => {
    const notificationService = new NotificationService();
    console.log("notification.ts");
    return {
        provide: {
            notification: notificationService as INotificationService,
        },
    };
});
