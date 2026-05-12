'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { saveApiKey } from '@/app/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function SettingsForm() {
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey) return

    setLoading(true)
    try {
      await saveApiKey(apiKey)
      toast.success('API Key saved successfully')
      setApiKey('')
      router.refresh()
    } catch (error) {
      toast.error('Failed to save API Key')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Configure your OpenAI API credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Your key is encrypted and stored securely.</p>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save API Key'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
