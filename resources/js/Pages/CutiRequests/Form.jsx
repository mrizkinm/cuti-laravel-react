import React, { useState } from 'react'
import { usePage, router, Head } from '@inertiajs/react'
import DashboardLayout from '../Layouts/DashboardLayout'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import History from '../History'
import { Checkbox } from '@/components/ui/checkbox'
import { ComboboxForm } from '../ComboboxForm'

const schema = z.object({
  employee_id: z.string().min(1, 'Karyawan wajib dipilih'),
  cuti_type_id: z.string().min(1, 'Jenis cuti wajib dipilih'),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().min(1, 'Tanggal selesai wajib diisi'),
  reason: z.string().optional(),
  document: z
    .any()
    .refine((file) => !file || (file instanceof File && file.type === 'application/pdf'), {
      message: 'File harus berupa PDF',
    })
    .refine((file) => !file || (file.size >= 100_000 && file.size <= 500_000), {
      message: 'Ukuran file harus antara 100KB - 500KB',
    }),
  approved: z.boolean().optional(),
})

const Form = ({isEdit = false}) => {
  const { cutiRequest, cutiTypes, employees, title, audits } = usePage().props
  console.log(cutiRequest)
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employee_id: cutiRequest?.employee_id || '',
      cuti_type_id: cutiRequest?.cuti_type_id || '',
      start_date: formatDate(cutiRequest?.start_date) || '',
      end_date: formatDate(cutiRequest?.end_date) || '',
      reason: cutiRequest?.reason || '',
      document: null,
      approved: cutiRequest?.approved ? true : false
    },
  })
  const csrfToken = usePage().props.csrf_token
  const [ loading, setLoading ] = useState(false);

  const onSubmit = (data) => {
    const formData = new FormData()
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        if (typeof data[key] === 'boolean') {
          formData.append(key, data[key] ? '1' : '0') // Convert boolean ke string "1"/"0"
        } else {
          formData.append(key, data[key])
        }
      }
    }

    if (isEdit) {
      formData.append('_method', 'put')
      router.post(`/cuti-requests/${cutiRequest.id}`, formData, {
        forceFormData: true,
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
        onError: (err) => {
          showErrors(err);
        }
      });
    } else {
      router.post('/cuti-requests', formData, {
        forceFormData: true,
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
        onError: (err) => {
          showErrors(err);
        }
      })
    }
  }

  const showErrors = (err) => {
    Object.entries(err).forEach(([_, message]) => {
      toast.error(message)
    })
  }

  return (
    <div>
      <Head title={title} />
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Edit Pengajuan Cuti' : 'Ajukan Cuti Baru'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <Label className="mb-2">Karyawan</Label>
            {/* <Select
              onValueChange={(val) => setValue('employee_id', val)}
              defaultValue={cutiRequest?.employee_id || ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih karyawan" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <ComboboxForm
              name="employee_id"
              control={control}
              options={employees}
              placeholder="Pilih karyawan"
            />
            {errors.employee_id && <div className="text-sm text-red-500">{errors.employee_id.message}</div>}
          </div>
          <div>
            <Label className="mb-2">Jenis Cuti</Label>
            {/* <Select
              onValueChange={(val) => setValue('cuti_type_id', val)}
              defaultValue={cutiRequest?.cuti_type_id || ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih jenis cuti" />
              </SelectTrigger>
              <SelectContent>
                {cutiTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <ComboboxForm
              name="cuti_type_id"
              control={control}
              options={cutiTypes}
              placeholder="Pilih jenis cuti"
            />
            {errors.cuti_type_id && <div className="text-sm text-red-500">{errors.cuti_type_id.message}</div>}
          </div>

          <div>
            <Label className="mb-2">Tanggal Mulai</Label>
            <Input type="date" placeholder="Pilih Tanggal" {...register('start_date')} />
            {errors.start_date && <div className="text-sm text-red-500">{errors.start_date.message}</div>}
          </div>

          <div>
            <Label className="mb-2">Tanggal Selesai</Label>
            <Input type="date" placeholder="Pilih Tanggal" {...register('end_date')} />
            {errors.end_date && <div className="text-sm text-red-500">{errors.end_date.message}</div>}
          </div>

          <div>
            <Label className="mb-2">Alasan</Label>
            <Textarea rows="3" placeholder="Alasan" {...register('reason')} />
            {errors.reason && <div className="text-sm text-red-500">{errors.reason.message}</div>}
          </div>

          <div>
            <Label className="mb-2">Upload Dokumen (PDF)</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setValue('document', e.target.files[0])}
            />
            {errors.document && <div className="text-sm text-red-500">{errors.document.message}</div>}
          </div>
          {isEdit && (
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="approved"
                render={({ field }) => (
                  <Checkbox
                    id="approved"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="approved">Approved</Label>
            </div>
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
            >
              {isEdit ? 'Update' : 'Ajukan'}
            </Button>
          </div>
        </form>
      </div>
      <History audits={audits} />
    </div>
  )
}

Form.layout = (page) => <DashboardLayout children={page} />
export default Form