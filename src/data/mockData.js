export const users = [
  {
    id: 'u_admin_1',
    name: 'Prof. Ada Lovelace',
    role: 'admin',
    password: '123456789',
  },
  {
    id: 'u_student_1',
    name: 'Alice Johnson',
    role: 'student',
    password: '123456789',
  },
  {
    id: 'u_student_2',
    name: 'Bob Smith',
    role: 'student',
    password: '123456789',
  },
]

export const assignments = [
  {
    id: 'a1',
    title: 'Essay: History of Computing',
    description: 'Write a 1500-word essay on a computing pioneer.',
    dueDate: '2025-11-10',
    driveLink: 'https://drive.example.com/essay-a1',
    createdBy: 'u_admin_1',
    assignedTo: ['u_student_1', 'u_student_2'],
    // submissions: map of studentId => { submitted: boolean, timestamp }
    submissions: {
      u_student_1: { submitted: false, timestamp: null },
      u_student_2: { submitted: true, timestamp: '2025-10-20T12:00:00Z' },
    },
  },
  {
    id: 'a2',
    title: 'Project: Simple Web App',
    description: 'Build a small React app and deploy to Netlify or Vercel.',
    dueDate: '2025-11-20',
    driveLink: 'https://drive.example.com/project-a2',
    createdBy: 'u_admin_1',
    assignedTo: ['u_student_1'],
    submissions: {
      u_student_1: { submitted: false, timestamp: null },
    },
  },
]
