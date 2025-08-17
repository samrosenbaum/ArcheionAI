"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/ui/navigation"
import { createClient } from '@supabase/supabase-js'
import { 
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  HardDrive,
  Settings
} from "lucide-react"

export default function TestStoragePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [testResults, setTestResults] = useState<any>({})
  const [isTesting, setIsTesting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const runStorageTests = async () => {
    setIsTesting(true)
    const results: any = {}

    try {
      console.log('Starting storage tests...')
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Test 1: Check environment variables
      results.envVars = {
        'NEXT_PUBLIC_SUPABASE_URL': supabaseUrl ? '✅ Set' : '❌ Missing',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': supabaseKey ? '✅ Set' : '❌ Missing'
      }

      // Test 2: Test Supabase client creation
      try {
        const { data, error } = await supabase.auth.getSession()
        results.clientCreation = error ? `❌ Error: ${error.message}` : '✅ Success'
        results.session = data.session ? '✅ Active session' : '❌ No session'
      } catch (error) {
        results.clientCreation = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }

      // Test 3: Check storage buckets
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets()
        if (error) {
          results.storageBuckets = `❌ Error: ${error.message}`
        } else {
          const documentsBucket = buckets?.find(b => b.name === 'documents')
          results.storageBuckets = documentsBucket ? '✅ Documents bucket found' : '❌ Documents bucket not found'
          results.bucketDetails = buckets?.map(b => ({ name: b.name, public: b.public })) || []
        }
      } catch (error) {
        results.storageBuckets = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }

      // Test 4: Test storage policies
      try {
        // Try to list objects in documents bucket
        const { data: objects, error } = await supabase.storage
          .from('documents')
          .list('', { limit: 1 })
        
        if (error) {
          results.storagePolicies = `❌ Error: ${error.message}`
        } else {
          results.storagePolicies = '✅ Storage access successful'
        }
      } catch (error) {
        results.storagePolicies = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }

      // Test 5: Check database tables
      try {
        const { data: tables, error } = await supabase
          .from('documents')
          .select('id')
          .limit(1)
        
        if (error) {
          results.databaseTables = `❌ Error: ${error.message}`
        } else {
          results.databaseTables = '✅ Documents table accessible'
        }
      } catch (error) {
        results.databaseTables = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }

      // Test 6: Test file upload (if file selected)
      if (selectedFile) {
        try {
          const testPath = `test/${Date.now()}-${selectedFile.name}`
          const { data, error } = await supabase.storage
            .from('documents')
            .upload(testPath, selectedFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (error) {
            results.fileUpload = `❌ Upload failed: ${error.message}`
          } else {
            results.fileUpload = '✅ File upload successful'
            
            // Clean up test file
            await supabase.storage
              .from('documents')
              .remove([testPath])
          }
        } catch (error) {
          results.fileUpload = `❌ Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      }

    } catch (error) {
      results.generalError = `❌ General error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    setTestResults(results)
    setIsTesting(false)
    console.log('Storage tests completed:', results)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" />
            <Navigation 
              showMobileMenu={showMobileMenu}
              onMobileMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Storage Test</h1>
          <p className="text-slate-600">Test and troubleshoot Supabase storage configuration</p>
        </div>

        {/* Test Controls */}
        <Card className="border border-slate-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-slate-700" />
              <span>Test Configuration</span>
            </CardTitle>
            <CardDescription>Run diagnostics on your Supabase setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="test-file">Test File (Optional)</Label>
              <Input
                id="test-file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">
                Select a small file to test upload functionality
              </p>
            </div>
            
            <Button 
              onClick={runStorageTests} 
              disabled={isTesting}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isTesting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Run Storage Tests
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-6">
            {/* Environment Variables */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-slate-700" />
                  <span>Environment Variables</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(testResults.envVars || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-mono text-sm">{key}</span>
                      <span className={`text-sm ${
                        value === '✅ Set' ? 'text-slate-900' :
                        value === '❌ Missing' ? 'text-slate-600' :
                        'text-slate-500'
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supabase Client */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-slate-700" />
                  <span>Supabase Client</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">Client Creation</span>
                    <span className={`text-sm ${
                      testResults.clientCreation?.includes('✅') ? 'text-slate-900' : 'text-slate-600'
                    }`}>
                      {testResults.clientCreation}
                    </span>
                  </div>
                  {testResults.session && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm">Session Status</span>
                      <span className={`text-sm ${
                        testResults.session?.includes('✅') ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {testResults.session}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Storage Buckets */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-slate-700" />
                  <span>Storage Buckets</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">Bucket Access</span>
                    <span className={`text-sm ${
                      testResults.storageBuckets?.includes('✅') ? 'text-slate-900' : 'text-slate-600'
                    }`}>
                      {testResults.storageBuckets}
                    </span>
                  </div>
                  
                  {testResults.bucketDetails && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Available Buckets:</h4>
                      <div className="space-y-1">
                        {testResults.bucketDetails.map((bucket: any, index: number) => (
                          <div key={index} className="text-xs text-slate-600 bg-slate-100 p-2 rounded">
                            <span className="font-mono">{bucket.name}</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              bucket.public ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {bucket.public ? 'Public' : 'Private'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Storage Policies */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-slate-700" />
                  <span>Storage Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm">Policy Access</span>
                  <span className={`text-sm ${
                    testResults.storagePolicies?.includes('✅') ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {testResults.storagePolicies}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Database Tables */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-slate-700" />
                  <span>Database Tables</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm">Documents Table</span>
                  <span className={`text-sm ${
                    testResults.databaseTables?.includes('✅') ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {testResults.databaseTables}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* File Upload Test */}
            {selectedFile && (
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-slate-700" />
                    <span>File Upload Test</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm">Test File: {selectedFile.name}</span>
                      <span className="text-xs text-slate-500">{selectedFile.size} bytes</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm">Upload Result</span>
                      <span className={`text-sm ${
                        testResults.fileUpload?.includes('✅') ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        {testResults.fileUpload}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* General Errors */}
            {testResults.generalError && (
              <Card className="border border-red-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span>General Errors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-sm text-red-700">{testResults.generalError}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Troubleshooting Guide */}
        <Card className="border border-slate-200 shadow-sm mt-8">
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
            <CardDescription>Troubleshoot common storage problems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-1">Storage Bucket Not Found</h4>
                <p className="text-sm text-slate-600">
                  Run the database setup script in Supabase SQL Editor to create the 'documents' bucket
                </p>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-1">Permission Denied</h4>
                <p className="text-sm text-slate-600">
                  Check that RLS policies are properly configured for the storage.objects table
                </p>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-1">Environment Variables Missing</h4>
                <p className="text-sm text-slate-600">
                  Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
