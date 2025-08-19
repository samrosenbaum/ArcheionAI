import { type NextRequest, NextResponse } from "next/server"
import { SMSIntegrationService } from "@/lib/sms-integration"
import { validateSMSWebhook } from "@/lib/validation"
import { handleError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const phoneNumber = formData.get("From") as string
    const messageBody = formData.get("Body") as string
    const mediaCount = Number.parseInt((formData.get("NumMedia") as string) || "0")

    // Extract media URLs if present
    const mediaUrls: string[] = []
    for (let i = 0; i < mediaCount; i++) {
      const mediaUrl = formData.get(`MediaUrl${i}`) as string
      if (mediaUrl) {
        mediaUrls.push(mediaUrl)
      }
    }

    // Validate the SMS data
    const smsData = validateSMSWebhook({
      from: phoneNumber,
      body: messageBody,
      mediaUrl: mediaUrls,
      timestamp: new Date()
    })

    // Process the SMS
    const result = await SMSIntegrationService.processSMSWebhook(smsData)

    if (!result.success) {
      throw new Error(result.error || 'SMS processing failed')
    }

    // Return TwiML response
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${result.message || 'Message processed successfully'}</Message>
</Response>`

    return new NextResponse(twimlResponse, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("SMS webhook error:", error)
    
    const appError = handleError(error)
    const errorMessage = appError.message || 'Sorry, something went wrong. Please try again later.'

    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${errorMessage}</Message>
</Response>`

    return new NextResponse(errorResponse, {
      status: appError.statusCode,
      headers: {
        "Content-Type": "text/xml",
      },
    })
  }
}
