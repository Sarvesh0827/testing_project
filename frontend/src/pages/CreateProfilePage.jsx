import { useState } from 'react'
import ProfileForm from '../components/ProfileForm'
import { createMember } from '../api/memberApi'

export default function CreateProfilePage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (payload) => {
    setMessage('')
    setError('')
    try {
      const data = await createMember(payload)
      setMessage(`${data.message} (${data.member_id})`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h2>Create Member Profile</h2>
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
      <ProfileForm onSubmit={handleSubmit} submitText="Create Profile" />
    </section>
  )
}
