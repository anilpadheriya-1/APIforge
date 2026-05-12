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
        <CardContent>
          <p className="text-muted-foreground text-sm">No usage data available.</p>
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
