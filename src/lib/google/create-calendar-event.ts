import { google } from 'googleapis'
import { getValidInstructorAccessToken } from './calendar-auth'

interface CreateEventParams {
  instructorId: string
  studentName: string
  startTime: string
  endTime: string
  bookingId: string
}

interface CreateEventResult {
  eventId: string
  meetLink: string
}

export async function createCalendarEventWithMeet(
  params: CreateEventParams
): Promise<CreateEventResult> {
  const accessToken = await getValidInstructorAccessToken(params.instructorId)

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const { data: event } = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `DersoLab dersi — ${params.studentName}`,
      start: { dateTime: params.startTime },
      end: { dateTime: params.endTime },
      conferenceData: {
        createRequest: {
          requestId: params.bookingId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  })

  if (!event.id || !event.hangoutLink) {
    throw new Error('Google Calendar Meet linki üretemedi')
  }

  return { eventId: event.id, meetLink: event.hangoutLink }
}
