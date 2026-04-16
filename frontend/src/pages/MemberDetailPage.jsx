import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteMember, getMember } from '../api/memberApi'

export default function MemberDetailPage() {
  const { memberId } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
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

  const handleDelete = async () => {
    if (!window.confirm('Delete this profile?')) return
    try {
      await deleteMember(memberId)
      navigate('/members/search')
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) return <p className="error-text">{error}</p>
  if (!member) return <p>Loading...</p>

  return (
    <section className="card detail-card">
      {member.profile_photo_url && <img className="detail-avatar" src={member.profile_photo_url} alt={`${member.first_name} ${member.last_name}`} />}
      <h2>{member.first_name} {member.last_name}</h2>
      <p>{member.headline}</p>
      <p>{member.email}</p>
      <p>{member.phone}</p>
      <p>{[member.city, member.state, member.country].filter(Boolean).join(', ')}</p>
      <p><strong>Skills:</strong> {(member.skills || []).join(', ')}</p>
      <p><strong>About:</strong> {member.about_summary}</p>
      <p><strong>Resume:</strong> {member.resume_text}</p>
      <div className="button-row">
        <Link className="secondary-link" to={`/members/${member.member_id}/edit`}>Edit</Link>
        <button className="danger-button" onClick={handleDelete}>Delete</button>
      </div>
    </section>
  )
}
