<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl border-r border-border transform transition-transform duration-300 ease-in-out overflow-y-auto"
      :class="{ '-translate-x-full': !isSidebarOpen }"
    >
      <div class="flex items-center justify-center h-[65px] border-b border-border">
        <h1 class="text-xl font-bold text-secondary-foreground">TrendAI Admin</h1>
      </div>
      
      <nav class="mt-8">
        <div class="px-4 space-y-2">
          <NuxtLink
            to="/"
            class="flex items-center px-4 py-3 text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            :class="{ 'bg-accent text-accent-foreground': $route.path === '/' }"
            @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012 2h4a2 2 0 01-2-2v0"></path>
            </svg>
            Dashboard
          </NuxtLink>
          
          <a
            href="#"
            @click.prevent="toggleChatbotSubmenu"
            class="flex items-center px-4 py-3 text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            :class="{ 'bg-accent text-accent-foreground': isChatbotSubmenuOpen || $route.path.startsWith('/chatbot') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Chatbot
            <svg 
              class="w-4 h-4 ml-auto transform transition-transform duration-200" 
              :class="{ 'rotate-180': isChatbotSubmenuOpen }" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
          
          <!-- Chatbot Submenu -->
          <div v-if="isChatbotSubmenuOpen" class="ml-8 mt-2 space-y-1">
            <NuxtLink
              to="/chatbot"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/chatbot' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Sessions
            </NuxtLink>
            
            <NuxtLink
              to="/chatbot/chat"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/chatbot/chat' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Live Chat
            </NuxtLink>

            <NuxtLink
              to="/chatbot/settings"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/chatbot/settings' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Settings
            </NuxtLink>
          </div>

          <a
            href="#"
            @click.prevent="toggleUserManagementSubmenu"
            class="flex items-center px-4 py-3 text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            :class="{ 'bg-accent text-accent-foreground': isUserManagementSubmenuOpen || $route.path.startsWith('/users') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2m3 2v-2m-4 2h.01M12 12l-1 1H9l-1-1m4-4a4 4 0 11-8 0 4 4 0 018 0zM12 12l1 1h2l1-1m-4-4a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            User Management
            <svg 
              class="w-4 h-4 ml-auto transform transition-transform duration-200" 
              :class="{ 'rotate-180': isUserManagementSubmenuOpen }" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
          
          <!-- User Management Submenu -->
          <div v-if="isUserManagementSubmenuOpen" class="ml-8 mt-2 space-y-1">
            <NuxtLink
              to="/users"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/users' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Users
            </NuxtLink>
            
            <NuxtLink
              to="/users/roles"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/users/roles' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2m3 2v-2m-4 2h.01M12 12l-1 1H9l-1-1m4-4a4 4 0 11-8 0 4 4 0 018 0zM12 12l1 1h2l1-1m-4-4a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Roles
            </NuxtLink>

            <NuxtLink
              to="/users/permissions"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/users/permissions' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 2.831.957 5.447 2.574 7.657L12 22l6.506-3.253C20.04 17.118 21 14.65 21 12a11.955 11.955 0 00-1.382-5.016z"></path>
              </svg>
              Permissions
            </NuxtLink>

            <NuxtLink
              to="/users/sessions"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/users/sessions' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Sessions
            </NuxtLink>
          </div>

          <NuxtLink
            to="/notifications"
            class="flex items-center px-4 py-3 text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            :class="{ 'bg-accent text-accent-foreground': $route.path.startsWith('/notifications') }"
            @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            Notifications
          </NuxtLink>
          
          <a
            href="#"
            @click.prevent="toggleCmsSubmenu"
            class="flex items-center px-4 py-3 text-secondary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            :class="{ 'bg-accent text-accent-foreground': isCmsSubmenuOpen || $route.path.startsWith('/cms') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            CMS Management
            <svg 
              class="w-4 h-4 ml-auto transform transition-transform duration-200" 
              :class="{ 'rotate-180': isCmsSubmenuOpen }" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
          
          <!-- CMS Submenu -->
          <div v-if="isCmsSubmenuOpen" class="ml-8 mt-2 space-y-1">
            <NuxtLink
              to="/cms/authors"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/cms/authors' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Yazarlar
            </NuxtLink>
            
            <NuxtLink
              to="/cms/sources"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/cms/sources' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              Haber Kaynağı
            </NuxtLink>

            <NuxtLink
              to="/cms/categories"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/cms/categories' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              Kategori
            </NuxtLink>

            <NuxtLink
              to="/cms/tags"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/cms/tags' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              Etiket (Tag)
            </NuxtLink>

            <NuxtLink
              to="/cms/news"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/cms/news' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
              </svg>
              Haberler
            </NuxtLink>

            <NuxtLink
              to="/cms/news/add"
              class="flex items-center px-4 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'bg-accent text-accent-foreground': $route.path === '/cms/news/add' }"
              @click="closeSidebarOnMobile"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Haber Ekle
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>

    <!-- Overlay for mobile sidebar -->
    <div
      v-if="isSidebarOpen && !isLargeScreen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Main Content -->
    <div :class="{ 'lg:ml-64': isSidebarOpen }" class="flex flex-col min-h-screen">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 bg-card shadow-lg border-b border-border z-30" :class="{ 'lg:ml-[255.2px]': isSidebarOpen }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <button
                @click="isSidebarOpen = !isSidebarOpen"
                class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 class="ml-4 text-xl font-semibold text-foreground">
                {{ getPageTitle() }}
              </h2>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Theme Toggle Button -->
              <button
                @click="toggleTheme"
                class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
              >
                <svg v-if="theme === 'light'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M3 12H2m8.003-8.003l.707-.707M15.293 5.293l.707-.707M6.707 19.293l-.707.707M19.293 19.293l.707.707M18 12a6 6 0 11-12 0 6 6 0 0112 0z"></path>
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              </button>

              <div class="relative">
                <button
                  @click="togglePopover"
                  class="flex items-center text-foreground p-2 rounded-xl hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-accent/30 transition-all duration-300 group"
                >
                  <div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                    <span class="text-primary-foreground text-sm font-semibold">AU</span>
                  </div>
                  <div class="text-left hidden sm:block">
                    <div class="text-sm font-medium text-foreground">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</div>
                    <div class="text-xs text-muted-foreground">{{ authStore.user?.email }}</div>
                  </div>
                  <svg 
                    class="w-4 h-4 ml-2 text-muted-foreground transform transition-transform duration-300 group-hover:text-foreground" 
                    :class="{ 'rotate-180': isPopoverOpen }" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Popover Content -->
                <transition
                  enter-active-class="transition ease-out duration-300"
                  enter-from-class="opacity-0 scale-95 translate-y-1"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-200"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95 translate-y-1"
                >
                  <div 
                    v-if="isPopoverOpen" 
                    class="absolute right-0 mt-3 w-64 bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 py-2 focus:outline-none transform origin-top-right z-50"
                    role="menu" 
                    aria-orientation="vertical" 
                    aria-labelledby="user-menu-button"
                  >
                    <!-- User Info Header -->
                    <div class="px-4 py-3 border-b border-border/30">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                          <span class="text-primary-foreground text-sm font-semibold">AU</span>
                        </div>
                        <div>
                          <div class="text-sm font-semibold text-popover-foreground">{{ authStore.user.firstName }} {{ authStore.user.lastName }}</div>
                          <div class="text-xs text-muted-foreground">{{ authStore.user?.email }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Menu Items -->
                    <div class="py-2">
                      <a href="#" class="flex items-center px-4 py-3 text-sm text-popover-foreground hover:bg-accent/50 transition-all duration-200 group" role="menuitem">
                        <svg class="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="group-hover:translate-x-0.5 transition-transform duration-200">Your Profile</span>
                      </a>
                      
                      <a href="#" class="flex items-center px-4 py-3 text-sm text-popover-foreground hover:bg-accent/50 transition-all duration-200 group" role="menuitem">
                        <svg class="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="group-hover:translate-x-0.5 transition-transform duration-200">Account Settings</span>
                      </a>
                      
                      <a href="#" class="flex items-center px-4 py-3 text-sm text-popover-foreground hover:bg-accent/50 transition-all duration-200 group" role="menuitem">
                        <svg class="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="group-hover:translate-x-0.5 transition-transform duration-200">Help & Support</span>
                      </a>
                    </div>
                    
                    <!-- Divider -->
                    <div class="border-t border-border/30 my-2"></div>
                    
                    <!-- Sign Out -->
                    <div class="py-2">
                      <NuxtLink @click.prevent="handleLogout" to="/" class="flex items-center px-4 py-3 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group" role="menuitem">
                        <svg class="w-4 h-4 mr-3 group-hover:text-destructive transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span class="group-hover:translate-x-0.5 transition-transform duration-200">Sign out</span>
                      </NuxtLink>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 overflow-hidden !max-w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, inject, computed } from 'vue'
import { useRoute, useHead } from '#app' // useHead'i import et

const authStore = useAuthStore()
const route = useRoute()

const isSidebarOpen = ref(false)
const isLargeScreen = ref(false)
const isChatbotSubmenuOpen = ref(false)
const isUserManagementSubmenuOpen = ref(false)
const isCmsSubmenuOpen = ref(false)
const isPopoverOpen = ref(false)

// New flags to track if user explicitly closed a submenu
const userExplicitlyClosedChatbotSubmenu = ref(false);
const userExplicitlyClosedUserManagementSubmenu = ref(false);
const userExplicitlyClosedCmsSubmenu = ref(false);

// Inject theme and toggleTheme from app.vue
const theme = inject('theme');
const toggleTheme = inject('toggleTheme');

const checkScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024 // Tailwind's 'lg' breakpoint
}

const closeSidebarOnMobile = () => {
  if (!isLargeScreen.value) {
    isSidebarOpen.value = false;
  }
}

const handleLogout = async () => {
  await authStore.logout();
}

const toggleChatbotSubmenu = () => {
  isChatbotSubmenuOpen.value = !isChatbotSubmenuOpen.value;
  userExplicitlyClosedChatbotSubmenu.value = !isChatbotSubmenuOpen.value; // Set to true if it's now closed
  closeSidebarOnMobile();
}

const toggleUserManagementSubmenu = () => {
  isUserManagementSubmenuOpen.value = !isUserManagementSubmenuOpen.value;
  userExplicitlyClosedUserManagementSubmenu.value = !isUserManagementSubmenuOpen.value; // Set to true if it's now closed
  closeSidebarOnMobile();
}

const toggleCmsSubmenu = () => {
  isCmsSubmenuOpen.value = !isCmsSubmenuOpen.value;
  userExplicitlyClosedCmsSubmenu.value = !isCmsSubmenuOpen.value; // Set to true if it's now closed
  closeSidebarOnMobile();
}

const togglePopover = () => {
  isPopoverOpen.value = !isPopoverOpen.value;
}

const handleClickOutside = (event) => {
  // Close popover if click is outside the popover button and content
  // Check if the click target is not within the popover's parent container (the relative div)
  const popoverContainer = document.querySelector('.relative'); // Assuming this is the parent of the button and popover
  if (isPopoverOpen.value && popoverContainer && !popoverContainer.contains(event.target)) {
    isPopoverOpen.value = false;
  }
}

// Computed property to determine if body should be no-scroll
const shouldPreventBodyScroll = computed(() => {
  return isSidebarOpen.value && !isLargeScreen.value;
});

// Use useHead to add/remove class to body
useHead(() => ({
  bodyAttrs: {
    class: {
      'no-scroll': shouldPreventBodyScroll.value
    }
  }
}));

onMounted(() => {
  checkScreenSize()
  // Set initial sidebar state based on screen size
  isSidebarOpen.value = isLargeScreen.value;
  window.addEventListener('resize', checkScreenSize)
  
  // Initialize submenu state based on current route on mount
  isChatbotSubmenuOpen.value = route.path.startsWith('/chatbot');
  isUserManagementSubmenuOpen.value = route.path.startsWith('/users');
  isCmsSubmenuOpen.value = route.path.startsWith('/cms');

  document.addEventListener('click', handleClickOutside); // Add click outside listener
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('click', handleClickOutside); // Remove click outside listener
})

// Watch for changes in isLargeScreen to adjust isSidebarOpen
watch(isLargeScreen, (newVal, oldVal) => {
  if (newVal && !oldVal) { // Transitioned from small to large
    isSidebarOpen.value = true; // Open sidebar
  } else if (!newVal && oldVal) { // Transitioned from large to small
    isSidebarOpen.value = false; // Close sidebar
  }
});

// Watch for route changes to manage submenu state
watch(() => route.path, (newPath) => {
  // Chatbot submenu logic
  const isChatbotSection = newPath.startsWith('/chatbot');
  if (isChatbotSection) {
    if (!userExplicitlyClosedChatbotSubmenu.value) {
      isChatbotSubmenuOpen.value = true;
    }
  } else {
    isChatbotSubmenuOpen.value = false;
    userExplicitlyClosedChatbotSubmenu.value = false; // Reset flag when leaving the section
  }

  // User Management submenu logic
  const isUserManagementSection = newPath.startsWith('/users');
  if (isUserManagementSection) {
    if (!userExplicitlyClosedUserManagementSubmenu.value) {
      isUserManagementSubmenuOpen.value = true;
    }
  } else {
    isUserManagementSubmenuOpen.value = false;
    userExplicitlyClosedUserManagementSubmenu.value = false; // Reset flag when leaving the section
  }

  // CMS submenu logic
  const isCmsSection = newPath.startsWith('/cms');
  if (isCmsSection) {
    if (!userExplicitlyClosedCmsSubmenu.value) {
      isCmsSubmenuOpen.value = true;
    }
  } else {
    isCmsSubmenuOpen.value = false;
    userExplicitlyClosedCmsSubmenu.value = false; // Reset flag when leaving the section
  }

  // Close popover on route change
  isPopoverOpen.value = false;
});

const getPageTitle = () => {
  const path = route.path
  if (path === '/') return 'Dashboard'
  if (path === '/chatbot') return 'Chatbot Sessions'
  if (path.startsWith('/chatbot/') && path !== '/chatbot/chat' && path !== '/chatbot/settings') return 'Session Details' // New title for dynamic route
  if (path === '/chatbot/chat') return 'Live Chat'
  if (path === '/chatbot/settings') return 'Chatbot Settings' // New title for chatbot settings
  if (path === '/users') return 'User Management' // New title for user management
  if (path === '/users/roles') return 'Role Management' // New title for roles
  if (path === '/users/permissions') return 'Permission Management' // New title for permissions
  if (path === '/users/sessions') return 'User Sessions' // New title for sessions
  if (path === '/notifications') return 'Notification Management' // New title for notifications
  if (path === '/cms/authors') return 'Yazar Yönetimi' // New title for authors
  if (path === '/cms/sources') return 'Haber Kaynağı Yönetimi' // New title for sources
  if (path === '/cms/categories') return 'Kategori Yönetimi' // New title for categories
  if (path === '/cms/tags') return 'Etiket Yönetimi' // New title for tags
  if (path === '/cms/news') return 'Haber Yönetimi' // New title for news
  if (path === '/cms/news/add') return 'Yeni Haber Ekle' // New title for add news
  if (path === '/settings') return 'Settings'
  return 'Admin Panel'
}

onMounted(async () => {
  const { connect } = useSignalR();
  await connect();
})
</script>

<style>
/* Bu stil, sidebar mobil görünümde açıkken ana sayfanın kaydırılmasını engeller */
body.no-scroll {
  overflow: hidden;
  height: 100vh; /* Opsiyonel: body'nin tam viewport yüksekliğini almasını sağlar */
}
</style>
