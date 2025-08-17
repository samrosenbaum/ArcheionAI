"use client"

import { useState } from "react"
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export default function TestConnectionPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [isTesting, setIsTesting] = useState(false)

  const testSupabaseConnection = async () => {
    setIsTesting(true)
    const results: any = {}

    try {
      // Test 1: Environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      results.envVars = {
        url: supabaseUrl ? '✅ Set' : '❌ Missing',
        key: supabaseKey ? '✅ Set' : '❌ Missing'
      }

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing environment variables')
      }

      // Test 2: Supabase client creation
      const supabase = createClient(supabaseUrl, supabaseKey)
      results.clientCreation = '✅ Success'

      // Test 3: Storage bucket access
      try {
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
        if (bucketError) {
          results.storage = `❌ Error: ${bucketError.message}`
        } else {
          const documentsBucket = buckets.find(b => b.name === 'documents')
          results.storage = documentsBucket ? '✅ Documents bucket exists' : '❌ Documents bucket not found'
        }
      } catch (error) {
        results.storage = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }

      // Test 4: Database table access
      try {
        const { data: tables, error: tableError } = await supabase
          .from('documents')
          .select('count')
          .limit(1)
        
        if (tableError) {
          results.database = `❌ Error: ${tableError.message}`
        } else {
          results.database = '✅ Documents table accessible'
        }
      } catch (error) {
        results.database = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }

      // Test 5: Simple file upload test
      try {
        const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload('test/test.txt', testFile, { upsert: true })
        
        if (uploadError) {
          results.upload = `❌ Error: ${uploadError.message}`
        } else {
          results.upload = '✅ File upload works'
          
          // Clean up test file
          await supabase.storage.from('documents').remove(['test/test.txt'])
        }
      } catch (error) {
        results.upload = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }

    } catch (error) {
      results.overall = `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    setTestResults(results)
    setIsTesting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" />
            <h1 className="text-xl font-semibold text-slate-900">Connection Test</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Supabase Connection Test
          </h1>
          <p className="text-slate-600">
            Test your Supabase connection and database setup
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testSupabaseConnection}
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? 'Testing...' : 'Run Connection Test'}
            </Button>
          </CardContent>
        </Card>

        {Object.keys(testResults).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testResults).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className={`font-mono text-sm ${
                      typeof value === 'string' && value.includes('✅') 
                        ? 'text-green-600' 
                        : typeof value === 'string' && value.includes('❌')
                        ? 'text-red-600'
                        : 'text-slate-600'
                    }`}>
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Environment Variables</h3>
          <ul className="text-sm text-slate-800 space-y-1">
            {Object.entries(testResults.envVars || {}).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-mono text-sm">{key}</span>
                <span className={`text-sm ${
                  value === '✅ Set' ? 'text-slate-900' : 
                  value === '❌ Missing' ? 'text-slate-600' : 
                  'text-slate-500'
                }`}>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Next Steps</h3>
          <ol className="text-sm text-slate-800 space-y-1">
            <li>1. Check your environment variables in `.env.local`</li>
            <li>2. Run the SQL setup script in Supabase SQL Editor</li>
            <li>3. Verify your Supabase project settings</li>
            <li>4. Check the browser console for detailed error messages</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
