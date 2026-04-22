'use client'

import { useState, useEffect } from 'react'
import { BookOpen, PenLine, Archive, Heart, Search, Plus, X, Clock, Eye, ChevronRight, User, Calendar, MessageSquare, Shield } from 'lucide-react'

interface Story {
  id: string
  title: string
  author: string
  date: string
  content: string
  category: string
  likes: number
  views: number
  encrypted: boolean
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([])
  const [showNewStory, setShowNewStory] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [newStory, setNewStory] = useState({ title: '', author: '', content: '', category: 'story' })

  // Load stories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('war-stories')
    if (saved) {
      setStories(JSON.parse(saved))
    }
  }, [])

  // Save stories to localStorage
  useEffect(() => {
    localStorage.setItem('war-stories', JSON.stringify(stories))
  }, [stories])

  const categories = [
    { id: 'all', label: 'Всі історії', icon: BookOpen },
    { id: 'story', label: 'Історії', icon: BookOpen },
    { id: 'letter', label: 'Листи', icon: PenLine },
    { id: 'archive', label: 'Архів', icon: Archive },
    { id: 'favorites', label: 'Збережене', icon: Heart },
  ]

  const storyCategories = [
    { id: 'story', label: '📖 Історія' },
    { id: 'letter', label: '✉️ Лист' },
    { id: 'report', label: '📋 Звіт' },
    { id: 'poem', label: '📝 Вірш' },
    { id: 'memory', label: '💭 Спогад' },
  ]

  const sampleStories: Story[] = [
    {
      id: '1',
      title: 'Перший бій під Бахмутом',
      author: 'Олександр М.',
      date: '2026-04-15',
      content: 'Той ранок був холодним. Туман стелився над полем, і ми знали, що сьогодні буде важкий день. О 5:30 почався артобстріл. Земля двигтіла під ногами...',
      category: 'story',
      likes: 234,
      views: 1542,
      encrypted: true,
    },
    {
      id: '2',
      title: 'Лист додому, грудень 2022',
      author: 'Віталій К.',
      date: '2026-04-10',
      content: 'Мамо, привіт! Сьогодні вперше за місяць зміг написати. У нас все добре, не хвилюйся. Хлопці передають вітання. Як там наш сад? Чи зацвіли вишні?...',
      category: 'letter',
      likes: 567,
      views: 3421,
      encrypted: true,
    },
    {
      id: '3',
      title: 'Порятунок побратима',
      author: 'Андрій Р.',
      date: '2026-04-08',
      content: 'Ми почули крик по рації. "Поранений! 300!" Далі не було часу думати. Я схопив аптечку і побіг під обстрілом. Кожна секунда мала значення...',
      category: 'story',
      likes: 891,
      views: 4567,
      encrypted: false,
    },
    {
      id: '4',
      title: 'Вірш про Маріуполь',
      author: 'Олена К.',
      date: '2026-04-05',
      content: 'Маріуполь, ти в серці назавжди,\nТвої вулиці у диму й біді.\nАзовське море пам\'ятає нас,\nІ наш останній, мужній час...',
      category: 'poem',
      likes: 1234,
      views: 8901,
      encrypted: false,
    },
    {
      id: '5',
      title: 'Звіт про евакуацію',
      author: 'Медична служба',
      date: '2026-04-03',
      content: 'За період з 01.03 по 31.03 було евакуйовано 47 поранених. 32 успішно доставлені до шпиталю. 15 отримали першу допомогу на місці...',
      category: 'report',
      likes: 345,
      views: 2134,
      encrypted: true,
    },
    {
      id: '6',
      title: 'Спогад про мирне життя',
      author: 'Ірина В.',
      date: '2026-04-01',
      content: 'Я згадую, як ми ходили до школи повз старі каштани. Вони цвіли так гарно навесні. Зараз на їх місці — окопи. Але ми відбудуємо все...',
      category: 'memory',
      likes: 678,
      views: 3456,
      encrypted: false,
    },
  ]

  const filteredStories = stories.length > 0
    ? stories.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.author.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'all' || s.category === activeCategory
        return matchesSearch && matchesCategory
      })
    : sampleStories.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.author.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'all' || s.category === activeCategory
        return matchesSearch && matchesCategory
      })

  const handleCreateStory = () => {
    if (!newStory.title || !newStory.content) return

    const story: Story = {
      id: Date.now().toString(),
      title: newStory.title,
      author: newStory.author || 'Анонімний автор',
      date: new Date().toISOString().split('T')[0],
      content: newStory.content,
      category: newStory.category,
      likes: 0,
      views: 0,
      encrypted: true,
    }

    setStories(prev => [story, ...prev])
    setNewStory({ title: '', author: '', content: '', category: 'story' })
    setShowNewStory(false)
  }

  const handleLike = (id: string) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s))
  }

  const handleDelete = (id: string) => {
    if (confirm('Видалити цю історію?')) {
      setStories(prev => prev.filter(s => s.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-linear-bg">
      {/* Header */}
      <header className="border-b border-linear-border bg-linear-bgSecondary">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-linear-accent/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-linear-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-linear-text">War Stories</h1>
                <p className="text-xs text-linear-textSecondary">Історії з війни</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-linear-textSecondary" />
                <input
                  type="text"
                  placeholder="Пошук історій..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-linear-bg border border-linear-border rounded-lg text-sm text-linear-text placeholder-linear-textSecondary focus:outline-none focus:border-linear-accent w-64"
                />
              </div>

              <button
                onClick={() => setShowNewStory(true)}
                className="flex items-center gap-2 px-4 py-2 bg-linear-accent text-white rounded-lg hover:bg-linear-accent/90 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Нова історія
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b border-linear-border bg-linear-bg">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1 py-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-linear-accent text-white'
                    : 'text-linear-textSecondary hover:text-linear-text hover:bg-linear-bgSecondary'
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-linear-bgSecondary border border-linear-border rounded-lg p-4">
            <div className="text-2xl font-bold text-linear-text">{filteredStories.length}</div>
            <div className="text-xs text-linear-textSecondary">Історій</div>
          </div>
          <div className="bg-linear-bgSecondary border border-linear-border rounded-lg p-4">
            <div className="text-2xl font-bold text-linear-text">
              {filteredStories.reduce((sum, s) => sum + s.likes, 0)}
            </div>
            <div className="text-xs text-linear-textSecondary">Вподобань</div>
          </div>
          <div className="bg-linear-bgSecondary border border-linear-border rounded-lg p-4">
            <div className="text-2xl font-bold text-linear-text">
              {filteredStories.reduce((sum, s) => sum + s.views, 0)}
            </div>
            <div className="text-xs text-linear-textSecondary">Переглядів</div>
          </div>
          <div className="bg-linear-bgSecondary border border-linear-border rounded-lg p-4">
            <div className="text-2xl font-bold text-linear-text">
              {filteredStories.filter(s => s.encrypted).length}
            </div>
            <div className="text-xs text-linear-textSecondary">Зашифровано</div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-linear-bgSecondary border border-linear-border rounded-lg p-5 hover:border-linear-accent transition-colors cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 rounded text-xs bg-linear-bg border border-linear-border text-linear-textSecondary">
                  {storyCategories.find(c => c.id === story.category)?.label || story.category}
                </span>
                {story.encrypted && (
                  <Shield className="h-4 w-4 text-linear-success" />
                )}
              </div>

              <h3 className="text-lg font-bold text-linear-text mb-2 line-clamp-2">{story.title}</h3>
              <p className="text-sm text-linear-textSecondary mb-4 line-clamp-3">{story.content}</p>

              <div className="flex items-center justify-between text-xs text-linear-textSecondary mt-auto">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {story.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {story.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLike(story.id) }}
                    className="flex items-center gap-1 hover:text-linear-error transition-colors"
                  >
                    <Heart className="h-3 w-3" />
                    {story.likes}
                  </button>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {story.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-16">
            <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-linear-bgSecondary border border-linear-border flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-linear-textSecondary" />
            </div>
            <h3 className="text-xl font-bold text-linear-text mb-2">Ще немає історій</h3>
            <p className="text-linear-textSecondary mb-6">Станьте першим, хто поділиться своєю історією</p>
            <button
              onClick={() => setShowNewStory(true)}
              className="px-6 py-3 bg-linear-accent text-white rounded-lg hover:bg-linear-accent/90 transition-colors"
            >
              Написати історію
            </button>
          </div>
        )}
      </main>

      {/* New Story Modal */}
      {showNewStory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowNewStory(false)}>
          <div className="bg-linear-bgSecondary border border-linear-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-linear-accent/10 flex items-center justify-center">
                  <PenLine className="h-6 w-6 text-linear-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-linear-text">Нова історія</h2>
                  <p className="text-xs text-linear-textSecondary">Поділіться своєю історією з іншими</p>
                </div>
              </div>
              <button onClick={() => setShowNewStory(false)} className="p-2 rounded-lg hover:bg-linear-bg transition-colors">
                <X className="h-5 w-5 text-linear-textSecondary" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-linear-text mb-2">Назва історії *</label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Введіть назву..."
                  className="w-full px-4 py-2.5 bg-linear-bg border border-linear-border rounded-lg text-linear-text placeholder-linear-textSecondary focus:outline-none focus:border-linear-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-linear-text mb-2">Автор</label>
                <input
                  type="text"
                  value={newStory.author}
                  onChange={(e) => setNewStory(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Ваше ім'я або псевдонім"
                  className="w-full px-4 py-2.5 bg-linear-bg border border-linear-border rounded-lg text-linear-text placeholder-linear-textSecondary focus:outline-none focus:border-linear-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-linear-text mb-2">Категорія</label>
                <select
                  value={newStory.category}
                  onChange={(e) => setNewStory(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-linear-bg border border-linear-border rounded-lg text-linear-text focus:outline-none focus:border-linear-accent"
                >
                  {storyCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-linear-text mb-2">Текст історії *</label>
                <textarea
                  value={newStory.content}
                  onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Напишіть свою історію..."
                  rows={8}
                  className="w-full px-4 py-2.5 bg-linear-bg border border-linear-border rounded-lg text-linear-text placeholder-linear-textSecondary focus:outline-none focus:border-linear-accent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreateStory}
                  disabled={!newStory.title || !newStory.content}
                  className="flex-1 px-6 py-3 bg-linear-accent text-white rounded-lg hover:bg-linear-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Опублікувати
                </button>
                <button
                  onClick={() => setShowNewStory(false)}
                  className="px-6 py-3 border border-linear-border text-linear-text rounded-lg hover:bg-linear-bg transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStory(null)}>
          <div className="bg-linear-bgSecondary border border-linear-border rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded text-sm bg-linear-bg border border-linear-border text-linear-textSecondary">
                  {storyCategories.find(c => c.id === selectedStory.category)?.label || selectedStory.category}
                </span>
                {selectedStory.encrypted && (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded text-sm bg-linear-success/10 text-linear-success">
                    <Shield className="h-4 w-4" />
                    Зашифровано
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedStory.id)}
                  className="p-2 rounded-lg hover:bg-linear-bg transition-colors text-linear-error"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-linear-text mb-4">{selectedStory.title}</h2>

            <div className="flex items-center gap-4 mb-6 text-sm text-linear-textSecondary">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {selectedStory.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {selectedStory.date}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {selectedStory.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {selectedStory.views}
              </span>
            </div>

            <div className="p-6 bg-linear-bg border border-linear-border rounded-lg mb-6">
              <p className="text-linear-text leading-relaxed whitespace-pre-line">{selectedStory.content}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { handleLike(selectedStory.id); setSelectedStory(prev => prev ? { ...prev, likes: prev.likes + 1 } : null) }}
                className="flex items-center gap-2 px-4 py-2 border border-linear-border rounded-lg hover:bg-linear-bg transition-colors text-linear-text"
              >
                <Heart className="h-4 w-4" />
                Вподобати ({selectedStory.likes})
              </button>
              <button
                onClick={() => setSelectedStory(null)}
                className="px-4 py-2 bg-linear-accent text-white rounded-lg hover:bg-linear-accent/90 transition-colors"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-linear-border mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-linear-textSecondary">
              <BookOpen className="h-4 w-4" />
              <span>War Stories — платформа для збереження історій про війну</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-linear-textSecondary">
              <span>© 2026 War Stories</span>
              <a href="#" className="hover:text-linear-text">Про проект</a>
              <a href="#" className="hover:text-linear-text">Політика</a>
              <a href="#" className="hover:text-linear-text">Контакти</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
