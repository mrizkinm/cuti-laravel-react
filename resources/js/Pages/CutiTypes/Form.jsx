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
  // status: z.boolean().optional(),
})

const Form = ({isEdit = false}) => {
  const { cutiType, title, audits } = usePage().props
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: cutiType?.name || '',
      // status: cutiType?.status ? true : false
    },
  })
  const csrfToken = usePage().props.csrf_token
  const [ loading, setLoading ] = useState(false);

  const onSubmit = (data) => {
    if (isEdit) {
      router.put(`/cuti-types/${cutiType.id}`, data, {
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
      router.post('/cuti-types', data, {
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
          {isEdit ? 'Edit Jenis Cuti' : 'Tambah Jenis Cuti'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">Nama</Label>
            <Input type="text" placeholder="Masukkan Jenis Cuti" {...register('name')} />
            {errors.name && <div className="text-sm text-red-500">{errors.name.message}</div>}
          </div>
          {/* <div className="flex items-center space-x-2">
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
          </div> */}
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