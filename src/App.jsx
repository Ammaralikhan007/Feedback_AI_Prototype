import { useState, useEffect } from 'react'
import { Search, Bell, User, Settings, Info, Upload, X, FileText, Calendar, Clock, UserX, ChevronDown } from 'lucide-react'

function App() {
  // View state management
  const [currentView, setCurrentView] = useState('submit') // 'submit' or 'submissions'
  
  // Submit feedback form state
  const [concernType, setConcernType] = useState('')
  const [department, setDepartment] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  
  // Submissions state
  const [feedbackData, setFeedbackData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      'In Progress': 'bg-orange-100 text-orange-800 border-orange-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Resolved': 'bg-green-100 text-green-800 border-green-200',
      'closed': 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.pending}`}>
        {status}
      </span>
    )
  }

  // Urgency badge styling
  const getUrgencyBadge = (urgency) => {
    const urgencyStyles = {
      'Low': 'bg-green-100 text-green-700 border-green-200',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'high': 'bg-red-100 text-red-700 border-red-200',
      'critical': 'bg-red-200 text-red-900 border-red-300'
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${urgencyStyles[urgency] || urgencyStyles.Medium}`}>
        {urgency}
      </span>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Fetch submissions data
  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    setFeedbackData([]) // Clear existing data
    
    try {
      console.log('Attempting to fetch from /api/feedback')
      const response = await fetch('/api/feedback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Successfully received data:', data)
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data))
      
      // Ensure data is always an array and set it
      const submissions = Array.isArray(data) ? data : (data.data ? data.data : [])
      setFeedbackData(submissions)
      
      if (submissions.length === 0) {
        setError('No submissions found in database')
      }
      
    } catch (err) {
      console.error('Detailed fetch error:', err)
      setError(`Failed to connect to backend API: ${err.message}`)
      setFeedbackData([]) // Set empty array on error, no mock data
    } finally {
      setLoading(false)
    }
  }

  // Fetch submissions when view changes to submissions
  useEffect(() => {
    console.log('Current view changed to:', currentView)
    if (currentView === 'submissions') {
      console.log('Fetching submissions...')
      fetchSubmissions()
    }
  }, [currentView])

  // Handle status change
  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Update local state with safety check
        setFeedbackData(prev => {
          if (!Array.isArray(prev)) return []
          return prev.map(item => 
            item.id === feedbackId ? { ...item, status: newStatus } : item
          )
        })
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
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
        
        // Refresh submissions if currently viewing them
        if (currentView === 'submissions') {
          fetchSubmissions()
        }
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2 mr-3">
              <span className="text-xl font-bold">🌟</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Clarity360</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
            <span className="mr-3">👁️</span>
            Dashboard
          </div>
          
          <div 
            className={`flex items-center px-6 py-3 text-sm font-medium cursor-pointer ${
              currentView === 'submit' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentView('submit')}
          >
            <span className="mr-3">📝</span>
            Submit Feedback
          </div>
          
          <div 
            className={`flex items-center px-6 py-3 text-sm font-medium cursor-pointer ${
              currentView === 'submissions' 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentView('submissions')}
          >
            <FileText className="mr-3" size={16} />
            Submissions
          </div>
          
          <div className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer">
            <Settings className="mr-3" size={16} />
            Settings
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Header Right */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {currentView === 'submit' && (
            <div className="max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Feedback</h1>
                <p className="text-gray-600">
                  Share your concerns, suggestions, or feedback. Your input helps us create a better workplace. Only a description is required – 
                  other fields are optional.
                </p>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                <Info className="text-blue-600 mr-3 mt-0.5" size={20} />
                <p className="text-blue-800 text-sm">
                  All submissions are treated confidentially. You can choose to submit anonymously or include your identity. While concern type and 
                  department are optional, providing them helps us route your feedback to the right team faster.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Feedback Details</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {/* Concern Type */}
                  <div>
                    <label htmlFor="concernType" className="block text-sm font-medium text-gray-700 mb-2">
                      Concern Type (Optional)
                    </label>
                    <select
                      id="concernType"
                      value={concernType}
                      onChange={(e) => setConcernType(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-600"
                    >
                      <option value="">Select the type of concern (optional)</option>
                      {concernTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      Related Department (Optional)
                    </label>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-600"
                    >
                      <option value="">Select the relevant department (optional)</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please provide details about your concern or feedback..."
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={6}
                      required
                    />
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-500">{description.length} characters</span>
                      <span className="text-gray-400">Minimum 10 characters required</span>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600 mb-2">Drag files here or click to browse</p>
                      <p className="text-gray-400 text-sm mb-4">Supports: Images, PDFs, Text files (Max 10MB each, 5 files total)</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        Choose files
                        <span className="ml-2 text-gray-400">no file chosen</span>
                      </label>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Submit Anonymously</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      Your identity will not be shared with anyone reviewing this submission
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 focus:outline-none"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {currentView === 'submissions' && (
            <div className="max-w-6xl mx-auto">
              {/* Submissions Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Submissions</h1>
                    <p className="text-gray-600">
                      Review and manage all feedback submissions. Update status and track progress.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={fetchSubmissions}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Refresh
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          console.log('Testing direct API call...')
                          const response = await fetch('https://api.clarity360.io/api/feedback')
                          console.log('Direct API response:', response.status)
                          const data = await response.json()
                          console.log('Direct API data:', data)
                          alert(`Direct API test: ${response.status} - Found ${data?.length || 0} items`)
                        } catch (err) {
                          console.error('Direct API error:', err)
                          alert(`Direct API failed: ${err.message}`)
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      Test API
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading submissions...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-red-800">Error: {error}</p>
                    <button 
                      onClick={fetchSubmissions}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Retry
                    </button>
                  </div>
                  <p className="text-red-600 text-sm mt-2">
                    Make sure your backend is running at http://localhost:3001
                  </p>
                </div>
              )}

              {/* Submissions Grid */}
              {!loading && !error && (
                <div className="grid gap-6">
                  {(!feedbackData || !Array.isArray(feedbackData) || feedbackData.length === 0) ? (
                    <div className="text-center py-12">
                      <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600 mb-2">No feedback submissions yet</p>
                      <p className="text-gray-400 text-sm">Feedback will appear here once submitted</p>
                    </div>
                  ) : (
                    feedbackData.map((feedback) => (
                      <div key={feedback.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-6">
                        {/* Card Header with Status and Urgency */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(feedback.status)}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getUrgencyBadge(feedback.urgency)}
                          </div>
                        </div>

                        {/* Concern Type (Bold) */}
                        {feedback.concernType && (
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            {feedback.concernType}
                          </h3>
                        )}

                        {/* Description */}
                        <div className="mb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {feedback.description}
                          </p>
                        </div>

                        {/* AI Summary */}
                        {feedback.summary && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-1">AI Summary:</h4>
                            <p className="text-gray-600 text-sm">
                              {feedback.summary}
                            </p>
                          </div>
                        )}

                        {/*AI Suggested Action */}
                        {feedback.suggestedAction && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-1">AI Suggested Action:</h4>
                            <p className="text-gray-600 text-sm">
                              {feedback.suggestedAction}
                            </p>
                          </div>
                        )}

                        {/* Footer with Department, Anonymous/ID, Date */}
                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {feedback.department && (
                              <div className="flex items-center">
                                <span className="font-medium">{feedback.department}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              {feedback.isAnonymous ? (
                                <>
                                  <UserX size={14} className="mr-1" />
                                  <span>Anonymous</span>
                                </>
                              ) : (
                                <>
                                  <User size={14} className="mr-1" />
                                  <span>{feedback.submittedBy || `ID: ${feedback.id}`}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(feedback.createdAt)}
                            </div>
                          </div>

                          {/* Change Status Button */}
                          <div className="relative group">
                            <select
                              value={feedback.status}
                              onChange={(e) => handleStatusChange(feedback.id, e.target.value)}
                              className="appearance-none bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                            >
                              <option value="pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App