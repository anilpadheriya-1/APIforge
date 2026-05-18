import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl tracking-tight">APIForge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Log in
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 bg-slate-50">
        <div className="space-y-4 max-w-[800px]">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Take Control of Your OpenAI API Usage
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            APIForge provides a secure, powerful dashboard to track your OpenAI API spend and monitor daily usage. Never get caught off-guard by an API bill again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
