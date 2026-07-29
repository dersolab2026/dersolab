import { google } from 'googleapis'
import { getValidInstructorAccessToken } from './calendar-auth'

export async function deleteCalendarEvent(instructorId: string, eventId: string): Promise<void> {
  const accessToken = await getValidInstructorAccessToken(instructorId)

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    await calendar.events.delete({ calendarId: 'primary', eventId })
  } catch (err) {
    console.error('Google Calendar event silme hatası (yoksayıldı):', err)
  }
}
