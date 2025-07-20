<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Haberi Düzenle</h1>
      <p class="text-muted-foreground">Mevcut bir haberi düzenleyin ve güncelleyin</p>
    </div>

    <div v-if="notification.message" class="p-4 mb-4 rounded-md text-white flex justify-between items-center"
      :class="{
        'bg-green-500': notification.type === 'success',
        'bg-red-500': notification.type === 'error',
        'bg-blue-500': notification.type === 'info'
      }">
      <span>{{ notification.message }}</span>
      <button @click="hideNotification" class="ml-4 text-white font-bold">&times;</button>
    </div>

    <div v-if="isLoadingInitial" class="flex items-center justify-center h-96">
      <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="ml-3 text-foreground text-lg">Haber yükleniyor...</p>
    </div>

    <div v-else-if="!newsData.id" class="card p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
      </svg>
      <h3 class="text-lg font-medium text-foreground mb-2">Haber bulunamadı</h3>
      <p class="text-muted-foreground mb-4">Düzenlemek istediğiniz haber bulunamadı veya silinmiş olabilir.</p>
      <NuxtLink to="/cms/news" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-input rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-colors duration-200">
        Haber Yönetimine Geri Dön
      </NuxtLink>
    </div>

    <form v-else @submit.prevent="saveNews" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Haber Başlığı</h3>
            <input
              type="text"
              v-model="newsData.title"
              placeholder="Haber başlığını girin..."
              class="w-full px-4 py-3 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-lg"
              required
            />
          </div>

          <!-- Content -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">İçerik</h3>
            <div class="border border-input rounded-lg bg-background">
              <!-- Toolbar -->
              <div v-if="editor" class="border-b border-border p-2 flex flex-wrap gap-1 bg-secondary rounded-t-lg">
                <button
                  type="button"
                  @click="editor.chain().focus().toggleBold().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('bold') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Bold"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                  </svg>
                </button>
                
                <button
                  type="button"
                  @click="editor.chain().focus().toggleItalic().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('italic') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Italic"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4h-9M14 20H5M15 4L9 20"></path>
                  </svg>
                </button>

                <div class="w-px h-6 bg-border mx-1"></div>

                <button
                  type="button"
                  @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('heading', { level: 1 }) }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                  title="Heading 1"
                >
                  H1
                </button>
                
                <button
                  type="button"
                  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('heading', { level: 2 }) }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                  title="Heading 2"
                >
                  H2
                </button>

                <div class="w-px h-6 bg-border mx-1"></div>

                <button
                  type="button"
                  @click="editor.chain().focus().toggleBulletList().run()"
                  :class="{ 'bg-accent text-accent-foreground': editor.isActive('bulletList') }"
                  class="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Bullet List"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
                  </svg>
                </button>
              </div>

              <!-- Editor Content -->
              <div class="min-h-[300px] p-4">
                <editor-content :editor="editor" />
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Görsel</h3>
            <div class="flex items-center space-x-4 mb-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="url"
                  v-model="imageUploadMethod"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-foreground">URL ile Yükle</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="file"
                  v-model="imageUploadMethod"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-foreground">Cihazdan Seç</span>
              </label>
            </div>

            <div v-if="imageUploadMethod === 'url'">
              <input
                type="url"
                v-model="newsData.imageUrl"
                placeholder="Görsel URL'si girin..."
                class="w-full px-4 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
            </div>
            <div v-else-if="imageUploadMethod === 'file'">
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="w-full text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
              />
            </div>

            <div v-if="newsData.imageUrl" class="mt-4">
              <img :src="newsData.imageUrl" alt="Preview" class="w-full h-48 object-cover rounded-md" />
            </div>
            <div v-else-if="imageUploadMethod === 'file' && !newsData.imageUrl" class="mt-4 text-muted-foreground text-sm">
              Görsel seçilmedi.
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Publish Settings -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Yayın Ayarları</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">Durum</label>
                <select v-model="newsData.contentStatus" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm">
                  <option value="Draft">Taslak</option>
                  <option value="Published">Yayınla</option>
                  <option value="Archived">Arşivle</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">İçerik Türü</label>
                <select v-model="newsData.contentType" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm">
                  <option value="News">Haber</option>
                  <option value="Article">Makale</option>
                  <option value="Blog">Blog</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">Yayın Tarihi</label>
                <input
                  type="datetime-local"
                  v-model="publishedDateLocal"
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">Okuma Süresi (dakika)</label>
                <input
                  type="number"
                  v-model.number="newsData.readingDuration"
                  min="1"
                  class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                />
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  v-model="newsData.featured"
                  class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label for="featured" class="ml-2 block text-sm text-foreground">Öne Çıkan Haber</label>
              </div>
            </div>
          </div>

          <!-- Author -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Yazar</h3>
            <select v-model="newsData.authorId" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm">
              <option value="">Yazar seçin</option>
              <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.fullName }}</option>
            </select>
          </div>

          <!-- Source -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Kaynak</h3>
            <select v-model="newsData.sourceId" class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm mb-3">
              <option value="">Kaynak seçin</option>
              <option v-for="source in sources" :key="source.id" :value="source.id">{{ source.name }}</option>
            </select>
            <input
              type="url"
              v-model="newsData.sourceUrl"
              placeholder="Kaynak URL (opsiyonel)"
              class="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
          </div>

          <!-- Tags -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Etiketler</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div v-for="tag in availableTags" :key="tag.id" class="flex items-center">
                <input
                  type="checkbox"
                  :id="`tag-${tag.id}`"
                  :value="tag.id"
                  v-model="newsData.selectedTags"
                  class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label :for="`tag-${tag.id}`" class="ml-2 block text-sm text-foreground">{{ tag.name }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end items-center pt-6 border-t border-border">
        <div class="flex space-x-3">
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kaydediliyor...
            </span>
            <span v-else>{{ submitButtonText }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useRoute, navigateTo } from '#app'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const isLoading = ref(false)
const isLoadingInitial = ref(true) // For initial data fetch
const notification = ref({ message: '', type: '' })
let notificationTimeout = null

const newsData = ref({
  id: null, // Add ID for editing
  title: '',
  contentText: '',
  imageUrl: '',
  sourceUrl: '',
  contentStatus: 'Draft',
  contentType: 'News',
  readingDuration: 5,
  publishedDate: new Date(),
  featured: false,
  authorId: '',
  sourceId: '',
  selectedTags: []
})

const imageUploadMethod = ref('url');
const selectedFile = ref(null);

const publishedDateLocal = computed({
  get() {
    return newsData.value.publishedDate ? newsData.value.publishedDate.toISOString().slice(0, 16) : '';
  },
  set(value) {
    newsData.value.publishedDate = value ? new Date(value) : new Date();
  }
})

const submitButtonText = computed(() => {
  return newsData.value.contentStatus === 'Published' ? 'Yayınla' : 'Kaydet';
});

// Mock data (consistent with index.vue and preview/[id].vue)
const authors = ref([
  { id: 'author_001', fullName: 'Ahmet Yılmaz' },
  { id: 'author_002', fullName: 'Fatma Demir' },
  { id: 'author_003', fullName: 'Mehmet Kaya' },
  { id: 'author_004', fullName: 'Ayşe Kara' },
  { id: 'author_005', fullName: 'Zeynep Can' },
  { id: 'author_006', fullName: 'Ali Veli' },
  { id: 'author_007', fullName: 'Deniz Ak' },
])

const sources = ref([
  { id: 'source_001', name: 'TechCrunch' },
  { id: 'source_002', name: 'BBC News' },
  { id: 'source_003', name: 'Reuters' },
  { id: 'source_004', name: 'Bloomberg HT' },
  { id: 'source_005', name: 'Anadolu Ajansı' }
])

const availableTags = ref([
  { id: 'tag_001', name: 'yapay-zeka' },
  { id: 'tag_002', name: 'blockchain' },
  { id: 'tag_003', name: 'kripto-para' },
  { id: 'tag_004', name: 'mobil-uygulama' },
  { id: 'tag_005', name: 'siber-güvenlik' },
  { id: 'tag_006', name: 'enerji' },
  { id: 'tag_007', name: 'çevre' },
  { id: 'tag_008', name: 'finans' },
  { id: 'tag_009', name: 'uzay' },
  { id: 'tag_010', name: 'bilim' },
  { id: 'tag_011', name: 'akıllı-şehir' },
  { id: 'tag_012', name: 'yeşil-enerji' },
  { id: 'tag_013', name: 'metaverse' },
  { id: 'tag_014', name: 'sanal-gerçeklik' },
  { id: 'tag_015', name: 'kuantum' },
  { id: 'tag_016', name: 'bilgisayar' },
  { id: 'tag_017', name: 'biyoteknoloji' },
  { id: 'tag_018', name: 'uzaktan-çalışma' },
  { id: 'tag_019', name: 'iş-hayatı' },
  { id: 'tag_020', name: 'tarım' },
  { id: 'tag_021', name: 'sürdürülebilirlik' },
  { id: 'tag_022', name: 'sağlık' },
  { id: 'tag_023', name: 'eğitim' },
  { id: 'tag_024', name: 'teknoloji' },
  { id: 'tag_025', name: 'dijital-dönüşüm' }
])

// Mock data for news (should be consistent with index.vue and preview/[id].vue)
const mockNews = [
  {
    id: 'news_001',
    title: 'Yapay Zeka Teknolojisinde Yeni Gelişmeler',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Yapay zeka alanındaki son gelişmeler, makine öğrenimi algoritmalarının ve derin öğrenme modellerinin sınırlarını zorluyor. Özellikle doğal dil işleme ve görüntü tanıma konularında kaydedilen ilerlemeler, birçok sektörde devrim niteliğinde değişikliklere yol açıyor. Yeni nesil yapay zeka sistemleri, daha karmaşık problemleri çözme ve insan benzeri kararlar alma yeteneği kazanıyor.</p><p>Bu gelişmeler, sağlık, finans ve otomotiv gibi alanlarda büyük potansiyel sunuyor. Örneğin, yapay zeka destekli teşhis sistemleri, hastalıkların erken evrelerinde tespit edilmesine yardımcı olurken, otonom araçlar trafik güvenliğini artırıyor. Ancak, etik ve güvenlik konuları da bu teknolojilerin yaygınlaşmasıyla birlikte daha fazla önem kazanıyor.</p>',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 5,
    publishedDate: new Date('2023-12-01T10:00:00Z'),
    authorId: 'author_001',
    sourceId: 'source_001',
    categoryId: 'cat_001',
    tags: [{ id: 'tag_001', name: 'yapay-zeka' }, { id: 'tag_024', name: 'teknoloji' }],
    featured: true
  },
  {
    id: 'news_002',
    title: 'Blockchain ve Kripto Para Piyasası Analizi',
    imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Blockchain teknolojisi ve kripto para piyasaları, finans dünyasında köklü değişikliklere neden olmaya devam ediyor. Bitcoin ve Ethereum gibi önde gelen kripto paraların yanı sıra, merkeziyetsiz finans (DeFi) ve NFT (Non-Fungible Token) gibi yeni trendler de yatırımcıların ilgisini çekiyor. Bu teknolojiler, şeffaflık, güvenlik ve aracısız işlem imkanları sunarak geleneksel finans sistemlerine alternatif oluşturuyor.</p><p>Ancak, piyasadaki dalgalanmalar ve düzenleyici belirsizlikler, kripto paraların geleceği hakkında soru işaretleri yaratıyor. Uzmanlar, blockchain teknolojisinin sadece finans değil, tedarik zinciri yönetimi, sağlık ve fikri mülkiyet gibi birçok alanda da potansiyel taşıdığını belirtiyor. Gelecekte, bu teknolojilerin daha geniş kitleler tarafından benimsenmesi bekleniyor.</p>',
    contentStatus: 'Draft',
    contentType: 'Article',
    readingDuration: 8,
    publishedDate: new Date('2023-12-02T14:30:00Z'),
    authorId: 'author_002',
    sourceId: 'source_004',
    categoryId: 'cat_002',
    tags: [{ id: 'tag_002', name: 'blockchain' }, { id: 'tag_003', name: 'kripto-para' }, { id: 'tag_008', name: 'finans' }],
    featured: false
  },
  {
    id: 'news_003',
    title: 'Mobil Uygulama Geliştirme Trendleri',
    imageUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Mobil uygulama geliştirme sektörü, her geçen gün yeni trendlerle şekilleniyor. Artırılmış gerçeklik (AR), yapay zeka entegrasyonu ve 5G teknolojisinin yaygınlaşması, mobil uygulamaların yeteneklerini artırıyor. Kullanıcı deneyimi (UX) ve kullanıcı arayüzü (UI) tasarımında minimalist yaklaşımlar ve koyu mod seçenekleri popülerliğini koruyor.</p><p>Cross-platform geliştirme araçları (React Native, Flutter) sayesinde uygulamalar daha hızlı ve maliyet etkin bir şekilde geliştirilebiliyor. Güvenlik ve veri gizliliği, mobil uygulama geliştiricileri için en önemli önceliklerden biri haline geldi. Ayrıca, giyilebilir teknolojiler ve IoT (Nesnelerin İnterneti) cihazlarıyla entegrasyon da mobil uygulamaların geleceğinde önemli bir yer tutuyor.</p>',
    contentStatus: 'Published',
    contentType: 'Blog',
    readingDuration: 6,
    publishedDate: new Date('2023-12-03T09:15:00Z'),
    authorId: 'author_003',
    sourceId: 'source_002',
    categoryId: 'cat_001',
    tags: [{ id: 'tag_004', name: 'mobil-uygulama' }, { id: 'tag_024', name: 'teknoloji' }],
    featured: false
  },
  {
    id: 'news_004',
    title: 'Siber Güvenlik: 2024 Trendleri ve Öneriler',
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>2024 yılında siber güvenlik tehditleri daha karmaşık ve sofistike hale geliyor. Yapay zeka destekli siber saldırılar, fidye yazılımları ve veri ihlalleri, kurumlar için büyük risk oluşturuyor. Bu nedenle, siber güvenlik stratejilerinin sürekli güncellenmesi ve proaktif önlemler alınması büyük önem taşıyor.</p><p>Çok faktörlü kimlik doğrulama (MFA), sıfır güven (Zero Trust) mimarisi ve bulut güvenliği çözümleri, şirketlerin siber saldırılara karşı direncini artırıyor. Çalışan eğitimleri ve farkındalık programları da insan faktöründen kaynaklanan güvenlik açıklarını minimize etmek için kritik rol oynuyor. Siber güvenlik uzmanları, sürekli değişen tehdit ortamına uyum sağlamanın ve yeni teknolojileri takip etmenin önemini vurguluyor.</p>',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 7,
    publishedDate: new Date('2023-12-04T11:20:00Z'),
    authorId: 'author_004',
    sourceId: 'source_003',
    categoryId: 'cat_001',
    tags: [{ id: 'tag_005', name: 'siber-güvenlik' }, { id: 'tag_024', name: 'teknoloji' }],
    featured: true
  },
  {
    id: 'news_005',
    title: 'Bulut Bilişim Hizmetlerinde Son Gelişmeler',
    imageUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Bulut bilişim, işletmelerin dijital dönüşüm süreçlerinde vazgeçilmez bir rol oynamaya devam ediyor. Hibrit bulut çözümleri, çoklu bulut stratejileri ve sunucusuz mimariler, şirketlere daha fazla esneklik ve ölçeklenebilirlik sunuyor. Veri güvenliği ve uyumluluk, bulut hizmetlerinin benimsenmesinde en kritik faktörler arasında yer alıyor.</p><p>Edge computing (uç bilişim) ve yapay zeka destekli bulut hizmetleri, verilerin daha hızlı işlenmesini ve analiz edilmesini sağlıyor. Bu gelişmeler, özellikle büyük veri ve IoT uygulamaları için yeni fırsatlar yaratıyor. Bulut bilişim pazarının önümüzdeki yıllarda da güçlü bir büyüme göstermesi bekleniyor.</p>',
    contentStatus: 'Archived',
    contentType: 'Article',
    readingDuration: 9,
    publishedDate: new Date('2023-11-28T16:45:00Z'),
    authorId: 'author_003',
    sourceId: 'source_001',
    categoryId: 'cat_001',
    tags: [{ id: 'tag_024', name: 'teknoloji' }],
    featured: false
  },
  {
    id: 'news_006',
    title: 'E-ticaret Sektöründe Dijital Dönüşüm',
    imageUrl: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>E-ticaret sektörü, dijital dönüşümle birlikte hızla evriliyor. Kişiselleştirilmiş alışveriş deneyimleri, yapay zeka destekli müşteri hizmetleri ve mobil ticaretin yükselişi, tüketicilerin beklentilerini değiştiriyor. Sosyal ticaret ve canlı yayın alışverişi gibi yeni kanallar, markaların müşterilerle etkileşim kurma biçimlerini dönüştürüyor.</p><p>Tedarik zinciri optimizasyonu, hızlı teslimat seçenekleri ve sürdürülebilirlik uygulamaları, e-ticaret şirketleri için rekabet avantajı sağlıyor. Veri analizi ve büyük veri kullanımı, müşteri davranışlarını anlamak ve pazarlama stratejilerini optimize etmek için kritik öneme sahip. E-ticaretin geleceği, daha entegre, kişiselleştirilmiş ve veriye dayalı deneyimler sunmaya odaklanacak.</p>',
    contentStatus: 'Draft',
    contentType: 'Blog',
    readingDuration: 4,
    publishedDate: new Date('2023-12-05T08:30:00Z'),
    authorId: 'author_002',
    sourceId: 'source_005',
    categoryId: 'cat_002',
    tags: [{ id: 'tag_025', name: 'dijital-dönüşüm' }],
    featured: false
  },
  {
    id: 'news_007',
    title: 'Yenilenebilir Enerji Kaynakları ve Geleceği',
    imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Yenilenebilir enerji kaynakları, küresel enerji dönüşümünün merkezinde yer alıyor. Güneş, rüzgar, hidroelektrik ve jeotermal enerji, fosil yakıtlara olan bağımlılığı azaltarak iklim değişikliğiyle mücadelede kilit rol oynuyor. Enerji depolama teknolojilerindeki gelişmeler, yenilenebilir enerjinin sürekliliğini sağlamak için hayati önem taşıyor.</p><p>Akıllı şebekeler ve enerji verimliliği uygulamaları, enerji tüketimini optimize ederek sürdürülebilir bir gelecek inşa etmeye yardımcı oluyor. Hükümetler ve özel sektör, yenilenebilir enerji yatırımlarını artırarak bu alandaki büyümeyi destekliyor. Temiz enerjiye geçiş, hem çevresel hem de ekonomik faydalar sunuyor.</p>',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 6,
    publishedDate: new Date('2023-12-06T10:00:00Z'),
    authorId: 'author_005',
    sourceId: 'source_002',
    categoryId: 'cat_006',
    tags: [{ id: 'tag_006', name: 'enerji' }, { id: 'tag_007', name: 'çevre' }],
    featured: false
  },
  {
    id: 'news_008',
    title: 'Finansal Teknolojilerde İnovasyon',
    imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Finansal teknolojiler (FinTech), bankacılık, ödeme sistemleri ve yatırım alanlarında devrim yaratıyor. Mobil bankacılık uygulamaları, yapay zeka destekli finansal danışmanlık ve blok zinciri tabanlı ödeme çözümleri, tüketicilere daha hızlı, güvenli ve erişilebilir hizmetler sunuyor. Geleneksel finans kurumları da bu yeniliklere ayak uydurarak dijitalleşme süreçlerini hızlandırıyor.</p><p>Regülasyon teknolojileri (RegTech) ve siber güvenlik, FinTech sektörünün büyümesi için kritik öneme sahip. Açık bankacılık (Open Banking) ve API entegrasyonları, farklı finansal hizmetlerin bir araya gelmesini sağlayarak yeni iş modelleri yaratıyor. FinTech, gelecekte finansal hizmetlerin daha kapsayıcı ve verimli hale gelmesine öncülük edecek.</p>',
    contentStatus: 'Published',
    contentType: 'Article',
    readingDuration: 7,
    publishedDate: new Date('2023-12-07T11:30:00Z'),
    authorId: 'author_006',
    sourceId: 'source_004',
    categoryId: 'cat_002',
    tags: [{ id: 'tag_008', name: 'finans' }, { id: 'tag_024', name: 'teknoloji' }],
    featured: false
  },
  {
    id: 'news_009',
    title: 'Uzay Keşiflerinde Yeni Ufuklar',
    imageUrl: 'https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Uzay keşifleri, insanlığın sınırlarını zorlamaya devam ediyor. Mars\'a insanlı görevler, Ay\'da kalıcı üsler kurma projeleri ve uzay turizminin gelişimi, bu alandaki heyecanı artırıyor. Özel şirketlerin uzay sektörüne girişi, inovasyonu hızlandırarak maliyetleri düşürüyor ve erişilebilirliği artırıyor.</p><p>Uzay teleskopları sayesinde evrenin derinlikleri hakkında yeni bilgiler edinilirken, uydu teknolojileri iletişim, navigasyon ve iklim gözlemi gibi alanlarda kritik rol oynuyor. Uzay madenciliği ve asteroitlerden kaynak çıkarma potansiyeli, gelecekteki uzay ekonomisi için yeni kapılar açıyor. Uzay keşifleri, bilimsel ilerlemenin yanı sıra insanlığın merakını ve keşfetme arzusunu da besliyor.</p>',
    contentStatus: 'Draft',
    contentType: 'Blog',
    readingDuration: 5,
    publishedDate: new Date('2023-12-08T09:00:00Z'),
    authorId: 'author_007',
    sourceId: 'source_003',
    categoryId: 'cat_006',
    tags: [{ id: 'tag_009', name: 'uzay' }, { id: 'tag_010', name: 'bilim' }],
    featured: false
  },
  {
    id: 'news_010',
    title: 'Geleceğin Şehirleri: Akıllı Kent Teknolojileri',
    imageUrl: 'https://images.pexels.com/photos/262919/pexels-photo-262919.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Akıllı kent teknolojileri, şehirlerin daha yaşanabilir, sürdürülebilir ve verimli hale gelmesini sağlıyor. Akıllı ulaşım sistemleri, enerji yönetimi, atık toplama ve güvenlik çözümleri, şehir sakinlerinin yaşam kalitesini artırıyor. IoT sensörleri ve büyük veri analizi, şehir yöneticilerine gerçek zamanlı bilgiler sunarak daha iyi kararlar almalarına yardımcı oluyor.</p><p>Yapay zeka destekli trafik yönetimi, akıllı aydınlatma sistemleri ve dijital vatandaşlık platformları, şehir hizmetlerini optimize ediyor. Akıllı kentler, çevresel sürdürülebilirliği desteklerken, aynı zamanda ekonomik büyümeyi ve sosyal kapsayıcılığı teşvik ediyor. Geleceğin şehirleri, teknoloji ve insan odaklı tasarımın birleşimiyle şekillenecek.</p>',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 6,
    publishedDate: new Date('2023-12-09T13:00:00Z'),
    authorId: 'author_001',
    sourceId: 'source_001',
    categoryId: 'cat_001',
    tags: [{ id: 'tag_011', name: 'akıllı-şehir' }, { id: 'tag_024', name: 'teknoloji' }],
    featured: false
  },
  {
    id: 'news_011',
    title: 'Yeşil Enerjiye Geçişte Yeni Adımlar',
    imageUrl: 'https://images.pexels.com/photos/159397/pexels-photo-159397.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Yeşil enerjiye geçiş, küresel iklim hedeflerine ulaşmak için atılan önemli adımlardan biri. Güneş panelleri, rüzgar türbinleri ve hidrojen enerjisi gibi temiz enerji teknolojileri, enerji üretiminde karbon ayak izini azaltıyor. Enerji depolama çözümleri, yenilenebilir kaynaklardan elde edilen enerjinin daha verimli kullanılmasını sağlıyor.</p><p>Elektrikli araçların yaygınlaşması ve enerji verimliliği uygulamaları, enerji talebini düşürerek sürdürülebilir bir enerji sistemi oluşturmaya katkıda bulunuyor. Hükümetler ve uluslararası kuruluşlar, yeşil enerji yatırımlarını teşvik ederek bu alandaki dönüşümü hızlandırıyor. Temiz enerji, hem çevre koruma hem de enerji bağımsızlığı açısından stratejik bir öneme sahip.</p>',
    contentStatus: 'Published',
    contentType: 'Article',
    readingDuration: 8,
    publishedDate: new Date('2023-12-10T15:45:00Z'),
    authorId: 'author_005',
    sourceId: 'source_002',
    categoryId: 'cat_006',
    tags: [{ id: 'tag_012', name: 'yeşil-enerji' }, { id: 'tag_007', name: 'çevre' }],
    featured: false
  },
  {
    id: 'news_012',
    title: 'Metaverse ve Sanal Gerçeklik Deneyimleri',
    imageUrl: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Metaverse ve sanal gerçeklik (VR) teknolojileri, dijital dünyada yeni deneyimler sunuyor. Sanal toplantılar, eğitim simülasyonları, oyunlar ve sosyal etkileşimler, metaverse platformlarında giderek daha gerçekçi hale geliyor. Artırılmış gerçeklik (AR) ise fiziksel dünyayı dijital içeriklerle zenginleştirerek yeni kullanım alanları yaratıyor.</p><p>Bu teknolojiler, eğlence, eğitim, sağlık ve perakende gibi birçok sektörde dönüştürücü bir potansiyele sahip. VR başlıkları ve AR gözlükleri gibi donanımların gelişimi, kullanıcı deneyimini iyileştiriyor. Metaverse\'in geleceği, daha sürükleyici ve etkileşimli dijital ortamlar yaratma üzerine kurulu olacak.</p>',
    contentStatus: 'Draft',
    contentType: 'Blog',
    readingDuration: 7,
    publishedDate: new Date('2023-12-11T10:30:00Z'),
    authorId: 'author_007',
    sourceId: 'source_003',
    categoryId: 'cat_001',
    tags: [{ id: 'tag_013', name: 'metaverse' }, { id: 'tag_014', name: 'sanal-gerçeklik' }],
    featured: false
  },
  {
    id: 'news_013',
    title: 'Kuantum Bilgisayarların Geleceği',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Kuantum bilgisayarlar, geleneksel bilgisayarların çözemediği karmaşık problemleri çözme potansiyeliyle bilim ve teknoloji dünyasında büyük heyecan yaratıyor. Kuantum süperpozisyonu ve dolanıklık gibi prensiplere dayanan bu yeni nesil bilgisayarlar, ilaç keşfi, malzeme bilimi, finansal modelleme ve yapay zeka gibi alanlarda çığır açabilir.</p><p>Henüz geliştirme aşamasında olsalar da, kuantum bilgisayarların gelecekte şifreleme, optimizasyon ve büyük veri analizi gibi konularda devrim yaratması bekleniyor. Küresel çapta birçok araştırma kurumu ve teknoloji şirketi, kuantum bilişim alanındaki çalışmaları hızlandırıyor. Bu teknoloji, bilimsel keşiflerin ve teknolojik ilerlemelerin yeni bir çağına işaret ediyor.</p>',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 9,
    publishedDate: new Date('2023-12-12T14:00:00Z'),
    authorId: 'author_004',
    sourceId: 'source_003',
    categoryId: 'cat_006',
    tags: [{ id: 'tag_015', name: 'kuantum' }, { id: 'tag_016', name: 'bilgisayar' }, { id: 'tag_010', name: 'bilim' }],
    featured: false
  },
  {
    id: 'news_014',
    title: 'Biyoteknolojideki Son Yenilikler',
    imageUrl: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Biyoteknoloji, gen düzenleme, sentetik biyoloji ve biyoinformatik gibi alanlardaki yeniliklerle sağlık, tarım ve çevre sektörlerinde büyük dönüşümler yaratıyor. CRISPR gibi gen düzenleme araçları, genetik hastalıkların tedavisi ve bitki ıslahında yeni kapılar açıyor. Biyolojik ilaçlar ve kişiselleştirilmiş tıp, hastalıklarla mücadelede daha etkili çözümler sunuyor.</p><p>Biyoteknoloji, aynı zamanda sürdürülebilir üretim süreçleri ve biyoyakıt geliştirme gibi çevresel sorunlara da çözümler sunuyor. Etik ve biyogüvenlik konuları, bu alandaki araştırmaların ve uygulamaların önemli bir parçası. Biyoteknolojinin geleceği, insan sağlığını iyileştirme, gıda güvenliğini sağlama ve çevreyi koruma potansiyeliyle dolu.</p>',
    contentStatus: 'Archived',
    contentType: 'Article',
    readingDuration: 10,
    publishedDate: new Date('2023-12-13T11:00:00Z'),
    authorId: 'author_006',
    sourceId: 'source_004',
    categoryId: 'cat_006',
    tags: [{ id: 'tag_017', name: 'biyoteknoloji' }, { id: 'tag_010', name: 'bilim' }],
    featured: false
  },
  {
    id: 'news_015',
    title: 'Uzaktan Çalışma Kültürünün Evrimi',
    imageUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Uzaktan çalışma, küresel çapta iş yapış biçimlerini kökten değiştirdi. Esnek çalışma saatleri, coğrafi bağımsızlık ve iş-yaşam dengesi, uzaktan çalışmanın sunduğu başlıca avantajlar arasında yer alıyor. Video konferans araçları, bulut tabanlı işbirliği platformları ve proje yönetim yazılımları, uzaktan ekiplerin verimli çalışmasını sağlıyor.</p><p>Ancak, uzaktan çalışmanın getirdiği zorluklar da bulunuyor; bunlar arasında ekip içi iletişimin sürdürülmesi, motivasyonun korunması ve siber güvenlik riskleri yer alıyor. Şirketler, hibrit çalışma modellerini benimseyerek hem ofis ortamının faydalarını hem de uzaktan çalışmanın esnekliğini bir araya getirmeye çalışıyor. Uzaktan çalışma kültürü, gelecekte de iş dünyasının önemli bir parçası olmaya devam edecek.</p>',
    contentStatus: 'Published',
    contentType: 'Blog',
    readingDuration: 5,
    publishedDate: new Date('2023-12-14T09:30:00Z'),
    authorId: 'author_001',
    sourceId: 'source_005',
    categoryId: 'cat_005',
    tags: [{ id: 'tag_018', name: 'uzaktan-çalışma' }, { id: 'tag_019', name: 'iş-hayatı' }],
    featured: false
  },
  {
    id: 'news_016',
    title: 'Sürdürülebilir Tarım Uygulamaları',
    imageUrl: 'https://images.pexels.com/photos/3861970/pexels-photo-3861970.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Sürdürülebilir tarım uygulamaları, gıda güvenliğini sağlarken çevresel etkiyi minimize etmeyi hedefliyor. Organik tarım, dikey tarım, hassas tarım ve su tasarrufu sağlayan sulama teknikleri, toprağın sağlığını koruyarak verimliliği artırıyor. Biyoçeşitliliğin korunması ve kimyasal gübre kullanımının azaltılması, ekosistemlerin dengesini destekliyor.</p><p>Akıllı tarım teknolojileri, sensörler, dronlar ve yapay zeka kullanarak çiftçilere daha bilinçli kararlar alma imkanı sunuyor. Tüketicilerin sürdürülebilir gıdalara olan talebi arttıkça, tarım sektöründe de bu yönde dönüşümler hızlanıyor. Sürdürülebilir tarım, gelecek nesiller için sağlıklı gıda üretimi ve doğal kaynakların korunması açısından kritik öneme sahip.</p>',
    contentStatus: 'Published',
    contentType: 'News',
    readingDuration: 6,
    publishedDate: new Date('2023-12-15T10:00:00Z'),
    authorId: 'author_005',
    sourceId: 'source_002',
    categoryId: 'cat_005',
    tags: [{ id: 'tag_020', name: 'tarım' }, { id: 'tag_021', name: 'sürdürülebilirlik' }],
    featured: false
  },
  {
    id: 'news_017',
    title: 'Yapay Zeka Destekli Sağlık Çözümleri',
    imageUrl: 'https://images.pexels.com/photos/3861971/pexels-photo-3861971.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Yapay zeka destekli sağlık çözümleri, tıp alanında devrim niteliğinde yenilikler sunuyor. Hastalık teşhisi, ilaç geliştirme, kişiselleştirilmiş tedavi planları ve cerrahi robotlar, yapay zekanın sağlık sektöründeki başlıca uygulama alanları arasında yer alıyor. Büyük veri analizi, doktorlara daha doğru ve hızlı kararlar alma imkanı sağlıyor.</p><p>Teletıp ve uzaktan hasta takibi, sağlık hizmetlerinin daha erişilebilir ve verimli hale gelmesine katkıda bulunuyor. Etik ve veri gizliliği konuları, yapay zekanın sağlıkta kullanımında büyük önem taşıyor. Yapay zeka, gelecekte sağlık hizmetlerinin kalitesini artırarak daha sağlıklı bir toplum inşa etmeye yardımcı olacak.</p>',
    contentStatus: 'Draft',
    contentType: 'Article',
    readingDuration: 8,
    publishedDate: new Date('2023-12-16T14:30:00Z'),
    authorId: 'author_003',
    sourceId: 'source_001',
    categoryId: 'cat_003',
    tags: [{ id: 'tag_022', name: 'sağlık' }, { id: 'tag_001', name: 'yapay-zeka' }],
    featured: false
  },
  {
    id: 'news_018',
    title: 'Eğitim Teknolojilerinde İnovasyon',
    imageUrl: 'https://images.pexels.com/photos/3861973/pexels-photo-3861973.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    contentText: '<p>Eğitim teknolojileri (EdTech), öğrenme deneyimlerini dönüştürerek daha etkileşimli ve kişiselleştirilmiş hale getiriyor. Çevrimiçi öğrenme platformları, yapay zeka destekli öğrenme asistanları, sanal ve artırılmış gerçeklik uygulamaları, öğrencilere yeni öğrenme yolları sunuyor. Uzaktan eğitim, küresel çapta eğitime erişimi artırıyor.</p><p>Oyunlaştırma (gamification) ve adaptif öğrenme sistemleri, öğrencilerin motivasyonunu artırarak öğrenme süreçlerini daha keyifli hale getiriyor. Veri analizi, öğrencilerin performansını takip etmek ve öğrenme materyallerini optimize etmek için kullanılıyor. Eğitim teknolojileri, gelecekte eğitimin daha esnek, kapsayıcı ve öğrenci odaklı olmasına öncülük edecek.</p>',
    contentStatus: 'Published',
    contentType: 'Blog',
    readingDuration: 7,
    publishedDate: new Date('2023-12-17T09:15:00Z'),
    authorId: 'author_002',
    sourceId: 'source_004',
    categoryId: 'cat_007',
    tags: [{ id: 'tag_023', name: 'eğitim' }, { id: 'tag_024', name: 'teknoloji' }],
    featured: false
  },
]

// Initialize Tiptap editor
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Haber içeriğini buraya yazın...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[250px] text-foreground',
    },
  },
  onUpdate: ({ editor }) => {
    newsData.value.contentText = editor.getHTML()
  },
})

