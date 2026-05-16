import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SettingsForm } from './settings-form'
import { StatsCards } from './stats-cards'
import { DailyUsageTable } from './daily-usage-table'
import { getOpenAIUsage } from '@/app/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  let usageData = null
  let totalSpend = 0
  let apiError = null

  try {
    usageData = await getOpenAIUsage()
    if (usageData && usageData.error) {
      apiError = usageData.error
      usageData = null
    } else if (usageData) {
      totalSpend = usageData.total_usage ? usageData.total_usage / 100 : 0
    }
  } catch (error) {
    console.error("Failed to load usage data")
    apiError = "An unexpected error occurred while loading usage data."
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">APIForge Dashboard</h1>
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </header>

      {apiError && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md text-sm font-medium">
          {apiError}
        </div>
      )}

      <div className="grid gap-8">
        <StatsCards
          totalSpend={totalSpend}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <DailyUsageTable dailyCosts={usageData?.daily_costs || []} />
          </div>
          <div className="md:col-span-1">
            <SettingsForm />
          </div>
        </div>
      </div>
    </div>
  )
}
