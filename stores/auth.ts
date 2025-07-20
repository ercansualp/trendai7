import * as backendForAdminClient from '~/clients/api/bfaClient'
import { TwoFactorMethodEnum } from '~/types/api/bfaModels.ts';
import { decodeJwt } from 'jose';

export const useAuthStore = defineStore('auth', () => {
    const user = ref({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        avatar: '',
        phoneNumberConfirmed: false,
        emailConfirmed: false,
        createdAt: null,
        twoFactorEnabled: false,
    })
    const isLoading = ref(false);
    const errorMessage = ref('');
    const temporaryToken = ref('');
    const temporaryPassword = ref('');
    const twoFaProviders = ref([]);
    const authenticatorKey = ref('');

    const router = useRouter()
    const localePath = useLocalePath()
    
    const registerAsync = async (registerUser) => {
        isLoading.value = true
        errorMessage.value = ''
      
        try {
          // In a real application, you would send registerForm.value to your backend.
          // For this example, we're simulating the API call.
          // If backendForAdminClient.postUserApiRegisterPortalAdmin supports currency, pass it here.
          const response = await backendForAdminClient.postUserApiRegister(registerUser);
            
          if(response.success){
            // Show success notification
            push.success({
                  message:
                      'Kayıt başarılı!',
              });
      
            // Redirect to login page
            router.push(localePath('/auth/login'))
          }
          else{
          }
        } catch (error) {
        } finally {
          isLoading.value = false
        }
    }

    const loginAsync = async (loginRequest) => {
        try {
          const response = await backendForAdminClient.postUserApiLogin(loginRequest);
          
          if(response.success){
            if(response.data.requiresTwoFactor)
            {
                user.value.email = loginRequest.email
                temporaryPassword.value = loginRequest.password
                temporaryToken.value = response.data.temporaryToken
                twoFaProviders.value = response.data.twoFaProviders
                user.value.phoneNumber = response.data.phoneNumber
                router.push(localePath('/auth/two-factor-provider'))
            }
            else
            {
                await cacheTokensToCookieAsync(response.data.accessToken, response.data.refreshToken, response.data.refreshTokenExpireDate);
                await getUserProfile();
                const { connect } = useSignalR()
                await connect();
                router.push(localePath('/'));
            }
          }
        } catch (error) {
            if(error.response.data.error_code === "ERR_EMAIL_NOT_CONFIRMED")
            {
                router.push(localePath(`/auth/confirm-email?email=${loginRequest.email}`));
            }
        }
    }

    const logout = async () => {
        const accessTokenCookie = useCookie('accessToken')
        const refreshTokenCookie = useCookie('refreshToken')
        accessTokenCookie.value = null
        refreshTokenCookie.value = null
        const { disconnect } = useSignalR()
        await disconnect();
        router.push(localePath('/auth/login'))
    }

    const refreshTokensAsync = async () => {
        const accessToken = useCookie('accessToken')?.value
        const refreshToken = useCookie('refreshToken')?.value
    
        if(!accessToken || !refreshToken)
        {
            await logout();
            return false;
        }
        
        try {
            const response = await backendForAdminClient.postUserApiRefreshToken({
                refreshToken: refreshToken,
                accessToken: accessToken
            });
            
            if(response && response.success){
                await cacheTokensToCookieAsync(response.data.accessToken, response.data.refreshToken, response.data.refreshTokenExpireDate);
                return true;
            }
            // If response is not successful, logout and return false
            await logout();
            return false;
        } catch (error) {
            // If refresh token fails (400, 401, etc.), logout the user
            console.error('Refresh token failed:', error);
            await logout();
            return false;
        }
    }

    const getUserProfile = async () => {
        const response = await backendForAdminClient.getUserApiGetUserProfileById();
        if(response.success){
            user.value = response.data
        }
    }

    const getTwoFactorStatus = async () => {
        try {
            const response = await backendForAdminClient.postUserApiGetTwoFactorStatus();
            if(response.success){
                user.value.twoFactorEnabled = response.data
            }
        } catch (error) {
        }
    }

    const checkPasswordAsync = async (password: string) => {
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await backendForAdminClient.postUserApiCheckPassword(password);
            if(response.success){
                return true;
            }
            errorMessage.value = 'Şifre kontrol ederken bir hata oluştu. Lütfen tekrar deneyin.'
            push.error({
                  message:
                      'Şifre kontrol ederken bir hata oluştu. Lütfen tekrar deneyin.',
              });
              return false;
        } catch (error) {
            errorMessage.value = 'Şifre kontrol ederken bir hata oluştu. Lütfen tekrar deneyin.'
              return false;
        } finally {
            isLoading.value = false
        }
    }

    const getAuthenticatorKeyAsync = async () => {
        isLoading.value = true
        errorMessage.value = ''
        
        try {
            const response = await backendForAdminClient.postUserApiGetAuthenticatorKey();
            if(response.success && response.data){
                authenticatorKey.value = response.data;
            }
            else
            {
                errorMessage.value = 'Authenticator anahtarı alınamadı. Lütfen tekrar deneyin.'
            }
        } catch (error) {
            errorMessage.value = 'Authenticator anahtarı alınamadı. Lütfen tekrar deneyin.'
        }
        finally {
            isLoading.value = false
        }
    }

    const enableTwoFactorAsync = async (totp: string) => {
        isLoading.value = true
        errorMessage.value = ''
        
        try {
            const response = await backendForAdminClient.getUserApiEnableTwoFactor({
                totp
            });
            if(response.success){
                user.value.twoFactorEnabled = true;
                return response.data;
            }
            else
            {
                errorMessage.value = 'Geçersiz kod. Lütfen tekrar deneyin.'
                return false;
            }
        } catch (error) {
            errorMessage.value = '2FA etkinleştirilemedi. Lütfen tekrar deneyin.'
            return false;
        }
        finally {
            isLoading.value = false
        }
    }

    const disableTwoFactorAsync = async () => {
        isLoading.value = true
        errorMessage.value = ''
        
        try {
            const response = await backendForAdminClient.postUserApiDisableTwoFactor();
            if(response.success){
                user.value.twoFactorEnabled = false;
                return true;
            }
            else
            {
                errorMessage.value = '2FA devre dışı bırakılamadı. Lütfen tekrar deneyin.'
                return false;
            }
        } catch (error) {
            errorMessage.value = '2FA devre dışı bırakılamadı. Lütfen tekrar deneyin.'
            return false;
        }
        finally {
            isLoading.value = false
        }
    }

    const changePasswordAsync = async (currentPassword: string, newPassword: string) => {
        isLoading.value = true
        errorMessage.value = ''
        
        try {
            const response = await backendForAdminClient.postUserApiChangePassword({
                currentPassword,
                newPassword,
            });
            if(response.success){
                return true;
            }
            else
            {
                errorMessage.value = 'Yanlış şifre. Lütfen tekrar deneyin.'
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Şifre değiştirilemedi. Lütfen tekrar deneyin.'
            return false;
        }
        finally {
            isLoading.value = false
        }
    }

    const cacheTokensToCookieAsync = async (accessToken: string, refreshToken: string, refreshTokenExpireDate: string) => {
        // refreshTokenExpireDate'i JavaScript Date nesnesine çevir
        const expires = new Date(refreshTokenExpireDate);

        // accessToken için cookie oluştur
        const accessTokenCookie = useCookie('accessToken', {
            expires,
            path: '/',
            secure: false, // HTTPS üzerinden çalışıyorsa
            httpOnly: false, // İstemci tarafında erişim için false, güvenlik için true yapabilirsiniz
            sameSite: 'strict'
            });
        accessTokenCookie.value = accessToken;

        // refreshToken için cookie oluştur
        const refreshTokenCookie = useCookie('refreshToken', {
            expires,
            path: '/',
            secure: false,
            httpOnly: false,
            sameSite: 'strict'
            });
        refreshTokenCookie.value = refreshToken;
    }

    const loginWith2FaAsync = async (code: string) => {
        isLoading.value = true
        errorMessage.value = ''
        
        try {
            const provider = localStorage.getItem('twoFactorProvider')?.toLocaleLowerCase()
 
            let selectedProvider = null;
            if(provider === 'sms')
            {
                selectedProvider = TwoFactorMethodEnum.Phone;
            }

            if(provider === 'authenticator')
            {
                selectedProvider = TwoFactorMethodEnum.Authenticator;
            }

            if(provider === 'email')
            {
                selectedProvider = TwoFactorMethodEnum.Email;
            }

            const response = await backendForAdminClient.postUserApiLoginWith2Fa({
                code,
                method: selectedProvider,
                temporaryToken: temporaryToken.value,
            });
            if(response.success){
                cacheTokensToCookieAsync(response.data.accessToken, response.data.refreshToken, response.data.refreshTokenExpireDate);
                
                await getUserProfile();

                const projectStore = useProjectStore();
                const decoded = decodeJwt(response.data.accessToken);
        
                // decoded içerisindeki projectId'yi al
                const projectId = decoded.ProjectId; // Token'a bağlı olarak bu alanın adı değişebilir
                await projectStore.getProjectAsync(projectId, true);
                router.push(localePath('/'));
            }
            else
            {
                errorMessage.value = '2FA doğrulanamadı. Lütfen tekrar deneyin.'
                return false;
            }
        } catch (error) {
            errorMessage.value = '2FA doğrulanamadı. Lütfen tekrar deneyin.'
            return false;
        }
        finally {
            isLoading.value = false
        }
    }

    const forgotPasswordAsync = async (email: string) => {
        isLoading.value = true
        errorMessage.value = ''
        
        try {
            const response = await backendForAdminClient.getUserApiForgetPassword({
                email
            });
            if(response.success)
            {
                push.success({
                    message:
                        'A password reset code has been sent to your email address, please check your email address!',
                });
            }
        } catch (error) {
        }
        finally {
            isLoading.value = false
        }
    }

    const resetPasswordAsync = async (resetCode: string, email: string, newPassword: string) => {
        const response = await backendForAdminClient.postUserApiResetPassword({
            resetCode,
            email,
            newPassword
        });
        if(response.success){
            push.success({
                message:
                    'Şifre sıfırlanmıştır!',
            });
            router.push(localePath('/auth/login'));
        }
    }

    const sendConfirmationEmailAsync = async (email: string) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.getUserApiSendConfirmationEmail({ email });
            if (response.success) {
                return true;
            } else {
                errorMessage.value = response.message || 'Onay e-postası gönderilirken bir hata oluştu.';
                return false;
            }
        } catch (error) {
            console.error('Send confirmation email error:', error);
            errorMessage.value = 'Onay e-postası gönderilirken bir hata oluştu.';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const confirmEmailAsync = async (email: string, token: string) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.getUserApiConfirmEmail({
                email,
                token
            });
            if (response.success) {
                return true;
            } else {
                errorMessage.value = response.message || 'E-posta doğrulanırken bir hata oluştu.';
                return false;
            }
        } catch (error) {
            console.error('Confirm email error:', error);
            errorMessage.value = 'E-posta doğrulanırken bir hata oluştu.';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const updateUserAsync = async (firstName, lastName, phoneNumber) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await backendForAdminClient.postUserApiUpdateUser({
                firstName,
                lastName,
                phoneNumber,
            });
            if (response.success) {
                user.value.firstName = firstName;
                user.value.lastName = lastName;
                user.value.phoneNumber = phoneNumber;
                return true;
            } else {
                errorMessage.value = response.message || 'Kullanıcı güncellenirken bir hata oluştu.';
                return false;
            }
        } catch (error) {
            errorMessage.value = 'Kullanıcı güncellenirken bir hata oluştu.';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        user,
        isLoading,
        errorMessage,
        registerAsync,
        loginAsync,
        logout,
        getUserProfile,
        getTwoFactorStatus,
        checkPasswordAsync,
        authenticatorKey,
        getAuthenticatorKeyAsync,
        enableTwoFactorAsync,
        disableTwoFactorAsync,
        changePasswordAsync,
        twoFaProviders,
        loginWith2FaAsync,
        forgotPasswordAsync,
        resetPasswordAsync,
        sendConfirmationEmailAsync,
        confirmEmailAsync,
        cacheTokensToCookieAsync,
        refreshTokensAsync,
        updateUserAsync,
    }
})
