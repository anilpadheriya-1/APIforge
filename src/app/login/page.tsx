import { LoginForm } from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm message={message} />
    </div>
  )
}