const showNotification = (message, type) => {
  notification.value = { message, type }
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = setTimeout(() => hideNotification(), 5000)
}

const hideNotification = () => {
  notification.value = { message: '', type: '' }
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
    notificationTimeout = null
  }
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      newsData.value.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    selectedFile.value = null;
    newsData.value.imageUrl = '';
  }
};

watch(imageUploadMethod, (newMethod) => {
  if (newMethod === 'url') {
    selectedFile.value = null;
  } else if (newMethod === 'file') {
    newsData.value.imageUrl = '';
  }
});

const saveNews = async () => {
  if (!newsData.value.title.trim()) {
    showNotification('Haber başlığı gereklidir.', 'error')
    return
  }

  if (!newsData.value.contentText.trim()) {
    showNotification('Haber içeriği gereklidir.', 'error')
    return
  }

  if (!newsData.value.imageUrl) {
    showNotification('Haber görseli gereklidir.', 'error')
    return
  }

  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real application, you would send newsData to your API to update the news item
    console.log('Haber güncelleniyor:', newsData.value);

    const action = newsData.value.contentStatus === 'Published' ? 'yayınlandı' : 'kaydedildi'
    showNotification(`Haber başarıyla ${action}!`, 'success')
    
    setTimeout(() => {
      navigateTo('/cms/news')
    }, 1500)
  } catch (error) {
    showNotification('Haber kaydedilirken hata oluştu.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  const newsId = route.params.id;
  if (newsId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
      const foundNews = mockNews.find(n => n.id === newsId);
      if (foundNews) {
        // Deep copy to avoid modifying mock data directly
        newsData.value = JSON.parse(JSON.stringify(foundNews));
        // Ensure publishedDate is a Date object
        newsData.value.publishedDate = new Date(newsData.value.publishedDate);
        // Set editor content
        if (editor.value) {
          editor.value.commands.setContent(newsData.value.contentText);
        }
        // Determine image upload method based on imageUrl (simple heuristic)
        if (newsData.value.imageUrl && newsData.value.imageUrl.startsWith('data:')) {
          imageUploadMethod.value = 'file';
          // For a real app, you'd need to handle re-uploading or displaying the original file name
        } else {
          imageUploadMethod.value = 'url';
        }
      } else {
        showNotification('Düzenlenecek haber bulunamadı.', 'error');
      }
    } catch (error) {
      console.error('Haber yüklenirken hata oluştu:', error);
      showNotification('Haber yüklenirken hata oluştu.', 'error');
    } finally {
      isLoadingInitial.value = false;
    }
  } else {
    isLoadingInitial.value = false; // No ID, so no initial loading needed
    showNotification('Haber ID\'si bulunamadı.', 'error');
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
/* Tiptap Editor Styles */
:deep(.ProseMirror) {
  outline: none;
  padding: 1rem;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
  border-radius: 0 0 0.5rem 0.5rem;
  min-height: 250px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
  color: hsl(var(--foreground));
}

:deep(.ProseMirror h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.75rem 0 0.5rem 0;
  color: hsl(var(--foreground));
}

:deep(.ProseMirror p) {
  margin: 0.5rem 0;
  color: hsl(var(--foreground));
}

:deep(.ProseMirror ul, .ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

:deep(.ProseMirror li) {
  margin: 0.25rem 0;
  color: hsl(var(--foreground));
}
</style>
