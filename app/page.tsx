'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, Search, Filter, Heart, Lock, Globe,
  BookOpen, FileText, MessageSquare, Clock, User,
  Calendar, MapPin, Eye, EyeOff, Trash2, Edit3,
  Share2, Download, MoreVertical, ChevronDown
} from 'lucide-react'

interface Story {
  id: string
  title: string
  content: string
  author: string
  date: string
  category: 'stories' | 'letters' | 'reports' | 'poems' | 'memories'
  likes: number
  isEncrypted: boolean
  location?: string
  tags: string[]
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([])
  const [newStory, setNewStory] = useState({ title: '', content: '', category: 'stories' as const })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [likedStories, setLikedStories] = useState<string[]>([])
  const [showEncryptedOnly, setShowEncryptedOnly] = useState(false)

  const categories = [
    { id: 'all', label: 'Всі історії', icon: BookOpen, count: 0 },
    { id: 'stories', label: 'Історії', icon: BookOpen, count: 0 },
    { id: 'letters', label: 'Листи', icon: FileText, count: 0 },
    { id: 'reports', label: 'Звіти', icon: FileText, count: 0 },
    { id: 'poems', label: 'Вірші', icon: MessageSquare, count: 0 },
    { id: 'memories', label: 'Спогади', icon: Clock, count: 0 },
  ]

  const addStory = () => {
    if (!newStory.title.trim() || !newStory.content.trim()) return
    
    const story: Story = {
      id: Date.now().toString(),
      title: newStory.title,
      content: newStory.content,
      author: 'Анонімний автор',
      date: new Date().toLocaleDateString('uk-UA'),
      category: newStory.category,
      likes: 0,
      isEncrypted: Math.random() > 0.5,
      tags: ['війна', 'Україна', 'пам\'ять'],
    }
    
    setStories([story, ...stories])
    setNewStory({ title: '', content: '', category: 'stories' })
  }

  const toggleLike = (id: string) => {
    setLikedStories(prev => 
      prev.includes(id) 
        ? prev.filter(storyId => storyId !== id)
        : [...prev, id]
    )
    
    setStories(prev => prev.map(story => 
      story.id === id 
        ? { ...story, likes: likedStories.includes(id) ? story.likes - 1 : story.likes + 1 }
        : story
    ))
  }

  const filteredStories = stories.filter(story => {
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEncryption = !showEncryptedOnly || story.isEncrypted
    
    return matchesCategory && matchesSearch && matchesEncryption
  })

