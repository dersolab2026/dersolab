import { google } from 'googleapis'
import { getValidInstructorAccessToken } from './calendar-auth'

export interface BusyBlock {
  start: string
  end: string
}

export async function getGoogleBusyBlocks(
  instructorId: string,
  timeMinISO: string,
  timeMaxISO: string
): Promise<BusyBlock[]> {
  const accessToken = await getValidInstructorAccessToken(instructorId)

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMinISO,
      timeMax: timeMaxISO,
      items: [{ id: 'primary' }],
    },
  })

  const busy = data.calendars?.primary?.busy ?? []
  return busy.map((b) => ({ start: b.start!, end: b.end! }))
}
