"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { CheckCircle, AlertTriangle, Database } from "lucide-react"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export default function TestDBPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [isTesting, setIsTesting] = useState(false)

  const runTests = async () => {
    setIsTesting(true)
    const results: any = {}

    try {
      // Test 1: Basic connection
      console.log('Testing basic Supabase connection...')
      const { data, error } = await supabase.from('documents').select('count').limit(1)
      results.connection = error ? { success: false, error: error.message } : { success: true, data }
    } catch (error: any) {
      results.connection = { success: false, error: error.message }
    }

    try {
      // Test 2: Check if documents table exists
      console.log('Checking if documents table exists...')
      const { data, error } = await supabase.from('documents').select('*').limit(1)
      results.tableExists = error ? { success: false, error: error.message } : { success: true, data }
    } catch (error: any) {
      results.tableExists = { success: false, error: error.message }
    }

    try {
      // Test 3: Test insert (should fail due to RLS, but should reach the table)
      console.log('Testing insert operation...')
      const testData = {
        user_id: 'test-user-id',
        name: 'test-document.pdf',
        file_path: 'test/test.pdf',
        file_size: 1024,
        file_type: 'application/pdf',
        category: 'test',
        status: 'test'
      }
      
      const { data, error } = await supabase.from('documents').insert([testData]).select()
      results.insert = error ? { success: false, error: error.message } : { success: true, data }
    } catch (error: any) {
      results.insert = { success: false, error: error.message }
    }

    try {
      // Test 4: Check storage bucket
      console.log('Testing storage bucket access...')
      const { data, error } = await supabase.storage.listBuckets()
      results.storage = error ? { success: false, error: error.message } : { success: true, data }
    } catch (error: any) {
      results.storage = { success: false, error: error.message }
    }

    setTestResults(results)
    setIsTesting(false)
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" />
            <Navigation />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Database Connection Test</h1>
          <p className="text-slate-600">Test your Supabase database connection and identify issues</p>
        </div>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-slate-600" />
              <span>Connection Test</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Supabase URL</Label>
                <Input value={supabaseUrl} readOnly className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">API Key (first 20 chars)</Label>
                <Input value={supabaseKey.substring(0, 20) + '...'} readOnly className="mt-1" />
              </div>
              <Button 
                onClick={runTests} 
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? 'Running Tests...' : 'Run Database Tests'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Test Results</h2>
            
            {/* Connection Test */}
            {testResults.connection && (
              <Card className={`border ${getStatusColor(testResults.connection.success)}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    {getStatusIcon(testResults.connection.success)}
                    <span>Basic Connection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {testResults.connection.success 
                      ? 'Successfully connected to Supabase' 
                      : `Connection failed: ${testResults.connection.error}`
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Table Exists Test */}
            {testResults.tableExists && (
              <Card className={`border ${getStatusColor(testResults.tableExists.success)}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    {getStatusIcon(testResults.tableExists.success)}
                    <span>Documents Table Access</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {testResults.tableExists.success 
                      ? 'Documents table is accessible' 
                      : `Table access failed: ${testResults.tableExists.error}`
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Insert Test */}
            {testResults.insert && (
              <Card className={`border ${getStatusColor(testResults.insert.success)}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    {getStatusIcon(testResults.insert.success)}
                    <span>Insert Operation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {testResults.insert.success 
                      ? 'Insert operation successful (test data added)' 
                      : `Insert failed: ${testResults.insert.error}`
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Storage Test */}
            {testResults.storage && (
              <Card className={`border ${getStatusColor(testResults.storage.success)}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    {getStatusIcon(testResults.storage.success)}
                    <span>Storage Access</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {testResults.storage.success 
                      ? 'Storage buckets accessible' 
                      : `Storage access failed: ${testResults.storage.error}`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Troubleshooting Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Common Issues:</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• <strong>Connection failed:</strong> Check your Supabase URL and API key</li>
                <li>• <strong>Table access failed:</strong> Database table might not exist or RLS is blocking access</li>
                <li>• <strong>Insert failed:</strong> RLS policies might be too restrictive</li>
                <li>• <strong>Storage failed:</strong> Storage bucket might not exist or policies are blocking access</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Next Steps:</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Run the database setup script if tables don't exist</li>
                <li>• Check RLS policies in Supabase dashboard</li>
                <li>• Verify storage bucket configuration</li>
                <li>• Check browser console for detailed error messages</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
