export type UserRole = 'student' | 'parent' | 'instructor' | 'admin'
export type GradeTrack = 'lgs' | 'yks'
export type HomeworkStatus = 'assigned' | 'submitted' | 'completed'
export type BookingStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

export interface AppUser {
  id: string
  role: UserRole
  name: string
  email: string
  phone: string | null
  birthDate: string | null
  avatarUrl: string | null
}

export interface InstructorProfile {
  userId: string
  name: string
  avatarUrl: string | null
  bio: string | null
  subjects: string[]
  lessonPrice: number
  introVideoUrl: string | null
  isCalendarConnected: boolean
}

export interface TimeSlot {
  start: string
  end: string
}

export interface AvailabilityRule {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string | null
  fieldOfStudy: string | null
  startYear: number | null
  endYear: number | null
}

export interface Homework {
  id: string
  bookingId: string | null
  studentId: string
  instructorId: string
  title: string
  description: string | null
  dueDate: string | null
  status: HomeworkStatus
  completedAt: string | null
}

export interface HomeworkSubmission {
  id: string
  homeworkId: string
  filePath: string
  fileType: 'image' | 'video'
  uploadedAt: string
}
