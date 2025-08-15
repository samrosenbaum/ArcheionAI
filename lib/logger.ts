// Simple structured logging utility
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(entry: LogEntry): string {
    const timestamp = entry.timestamp
    const level = entry.level.toUpperCase().padEnd(5)
    const message = entry.message
    
    let logString = `[${timestamp}] ${level} ${message}`
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      logString += ` | ${JSON.stringify(entry.context)}`
    }
    
    if (entry.error) {
      logString += ` | Error: ${entry.error.message}`
      if (this.isDevelopment && entry.error.stack) {
        logString += `\n${entry.error.stack}`
      }
    }
    
    return logString
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }

    const formattedLog = this.formatLog(entry)

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedLog)
        }
        break
      case 'info':
        console.info(formattedLog)
        break
      case 'warn':
        console.warn(formattedLog)
        break
      case 'error':
        console.error(formattedLog)
        break
    }

    // In production, you might want to send logs to a service like DataDog, LogRocket, etc.
    if (!this.isDevelopment && level === 'error') {
      this.sendToExternalService(entry)
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // Placeholder for external logging service integration
    // Example: DataDog, Sentry, LogRocket, etc.
    try {
      // This would be implemented based on your chosen logging service
      // Example: Sentry.captureException(entry.error)
      // Example: DataDog.log(entry)
    } catch (err) {
      // Fallback to console if external service fails
      console.error('Failed to send log to external service:', err)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log('error', message, context, error)
  }

  // Convenience methods for common logging patterns
  logApiRequest(method: string, url: string, statusCode: number, duration: number) {
    this.info('API Request', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    })
  }

  logDocumentUpload(fileName: string, fileSize: number, userId: string) {
    this.info('Document Upload', {
      fileName,
      fileSize: `${(fileSize / 1024 / 1024).toFixed(2)}MB`,
      userId,
    })
  }

  logDocumentAnalysis(documentId: string, analysisType: string, duration: number) {
    this.info('Document Analysis', {
      documentId,
      analysisType,
      duration: `${duration}ms`,
    })
  }

  logError(error: Error, context?: Record<string, any>) {
    this.error('An error occurred', context, error)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for external use
export type { LogLevel, LogEntry }
