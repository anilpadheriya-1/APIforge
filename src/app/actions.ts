'use server'

import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

const IV_LENGTH = 16

function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error('ENCRYPTION_KEY is not set in environment variables.')
  }
  // Cryptographically hash the key to ensure it's exactly 32 bytes
  return crypto.createHash('sha256').update(key).digest()
}

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = getEncryptionKey()
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decrypt(text: string) {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift()!, 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const key = getEncryptionKey()
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export async function saveApiKey(apiKey: string) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const encryptedKey = encrypt(apiKey)

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      openai_api_key: encryptedKey,
      updated_at: new Date().toISOString()
    })

  if (error) {
    throw new Error('Failed to save API key')
  }

  return { success: true }
}

export async function getOpenAIUsage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('openai_api_key')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.openai_api_key) {
    return null // No API key saved yet
  }

  try {
    const apiKey = decrypt(profile.openai_api_key)

    // Get first day and last day of current month
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]

    const response = await fetch(`https://api.openai.com/v1/dashboard/billing/usage?start_date=${firstDay}&end_date=${lastDay}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error('OpenAI API Error:', await response.text())
      throw new Error('Failed to fetch from OpenAI')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching usage:', error)
    throw new Error('Failed to process usage data')
  }
}
