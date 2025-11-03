import React from 'react'

export default function CourseCard({ course, onOpen }) {
  return (
    <div className="rounded-2xl card-surface p-4 hover:shadow-lg transition cursor-pointer" onClick={onOpen}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-bronze font-semibold">{course.code}</div>
          <h3 className="font-bold text-lg text-taupe">{course.title}</h3>
          <div className="text-xs text-gray-500">{course.term}</div>
        </div>
        <div className="text-sm text-gray-500">{course.studentIds?.length || 0} students</div>
      </div>
    </div>
  )
}
