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
  const { cutiTypes, filters, title } = usePage().props
  const allFields = ['id', 'name', 'status', 'detail', 'created_at'];

  const { data, setData, get } = useForm({
    name: filters.name || '',
    sort: filters.sort || '',
    direction: filters.direction || 'asc',
  })

  const applyFilter = () => {
    get('/cuti-types', { preserveState: true })
  }

  const toggleSort = (field) => {
    const isSameField = data.sort === field
    const newDirection = isSameField && data.direction === 'asc' ? 'desc' : 'asc'
    setData({ ...data, sort: field, direction: newDirection })
    get('/cuti-types', { preserveState: true })
  }

  return (
    <div>
      <Head title={title} />
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Daftar Jenis Cuti</h2>
          <div className="flex gap-x-2">
            <ExportButton type="cuti-types" allFields={allFields} />
            <ImportButton type="cuti-types" />
            <Button asChild>
              <Link href="/cuti-types/create"><Plus /> Tambah</Link>
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
              {/* <TableHead>Aktif</TableHead> */}
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cutiTypes.length > 0 ? (
              cutiTypes.map((cutiType, index) => (
                <TableRow key={cutiType.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{cutiType.created_at}</TableCell>
                  <TableCell>{cutiType.name}</TableCell>
                  {/* <TableCell>{cutiType.status.toString()}</TableCell> */}
                  <TableCell>
                    <Button variant="default" size="sm" className="me-1" asChild>
                      <Link href={`/cuti-types/${cutiType.id}/edit`}><Pencil className="h-4 w-4" /></Link>
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
                            onClick={() => router.delete(`/cuti-types/${cutiType.id}`)}
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
                <TableCell colSpan={5} className="py-4">
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