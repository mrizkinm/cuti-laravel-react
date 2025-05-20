import React from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { LogOut, LayoutDashboard, Users, FileText, UserCheck, User2, FileArchive } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({ children }) {
  const { auth } = usePage().props
  const { url } = usePage()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'User', href: '/users', icon: User2, role: 'Administrator' },
    { name: 'Role', href: '/roles', icon: UserCheck },
    { name: 'Karyawan', href: '/employees', icon: Users },
    { name: 'Jenis Cuti', href: '/cuti-types', icon: FileArchive },
    { name: 'Pengajuan Cuti', href: '/cuti-requests', icon: FileText },
    // Add more nav items as needed
  ]
  const csrfToken = usePage().props.csrf_token

  const handleLogout = () => {
    router.post('/logout', {}, {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {auth.user.name} ({auth.user.role})</span>
          <Button variant="destructive" size="icon" onClick={handleLogout}><LogOut /></Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 space-y-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              if (item.role && auth.user.role !== item.role) return null

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition',
                    url.startsWith(item.href) && 'bg-gray-200 font-semibold'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}