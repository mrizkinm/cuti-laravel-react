import { Button } from '@/components/ui/button'
import { Head, Link } from '@inertiajs/react'
import { LogIn } from 'lucide-react'
import React from 'react'

const LandingPage = () => {
  return (
    <div>
      <Head title="Landing Page" />
      <div className="flex min-h-screen flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Landing Page</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600"></span>
            <Button variant="default" asChild>
              <Link href="/login"><LogIn /> Login</Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1">
          <main className="flex-1 overflow-y-auto">
            <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
              <h1 className='text-4xl font-bold mb-4'>Aplikasi Pengajuan Cuti</h1>
              <p className='text-lg mb-4'>Landing page aplikasi</p>
              <Button variant="default" asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default LandingPage