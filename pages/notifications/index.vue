<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Notification Management</h1>
      <p class="text-muted-foreground">Manage notification settings, templates, and records.</p>
    </div>

    <!-- Notification Display -->
    <div v-if="notification.message" :class="[
      'p-4 mb-6 rounded-lg text-sm font-medium flex items-center justify-between',
      notification.type === 'success' ? 'bg-success/10 text-success border border-success' : 'bg-destructive/10 text-destructive border border-destructive'
    ]">
      <span>{{ notification.message }}</span>
      <button @click="clearNotification" class="text-current hover:opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Tabs Navigation -->
    <div class="mb-6 border-b border-border overflow-x-auto overflow-y-hidden">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          @click="setActiveTab('templates')"
          :class="[
            activeTab === 'templates'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
          ]"
        >
          Message Templates
        </button>
        <button
          @click="setActiveTab('records')"
          :class="[
            activeTab === 'records'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
          ]"
        >
          Notification Records
        </button>
        <button
          @click="setActiveTab('settings')"
          :class="[
            activeTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
          ]"
        >
          Other Settings
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content relative">
      <!-- Loading Overlay for Tab Content -->
      <div v-if="isTabContentLoading" class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
        <svg class="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="ml-3 text-foreground text-lg">Loading tab...</p>
      </div>

      <!-- Message Templates Tab -->
      <div v-show="activeTab === 'templates'" class="card p-6 bg-card text-card-foreground rounded-lg shadow-sm mb-8 relative">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <h3 class="text-lg font-semibold text-foreground">Message Templates</h3>
          <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <!-- Search Input -->
            <div class="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search templates..."
                class="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full shadow-sm"
                v-model="searchQueryTemplates"
              />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <button
                v-if="searchQueryTemplates"
                @click="clearSearchTemplates"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                aria-label="Clear search"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Channel Filter Dropdown -->
            <div class="relative w-full sm:w-48">
              <button
                @click="toggleChannelDropdown"
                class="w-full flex justify-between items-center px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              >
                <span>{{ selectedChannels.length === 0 ? 'Filter by Channel' : `Channels (${selectedChannels.length})` }}</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="showChannelDropdown" class="absolute right-0 mt-2 w-full sm:w-48 bg-card border border-border rounded-md shadow-lg z-10">
                <div v-for="channel in availableChannels" :key="channel" class="flex items-center p-2 hover:bg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    :id="`channel-${channel}`"
                    :value="channel"
                    v-model="selectedChannels"
                    class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  />
                  <label :for="`channel-${channel}`" class="ml-2 text-sm text-foreground">{{ channel }}</label>
                </div>
                <div class="p-2 border-t border-border">
                  <button @click="clearChannelFilter" class="text-sm text-primary hover:underline">Clear Filter</button>
                </div>
              </div>
            </div>

            <button @click="openAddTemplateDialog" :disabled="isLoadingTemplates" class="btn btn-primary px-4 py-2 w-full sm:w-auto">
              <span v-if="isLoadingTemplates" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
              <span v-else>Add New Template</span>
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableTemplates('name')"
                >
                  <div class="flex items-center">
                    Name
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnTemplates === 'name' && sortDirectionTemplates === 'asc', 'text-muted-foreground/50': !(sortColumnTemplates === 'name' && sortDirectionTemplates === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnTemplates === 'name' && sortDirectionTemplates === 'desc', 'text-muted-foreground/50': !(sortColumnTemplates === 'name' && sortDirectionTemplates === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableTemplates('channel')"
                >
                  <div class="flex items-center">
                    Channel
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnTemplates === 'channel' && sortDirectionTemplates === 'asc', 'text-muted-foreground/50': !(sortColumnTemplates === 'channel' && sortDirectionTemplates === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnTemplates === 'channel' && sortDirectionTemplates === 'desc', 'text-muted-foreground/50': !(sortColumnTemplates === 'channel' && sortDirectionTemplates === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableTemplates('subject')"
                >
                  <div class="flex items-center">
                    Subject
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnTemplates === 'subject' && sortDirectionTemplates === 'asc', 'text-muted-foreground/50': !(sortColumnTemplates === 'subject' && sortDirectionTemplates === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnTemplates === 'subject' && sortDirectionTemplates === 'desc', 'text-muted-foreground/50': !(sortColumnTemplates === 'subject' && sortDirectionTemplates === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-card divide-y divide-border">
              <tr v-for="template in paginatedTemplates" :key="template.id" class="hover:bg-muted/50 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">{{ template.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{{ template.channel }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{{ template.subject || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{{ template.description || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button @click="openEditTemplateDialog(template)" :disabled="isLoadingTemplates" class="text-primary hover:text-primary/80 mr-2">
                    <span v-if="isLoadingTemplates && currentEditingTemplateId === template.id">Editing...</span>
                    <span v-else>Edit</span>
                  </button>
                  <button @click="prepareDeleteTemplate(template.id, template.name)" :disabled="isLoadingTemplates" class="text-destructive hover:text-destructive/80">
                    <span v-if="isLoadingTemplates && currentDeletingTemplateId === template.id">Deleting...</span>
                    <span v-else>Delete</span>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedTemplates.length === 0 && !isLoadingTemplates">
                <td colspan="5" class="px-4 py-3 text-center text-sm text-muted-foreground">No message templates found.</td>
              </tr>
              <tr v-if="isLoadingTemplates && paginatedTemplates.length === 0">
                <td colspan="5" class="px-4 py-3 text-center text-sm text-muted-foreground">Loading templates...</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modern Pagination Controls for Templates -->
        <div v-if="totalPagesTemplates > 1 || filteredTemplates.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
          <div class="text-sm text-muted-foreground">
            Showing {{ paginatedTemplates.length }} of {{ filteredTemplates.length }} templates
          </div>
          <div class="flex justify-center items-center space-x-2">
            <button
              @click="goToPageTemplates(1)"
              :disabled="currentPageTemplates === 1"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">First</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              @click="prevPageTemplates"
              :disabled="currentPageTemplates === 1"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">Previous</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <template v-for="(page, index) in visiblePagesTemplates" :key="index">
              <span v-if="page === '...'" class="px-3 py-1 text-muted-foreground">...</span>
              <button
                v-else
                @click="goToPageTemplates(page)"
                :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
                  currentPageTemplates === page ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted border border-input'
                ]"
              >
                {{ page }}
              </button>
            </template>

            <button
              @click="nextPageTemplates"
              :disabled="currentPageTemplates === totalPagesTemplates"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">Next</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button
              @click="goToPageTemplates(totalPagesTemplates)"
              :disabled="currentPageTemplates === totalPagesTemplates"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">Last</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading Overlay for Templates Table -->
        <div v-if="isTemplatesTableLoading" class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
          <svg class="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="ml-3 text-foreground text-lg">Loading templates...</p>
        </div>
      </div>

      <!-- Notification Records Tab -->
      <div v-show="activeTab === 'records'" class="card p-6 bg-card text-card-foreground rounded-lg shadow-sm relative">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <h3 class="text-lg font-semibold text-foreground">Notification Records</h3>
          <div class="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search records..."
              class="pl-10 pr-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full shadow-sm"
              v-model="searchQueryRecords"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button
              v-if="searchQueryRecords"
              @click="clearSearchRecords"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label="Clear search"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableRecords('eventType')"
                >
                  <div class="flex items-center">
                    Event Type
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'eventType' && sortDirectionRecords === 'asc', 'text-muted-foreground/50': !(sortColumnRecords === 'eventType' && sortDirectionRecords === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'eventType' && sortDirectionRecords === 'desc', 'text-muted-foreground/50': !(sortColumnRecords === 'eventType' && sortDirectionRecords === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableRecords('to')"
                >
                  <div class="flex items-center">
                    To
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'to' && sortDirectionRecords === 'asc', 'text-muted-foreground/50': !(sortColumnRecords === 'to' && sortDirectionRecords === 'asc')}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'to' && sortDirectionRecords === 'desc', 'text-muted-foreground/50': !(sortColumnRecords === 'to' && sortDirectionRecords === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableRecords('subject')"
                >
                  <div class="flex items-center">
                    Subject
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'subject' && sortDirectionRecords === 'asc', 'text-muted-foreground/50': !(sortColumnRecords === 'subject' && sortDirectionRecords === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'subject' && sortDirectionRecords === 'desc', 'text-muted-foreground/50': !(sortColumnRecords === 'subject' && sortDirectionRecords === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableRecords('templateName')"
                >
                  <div class="flex items-center">
                    Template Used
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'templateName' && sortDirectionRecords === 'asc', 'text-muted-foreground/50': !(sortColumnRecords === 'templateName' && sortDirectionRecords === 'asc')}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'templateName' && sortDirectionRecords === 'desc', 'text-muted-foreground/50': !(sortColumnRecords === 'templateName' && sortDirectionRecords === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  @click="sortTableRecords('createdAt')"
                >
                  <div class="flex items-center">
                    Sent At
                    <span class="ml-2 flex flex-row space-x-1">
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'createdAt' && sortDirectionRecords === 'asc', 'text-muted-foreground/50': !(sortColumnRecords === 'createdAt' && sortDirectionRecords === 'asc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                      <svg class="w-4 h-4" :class="{'text-primary': sortColumnRecords === 'createdAt' && sortDirectionRecords === 'desc', 'text-muted-foreground/50': !(sortColumnRecords === 'createdAt' && sortDirectionRecords === 'desc')}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
                    </span>
                  </div>
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-card divide-y divide-border">
              <tr v-for="record in paginatedRecords" :key="record.id" class="hover:bg-muted/50 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">{{ record.eventType }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{{ record.to }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{{ record.subject || record.templateName }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{{ record.useTemplate ? 'Yes' : 'No' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{{ formatDate(record.createdAt) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    @click="openNotificationDetails(record)" 
                    class="text-primary hover:text-primary/80 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedRecords.length === 0 && !isRecordsTableLoading">
                <td colspan="6" class="px-4 py-3 text-center text-sm text-muted-foreground">No notification records found.</td>
              </tr>
              <tr v-if="isRecordsTableLoading && paginatedRecords.length === 0">
                <td colspan="6" class="px-4 py-3 text-center text-sm text-muted-foreground">Loading records...</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modern Pagination Controls for Records -->
        <div v-if="totalPagesRecords > 1 || filteredRecords.length > 0" class="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
          <div class="text-sm text-muted-foreground">
            Showing {{ paginatedRecords.length }} of {{ filteredRecords.length }} records
          </div>
          <div class="flex justify-center items-center space-x-2">
            <button
              @click="goToPageRecords(1)"
              :disabled="currentPageRecords === 1"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">First</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              @click="prevPageRecords"
              :disabled="currentPageRecords === 1"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">Previous</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <template v-for="(page, index) in visiblePagesRecords" :key="index">
              <span v-if="page === '...'" class="px-3 py-1 text-muted-foreground">...</span>
              <button
                v-else
                @click="goToPageRecords(page)"
                :class="['px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
                  currentPageRecords === page ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted border border-input'
                ]"
              >
                {{ page }}
              </button>
            </template>

            <button
              @click="nextPageRecords"
              :disabled="currentPageRecords === totalPagesRecords"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">Next</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button
              @click="goToPageRecords(totalPagesRecords)"
              :disabled="currentPageRecords === totalPagesRecords"
              class="px-3 py-1 sm:px-4 sm:py-2 border border-input rounded-md text-foreground bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
              <span class="hidden sm:inline">Last</span>
              <svg class="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading Overlay for Records Table -->
        <div v-if="isRecordsTableLoading" class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
          <svg class="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.000 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="ml-3 text-foreground text-lg">Loading records...</p>
        </div>
      </div>

      <!-- Other Settings Tab -->
      <div v-show="activeTab === 'settings'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Email Settings -->
        <div class="card p-6 bg-card text-card-foreground rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-foreground mb-4">Email Settings</h3>
          <form @submit.prevent="saveEmailSettings">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">SMTP Host</label>
                <input v-model="emailSettings.smtpHost" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="smtp.example.com" />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">SMTP Port</label>
                <input v-model.number="emailSettings.smtpPort" type="number" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="587" />
              </div>
              <div class="flex items-center">
                <input v-model="emailSettings.useSsl" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-input rounded" />
                <label class="ml-2 block text-sm text-foreground">Use SSL</label>
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Sender Email</label>
                <input v-model="emailSettings.senderEmail" type="email" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="noreply@example.com" />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Sender Name</label>
                <input v-model="emailSettings.senderName" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="TrendAI Notifications" />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Username</label>
                <input v-model="emailSettings.username" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="smtp_username" />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Password</label>
                <input v-model="emailSettings.password" type="password" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="********" />
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="submit" :disabled="isLoadingEmailSettings" class="btn btn-primary px-4 py-2">
                <span v-if="isLoadingEmailSettings" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>Save Email Settings</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Push Notification Settings -->
        <div class="card p-6 bg-card text-card-foreground rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-foreground mb-4">Push Notification Settings</h3>
          <form @submit.prevent="savePushSettings">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">FCM Server Key</label>
                <input v-model="pushSettings.fcmServerKey" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="Your Firebase Cloud Messaging Server Key" />
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="submit" :disabled="isLoadingPushSettings" class="btn btn-primary px-4 py-2">
                <span v-if="isLoadingPushSettings" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>Save Push Settings</span>
              </button>
            </div>
          </form>
        </div>

        <!-- SMS Settings -->
        <div class="card p-6 bg-card text-card-foreground rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-foreground mb-4">SMS Settings</h3>
          <form @submit.prevent="saveSmsSettings">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Provider Name</label>
                <input v-model="smsSettings.providerName" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="Twilio, NetGSM, etc." />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">API Key</label>
                <input v-model="smsSettings.apiKey" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="Your SMS API Key" />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">API Secret</label>
                <input v-model="smsSettings.apiSecret" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="Your SMS API Secret" />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Sender Number</label>
                <input v-model="smsSettings.senderNumber" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="+1234567890" />
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="submit" :disabled="isLoadingSmsSettings" class="btn btn-primary px-4 py-2">
                <span v-if="isLoadingSmsSettings" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>Save SMS Settings</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Telegram Settings -->
        <div class="card p-6 bg-card text-card-foreground rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-foreground mb-4">Telegram Settings</h3>
          <form @submit.prevent="saveTelegramSettings">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Bot Token</label>
                <input v-model="telegramSettings.botToken" type="text" class="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground" placeholder="Your Telegram Bot Token" />
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="submit" :disabled="isLoadingTelegramSettings" class="btn btn-primary px-4 py-2">
                <span v-if="isLoadingTelegramSettings" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>Save Telegram Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notification Template Add/Edit Dialog -->
    <NotificationTemplateDialog
      :is-visible="showTemplateDialog"
      :template="templateToEdit"
      :is-loading="isLoadingTemplates"
      @save="handleSaveTemplate"
      @close="closeTemplateDialog"
    />

    <!-- Notification Details Modal -->
    <NotificationDetailsModal
      :is-visible="showDetailsModal"
      :notification="selectedNotification"
      @close="closeDetailsModal"
    />

    <!-- Custom Confirmation Dialog for Template Deletion -->
    <ConfirmDialog
      v-model="showConfirmDeleteTemplateDialog"
      :title="confirmDeleteTemplateDialogTitle"
      :message="confirmDeleteTemplateDialogMessage"
      :confirmButtonText="confirmDeleteTemplateDialogButtonText"
      confirmButtonClass="bg-destructive hover:bg-destructive/90"
      @confirm="executeDeleteTemplate"
      @cancel="cancelDeleteTemplate"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import NotificationTemplateDialog from '~/components/NotificationTemplateDialog.vue';
import NotificationDetailsModal from '~/components/NotificationDetailsModal.vue';
import ConfirmDialog from '~/components/ConfirmDialog.vue'; // Import the new component

definePageMeta({
  layout: 'admin'
})

const notificationApiStore = useNotificationApiStore();
const { emailSettings } = storeToRefs(notificationApiStore);

const activeTab = ref('templates'); // Default active tab
const isTabContentLoading = ref(false); // New state for tab content loading

// Loading states
const isLoadingTemplates = ref(false);
const currentEditingTemplateId = ref(null);
const currentDeletingTemplateId = ref(null);

const isLoadingEmailSettings = ref(false);
const isLoadingPushSettings = ref(false);
const isLoadingSmsSettings = ref(false);
const isLoadingTelegramSettings = ref(false);

// Notification state
const notification = ref({
  message: '',
  type: '' // 'success' or 'destructive'
});

const showNotification = (message, type) => {
  notification.value.message = message;
  notification.value.type = type;
  setTimeout(() => {
    clearNotification();
  }, 5000); // Clear notification after 5 seconds
};

const clearNotification = () => {
  notification.value.message = '';
  notification.value.type = '';
};

const pushSettings = ref({
  fcmServerKey: 'mock_fcm_server_key_12345'
});

const smsSettings = ref({
  providerName: 'Twilio',
  apiKey: 'mock_sms_api_key_abc',
  apiSecret: 'mock_sms_api_secret_xyz',
  senderNumber: '+1501712266'
});

const telegramSettings = ref({
  botToken: 'mock_telegram_bot_token_67890'
});

// Mock Data for Message Templates
const messageTemplates = ref([
  {
    id: 'tpl1',
    dataType: 'Project',
    name: 'WelcomeEmail',
    description: 'Email sent to new users upon registration.',
    body: 'Welcome to TrendAI! Your journey starts now.',
    channel: 'Email',
    subject: 'Welcome to TrendAI!',
    isHtml: true,
  },
  {
    id: 'tpl2',
    dataType: 'Project',
    name: 'PasswordResetSMS',
    description: 'SMS for password reset verification.',
    body: 'Your password reset code is: {code}',
    channel: 'SMS',
    subject: null,
    isHtml: false,
  },
  {
    id: 'tpl3',
    dataType: 'Project',
    name: 'NewFeaturePush',
    description: 'Push notification for new feature announcement.',
    body: 'Exciting new features are here! Check them out.',
    channel: 'PushNotification',
    subject: 'New Features Available!',
    isHtml: false,
  },
  {
    id: 'tpl4',
    dataType: 'Project',
    name: 'OrderConfirmationEmail',
    description: 'Confirmation email for successful orders.',
    body: 'Your order {orderId} has been confirmed.',
    channel: 'Email',
    subject: 'Order Confirmation',
    isHtml: true,
  },
  {
    id: 'tpl5',
    dataType: 'Project',
    name: 'ShippingUpdateSMS',
    description: 'SMS notification for shipping updates.',
    body: 'Your order {orderId} has been shipped. Tracking: {trackingNumber}',
    channel: 'SMS',
    subject: null,
    isHtml: false,
  },
  {
    id: 'tpl6',
    dataType: 'Project',
    name: 'AccountSuspensionEmail',
    description: 'Email notifying user of account suspension.',
    body: 'Your account has been suspended due to unusual activity.',
    channel: 'Email',
    subject: 'Account Suspension Notice',
    isHtml: true,
  },
  {
    id: 'tpl7',
    dataType: 'Project',
    name: 'DailyDigestEmail',
    description: 'Daily summary of activities and updates.',
    body: 'Here is your daily digest from TrendAI.',
    channel: 'Email',
    subject: 'Your Daily TrendAI Digest',
    isHtml: true,
  },
  {
    id: 'tpl8',
    dataType: 'Project',
    name: 'LowBalanceAlertSMS',
    description: 'SMS alert for low account balance.',
    body: 'Your account balance is low. Please top up.',
    channel: 'SMS',
    subject: null,
    isHtml: false,
  },
  {
    id: 'tpl9',
    dataType: 'Project',
    name: 'MarketingPromotionPush',
    description: 'Push notification for new marketing promotions.',
    body: 'Check out our latest promotions!',
    channel: 'PushNotification',
    subject: 'Exclusive Offers!',
    isHtml: false,
  },
  {
    id: 'tpl10',
    dataType: 'Project',
    name: 'FeedbackRequestEmail',
    description: 'Email requesting user feedback.',
    body: 'We value your feedback! Please share your experience.',
    channel: 'Email',
    subject: 'Share Your Feedback',
    isHtml: true,
  }
]);

// Pagination and Sorting for Message Templates
const currentPageTemplates = ref(1);
const itemsPerPageTemplates = ref(5); // Adjust as needed
const searchQueryTemplates = ref('');
const sortColumnTemplates = ref(null);
const sortDirectionTemplates = ref(null); // 'asc', 'desc', or null
const isTemplatesTableLoading = ref(false);

// Channel Filter for Message Templates
const availableChannels = ['Email', 'SMS', 'PushNotification', 'Telegram'];
const selectedChannels = ref([]);
const showChannelDropdown = ref(false);

const toggleChannelDropdown = () => {
  showChannelDropdown.value = !showChannelDropdown.value;
};

const clearChannelFilter = () => {
  selectedChannels.value = [];
  showChannelDropdown.value = false;
};

const filteredTemplates = computed(() => {
  let filtered = messageTemplates.value;
  const query = searchQueryTemplates.value.toLowerCase();

  // Apply search query filter
  if (query) {
    filtered = filtered.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.channel.toLowerCase().includes(query) ||
      (template.subject && template.subject.toLowerCase().includes(query)) ||
      template.description.toLowerCase().includes(query)
    );
  }

  // Apply channel filter
  if (selectedChannels.value.length > 0) {
    filtered = filtered.filter(template =>
      selectedChannels.value.includes(template.channel)
    );
  }

  return filtered;
});

const sortedTemplates = computed(() => {
  const sortableTemplates = [...filteredTemplates.value];
  if (!sortColumnTemplates.value || !sortDirectionTemplates.value) {
    return sortableTemplates;
  }

  return sortableTemplates.sort((a, b) => {
    let aValue = a[sortColumnTemplates.value];
    let bValue = b[sortColumnTemplates.value];

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    } else {
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
    }

    return sortDirectionTemplates.value === 'asc' ? comparison : -comparison;
  });
});

const totalPagesTemplates = computed(() => {
  return Math.ceil(sortedTemplates.value.length / itemsPerPageTemplates.value);
});

const paginatedTemplates = computed(() => {
  const start = (currentPageTemplates.value - 1) * itemsPerPageTemplates.value;
  const end = start + itemsPerPageTemplates.value;
  return sortedTemplates.value.slice(start, end);
});

const visiblePagesTemplates = computed(() => {
  const pages = [];
  const total = totalPagesTemplates.value;
  const current = currentPageTemplates.value;
  const maxVisible = 5;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    let start = Math.max(2, current - Math.floor(maxVisible / 2) + 1);
    let end = Math.min(total - 1, current + Math.floor(maxVisible / 2) - 1);

    if (current < maxVisible - 1) {
      end = maxVisible - 1;
    } else if (current > total - (maxVisible - 2)) {
      start = total - (maxVisible - 2);
    }

    if (start > 2) {
      pages.push('...');
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < total - 1) {
      pages.push('...');
    }
    pages.push(total);
  }
  return pages;
});

const sortTableTemplates = (column) => {
  isTemplatesTableLoading.value = true;
  if (sortColumnTemplates.value === column) {
    if (sortDirectionTemplates.value === 'asc') {
      sortDirectionTemplates.value = 'desc';
    } else if (sortDirectionTemplates.value === 'desc') {
      sortDirectionTemplates.value = null;
      sortColumnTemplates.value = null;
    } else {
      sortDirectionTemplates.value = 'asc';
    }
  } else {
    sortColumnTemplates.value = column;
    sortDirectionTemplates.value = 'asc';
  }
  currentPageTemplates.value = 1;
  setTimeout(() => { isTemplatesTableLoading.value = false; }, 300);
};

const nextPageTemplates = () => {
  if (currentPageTemplates.value < totalPagesTemplates.value) {
    isTemplatesTableLoading.value = true;
    currentPageTemplates.value++;
    setTimeout(() => { isTemplatesTableLoading.value = false; }, 300);
  }
};

const prevPageTemplates = () => {
  if (currentPageTemplates.value > 1) {
    isTemplatesTableLoading.value = true;
    currentPageTemplates.value--;
    setTimeout(() => { isTemplatesTableLoading.value = false; }, 300);
  }
};

const goToPageTemplates = (page) => {
  if (page >= 1 && page <= totalPagesTemplates.value) {
    isTemplatesTableLoading.value = true;
    currentPageTemplates.value = page;
    setTimeout(() => { isTemplatesTableLoading.value = false; }, 300);
  }
};

const clearSearchTemplates = () => {
  searchQueryTemplates.value = '';
};

watch([searchQueryTemplates, sortColumnTemplates, sortDirectionTemplates, selectedChannels], () => {
  currentPageTemplates.value = 1;
  isTemplatesTableLoading.value = true;
  setTimeout(() => { isTemplatesTableLoading.value = false; }, 300);
});


// Mock Data for Notification Records
const notificationRecords = ref([
  {
    id: 'rec1',
    eventType: 'UserRegistered',
    to: 'user1@example.com',
    body: 'Welcome to TrendAI! Your journey starts now.',
    subject: 'Welcome to TrendAI!',
    templateName: 'WelcomeEmail',
    useTemplate: true,
    isHtml: true,
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'rec2',
    eventType: 'PasswordReset',
    to: '+1234567890',
    body: 'Your password reset code is: 123456',
    subject: null,
    templateName: 'PasswordResetSMS',
    useTemplate: true,
    isHtml: false,
    createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  },
  {
    id: 'rec3',
    eventType: 'SystemAlert',
    to: 'admin@example.com',
    body: 'Database backup failed. Please check logs.',
    subject: 'Critical System Alert',
    templateName: null,
    useTemplate: false,
    isHtml: false,
    createdAt: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
  },
  {
    id: 'rec4',
    eventType: 'OrderShipped',
    to: 'user2@example.com',
    body: 'Your order #12345 has been shipped.',
    subject: 'Order Shipped',
    templateName: 'OrderShippedEmail',
    useTemplate: true,
    isHtml: false,
    createdAt: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
  },
  {
    id: 'rec5',
    eventType: 'LoginAttempt',
    to: 'user3@example.com',
    body: 'Unusual login attempt detected from new device.',
    subject: 'Security Alert',
    templateName: null,
    useTemplate: false,
    isHtml: false,
    createdAt: new Date(Date.now() - 18000000).toISOString() // 5 hours ago
  },
  {
    id: 'rec6',
    eventType: 'NewMessage',
    to: 'user4@example.com',
    body: 'You have a new message from support.',
    subject: 'New Message',
    templateName: 'NewMessagePush',
    useTemplate: true,
    isHtml: false,
    createdAt: new Date(Date.now() - 21600000).toISOString() // 6 hours ago
  },
  {
    id: 'rec7',
    eventType: 'SubscriptionRenewal',
    to: 'user5@example.com',
    body: 'Your subscription is due for renewal on 2024-07-01.',
    subject: 'Subscription Renewal Reminder',
    templateName: 'SubscriptionRenewalEmail',
    useTemplate: true,
    isHtml: true,
    createdAt: new Date(Date.now() - 25200000).toISOString() // 7 hours ago
  },
  {
    id: 'rec8',
    eventType: 'PaymentFailed',
    to: 'user6@example.com',
    body: 'Your recent payment failed. Please update your billing info.',
    subject: 'Payment Failed',
    templateName: null,
    useTemplate: false,
    isHtml: false,
    createdAt: new Date(Date.now() - 28800000).toISOString() // 8 hours ago
  },
  {
    id: 'rec9',
    eventType: 'WelcomeOnboard',
    to: 'newuser@example.com',
    body: 'Welcome to our platform! Get started now.',
    subject: 'Welcome!',
    templateName: 'WelcomeEmail',
    useTemplate: true,
    isHtml: true,
    createdAt: new Date(Date.now() - 32400000).toISOString() // 9 hours ago
  },
  {
    id: 'rec10',
    eventType: 'FeatureUpdate',
    to: 'allusers@example.com',
    body: 'Exciting new features are here! Check them out.',
    subject: 'New Features Available!',
    templateName: 'NewFeaturePush',
    useTemplate: true,
    isHtml: false,
    createdAt: new Date(Date.now() - 36000000).toISOString() // 10 hours ago
  }
]);

// Pagination and Sorting for Notification Records
const currentPageRecords = ref(1);
const itemsPerPageRecords = ref(5); // Adjust as needed
const searchQueryRecords = ref('');
const sortColumnRecords = ref(null);
const sortDirectionRecords = ref(null); // 'asc', 'desc', or null
const isRecordsTableLoading = ref(false);

const filteredRecords = computed(() => {
  let filtered = notificationRecords.value;
  const query = searchQueryRecords.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(record =>
      record.eventType.toLowerCase().includes(query) ||
      record.to.toLowerCase().includes(query) ||
      (record.subject && record.subject.toLowerCase().includes(query)) ||
      (record.templateName && record.templateName.toLowerCase().includes(query)) ||
      record.body.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const sortedRecords = computed(() => {
  const sortableRecords = [...filteredRecords.value];
  if (!sortColumnRecords.value || !sortDirectionRecords.value) {
    return sortableRecords;
  }

  return sortableRecords.sort((a, b) => {
    let aValue = a[sortColumnRecords.value];
    let bValue = b[sortColumnRecords.value];

    let comparison = 0;
    if (sortColumnRecords.value === 'createdAt') {
      const dateA = aValue ? new Date(aValue).getTime() : 0;
      const dateB = bValue ? new Date(bValue).getTime() : 0;
      comparison = dateA - dateB;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    } else {
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
    }

    return sortDirectionRecords.value === 'asc' ? comparison : -comparison;
  });
});

const totalPagesRecords = computed(() => {
  return Math.ceil(sortedRecords.value.length / itemsPerPageRecords.value);
});

const paginatedRecords = computed(() => {
  const start = (currentPageRecords.value - 1) * itemsPerPageRecords.value;
  const end = start + itemsPerPageRecords.value;
  return sortedRecords.value.slice(start, end);
});

const visiblePagesRecords = computed(() => {
  const pages = [];
  const total = totalPagesRecords.value;
  const current = currentPageRecords.value;
  const maxVisible = 5;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    let start = Math.max(2, current - Math.floor(maxVisible / 2) + 1);
    let end = Math.min(total - 1, current + Math.floor(maxVisible / 2) - 1);

    if (current < maxVisible - 1) {
      end = maxVisible - 1;
    } else if (current > total - (maxVisible - 2)) {
      start = total - (maxVisible - 2);
    }

    if (start > 2) {
      pages.push('...');
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < total - 1) {
      pages.push('...');
    }
    pages.push(total);
  }
  return pages;
});

const sortTableRecords = (column) => {
  isRecordsTableLoading.value = true;
  if (sortColumnRecords.value === column) {
    if (sortDirectionRecords.value === 'asc') {
      sortDirectionRecords.value = 'desc';
    } else if (sortDirectionRecords.value === 'desc') {
      sortDirectionRecords.value = null;
      sortColumnRecords.value = null;
    } else {
      sortDirectionRecords.value = 'asc';
    }
  } else {
    sortColumnRecords.value = column;
    sortDirectionRecords.value = 'asc';
  }
  currentPageRecords.value = 1;
  setTimeout(() => { isRecordsTableLoading.value = false; }, 300);
};

const nextPageRecords = () => {
  if (currentPageRecords.value < totalPagesRecords.value) {
    isRecordsTableLoading.value = true;
    currentPageRecords.value++;
    setTimeout(() => { isRecordsTableLoading.value = false; }, 300);
  }
};

const prevPageRecords = () => {
  if (currentPageRecords.value > 1) {
    isRecordsTableLoading.value = true;
    currentPageRecords.value--;
    setTimeout(() => { isRecordsTableLoading.value = false; }, 300);
  }
};

const goToPageRecords = (page) => {
  if (page >= 1 && page <= totalPagesRecords.value) {
    isRecordsTableLoading.value = true;
    currentPageRecords.value = page;
    setTimeout(() => { isRecordsTableLoading.value = false; }, 300);
  }
};

const clearSearchRecords = () => {
  searchQueryRecords.value = '';
};

watch([searchQueryRecords, sortColumnRecords, sortDirectionRecords], () => {
  currentPageRecords.value = 1;
  isRecordsTableLoading.value = true;
  setTimeout(() => { isRecordsTableLoading.value = false; }, 300);
});

watch(activeTab, async () => {
  if (activeTab.value === 'templates') {
    
  } else if (activeTab.value === 'records') {
    
  } else if (activeTab.value === 'settings') {
    await notificationApiStore.getEmailSettingsAsync();
    await notificationApiStore.getPushNotificationSettingsAsync();
    await notificationApiStore.getTelegramSettingsAsync();
    await notificationApiStore.getSmsSettingsAsync();
  }
});

// Methods for Settings
const saveEmailSettings = async () => {
  clearNotification();
  isLoadingEmailSettings.value = true;
  await notificationApiStore.updateEmailSettingsAsync();
  isLoadingEmailSettings.value = false;
};

const savePushSettings = async () => {
  isLoadingPushSettings.value = true;
  await notificationApiStore.updatePushNotificationSettingsAsync();
  isLoadingPushSettings.value = false;
};

const saveSmsSettings = async () => {
  isLoadingSmsSettings.value = true;
  clearNotification();
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Saving SMS Settings:', smsSettings.value);
    showNotification('SMS Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving SMS settings:', error);
    showNotification('Failed to save SMS Settings.', 'destructive');
  } finally {
    isLoadingSmsSettings.value = false;
  }
};

const saveTelegramSettings = async () => {
  isLoadingTelegramSettings.value = true;
  clearNotification();
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Saving Telegram Settings:', telegramSettings.value);
    showNotification('Telegram Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving Telegram settings:', error);
    showNotification('Failed to save Telegram Settings.', 'destructive');
  } finally {
    isLoadingTelegramSettings.value = false;
  }
};

// Dialog state for Message Templates
const showTemplateDialog = ref(false);
const templateToEdit = ref(null); // Holds the template object when editing, null when adding

// Details modal state
const showDetailsModal = ref(false);
const selectedNotification = ref(null);

// State for custom confirmation dialog for template deletion
const showConfirmDeleteTemplateDialog = ref(false);
const confirmDeleteTemplateDialogTitle = ref('');
const confirmDeleteTemplateDialogMessage = ref('');
const confirmDeleteTemplateDialogButtonText = ref('');
const templateIdToDelete = ref(null); // To store the ID of the template being deleted

const openAddTemplateDialog = () => {
  templateToEdit.value = null; // Clear for new template
  showTemplateDialog.value = true;
};

const openEditTemplateDialog = (template) => {
  templateToEdit.value = { ...template }; // Pass a copy to avoid direct mutation
  showTemplateDialog.value = true;
};

const closeTemplateDialog = () => {
  showTemplateDialog.value = false;
  templateToEdit.value = null; // Clear template to edit
};

const handleSaveTemplate = async (templateData) => {
  isLoadingTemplates.value = true;
  clearNotification();
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    if (templateData.id) {
      // Editing existing template
      const index = messageTemplates.value.findIndex(t => t.id === templateData.id);
      if (index !== -1) {
        messageTemplates.value[index] = templateData;
        showNotification(`Template "${templateData.name}" updated successfully!`, 'success');
      }
    } else {
      // Adding new template
      const newId = `tpl${messageTemplates.value.length + 1}`;
      messageTemplates.value.push({ ...templateData, id: newId });
      showNotification('New template added successfully!', 'success');
    }
    closeTemplateDialog();
  } catch (error) {
    console.error('Error saving template:', error);
    showNotification(`Failed to save template "${templateData.name}".`, 'destructive');
  } finally {
    isLoadingTemplates.value = false;
  }
};

// Prepare the custom confirmation dialog for template deletion
const prepareDeleteTemplate = (id, name) => {
  templateIdToDelete.value = id;
  confirmDeleteTemplateDialogTitle.value = 'Confirm Template Deletion';
  confirmDeleteTemplateDialogMessage.value = `Are you sure you want to delete the template "${name}"? This action cannot be undone.`;
  confirmDeleteTemplateDialogButtonText.value = 'Delete';
  showConfirmDeleteTemplateDialog.value = true;
};

// Execute the delete action after confirmation
const executeDeleteTemplate = async () => {
  const id = templateIdToDelete.value;
  isLoadingTemplates.value = true;
  currentDeletingTemplateId.value = id;
  clearNotification();
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    messageTemplates.value = messageTemplates.value.filter(t => t.id !== id);
    showNotification('Template deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting template:', error);
    showNotification('Failed to delete template.', 'destructive');
  } finally {
    isLoadingTemplates.value = false;
    currentDeletingTemplateId.value = null;
    templateIdToDelete.value = null; // Clear the stored ID
  }
};

// Handle cancellation from the custom confirmation dialog
const cancelDeleteTemplate = () => {
  templateIdToDelete.value = null; // Clear the stored ID
  showNotification('Template deletion cancelled.', 'info');
};

// Notification details methods
const openNotificationDetails = (notification) => {
  selectedNotification.value = notification;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedNotification.value = null;
};

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Function to handle tab changes with loading state
const setActiveTab = (tabName) => {
  if (activeTab.value !== tabName) {
    isTabContentLoading.value = true;
    setTimeout(() => {
      activeTab.value = tabName;
      isTabContentLoading.value = false;
    }, 300); // Simulate loading time
  }
};
</script>
