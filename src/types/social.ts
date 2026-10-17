export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'linkedin'

export type InstagramContentType = 'carousel' | 'post' | 'reels' | 'story'

export type ContentTopic =
  | 'exam_tactics'
  | 'dersolab_features'
  | 'motivation'
  | 'daily_question'
  | 'weekly_plan'
  | 'book_recommendation'
  | 'custom'

export type PostStatus = 'draft' | 'approved' | 'scheduled' | 'published'

export type SlideThemeVariant = 'lab_dark' | 'neon_orange' | 'cyan_cyber' | 'purple_matrix'

export type StoryStickerType = 'quiz' | 'poll' | 'link' | 'countdown' | 'question_box'

export interface CarouselSlide {
  slideNumber: number
  badge?: string
  headline: string
  subhead?: string
  bodyPoints: string[]
  highlightTag?: string
  footerNote?: string
  themeVariant: SlideThemeVariant
  uploadedImageUrl?: string
}

export interface SinglePostData {
  badge: string
  headline: string
  questionOrSummary: string
  keyTakeaway: string
  options?: { key: string; text: string; isCorrect?: boolean }[]
  themeVariant: SlideThemeVariant
  uploadedImageUrl?: string
}

export interface DualBookItem {
  title: string
  author: string
  genre?: string
  whyRead?: string
  imageUrl?: string
  highlightTag?: string
}

export interface DualBookData {
  ortaokul: DualBookItem
  lise: DualBookItem
}

export interface StoryData {
  badge: string
  headline: string
  subhead?: string
  stickerType: StoryStickerType
  stickerQuestion?: string
  stickerOptions?: string[]
  stickerLinkText?: string
  stickerLinkUrl?: string
  themeVariant: SlideThemeVariant
  uploadedImageUrl?: string
  dualBookData?: DualBookData
}

export interface ReelsStoryboard {
  hook3s: string
  visualDirection: string
  spokenScript: string
  onScreenText: string[]
  musicAudioVibe: string
  callToAction: string
  uploadedImageUrl?: string
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
  storyData?: StoryData
  reelsStoryboard?: ReelsStoryboard
  uploadedImageUrl?: string
  scheduledFor?: string | null
  publishedAt?: string | null
  createdAt: string
  notes?: string
}

export interface GeneratePostRequest {
  type: InstagramContentType
  topic: ContentTopic
  subject?: string
  subTopic?: string
  customPrompt?: string
  targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
  tone?: 'energetic' | 'informative' | 'coaching' | 'humorous'
  imageBase64?: string
  storyStickerType?: StoryStickerType
}

export interface WeeklyCalendarRequest {
  targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
  focusSubject?: string
  customInstructions?: string
}
