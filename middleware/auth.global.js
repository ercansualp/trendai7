export default defineNuxtRouteMiddleware((to) => {
  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')

  if(accessToken.value && refreshToken.value)
  {
    if(!to.path.startsWith('/auth/'))
    {
      return;
    }
    return navigateTo('/')
  }
  else
  {
    if(to.path.startsWith('/auth/'))
    {
      return;
    }
    return navigateTo('/auth/login')
  }
})
