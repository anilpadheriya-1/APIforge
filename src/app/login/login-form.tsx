'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login, signup } from './actions'

export function LoginForm({ message }: { message?: string }) {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome to APIForge</CardTitle>
        <CardDescription>Sign in to your account or create a new one.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {message && (
            <div className="text-sm text-red-500 font-medium p-2 bg-red-50 rounded-md">
              {message}
            </div>
          )}

          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </div>
          </form>

          <form action={signup} className="w-full">
            <input type="hidden" name="email" id="signup-email" />
            <input type="hidden" name="password" id="signup-password" />

            <Button
              type="submit"
              variant="outline"
              className="w-full mt-2"
              onClick={(e) => {
                const emailInput = document.getElementById('email') as HTMLInputElement;
                const passwordInput = document.getElementById('password') as HTMLInputElement;
                const targetEmail = document.getElementById('signup-email') as HTMLInputElement;
                const targetPassword = document.getElementById('signup-password') as HTMLInputElement;

                if (emailInput && passwordInput && targetEmail && targetPassword) {
                  targetEmail.value = emailInput.value;
                  targetPassword.value = passwordInput.value;

                  if (!emailInput.value || !passwordInput.value) {
                    e.preventDefault();
                    alert('Please fill in both email and password fields to sign up.');
                  }
                }
              }}
            >
              Sign up
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
