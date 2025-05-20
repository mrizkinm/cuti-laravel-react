import React, { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Password is required'),
});

const Login = () => {
  const [ loading, setLoading ] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const csrfToken = usePage().props.csrf_token

  const onSubmit = (data) => {
    router.post("/login", data, {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
      onError: (err) => {
        showErrors(err);
      }
    });
  };

  const showErrors = (err) => {
    Object.entries(err).forEach(([_, message]) => {
      toast.error(message)
    })
  }

  return (
    <div>
      <Head title="Login" />
      <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <div className="bg-white p-6 rounded-md shadow-md w-96">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-2xl font-bold mb-4 text-center">Login</div>
            <div className="mb-4" >
              <Input type="email" {...register("email")} placeholder="Email" />
              {errors.email && <div className="text-sm text-red-500">{errors.email.message}</div>}
            </div>
            <div className="mb-4">
              <Input type="password" {...register("password")} placeholder="Password" />
              {errors.password && <div className="text-sm text-red-500">{errors.password.message}</div>}
            </div>
            <Button type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login