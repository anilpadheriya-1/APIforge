import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { LineChart } from 'lucide-react'

type DailyUsageProps = {
  dailyCosts: { timestamp: number; line_items: { cost: number }[] }[]
}

export function DailyUsageTable({ dailyCosts }: DailyUsageProps) {
  if (!dailyCosts || dailyCosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <LineChart className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-lg font-medium">No usage data</p>
          <p className="text-muted-foreground text-sm max-w-sm mt-1">
            Add your OpenAI API key in the settings to start tracking your daily costs and usage.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate total cost per day
  const formattedData = dailyCosts.map(day => {
    const totalCost = day.line_items.reduce((sum, item) => sum + item.cost, 0)
    return {
      date: new Date(day.timestamp * 1000),
      cost: totalCost
    }
  }).sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Usage Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Cost (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedData.map((day, index) => (
              <TableRow key={index}>
                <TableCell>{format(day.date, 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">${day.cost.toFixed(4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
