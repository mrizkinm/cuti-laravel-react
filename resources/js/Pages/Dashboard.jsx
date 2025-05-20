import React from 'react'
import DashboardLayout from './Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

const Dashboard = () => {
  return (
    <div>
      <Head title="Dashboard" />
      <div>Selamat datang di aplikasi pengajuan cuti</div>
    </div>
  )
}

Dashboard.layout = (page) => <DashboardLayout children={page} />;
export default Dashboard