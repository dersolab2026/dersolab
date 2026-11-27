/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * DersoLab — Canlı Supabase (PostgREST OpenAPI) Veritabanı Şema Tipleri
 * Tüm 34 canlı tablo için tam satır (Row) arayüzleri + esnek sorgu uyumluluğu.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface UsersRow {
  id: string
  role: 'student' | 'instructor' | 'parent' | 'admin' | string
  name: string | null
  email: string | null
  phone: string | null
  birth_date: string | null
  avatar_url: string | null
  created_at: string
  identity_number: string | null
  address: string | null
  city: string | null
  deleted_at: string | null
  role_confirmed: boolean | null
}

export interface StudentsRow {
  user_id: string
  grade_track: string | null
  credit_balance: number
  created_at: string
  free_trial_used: boolean
  school_name: string | null
  grade: number | null
  track: string | null
  target_program_code: number | null
  target_rank: number | null
  target_exam_date: string | null
}

export interface InstructorsRow {
  user_id: string
  bio: string | null
  subjects: string[] | null
  lesson_price: number | null
  created_at: string
  calendar_connected: boolean
  intro_video_url: string | null
  approval_status: string | null
  approval_note: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  offers_free_trial: boolean
  paused: boolean
}

export interface BookingsRow {
  id: string
  student_id: string
  instructor_id: string
  purchased_by: string | null
  start_time: string
  end_time: string
  meet_link: string | null
  status: string
  credits_used: number
  instructor_notes: string | null
  completed_at: string | null
  created_at: string
  cancelled_by: string | null
  credit_refunded: boolean
  google_event_id: string | null
  is_trial: boolean
  reminder_sent: boolean
  topic_note: string | null
  session_type: string | null
  cancelled_at: string | null
}

export interface HomeworkRow {
  id: string
  booking_id: string | null
  student_id: string
  instructor_id: string
  title: string
  description: string | null
  due_date: string | null
  status: string
  completed_at: string | null
  created_at: string
  resource_id: string | null
  resource_range: string | null
  homework_type: string | null
  instructor_feedback: string | null
}

export interface HomeworkSubmissionsRow {
  id: string
  homework_id: string
  file_path: string
  file_type: string | null
  uploaded_at: string
}

export interface LessonMaterialsRow {
  id: string
  booking_id: string | null
  instructor_id: string
  student_id: string
  title: string
  file_path: string
  created_at: string
}

export interface PackagesRow {
  id: string
  title: string
  description: string | null
  credit_amount: number
  price: number
  is_active: boolean
  created_at: string
  shopier_product_id: string | null
  shopier_product_url: string | null
}

export interface PackagePurchasesRow {
  id: string
  package_id: string | null
  student_id: string
  purchased_by: string | null
  credits_granted: number
  amount_paid: number
  payment_provider: string | null
  payment_reference: string | null
  status: string
  created_at: string
}

export interface NotificationsRow {
  id: string
  recipient_id: string
  type: string
  channel: string | null
  title: string
  body: string | null
  related_booking_id: string | null
  related_homework_id: string | null
  is_read: boolean
  sent_at: string | null
  created_at: string
  link: string | null
  batch_id: string | null
}

export interface CoachingRelationshipsRow {
  id: string
  student_id: string
  coach_id: string
  started_on: string
  ended_on: string | null
  weekly_rhythm: string | null
  status: string
  created_at: string
}

export interface CoachingPlanItemsRow {
  id: string
  student_id: string
  coach_id: string | null
  relationship_id: string | null
  plan_week: string | null
  plan_date: string
  plan_time: string | null
  subject: string
  topic: string | null
  source: string | null
  target_questions: number | null
  target_minutes: number | null
  status: string
  created_at: string
}

export interface CoachingSessionNotesRow {
  id: string
  booking_id: string | null
  relationship_id: string | null
  coach_id: string
  student_id: string
  session_date: string
  plan_followed: string | null
  obstacle: string | null
  student_commitment: string | null
  coach_decisions: string | null
  confidence: number | null
  created_at: string
}

export interface StudentStudyLogsRow {
  id: string
  student_id: string
  log_date: string
  subject: string
  topic: string | null
  hours: number | null
  questions_solved: number | null
  source: string | null
  created_at: string
}

export interface StudentExamResultsRow {
  id: string
  student_id: string
  exam_name: string
  exam_type: string
  exam_date: string
  correct_count: number
  wrong_count: number
  obp: number | null
  created_at: string
  track: string | null
  publisher: string | null
  difficulty: string | null
  duration_minutes: number | null
}

export interface StudentExamSectionsRow {
  id: string
  exam_result_id: string
  section_name: string
  correct_count: number
  wrong_count: number
  display_order: number | null
  wrong_knowledge: number | null
  wrong_careless: number | null
  wrong_misread: number | null
  wrong_timeout: number | null
}

export interface StudentExamReflectionsRow {
  exam_result_id: string
  preparation: string | null
  time_pressure_subject: string | null
  created_at: string
}

export interface StudentTargetNetsRow {
  id: string
  student_id: string
  exam_type: string
  track: string | null
  section_name: string
  target_net: number
  created_at: string
}

export interface StudentSelfAssessmentsRow {
  id: string
  student_id: string
  taken_on: string
  answers: Json
  created_at: string
}

