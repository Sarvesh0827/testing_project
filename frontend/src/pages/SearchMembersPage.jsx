import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchMembers } from '../api/memberApi'

export default function SearchMembersPage() {
  const [filters, setFilters] = useState({ skill: '', location: '', keyword: '' })
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const data = await searchMembers(filters)
      setMembers(data.members || [])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h2>Search Members</h2>
      <form className="card form-grid" onSubmit={handleSearch}>
        <input name="skill" value={filters.skill} onChange={handleChange} placeholder="Skill" />
        <input name="location" value={filters.location} onChange={handleChange} placeholder="Location" />
        <input name="keyword" value={filters.keyword} onChange={handleChange} placeholder="Keyword" />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <p>Found {members.length} member(s)</p>
      <div className="results-grid">
        {members.map((member) => (
          <article key={member.member_id} className="card member-card">
            {member.profile_photo_url && <img className="avatar" src={member.profile_photo_url} alt={`${member.first_name} ${member.last_name}`} />}
            <h3>{member.first_name} {member.last_name}</h3>
            <p>{member.headline}</p>
            <p>{member.email}</p>
            <p>{[member.city, member.state, member.country].filter(Boolean).join(', ')}</p>
            <p>Skills: {(member.skills || []).join(', ')}</p>
            <Link to={`/members/${member.member_id}`}>View Profile</Link>
          </article>
        ))}
      </div>
    </section>
  )
}
