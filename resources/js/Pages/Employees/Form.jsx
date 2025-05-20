import React, { useState } from 'react'
import { usePage, router, Head } from '@inertiajs/react'
import DashboardLayout from '../Layouts/DashboardLayout'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import History from '../History'
import { Checkbox } from '@/components/ui/checkbox'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid').optional(),
  nip: z.string().min(1, 'NIP wajib diisi').optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  status: z.boolean().optional(),
})

const Form = ({isEdit = false}) => {
  const { employee, title, audits } = usePage().props
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      nip: employee?.nip || '',
      phone: employee?.phone || '',
      date_of_birth: employee?.date_of_birth || '',
      status: employee?.status ? true : false
    },
  })
  const csrfToken = usePage().props.csrf_token
  const [ loading, setLoading ] = useState(false);

  const onSubmit = (data) => {
    if (isEdit) {
      router.put(`/employees/${employee.id}`, data, {
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
      router.post('/employees', data, {
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
          {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">NIP</Label>
            <Input type="text" placeholder="Masukkan NIP" {...register('nip')} />
            {errors.nip && <div className="text-sm text-red-500">{errors.nip.message}</div>}
          </div>
          <div>
            <Label className="mb-2">Nama</Label>
            <Input type="text" placeholder="Masukkan nama" {...register('name')} />
            {errors.name && <div className="text-sm text-red-500">{errors.name.message}</div>}
          </div>
          <div>
            <Label className="mb-2">Email</Label>
            <Input type="email" placeholder="Masukkan email" {...register('email')} />
            {errors.email && <div className="text-sm text-red-500">{errors.email.message}</div>}
          </div>
          <div>
            <Label className="mb-2">Phone</Label>
            <Input type="text" placeholder="Masukkan Phone" {...register('phone')} />
            {errors.phone && <div className="text-sm text-red-500">{errors.phone.message}</div>}
          </div>
          <div>
            <Label className="mb-2">Tanggal Lahir</Label>
            <Input type="date" placeholder="Masukkan Tanggal Lahir" {...register('date_of_birth')} />
            {errors.date_of_birth && <div className="text-sm text-red-500">{errors.date_of_birth.message}</div>}  
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Checkbox
                  id="status"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="status">Aktif</Label>
          </div>
          <div className="flex gap-4">  
            <Button
              type="submit"
              disabled={loading}
            >
              {isEdit ? 'Update' : 'Tambah'}
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