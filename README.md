# 📝 Aplikasi Pengajuan Cuti Pegawai

Sistem manajemen cuti pegawai berbasis **Laravel 12** untuk backend dan **React JS** untuk frontend SPA. Dibuat untuk memudahkan proses pengajuan, persetujuan, dan monitoring cuti secara efisien dan modern.

## 🔧 Teknologi yang Digunakan

### Backend
- Laravel 12
- MySQL
- Laravel Queue (untuk proses export/import csv)
- Role Permission (Role & Permission)

### Frontend
- React JS (Vite)
- React Hook Form + Zod (validasi form)
- Tailwind CSS (ShadCN)

---

## ⚙️ Cara Instalasi

### Clone Repo
```bash
git clone https://github.com/mrizkinm/cuti-laravel-react.git
cd cuti-laravel-react
```

### Setup Laravel
```bash
composer install
php artisan key:generate

# Setup database
php artisan migrate

# Jalankan server
php artisan serve

npm install
npm run dev
```