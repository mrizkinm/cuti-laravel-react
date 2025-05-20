import React from 'react'
import { Link, usePage, useForm, router, Head } from '@inertiajs/react'
import DashboardLayout from '../Layouts/DashboardLayout'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
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
  const { cutiRequests, filters, title } = usePage().props
  const allFields = ['id', 'employee_id', 'cuti_type_id', 'start_date', 'end_date', 'reason', 'approved', 'document', 'detail','created_at'];

  const { data, setData, get } = useForm({
    employee: filters.employee || '',
    approved: filters.approved || '',
    sort: filters.sort || '',
    direction: filters.direction || 'asc',
  })

  const applyFilter = () => {
    get('/cuti-requests', { preserveState: true })
  }

  const toggleSort = (field) => {
    const isSameField = data.sort === field
    const newDirection = isSameField && data.direction === 'asc' ? 'desc' : 'asc'
    setData({ ...data, sort: field, direction: newDirection })
    get('/cuti-requests', { preserveState: true })
  }

  return (
    <div>
      <Head title={title} />
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Daftar Pengajuan Cuti</h2>
          <div className="flex gap-x-2">
            <ExportButton type="cuti-requests" allFields={allFields} />
            <ImportButton type="cuti-requests" />
            <Button asChild>
              <Link href="/cuti-requests/create"><Plus /> Tambah</Link>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <Input
            type="search"
            placeholder="Cari nama"
            value={data.employee}
            onChange={(e) => setData('employee', e.target.value)}
          />
          <Select value={data.approved} onValueChange={(val) => setData('approved', val)}>
            <SelectTrigger>
              <span>
                {data.approved === 'all'
                  ? 'Semua Status'
                  : data.approved === 'true'
                  ? 'Disetujui'
                  : 'Belum Disetujui'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="true">Disetujui</SelectItem>
              <SelectItem value="false">Belum</SelectItem>
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
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Cuti</TableHead>
              <TableHead onClick={() => toggleSort('start_date')} className="cursor-pointer">
                Tanggal Mulai <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort('end_date')} className="cursor-pointer">
                Tanggal Selesai <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cutiRequests.length > 0 ? (
              cutiRequests.map((cuti, index) => (
                <TableRow key={cuti.id}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{cuti.created_at}</TableCell>
                  <TableCell>{cuti.employee_name}</TableCell>
                  <TableCell>{cuti.cuti_type_name}</TableCell>
                  <TableCell>{cuti.start_date?.slice(0, 10)}</TableCell>
                  <TableCell>{cuti.end_date?.slice(0, 10)}</TableCell>
                  <TableCell>{cuti.approved ? '✅' : '❌'}</TableCell>
                  <TableCell>
                    <a href={`http://127.0.0.1:8000/${cuti.document}`} target="_blank">
                      {cuti.document ? 'Lihat' : 'Tidak ada'}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button variant="default" size="sm" className="me-1" asChild>
                      <Link href={`/cuti-requests/${cuti.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Yakin ingin menghapus pengajuan ini?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => router.delete(`/cuti-requests/${cuti.id}`)}
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
                <TableCell colSpan={9} className="py-4">
                  Tidak ada data cuti yang ditemukan.
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