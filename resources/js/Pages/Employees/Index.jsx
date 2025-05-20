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
import ExportButton from '../ExportButton'
import ImportButton from '../ImportButton'

const Index = () => {
  const { employees, filters, title } = usePage().props
  const allFields = ['id', 'nip', 'name', 'email', 'phone', 'status', 'date_of_birth', 'detail', 'created_at'];

  const { data, setData, get } = useForm({
    nip: filters.nip || '',
    name: filters.name || '',
    email: filters.email || '',
    sort: filters.sort || '',
    direction: filters.direction || 'asc',
  })

  const applyFilter = () => {
    get('/employees', { preserveState: true })
  }

  const toggleSort = (field) => {
    const isSameField = data.sort === field
    const newDirection = isSameField && data.direction === 'asc' ? 'desc' : 'asc'
    setData({ ...data, sort: field, direction: newDirection })
    get('/employees', { preserveState: true })
  }

  return (
    <div>
      <Head title={title} />
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Daftar Karyawan</h2>
          <div className="flex gap-x-2">
            <ExportButton type="employees" allFields={allFields} />
            <ImportButton type="employees" />
            <Button asChild>
              <Link href="/employees/create"><Plus /> Tambah</Link>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <Input
            type="search"
            placeholder="Cari nip"
            value={data.nip}
            onChange={(e) => setData('nip', e.target.value)}
          />
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
          <Button onClick={applyFilter}>Filter</Button>
        </div>

        <Table className="border-1">
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead onClick={() => toggleSort('created_at')} className="cursor-pointer">
                Created At <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('nip')} className="cursor-pointer">
                NIP <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('name')} className="cursor-pointer">
                Nama <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('email')} className="cursor-pointer">
                Email <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Aktif</TableHead>
              <TableHead>Aksi</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{employee.created_at}</TableCell>
                  <TableCell>{employee.nip}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.status.toString()}</TableCell>
                  <TableCell>
                    <Button variant="default" size="sm" className="me-1" asChild>
                      <Link href={`/employees/${employee.id}/edit`}><Pencil className="h-4 w-4" /></Link>
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
                            onClick={() => router.delete(`/employees/${employee.id}`)}
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
                <TableCell colSpan={8} className="py-4">
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