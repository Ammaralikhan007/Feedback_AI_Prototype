import { useState } from 'react'
import { Search, Bell, User, Settings, Info, Upload, X } from 'lucide-react'

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
          
          <div className="flex items-center px-6 py-3 text-sm font-medium bg-blue-50 text-blue-700 border-r-2 border-blue-700">
            <span className="mr-3">📝</span>
            Submit Feedback
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
        </main>
      </div>
    </div>
  )
}

export default App