'use client'

import React, { useState } from 'react'
import { CVData, CVSection } from '@/types/cv'
import { 
  FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaSave,
  FaUser, FaBriefcase, FaGraduationCap, FaTools, FaLanguage, 
  FaCertificate, FaHeart, FaGripVertical,
  FaClock, FaStar, FaBuilding, FaCalendar, FaFileAlt, FaTrophy,
  FaHistory, FaCode, FaUsers, FaBook
} from 'react-icons/fa'
// import toast from 'react-hot-toast'

interface CVEditorProps {
  data: CVData
  onSave: (updatedData: CVData) => void
  onPrint: (e: React.MouseEvent) => void
  isAuthenticated: boolean
}

// Section configuration
const SECTIONS = [
  { id: 'summary', name: 'Professional Summary', icon: FaUser, type: 'text' },
  { id: 'experience', name: 'Work Experience', icon: FaBriefcase, type: 'list' },
  { id: 'education', name: 'Education', icon: FaGraduationCap, type: 'list' },
  { id: 'skills', name: 'Skills', icon: FaTools, type: 'simple' },
  { id: 'languages', name: 'Languages', icon: FaLanguage, type: 'simple' },
  { id: 'certifications', name: 'Certifications', icon: FaCertificate, type: 'list' },
  { id: 'projects', name: 'Projects', icon: FaBriefcase, type: 'list' },
  { id: 'hobbies', name: 'Hobbies & Interests', icon: FaHeart, type: 'simple' },
  // Additional Basic CV Builder fields
  { id: 'experienceYears', name: 'Experience Years', icon: FaClock, type: 'text' },
  { id: 'topStrengths', name: 'Top Strengths', icon: FaStar, type: 'simple' },
  { id: 'currentCompany', name: 'Current Company', icon: FaBuilding, type: 'text' },
  { id: 'currentRoleStartDate', name: 'Current Role Start Date', icon: FaCalendar, type: 'text' },
  { id: 'currentRoleDescription', name: 'Current Role Description', icon: FaFileAlt, type: 'text' },
  { id: 'currentAchievements', name: 'Current Achievements', icon: FaTrophy, type: 'text' },
  { id: 'previousExperience', name: 'Previous Experience', icon: FaHistory, type: 'text' },
  { id: 'technicalSkills', name: 'Technical Skills', icon: FaCode, type: 'simple' },
  { id: 'softSkills', name: 'Soft Skills', icon: FaUsers, type: 'simple' },
  { id: 'interests', name: 'Interests', icon: FaHeart, type: 'simple' }
]

