import React, { useState } from 'react'
import { usePage, Link, router, Head } from '@inertiajs/react'
import DashboardLayout from '../Layouts/DashboardLayout'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import History from '../History'
import { Checkbox } from "@/components/ui/checkbox"
import { ComboboxForm } from '../ComboboxForm'

const Form = ({isEdit = false}) => {
  const schema = z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().email('Email tidak valid').optional(),
    role_id: z.string().min(1, 'Role wajib dipilih'),
    password: !isEdit ? z.string().min(1, 'Password wajib diisi') : z.string().optional(),
    status: z.boolean().optional(),
  })

  const { user, roles, title, audits } = usePage().props
  
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role_id: user?.role_id || '',
      password: user?.password || '',
      status: user?.status ? true : false
    },
  })
  const csrfToken = usePage().props.csrf_token
  const [ loading, setLoading ] = useState(false);

  const onSubmit = (data) => {
    if (isEdit) {
      router.put(`/users/${user.id}`, data, {
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
      router.post('/users', data, {
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
          {isEdit ? 'Edit User' : 'Tambah User'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <Label className="mb-2">Nama</Label>
            <Input type="text" placeholder="Masukkan Nama" {...register('name')} />
            {errors.name && <div className="text-sm text-red-500">{errors.name.message}</div>}
        </div>
        <div>
            <Label className="mb-2">Email</Label>
            <Input type="email" placeholder="Masukkan Email" {...register('email')} />
            {errors.email && <div className="text-sm text-red-500">{errors.email.message}</div>}
        </div>
        <div>
            <Label className="mb-2">Role</Label>
            {/* <Select
              onValueChange={(val) => setValue('role_id', val)}
              defaultValue={user?.role_id || ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <ComboboxForm
              name="role_id"
              control={control}
              options={roles}
              placeholder="Pilih role"
            />
            {errors.role_id && <div className="text-sm text-red-500">{errors.role_id.message}</div>}
          </div>
          {!isEdit && (
            <div>
              <Label className="mb-2">Password</Label>
              <Input type="password" placeholder="Masukkan Password" {...register('password')} />
              {errors.password && <div className="text-sm text-red-500">{errors.password.message}</div>}
            </div>
          )}
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