  return (
    <div className="min-h-screen bg-zhuk-bg-primary">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3">
        <nav className="zhuk-breadcrumb">
          <a href="#" className="zhuk-breadcrumb-item">Openclaw_vps_server</a>
          <span className="zhuk-breadcrumb-separator">›</span>
          <span className="zhuk-breadcrumb-item">OPE-6 War Stories MVP</span>
        </nav>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-zhuk-page-title font-bold text-zhuk-text-primary mb-2">
              📖 War Stories MVP
            </h1>
            <p className="text-zhuk-body text-zhuk-text-secondary">
              Зберігайте та діліться історіями про війну в Україні
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="zhuk-btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Нова історія</span>
            </button>
            <button className="zhuk-btn-ghost flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Експорт</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="zhuk-card">
            <div className="flex items-center justify-between mb-3">
              <BookOpen className="h-5 w-5 text-zhuk-accent-primary" />
              <span className="text-zhuk-xs text-zhuk-accent-success">+12%</span>
            </div>
            <div className="text-zhuk-xxs text-zhuk-text-tertiary uppercase tracking-wide mb-1">
              Всього історій
            </div>
            <div className="text-2xl font-bold text-zhuk-text-primary">
              {stories.length}
            </div>
          </div>
          
          <div className="zhuk-card">
            <div className="flex items-center justify-between mb-3">
              <Heart className="h-5 w-5 text-zhuk-accent-error" />
              <span className="text-zhuk-xs text-zhuk-accent-success">+8%</span>
            </div>
            <div className="text-zhuk-xxs text-zhuk-text-tertiary uppercase tracking-wide mb-1">
              Всього лайків
            </div>
            <div className="text-2xl font-bold text-zhuk-text-primary">
              {stories.reduce((sum, story) => sum + story.likes, 0)}
            </div>
          </div>
          
          <div className="zhuk-card">
            <div className="flex items-center justify-between mb-3">
              <Lock className="h-5 w-5 text-zhuk-accent-warning" />
              <span className="text-zhuk-xs text-zhuk-accent-success">+5%</span>
            </div>
            <div className="text-zhuk-xxs text-zhuk-text-tertiary uppercase tracking-wide mb-1">
              Зашифровано
            </div>
            <div className="text-2xl font-bold text-zhuk-text-primary">
              {stories.filter(s => s.isEncrypted).length}
            </div>
          </div>
          
          <div className="zhuk-card">
            <div className="flex items-center justify-between mb-3">
              <User className="h-5 w-5 text-zhuk-accent-info" />
              <span className="text-zhuk-xs text-zhuk-accent-success">+15%</span>
            </div>
            <div className="text-zhuk-xxs text-zhuk-text-tertiary uppercase tracking-wide mb-1">
              Авторів
            </div>
            <div className="text-2xl font-bold text-zhuk-text-primary">
              {new Set(stories.map(s => s.author)).size}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zhuk-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Пошук історій..."
                className="w-full pl-10 pr-4 py-2.5 bg-zhuk-bg-primary border border-zhuk-border-primary rounded-lg text-zhuk-body text-zhuk-text-primary placeholder-zhuk-text-quaternary focus:outline-none focus:border-zhuk-accent-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowEncryptedOnly(!showEncryptedOnly)}
                className={`zhuk-toggle ${showEncryptedOnly ? 'zhuk-toggle-on' : ''}`}
              >
                <div className="zhuk-toggle-handle" />
              </button>
              <span className="text-zhuk-small text-zhuk-text-tertiary">
                Тільки зашифровані
              </span>
            </div>
            <button className="zhuk-btn-ghost flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Фільтри</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="text-zhuk-xs text-zhuk-text-tertiary uppercase tracking-wide mb-2">
            Категорії
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg border text-zhuk-button transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'border-zhuk-accent-primary bg-zhuk-accent-primary/10 text-zhuk-accent-primary'
                    : 'border-zhuk-border-primary bg-zhuk-bg-primary text-zhuk-text-tertiary hover:bg-zhuk-bg-secondary hover:text-zhuk-text-secondary'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.label}</span>
                <span className={`text-zhuk-xs px-1.5 py-0.5 rounded ${
                  selectedCategory === category.id
                    ? 'bg-zhuk-accent-primary/20'
                    : 'bg-zhuk-bg-tertiary'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* New Story Form */}
        <div className="zhuk-card mb-8">
          <h3 className="text-zhuk-section-heading font-semibold text-zhuk-text-primary mb-4">
            Додати нову історію
          </h3>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={newStory.title}
                onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                placeholder="Заголовок історії..."
                className="w-full px-4 py-2.5 bg-zhuk-bg-primary border border-zhuk-border-primary rounded-lg text-zhuk-body text-zhuk-text-primary placeholder-zhuk-text-quaternary focus:outline-none focus:border-zhuk-accent-primary"
              />
            </div>
            <div>
              <textarea
                value={newStory.content}
                onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                placeholder="Текст історії..."
                rows={4}
                className="w-full px-4 py-2.5 bg-zhuk-bg-primary border border-zhuk-border-primary rounded-lg text-zhuk-body text-zhuk-text-primary placeholder-zhuk-text-quaternary focus:outline-none focus:border-zhuk-accent-primary resize-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select
                  value={newStory.category}
                  onChange={(e) => setNewStory({...newStory, category: e.target.value as any})}
                  className="bg-zhuk-bg-primary border border-zhuk-border-primary rounded-lg px-3 py-1.5 text-zhuk-body text-zhuk-text-primary focus:outline-none focus:border-zhuk-accent-primary"
                >
                  <option value="stories">Історії</option>
                  <option value="letters">Листи</option>
                  <option value="reports">Звіти</option>
                  <option value="poems">Вірші</option>
                  <option value="memories">Спогади</option>
                </select>
                <div className="flex items-center gap-2">
                  <button className="zhuk-toggle">
                    <div className="zhuk-toggle-handle" />
                  </button>
                  <span className="text-zhuk-small text-zhuk-text-tertiary">
                    Зашифрувати
                  </span>
                </div>
              </div>
              <button
                onClick={addStory}
                disabled={!newStory.title.trim() || !newStory.content.trim()}
                className="zhuk-btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Опублікувати
              </button>
            </div>
          </div>
        </div>

        {/* Stories List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zhuk-section-heading font-semibold text-zhuk-text-primary">
              Історії
            </h3>
            <div className="text-zhuk-xs text-zhuk-text-tertiary">
              {filteredStories.length} з {stories.length}
            </div>
          </div>

          {filteredStories.length === 0 ? (
            <div className="zhuk-card text-center py-12">
              <BookOpen className="h-12 w-12 text-zhuk-text-tertiary mx-auto mb-4" />
              <h4 className="text-zhuk-body font-medium text-zhuk-text-primary mb-2">
                Історій не знайдено
              </h4>
              <p className="text-zhuk-small text-zhuk-text-tertiary max-w-md mx-auto mb-4">
                Додайте першу історію або змініть фільтри
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                  setShowEncryptedOnly(false)
                }}
                className="zhuk-btn-ghost"
              >
                <Filter className="h-4 w-4 mr-2" />
                Скинути фільтри
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStories.map((story) => (
                <div key={story.id} className="zhuk-issue-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-zhuk-xs px-2 py-0.5 rounded bg-zhuk-bg-tertiary">
                          {categories.find(c => c.id === story.category)?.label}
                        </div>
                        {story.isEncrypted && (
                          <div className="flex items-center gap-1 text-zhuk-xs text-zhuk-accent-warning">
                            <Lock className="h-3 w-3" />
                            <span>Зашифровано</span>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="text-zhuk-card-title font-medium text-zhuk-text-primary mb-2">
                        {story.title}
                      </h4>
                      
                      <p className="text-zhuk-small text-zhuk-text-secondary line-clamp-2 mb-3">
                        {story.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-zhuk-xs text-zhuk-text-tertiary">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{story.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{story.date}</span>
                        </div>
                        {story.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{story.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleLike(story.id)}
                        className={`p-1.5 rounded-lg flex items-center gap-1 ${
                          likedStories.includes(story.id)
                            ? 'bg-zhuk-accent-error/10 text-zhuk-accent-error'
                            : 'hover:bg-zhuk-bg-tertiary text-zhuk-text-tertiary'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedStories.includes(story.id) ? 'fill-current' : ''}`} />
                        <span className="text-zhuk-xs">{story.likes}</span>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-zhuk-bg-tertiary text-zhuk-text-tertiary">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-zhuk-bg-tertiary text-zhuk-text-tertiary">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zhuk-border-primary">
                    <div className="flex items-center gap-3">
                      <button className="zhuk-btn-ghost text-zhuk-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Переглянути
                      </button>
                      <button className="zhuk-btn-ghost text-zhuk-xs">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Редагувати
                      </button>
                      <button className="zhuk-btn-ghost text-zhuk-xs text-zhuk-accent-error">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Видалити
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {story.tags.map((tag, index) => (
                        <span key={index} className="text-zhuk-xs px-2 py-0.5 rounded bg-zhuk-bg-tertiary text-zhuk-text-tertiary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}