export default function CVEditor({ data, onSave, onPrint, isAuthenticated }: CVEditorProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})

  // Handle header field changes
  const handleHeaderChange = (field: string, value: string) => {
    const updatedData = { ...data }
    
    if (field === 'fullName') {
      updatedData.fullName = value
    } else if (field === 'preferredName') {
      updatedData.preferredName = value
    } else if (field === 'title') {
      updatedData.title = value
    } else if (['email', 'phone', 'location'].includes(field)) {
      updatedData.contact = { ...updatedData.contact, [field]: value }
    } else if (['linkedin', 'website'].includes(field)) {
      updatedData.social = { ...updatedData.social, [field]: value }
    } else if (['experienceYears', 'topStrengths', 'currentCompany', 'currentRoleStartDate', 
                'currentRoleDescription', 'currentAchievements', 'previousExperience', 
                'technicalSkills', 'softSkills', 'interests'].includes(field)) {
      (updatedData as any)[field] = value
    }
    
    onSave(updatedData)
  }

  // Start editing a section
  const startEditing = (sectionId: string) => {
    setEditingSection(sectionId)
    
    // Initialize edit data based on section type
    const section = SECTIONS.find(s => s.id === sectionId)
    if (!section) return

    if (section.type === 'text') {
      // Handle both standard CVData fields and additional Basic CV Builder fields
      let content = ''
      if (['experienceYears', 'currentCompany', 'currentRoleStartDate', 
          'currentRoleDescription', 'currentAchievements', 'previousExperience'].includes(sectionId)) {
        const value = (data as any)[sectionId]
        content = typeof value === 'string' ? value : ''
      } else {
        const value = data[sectionId as keyof CVData]
        content = typeof value === 'string' ? value : ''
      }
      setEditData({ content })
    } else if (section.type === 'simple') {
      const content = data[sectionId as keyof CVData]
      let items: string[] = []
      
      if (Array.isArray(content)) {
        // Check if array contains strings (not objects)
        if (content.length > 0 && typeof content[0] === 'string') {
          items = content as string[]
        } else {
          // If it's an array of objects, convert to strings
          items = content.map((item: any) => {
            if (typeof item === 'string') return item
            if (item && typeof item === 'object') {
              // Handle different object types
              return item.title || item.name || item.language || String(item)
            }
            return String(item)
          }).filter((item: string) => item.length > 0)
        }
      } else if (typeof content === 'string' && content.trim()) {
        // If it's a string, split by common separators
        items = content.split(/[,;]|\n/).map(item => item.trim()).filter(item => item.length > 0)
      }
      
      setEditData({ items })
    } else if (section.type === 'list') {
      setEditData({ items: data[sectionId as keyof CVData] || [] })
    }
  }

  // Save section changes
  const saveSection = () => {
    if (!editingSection) return

    const section = SECTIONS.find(s => s.id === editingSection)
    if (!section) return

    const updatedData = { ...data }
    
    if (section.type === 'text') {
      // Handle both standard CVData fields and additional Basic CV Builder fields
      if (['experienceYears', 'currentCompany', 'currentRoleStartDate', 
          'currentRoleDescription', 'currentAchievements', 'previousExperience'].includes(editingSection)) {
        (updatedData as any)[editingSection] = editData.content
      } else {
        updatedData[editingSection as keyof CVData] = editData.content
      }
    } else if (section.type === 'simple') {
      updatedData[editingSection as keyof CVData] = editData.items.filter((item: string) => item.trim() !== '')
    } else if (section.type === 'list') {
      updatedData[editingSection as keyof CVData] = editData.items.filter((item: CVSection) => item.title && item.title.trim() !== '')
    }
    
    onSave(updatedData)
    setEditingSection(null)
    setEditData({})
    console.log(`${section.name} updated successfully!`)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingSection(null)
    setEditData({})
  }

  // Add new item to list
  const addListItem = () => {
    if (!editingSection) return
    
    const section = SECTIONS.find(s => s.id === editingSection)
    if (!section || section.type !== 'list') return

    let newItem: any = {}
    
    if (section.id === 'education') {
      newItem = { degree: '', institution: '', field: '', dates: '', content: [] }
    } else if (section.id === 'experience') {
      newItem = { title: '', company: '', dates: '', content: [] }
    } else {
      newItem = { title: '', content: [] }
    }

    setEditData({
      ...editData,
      items: [...editData.items, newItem]
    })
  }

  // Add new simple item
  const addSimpleItem = () => {
    if (!editingSection) return
    
    const section = SECTIONS.find(s => s.id === editingSection)
    if (!section || section.type !== 'simple') return

    const currentItems = Array.isArray(editData.items) ? editData.items : []
    setEditData({
      ...editData,
      items: [...currentItems, '']
    })
  }

  // Update list item
  const updateListItem = (index: number, field: string, value: string | string[]) => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = [...currentItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setEditData({ ...editData, items: newItems })
  }

  // Update simple item
  const updateSimpleItem = (index: number, value: string) => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = [...currentItems]
    newItems[index] = value
    setEditData({ ...editData, items: newItems })
  }

  // Helper function to extract proficiency level from language string
  const getLanguageProficiency = (languageString: string): string => {
    const match = languageString.match(/\s*\(([^)]*)\)$/)
    return match ? match[1] : ''
  }

  // Update language item with name and proficiency level
  const updateLanguageItem = (index: number, languageName: string, proficiencyLevel: string) => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = [...currentItems]
    if (proficiencyLevel && proficiencyLevel.trim()) {
      newItems[index] = `${languageName} (${proficiencyLevel})`
    } else {
      newItems[index] = languageName
    }
    setEditData({ ...editData, items: newItems })
  }

  // Remove item
  const removeItem = (index: number) => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = currentItems.filter((_: any, i: number) => i !== index)
    setEditData({ ...editData, items: newItems })
  }

  // Move item up/down
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = [...currentItems]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newItems.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
      setEditData({ ...editData, items: newItems })
    }
  }

  // Add bullet point to list item
  const addBulletPoint = (itemIndex: number) => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = [...currentItems]
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      content: [...(newItems[itemIndex].content || []), '']
    }
    setEditData({ ...editData, items: newItems })
  }

  // Update bullet point
  const updateBulletPoint = (itemIndex: number, bulletIndex: number, value: string) => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = [...currentItems]
    if (newItems[itemIndex] && newItems[itemIndex].content) {
      newItems[itemIndex].content[bulletIndex] = value
    }
    setEditData({ ...editData, items: newItems })
  }

  // Remove bullet point
  const removeBulletPoint = (itemIndex: number, bulletIndex: number) => {
    const currentItems = Array.isArray(editData.items) ? editData.items : []
    const newItems = [...currentItems]
    if (newItems[itemIndex] && newItems[itemIndex].content) {
      newItems[itemIndex].content = newItems[itemIndex].content.filter((_: string, i: number) => i !== bulletIndex)
    }
    setEditData({ ...editData, items: newItems })
  }

  // Get section content for display
  const getSectionContent = (sectionId: string) => {
    const section = SECTIONS.find(s => s.id === sectionId)
    if (!section) return null

    // Handle both standard CVData fields and additional Basic CV Builder fields
    let content: any
    if (['experienceYears', 'currentCompany', 'currentRoleStartDate', 
        'currentRoleDescription', 'currentAchievements', 'previousExperience'].includes(sectionId)) {
      content = (data as any)[sectionId]
    } else {
      content = data[sectionId as keyof CVData]
    }
    
    if (section.type === 'text') {
      return content ? (
        <div className="whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{content as string}</div>
      ) : (
        <div className="italic" style={{ color: 'var(--text-tertiary)' }}>No content added yet</div>
      )
    } else if (section.type === 'simple') {
      // Ensure items is always an array
      let items: string[] = []
      if (Array.isArray(content)) {
        items = content
      } else if (typeof content === 'string' && content.trim()) {
        // If it's a string, split by common separators
        items = content.split(/[,;]|\n/).map(item => item.trim()).filter(item => item.length > 0)
      }
      
      return items && items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={index} style={{ color: 'var(--text-primary)' }}>• {item}</div>
          ))}
        </div>
      ) : (
        <div className="italic" style={{ color: 'var(--text-tertiary)' }}>No items added yet</div>
      )
    } else if (section.type === 'list') {
      // Ensure items is always an array
      let items: any[] = []
      if (Array.isArray(content)) {
        items = content
      } else if (typeof content === 'string' && content.trim()) {
        // If it's a string, create a simple object
        items = [{
          title: content,
          content: []
        }]
      }
      
      return items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="border-l-2 pl-3" style={{ borderColor: 'var(--border-medium)' }}>
              {/* Handle different data structures */}
              {item.title ? (
                // Standard CVSection structure
                <>
                  <div className="font-medium" style={{ color: 'var(--text-heading)' }}>{item.title}</div>
                  {item.content && Array.isArray(item.content) && item.content.map((bullet: string, bulletIndex: number) => (
                    <div key={bulletIndex} className="text-sm" style={{ color: 'var(--text-primary)' }}>• {bullet}</div>
                  ))}
                </>
              ) : item.degree ? (
                // Education structure from direct mapping
                <>
                  <div className="font-medium" style={{ color: 'var(--text-heading)' }}>{item.degree}</div>
                  {(item.institution || item.dates || item.field) && (
                    <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {item.institution && <span className="font-medium">{item.institution}</span>}
                      {item.institution && item.dates && <span className="mx-2">•</span>}
                      {item.dates && <span>{item.dates}</span>}
                      {item.dates && item.field && <span className="mx-2">•</span>}
                      {item.field && <span>{item.field}</span>}
                    </div>
                  )}
                  {item.content && Array.isArray(item.content) && item.content.map((bullet: string, bulletIndex: number) => (
                    <div key={bulletIndex} className="text-sm" style={{ color: 'var(--text-primary)' }}>• {bullet}</div>
                  ))}
                </>
              ) : item.company ? (
                // Experience structure
                <>
                  <div className="font-medium" style={{ color: 'var(--text-heading)' }}>{item.title || item.position}</div>
                  <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {item.company && <span className="font-medium">{item.company}</span>}
                    {item.company && item.dates && <span className="mx-2">•</span>}
                    {item.dates && <span>{item.dates}</span>}
                  </div>
                  {item.content && Array.isArray(item.content) && item.content.map((bullet: string, bulletIndex: number) => (
                    <div key={bulletIndex} className="text-sm" style={{ color: 'var(--text-primary)' }}>• {bullet}</div>
                  ))}
                </>
              ) : (
                // Fallback for other structures
                <div className="font-medium" style={{ color: 'var(--text-heading)' }}>{JSON.stringify(item)}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="italic" style={{ color: 'var(--text-tertiary)' }}>No items added yet</div>
      )
    }
    
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <input
              type="text"
              value={data.fullName || ''}
              onChange={(e) => handleHeaderChange('fullName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Preferred Name</label>
            <input
              type="text"
              value={data.preferredName || ''}
              onChange={(e) => handleHeaderChange('preferredName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="Nickname or preferred name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Professional Title</label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => handleHeaderChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Experience Years</label>
            <input
              type="text"
              value={(data as any).experienceYears || ''}
              onChange={(e) => handleHeaderChange('experienceYears', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="e.g., 5+ years"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={data.contact?.email || ''}
              onChange={(e) => handleHeaderChange('email', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label>
            <input
              type="tel"
              value={data.contact?.phone || ''}
              onChange={(e) => handleHeaderChange('phone', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Location</label>
            <input
              type="text"
              value={data.contact?.location || ''}
              onChange={(e) => handleHeaderChange('location', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="City, State/Province, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>LinkedIn</label>
            <input
              type="url"
              value={data.social?.linkedin || ''}
              onChange={(e) => handleHeaderChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="https://linkedin.com/in/yourname"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Website</label>
            <input
              type="url"
              value={data.social?.website || ''}
              onChange={(e) => handleHeaderChange('website', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="https://yourname.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Current Company</label>
            <input
              type="text"
              value={(data as any).currentCompany || ''}
              onChange={(e) => handleHeaderChange('currentCompany', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="Current company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Current Role Start Date</label>
            <input
              type="text"
              value={(data as any).currentRoleStartDate || ''}
              onChange={(e) => handleHeaderChange('currentRoleStartDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
              placeholder="MM/YYYY"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {SECTIONS.map((section, index) => {
          const IconComponent = section.icon || FaUser // Fallback to FaUser if icon is undefined
          const isEditing = editingSection === section.id
          // Handle content checking based on section type
          let hasContent = false
          if (section.type === 'text') {
          if (['experienceYears', 'currentCompany', 'currentRoleStartDate', 
              'currentRoleDescription', 'currentAchievements', 'previousExperience'].includes(section.id)) {
              hasContent = !!(data as any)[section.id]
            } else {
              hasContent = !!data[section.id as keyof CVData]
            }
          } else if (section.type === 'simple') {
            const content = data[section.id as keyof CVData]
            if (Array.isArray(content)) {
              hasContent = content.length > 0 && content.some(item => {
                if (typeof item === 'string') {
                  return item.trim().length > 0
                }
                // For object items, check if they have content
                return item && typeof item === 'object'
              })
            } else if (typeof content === 'string') {
              hasContent = content.trim().length > 0
            }
          } else if (section.type === 'list') {
            const content = data[section.id as keyof CVData]
            hasContent = Array.isArray(content) && content.length > 0
          }
          
          
          return (
            <div key={section.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-medium)' }}>
              {/* Section Header */}
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <div className="text-blue-600 text-sm">📝</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>{section.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {hasContent ? 'Content available' : 'Click to add content'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveSection}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(section.id)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors border"
                      style={{ color: 'var(--color-ladderfox-blue)', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-medium)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    >
                      ✏️ {hasContent ? 'Edit' : 'Add'}
                    </button>
                  )}
                </div>
              </div>

              {/* Section Content */}
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-4">
                    {section.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {section.name}
                        </label>
                        <textarea
                          value={editData.content || ''}
                          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                          placeholder={`Enter your ${section.name.toLowerCase()}...`}
                        />
                      </div>
                    )}

                    {section.type === 'simple' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {section.name}
                          </label>
                          <button
                            onClick={addSimpleItem}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors"
                            style={{ color: 'var(--color-ladderfox-blue)', backgroundColor: 'var(--bg-secondary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                          >
                            ➕ Add Item
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(Array.isArray(editData.items) ? editData.items : []).map((item: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => moveItem(index, 'up')}
                                  disabled={index === 0}
                                  className="p-1 disabled:opacity-50"
                                  style={{ color: 'var(--text-tertiary)' }}
                                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-secondary)')}
                                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                >
                                  ⬆️
                                </button>
                                <button
                                  onClick={() => moveItem(index, 'down')}
                                  disabled={index === (editData.items || []).length - 1}
                                  className="p-1 disabled:opacity-50"
                                  style={{ color: 'var(--text-tertiary)' }}
                                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-secondary)')}
                                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                >
                                  ⬇️
                                </button>
                              </div>
                              
                              {/* Special interface for languages */}
                              {section.id === 'languages' ? (
                                <div className="flex items-center space-x-2 flex-1">
                                  <input
                                    type="text"
                                    value={item.replace(/\s*\([^)]*\)$/, '')} // Remove proficiency level from display
                                    onChange={(e) => updateLanguageItem(index, e.target.value, getLanguageProficiency(item))}
                                    className="flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                    placeholder="Enter language name..."
                                  />
                                  <select
                                    value={getLanguageProficiency(item)}
                                    onChange={(e) => updateLanguageItem(index, item.replace(/\s*\([^)]*\)$/, ''), e.target.value)}
                                    className="px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                  >
                                    <option value="">Select level</option>
                                    <option value="Native">Native</option>
                                    <option value="Fluent">Fluent</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Conversational">Conversational</option>
                                  </select>
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateSimpleItem(index, e.target.value)}
                                  className="flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                  placeholder={`Enter ${section.name.toLowerCase()} item...`}
                                />
                              )}
                              
                              <button
                                onClick={() => removeItem(index)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.type === 'list' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {section.name}
                          </label>
                          <button
                            onClick={addListItem}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors"
                            style={{ color: 'var(--color-ladderfox-blue)', backgroundColor: 'var(--bg-secondary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                          >
                            ➕ Add Item
                          </button>
                        </div>
                        <div className="space-y-4">
                          {(Array.isArray(editData.items) ? editData.items : []).map((item: any, index: number) => (
                            <div key={index} className="rounded-lg p-4" style={{ border: '1px solid var(--border-medium)' }}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 disabled:opacity-50"
                                    style={{ color: 'var(--text-tertiary)' }}
                                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-secondary)')}
                                    onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                  >
                                    ⬆️
                                  </button>
                                  <button
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === (editData.items || []).length - 1}
                                    className="p-1 disabled:opacity-50"
                                    style={{ color: 'var(--text-tertiary)' }}
                                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-secondary)')}
                                    onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.color = 'var(--text-tertiary)')}
                                  >
                                    ⬇️
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(index)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  🗑️
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                {/* Custom editing interface based on section type */}
                                {section.id === 'education' ? (
                                  // Education-specific editing interface
                                  <>
                                    <div>
                                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Degree
                                      </label>
                                      <input
                                        type="text"
                                        value={item.degree || ''}
                                        onChange={(e) => updateListItem(index, 'degree', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                        placeholder="e.g., Bachelor of Science"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Institution
                                      </label>
                                      <input
                                        type="text"
                                        value={item.institution || ''}
                                        onChange={(e) => updateListItem(index, 'institution', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                        placeholder="e.g., University of California"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Field of Study
                                      </label>
                                      <input
                                        type="text"
                                        value={item.field || ''}
                                        onChange={(e) => updateListItem(index, 'field', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                        placeholder="e.g., Computer Science"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Dates
                                      </label>
                                      <input
                                        type="text"
                                        value={item.dates || ''}
                                        onChange={(e) => updateListItem(index, 'dates', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                        placeholder="e.g., 2018-2022"
                                      />
                                    </div>
                                  </>
                                ) : section.id === 'experience' ? (
                                  // Experience-specific editing interface
                                  <>
                                    <div>
                                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Job Title
                                      </label>
                                      <input
                                        type="text"
                                        value={item.title || item.position || ''}
                                        onChange={(e) => updateListItem(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                        placeholder="e.g., Software Engineer"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Company
                                      </label>
                                      <input
                                        type="text"
                                        value={item.company || ''}
                                        onChange={(e) => updateListItem(index, 'company', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                        placeholder="e.g., Google"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                        Dates
                                      </label>
                                      <input
                                        type="text"
                                        value={item.dates || ''}
                                        onChange={(e) => updateListItem(index, 'dates', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                        placeholder="e.g., 2020-2023"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  // Standard CVSection editing interface
                                  <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title || ''}
                                      onChange={(e) => updateListItem(index, 'title', e.target.value)}
                                      className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                      placeholder="Enter title..."
                                    />
                                  </div>
                                )}
                                
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                      Details
                                    </label>
                                    <button
                                      onClick={() => addBulletPoint(index)}
                                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors"
                                      style={{ color: 'var(--color-ladderfox-blue)', backgroundColor: 'var(--bg-secondary)' }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                    >
                                      ➕ Add Point
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    {(item.content || []).map((bullet: string, bulletIndex: number) => (
                                      <div key={bulletIndex} className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={bullet}
                                          onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                                          className="flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                          placeholder="Enter detail point..."
                                        />
                                        <button
                                          onClick={() => removeBulletPoint(index, bulletIndex)}
                                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[80px] p-4 border-2 border-dashed rounded-lg" style={{ borderColor: 'var(--border-medium)' }}>
                    {getSectionContent(section.id) || (
                      <div className="text-center" style={{ color: 'var(--text-tertiary)' }}>
                        <p className="text-sm">No content added yet</p>
                        <p className="text-xs mt-1">Click "Add" to get started</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 