export interface StudentIntakeFormsRow {
  id: string
  student_id: string
  goal: string[] | null
  hard_subjects: string[] | null
  daily_routine: string[] | null
  tried_methods: string[] | null
  study_environment: string[] | null
  who_wanted: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface GuardianLinksRow {
  id: string
  guardian_id: string
  student_id: string
  created_at: string
}

export interface GuardianLinkCodesRow {
  code: string
  student_id: string
  created_at: string
  expires_at: string
  used_at: string | null
  used_by: string | null
}

export interface DemoLessonRequestsRow {
  id: string
  student_id: string | null
  requested_by: string | null
  status: string
  assigned_instructor_id: string | null
  booking_id: string | null
  created_at: string
  resolved_at: string | null
  lead_name: string | null
  lead_email: string | null
  request_type: string | null
}

export interface DemoLessonDeclinesRow {
  request_id: string
  instructor_id: string
  created_at: string
}

export interface InstructorAvailabilityRow {
  id: string
  instructor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
}

export interface InstructorCalendarCredentialsRow {
  instructor_id: string
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  updated_at: string
}

export interface InstructorEducationRow {
  id: string
  instructor_id: string
  institution: string
  degree: string | null
  field_of_study: string | null
  start_year: number | null
  end_year: number | null
  display_order: number | null
  created_at: string
}

export interface InstructorPayoutDetailsRow {
  user_id: string
  payout_name: string | null
  payout_iban: string | null
  payout_updated_at: string | null
  created_at: string
}

export interface InstructorCoachCodesRow {
  user_id: string
  coach_invite_code: string
  created_at: string
}

export interface StudyResourcesRow {
  id: string
  publisher: string | null
  title: string
  subject: string
  exam_type: string | null
  total_units: number | null
  created_by: string | null
  created_at: string
}

export interface TermsAcceptancesRow {
  id: string
  user_id: string
  terms_version: string
  accepted_at: string
  acceptance_source: string | null
}

export interface TercihListeleriRow {
  id: string
  sender_id: string
  recipient_id: string | null
  file_path: string
  program_count: number | null
  created_at: string
  recipient_email: string | null
}

export interface ShopierUnmatchedPaymentsRow {
  id: string
  shopier_order_id: string
  shopier_product_id: string | null
  package_id: string | null
  buyer_email: string | null
  buyer_name: string | null
  amount: number
  note: string | null
  reason: string | null
  status: string
  resolved_student_id: string | null
  resolved_purchase_id: string | null
  created_at: string
  resolved_at: string | null
}

export interface YokAtlasProgramsRow {
  id: string
  kilavuz_kodu: number
  yil: number
  universite_id: number | null
  universite_adi: string
  universite_turu: string | null
  il_adi: string | null
  ilce_adi: string | null
  fakulte_adi: string | null
  birim_adi: string
  birim_grup_adi: string | null
  birim_turu_adi: string | null
  ogrenim_turu_adi: string | null
  ogrenim_dili_adi: string | null
  ogrenim_suresi: number | null
  puan_turu: string
  kontenjan: number | null
  ucret: number | null
  min_puan: number | null
  basari_sirasi: number | null
  min_puan_1: number | null
  basari_sirasi_1: number | null
  min_puan_2: number | null
  basari_sirasi_2: number | null
  min_puan_3: number | null
  basari_sirasi_3: number | null
  synced_at: string
}

export interface DatabaseTables {
  users: UsersRow
  students: StudentsRow
  instructors: InstructorsRow
  bookings: BookingsRow
  homework: HomeworkRow
  homework_submissions: HomeworkSubmissionsRow
  lesson_materials: LessonMaterialsRow
  packages: PackagesRow
  package_purchases: PackagePurchasesRow
  notifications: NotificationsRow
  coaching_relationships: CoachingRelationshipsRow
  coaching_plan_items: CoachingPlanItemsRow
  coaching_session_notes: CoachingSessionNotesRow
  student_study_logs: StudentStudyLogsRow
  student_exam_results: StudentExamResultsRow
  student_exam_sections: StudentExamSectionsRow
  student_exam_reflections: StudentExamReflectionsRow
  student_target_nets: StudentTargetNetsRow
  student_self_assessments: StudentSelfAssessmentsRow
  student_intake_forms: StudentIntakeFormsRow
  guardian_links: GuardianLinksRow
  guardian_link_codes: GuardianLinkCodesRow
  demo_lesson_requests: DemoLessonRequestsRow
  demo_lesson_declines: DemoLessonDeclinesRow
  instructor_availability: InstructorAvailabilityRow
  instructor_calendar_credentials: InstructorCalendarCredentialsRow
  instructor_education: InstructorEducationRow
  instructor_payout_details: InstructorPayoutDetailsRow
  instructor_coach_codes: InstructorCoachCodesRow
  study_resources: StudyResourcesRow
  terms_acceptances: TermsAcceptancesRow
  tercih_listeleri: TercihListeleriRow
  shopier_unmatched_payments: ShopierUnmatchedPaymentsRow
  yok_atlas_programs: YokAtlasProgramsRow
}

export type TableName = keyof DatabaseTables
export type TableRow<T extends TableName> = DatabaseTables[T]

export type Database = any
