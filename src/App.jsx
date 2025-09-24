import { useState } from 'react'
import { Search, Bell, User, Settings, Info, Upload, X } from 'lucide-react'
import './App.css'

function App() {
  const [concernType, setConcernType] = useState('')
  const [department, setDepartment] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [isAnonymous, setIsAnonymous] = useState(false)

  const concernTypes = [
    'Harassment / Bullying',
    'Discrimination',
    'Policy / Compliance Violation',
    'Health & Safety Issue',
    'Workplace Culture / Team Dynamics',
    'Leadership / Managerial Conduct',
    'Welfare / Wellbeing Concern',
    'Complaint (General)',
    'Suggestion / Improvement Idea',
    'Other (Miscellaneous)'
  ]

  const departments = [
    'Human Resources (HR)',
    'Finance / Accounts',
    'Operations',
    'IT / Technology',
    'Sales',
    'Marketing'
  ]

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files)
    setFiles(prevFiles => [...prevFiles, ...selectedFiles])
  }

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData()
      
      // Add text fields
      formData.append('concernType', concernType)
      formData.append('department', department)
      formData.append('description', description)
      formData.append('isAnonymous', isAnonymous)
      
      // Add files
      files.forEach((file, index) => {
        formData.append(`attachments`, file)
      })
      
      // Send to backend API via proxy
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        alert('Feedback submitted successfully!')
        
        // Reset form
        setConcernType('')
        setDepartment('')
        setDescription('')
        setFiles([])
        setIsAnonymous(false)
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">📊</div>
            <span className="logo-text">Clarity360</span>
          </div>
        </div>
        <div className="header-center">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search" className="search-input" />
          </div>
        </div>
        <div className="header-right">
          <Bell className="header-icon" size={20} />
          <User className="header-icon" size={20} />
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </div>
          <div className="nav-item active">
            <span className="nav-icon">📝</span>
            <span>Submit Feedback</span>
          </div>
          <div className="nav-item">
            <Settings className="nav-icon" size={16} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="feedback-container">
          <h1 className="page-title">Submit Feedback</h1>
          <p className="page-description">
            Share your concerns, suggestions, or feedback. Your input helps us create a better workplace. Only a description is required – other fields are optional.
          </p>

          <div className="info-banner">
            <Info className="info-icon" size={16} />
            <span>All submissions are treated confidentially. You can choose to submit anonymously or include your identity. While concern type and department are optional, providing them helps us route your feedback to the right team faster.</span>
          </div>

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-header">
              <h2>Feedback Details</h2>
              <X className="close-icon" size={20} />
            </div>

            <div className="form-group">
              <label htmlFor="concernType">Concern Type (Optional)</label>
              <select
                id="concernType"
                value={concernType}
                onChange={(e) => setConcernType(e.target.value)}
                className="form-select"
              >
                <option value="">Select the type of concern (optional)</option>
                {concernTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department">Related Department (Optional)</label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select"
              >
                <option value="">Select the relevant department (optional)</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about your concern or feedback..."
                className="form-textarea"
                rows={6}
                required
              />
              <div className="character-count">
                {description.length} characters
                <span className="min-characters">Minimum 10 characters required</span>
              </div>
            </div>

            <div className="form-group">
              <label>Attachments (Optional)</label>
              <div className="file-upload-area">
                <Upload className="upload-icon" size={24} />
                <p>Drag files here or click to browse</p>
                <p className="file-support">Supports: Images, PDFs, Text files (Max 10MB each, 5 files total)</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input"
                  accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
                />
                <button type="button" className="choose-files-btn">
                  Choose files no file chosen
                </button>
              </div>
              
              {files.length > 0 && (
                <div className="uploaded-files">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} className="remove-file-btn">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="anonymous-section">
              <div className="anonymous-toggle">
                <span>Submit Anonymously</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <p className="anonymous-description">
                Your identity will not be shared with anyone reviewing this submission
              </p>
            </div>

            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </form>

          <footer className="form-footer">
            <span>© 2025, Clarity360. All Rights Reserved.</span>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App