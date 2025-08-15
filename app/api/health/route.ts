import { NextResponse } from 'next/server'
import { supabase, isDemoMode } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function GET() {
  const startTime = Date.now()
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
    services: {
      database: 'unknown',
      ai: 'unknown',
      sms: 'unknown'
    },
    checks: {
      database: false,
      ai: false,
      sms: false
    }
  }

  try {
    // Check database connection
    if (!isDemoMode) {
      try {
        const { error } = await supabase.from('documents').select('count').limit(1)
        if (error) throw error
        health.services.database = 'healthy'
        health.checks.database = true
      } catch (error) {
        health.services.database = 'unhealthy'
        health.checks.database = false
        logger.error('Database health check failed', { error })
      }
    } else {
      health.services.database = 'demo_mode'
      health.checks.database = true
    }

    // Check AI service
    try {
      const hasApiKey = !!process.env.ANTHROPIC_API_KEY
      health.services.ai = hasApiKey ? 'healthy' : 'not_configured'
      health.checks.ai = hasApiKey
    } catch (error) {
      health.services.ai = 'unhealthy'
      health.checks.ai = false
      logger.error('AI service health check failed', { error })
    }

    // Check SMS service
    try {
      const hasTwilioConfig = !!(
        process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_PHONE_NUMBER
      )
      health.services.sms = hasTwilioConfig ? 'healthy' : 'not_configured'
      health.checks.sms = hasTwilioConfig
    } catch (error) {
      health.services.sms = 'unhealthy'
      health.checks.sms = false
      logger.error('SMS service health check failed', { error })
    }

    // Determine overall status
    const allChecksPassed = Object.values(health.checks).every(check => check === true)
    health.status = allChecksPassed ? 'healthy' : 'degraded'

    const duration = Date.now() - startTime
    logger.logApiRequest('GET', '/api/health', 200, duration)

    return NextResponse.json(health, { status: allChecksPassed ? 200 : 503 })

  } catch (error) {
    const duration = Date.now() - startTime
    logger.error('Health check failed', { error, duration })
    
    health.status = 'unhealthy'
    return NextResponse.json(health, { status: 500 })
  }
}
