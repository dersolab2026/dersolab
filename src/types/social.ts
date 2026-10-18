export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'linkedin'

export type InstagramContentType = 'carousel' | 'post' | 'reels' | 'story' | 'x_thread'

export type AgentPersona = 'grok_witty' | 'sherlock_exam' | 'growth_mentor' | 'direct_no_bs'

export type ContentTopic =
  | 'exam_tactics'
  | 'dersolab_features'
  | 'motivation'
  | 'daily_question'
  | 'weekly_plan'
  | 'book_recommendation'
  | 'custom'

export type PostStatus = 'draft' | 'approved' | 'scheduled' | 'published'

export type SlideThemeVariant = 'lab_dark' | 'neon_orange' | 'cyan_cyber' | 'purple_matrix' | 'grok_cyber'

export type StoryStickerType = 'quiz' | 'poll' | 'link' | 'countdown' | 'question_box'

export type ImageStylePreset =
  | 'cyber_lab'
  | 'scientific_diagram'
  | 'minimal_vector'
  | 'realistic_study'
  | 'mascot_fox'

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
  aiImagePrompt?: string
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

export interface HookVariation {
  id: string
  type: 'curiosity' | 'contrarian' | 'fomo' | 'grok_witty' | 'direct_value'
  title: string
  hookText: string
  viralityScore: number
  reason: string
}

export interface ViralityAnalysis {
  score: number // 0 - 100
  hookStrength: number // 0 - 100
  savePotential: number // 0 - 100
  shareability: number // 0 - 100
  commentBait: number // 0 - 100
  verdict: string
}

export interface XTweetItem {
  tweetNumber: number
  text: string
  charCount: number
  mediaPrompt?: string
}

export interface XThreadData {
  threadHook: string
  tweets: XTweetItem[]
  totalTweets: number
  estimatedReadTime: string
  callToAction: string
}

export interface SimulatedComment {
  id: string
  userHandle: string
  commentText: string
  userType: 'stressed_student' | 'curious' | 'doubtful' | 'parent'
  suggestedReplies: {
    persona: AgentPersona
    personaLabel: string
    replyText: string
  }[]
}

export interface PedagogicalAudit {
  isApproved: boolean
  mebCurriculumMatch: boolean
  osymRelevanceScore: number // 0 - 100
  checkedRules: string[]
  pedagogyNotes: string
  verifiedByAgent: string
  lastCheckedAt: string
}

export interface AgentLearningInsight {
  id: string
  title: string
  category: 'visual' | 'timing' | 'hooks' | 'stickers'
  metricBoost: string
  confidenceScore: number
  actionableTip: string
  appliedPattern: string
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
  platform?: SocialPlatform
  persona?: AgentPersona
  virality?: ViralityAnalysis
  hookMatrix?: HookVariation[]
  pedagogicalAudit?: PedagogicalAudit
  xThreadData?: XThreadData
  simulatedComments?: SimulatedComment[]
  isAutoPilot?: boolean
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
  persona?: AgentPersona
  platform?: SocialPlatform
  imageBase64?: string
  storyStickerType?: StoryStickerType
}

export interface WeeklyCalendarRequest {
  targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
  focusSubject?: string
  customInstructions?: string
  persona?: AgentPersona
}

export interface GrokAgentCommandRequest {
  command: string
  persona?: AgentPersona
  targetPlatform?: SocialPlatform
  targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
  focusSubject?: string
  autoEnqueue?: boolean
}

export interface GenerateImageRequest {
  prompt: string
  stylePreset?: ImageStylePreset
  aspectRatio?: '1:1' | '9:16' | '16:9'
  subject?: string
  slideNumber?: number
}

export interface GenerateImageResponse {
  success: boolean
  imageUrl: string
  prompt: string
  stylePreset: ImageStylePreset
  aspectRatio: '1:1' | '9:16' | '16:9'
}

