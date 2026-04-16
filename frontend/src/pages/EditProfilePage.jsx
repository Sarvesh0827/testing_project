import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProfileForm from '../components/ProfileForm'
import { getMember, updateMember } from '../api/memberApi'

export default function EditProfilePage() {
  const { memberId } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMember = async () => {
      try {
        const data = await getMember(memberId)
        setMember(data.member)
      } catch (err) {
        setError(err.message)
      }
    }
    loadMember()
  }, [memberId])

  const handleSubmit = async (payload) => {
    setMessage('')
    setError('')
    try {
      await updateMember({ member_id: memberId, ...payload })
      setMessage('Member updated successfully.')
      setTimeout(() => navigate(`/members/${memberId}`), 700)
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <p className="error-text">{error}</p>
  if (!member) return <p>Loading...</p>

  return (
    <section>
      <h2>Edit Member Profile</h2>
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
      <ProfileForm initialValues={member} onSubmit={handleSubmit} submitText="Update Profile" memberId={memberId} />
    </section>
  )
}
