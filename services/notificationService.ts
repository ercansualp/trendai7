export interface INotificationService {
    confirmationEmailSendedMesage(): void;

    showPasswordResetLinkSentNotification(): void;

    showPasswordResetLinkFailedNotification(): void;

    showPasswordResetSuccessNotification(): void;

    showPasswordResetFailedNotification(): void;

    getAuthenticatorKeyErrorMessage(): void;

    show2faEnabledMessage(): void;

    generalSuccess(successMessage: string, details?:string): void;

    generalError(errorMessage: string, details?:string): void;
}

export class NotificationService implements INotificationService {
    confirmationEmailSendedMesage(): void {
        push.success({
            message:
                'A confirmation link has been sent to your email address, please check your email address!',
        });
    }

    showPasswordResetLinkSentNotification(): void {
        push.success({
            message:
                'A password reset code has been sent to your email address, please check your email address!',
        });
    }

    showPasswordResetLinkFailedNotification(): void {
        push.error({
            message:
                'There was an error sending the password reset code to your email address!',
        });
    }

    showPasswordResetSuccessNotification(): void {
        push.success({
            message: 'Your password has been reset successfully. You can log in now.',
        });
    }

    showPasswordResetFailedNotification(): void {
        push.error({
            message: 'An error occurred during the password reset process!',
        });
    }

    getAuthenticatorKeyErrorMessage(): void {
        push.error({
            message: 'An error occurred during authenticanticatorkey fetch!',
        });
    }

    show2faEnabledMessage(): void {
        push.success({
            message: '2-step verification successfully activated!',
        });
    }

    generalSuccess(successMessage: string, details?:string): void {
        push.success({
            title: successMessage,
            message: details,
            duration: 5000
        });
    }

    generalError(errorMessage: string, details?:string): void {
        push.error({
            title: errorMessage,
            message: details,
            duration: 5000
        });
    }
}
