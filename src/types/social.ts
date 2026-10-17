export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'linkedin'

export type InstagramContentType = 'carousel' | 'post' | 'reels'

export type ContentTopic =
  | 'exam_tactics'
  | 'dersolab_features'
  | 'motivation'
  | 'daily_question'
  | 'weekly_plan'
  | 'custom'

export type PostStatus = 'draft' | 'approved' | 'scheduled' | 'published'

export type SlideThemeVariant = 'lab_dark' | 'neon_orange' | 'cyan_cyber' | 'purple_matrix'

export interface CarouselSlide {
  slideNumber: number
  badge?: string
  headline: string
  subhead?: string
  bodyPoints: string[]
  highlightTag?: string
  footerNote?: string
  themeVariant: SlideThemeVariant
}

export interface SinglePostData {
  badge: string
  headline: string
  questionOrSummary: string
  keyTakeaway: string
  options?: { key: string; text: string; isCorrect?: boolean }[]
  themeVariant: SlideThemeVariant
}

export interface ReelsStoryboard {
  hook3s: string
  visualDirection: string
  spokenScript: string
  onScreenText: string[]
  musicAudioVibe: string
  callToAction: string
}

export interface SocialPostItem {
  id: string
  title: string
  type: InstagramContentType
  topic: ContentTopic
  topicLabel: string
  status: PostStatus
  caption: string
  hashtags: string[]
  targetAudience: string
  carouselSlides?: CarouselSlide[]
  singlePostData?: SinglePostData
  reelsStoryboard?: ReelsStoryboard
  scheduledFor?: string | null
  publishedAt?: string | null
  createdAt: string
  notes?: string
}

export interface GeneratePostRequest {
  type: InstagramContentType
  topic: ContentTopic
  customPrompt?: string
  targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
  tone?: 'energetic' | 'informative' | 'coaching' | 'humorous'
}

export interface WeeklyCalendarRequest {
  targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
  focusSubject?: string
  customInstructions?: string
}
