import React from 'react'
import { Link, usePage, useForm, router, Head } from '@inertiajs/react'
import DashboardLayout from '../Layouts/DashboardLayout'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ExportButton from '../ExportButton'
import ImportButton from '../ImportButton'

const Index = () => {
  const { users, filters, roles, title } = usePage().props
  const allFields = ['id', 'name', 'email', 'role_id', 'status', 'detail', 'created_at'];
  
  const { data, setData, get } = useForm({
    name: filters.name || '',
    email: filters.email || '',
    role: filters.role || 'all',
    sort: filters.sort || '',
    direction: filters.direction || 'asc',
  })

  const applyFilter = () => {
    get('/users', { preserveState: true })
  }

  const toggleSort = (field) => {
    const isSameField = data.sort === field
    const newDirection = isSameField && data.direction === 'asc' ? 'desc' : 'asc'
    setData({ ...data, sort: field, direction: newDirection })
    get('/users', { preserveState: true })
  }

  return (
    <div>
      <Head title={title} />
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Daftar User</h2>
          <div className="flex gap-x-2">
            <ExportButton type="users" allFields={allFields} />
            <ImportButton type="users" />
            <Button asChild>
              <Link href="/users/create"><Plus /> Tambah</Link>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <Input
            type="search"
            placeholder="Cari nama"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
          />
          <Input
            type="search"
            placeholder="Cari email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
          />
          <Select value={data.role} onValueChange={(val) => setData('role', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua role</SelectItem>
                {roles.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={applyFilter}>Filter</Button>
        </div>

        <Table className="border-1">
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead onClick={() => toggleSort('created_at')} className="cursor-pointer">
                Created At <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('name')} className="cursor-pointer">
                Nama <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('email')} className="cursor-pointer">
                Email <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Aktif</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status.toString()}</TableCell>
                  <TableCell>
                    <Button variant="default" size="sm" className="me-1" asChild>
                      <Link href={`/users/${user.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Yakin ingin menghapus data ini?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => router.delete(`/users/${user.id}`)}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="text-center">
                <TableCell colSpan={7} className="py-4">
                  Tidak ada data yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

Index.layout = (page) => <DashboardLayout children={page} />
export default Index