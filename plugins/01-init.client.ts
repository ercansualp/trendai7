export default defineNuxtPlugin(async () => {
    const accessToken = useCookie('accessToken');

    if (accessToken.value) {
        const authStore = useAuthStore();
        await authStore.getUserProfile();
    }
});
