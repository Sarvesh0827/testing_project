import { useState } from 'react'
import { uploadPhoto } from '../api/memberApi'

const defaultForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  country: '',
  headline: '',
  about_summary: '',
  skills: '',
  profile_photo_url: '',
  resume_text: '',
}

export default function ProfileForm({ initialValues = defaultForm, onSubmit, submitText = 'Save Profile', memberId = null }) {
  const [form, setForm] = useState({ ...defaultForm, ...initialValues, skills: Array.isArray(initialValues.skills) ? initialValues.skills.join(', ') : initialValues.skills || '' })
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMessage('')
    setUploadError('')
    try {
      const data = await uploadPhoto(file, memberId)
      setForm((current) => ({ ...current, profile_photo_url: data.profile_photo_url || '' }))
      setUploadMessage('Photo uploaded successfully.')
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      skills: form.skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      experience: [],
      education: [],
    })
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First name" required />
      <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
      <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
      <input name="country" value={form.country} onChange={handleChange} placeholder="Country" />
      <input name="headline" value={form.headline} onChange={handleChange} placeholder="Headline" />
      <div className="upload-block">
        <label>Profile photo upload</label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        {uploading && <p className="info">Uploading...</p>}
        {uploadMessage && <p className="success-text">{uploadMessage}</p>}
        {uploadError && <p className="error-text">{uploadError}</p>}
        {form.profile_photo_url && (
          <div className="photo-preview">
            <img src={form.profile_photo_url} alt="Profile preview" />
          </div>
        )}
      </div>
      <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" />
      <textarea name="about_summary" value={form.about_summary} onChange={handleChange} placeholder="About summary" rows="4" />
      <textarea name="resume_text" value={form.resume_text} onChange={handleChange} placeholder="Resume text" rows="5" />
      <button type="submit">{submitText}</button>
    </form>
  )
}
