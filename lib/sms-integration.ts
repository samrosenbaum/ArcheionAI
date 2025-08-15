export interface SMSMessage {
  from: string
  body: string
  mediaUrl?: string[]
  timestamp: Date
}

export interface SMSResponse {
  success: boolean
  message?: string
  error?: string
}

export class SMSIntegrationService {
  private static isConfigured(): boolean {
    return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER)
  }

  static async sendSMS(to: string, message: string): Promise<SMSResponse> {
    if (!this.isConfigured()) {
      console.log(`Demo SMS to ${to}: ${message}`)
      return {
        success: true,
        message: "SMS sent successfully (demo mode)",
      }
    }

    try {
      // In a real implementation, this would use the Twilio SDK
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      // const result = await client.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: to
      // })

      return {
        success: true,
        message: "SMS sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "SMS sending failed",
      }
    }
  }

  static async processSMSWebhook(smsData: SMSMessage): Promise<SMSResponse> {
    try {
      const { from, body, mediaUrl } = smsData

      // Extract user intent from SMS body
      const intent = this.parseUserIntent(body)

      switch (intent.action) {
        case "upload_document":
          if (mediaUrl && mediaUrl.length > 0) {
            // Process attached images/documents
            for (const url of mediaUrl) {
              await this.processMediaAttachment(url, from)
            }
            await this.sendSMS(from, "Document received and processing started. You'll get an update shortly!")
          } else {
            await this.sendSMS(from, "Please attach a document image to upload.")
          }
          break

        case "get_insights":
          const insights = await this.getUserInsights(from)
          await this.sendSMS(from, insights)
          break

        case "help":
          await this.sendSMS(
            from,
            "Send me photos of your financial documents and I'll analyze them for you! Try: 'analyze my tax document' with an image attached.",
          )
          break

        default:
          await this.sendSMS(
            from,
            "I can help analyze your financial documents. Send me a photo with a description like 'analyze this tax document'.",
          )
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Webhook processing failed",
      }
    }
  }

  private static parseUserIntent(message: string): { action: string; category?: string } {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("upload") || lowerMessage.includes("analyze") || lowerMessage.includes("process")) {
      let category = "other"
      if (lowerMessage.includes("tax")) category = "tax"
      else if (lowerMessage.includes("insurance")) category = "insurance"
      else if (lowerMessage.includes("bank")) category = "banking"
      else if (lowerMessage.includes("investment")) category = "investments"

      return { action: "upload_document", category }
    }

    if (lowerMessage.includes("insight") || lowerMessage.includes("summary") || lowerMessage.includes("report")) {
      return { action: "get_insights" }
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("?")) {
      return { action: "help" }
    }

    return { action: "unknown" }
  }

  private static async processMediaAttachment(mediaUrl: string, userPhone: string): Promise<void> {
    try {
      // In a real implementation, this would:
      // 1. Download the media from Twilio
      // 2. Convert to appropriate format
      // 3. Run OCR/AI analysis
      // 4. Store in document management system
      // 5. Generate insights

      console.log(`Processing media attachment: ${mediaUrl} for user: ${userPhone}`)

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Send processing complete notification
      await this.sendSMS(
        userPhone,
        "✅ Document analysis complete! Found potential tax savings of $1,200. Check your dashboard for details.",
      )
    } catch (error) {
      await this.sendSMS(userPhone, "❌ Sorry, there was an error processing your document. Please try again.")
    }
  }

  private static async getUserInsights(_userPhone: string): Promise<string> {
    // In a real implementation, this would fetch actual user insights
    return `📊 Your latest insights:
• Tax savings opportunity: $1,200
• Insurance coverage gap identified
• 3 new documents processed this week
• Next deadline: Tax filing (Apr 15)

Visit your dashboard for details!`
  }
}
