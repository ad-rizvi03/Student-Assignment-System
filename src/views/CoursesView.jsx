import React from 'react'
import CourseCard from '../components/CourseCard'
import { getDisplayName } from '../utils/user'

export default function CoursesView({ currentUser, courses, users, onOpenCourse }) {
  // If admin, show courses they teach; if student, show courses they're enrolled in
  const list = (currentUser.role === 'admin')
    ? courses.filter(c => {
      // primary match: instructorId === currentUser.id
      if (c.instructorId === currentUser.id) return true
      // fallback: match by instructor name/displayName in case persisted ids differ
      const instr = users.find(u => u.id === c.instructorId)
      const instrName = instr ? getDisplayName(instr) : ''
      const curName = getDisplayName(currentUser)
      return instrName === curName
    })
    : courses.filter(c => c.studentIds && c.studentIds.includes(currentUser.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Courses</h2>
        <div className="text-sm text-gray-600">{list.length} {list.length === 1 ? 'course' : 'courses'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map(c => (
          <CourseCard key={c.id} course={c} onOpen={() => onOpenCourse(c.id)} />
        ))}
      </div>
    </div>
  )
}
