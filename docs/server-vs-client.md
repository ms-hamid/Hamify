# Next.js: Server vs Client Components

Ini adalah konsep **PALING PENTING** di Next.js App Router. Salah memahami ini akan membuat aplikasi lambat atau error.

---

## 1. Server Components (Default)

Secara default, **SEMUA komponen di folder `app` adalah Server Component**.
Kode di sini HANYA berjalan di server saat halaman dibuat. Tidak pernah dikirim ke browser.

### Karakteristik:

- ✅ Bisa akses database langsung (`prisma.brand.findMany()`).
- ✅ Bisa baca file system (`fs.readFile()`).
- ✅ Tidak menambah beban (bundle size) ke browser user.
- ❌ **TIDAK BISA** pakai `useState`, `useEffect`, `onClick`, `onChange`.

### Contoh di Project:

Halaman utama dashboard (`page.tsx`) adalah Server Component.

```typescript
// app/(admin)/dashboard/(index)/brands/page.tsx
import { prisma } from "@/lib/prisma"; // Aman karena di server

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany(); // Query Database Langsung!

  return (
    // ... render HTML ...
  );
}
```

---

## 2. Client Components (`"use client"`)

Komponen yang dikirim ke browser user dan bisa berinteraksi (interaktif).
Anda **WAJIB** menambahkan `"use client"` di baris paling atas file.

### Karakteristik:

- ✅ Bisa pakai `useState`, `useEffect`.
- ✅ Bisa pakai Event Listener (`onClick`, `onSubmit`).
- ❌ **TIDAK BISA** akses database langsung.
- ❌ Menambah ukuran file JS yang harus didownload user.

### Contoh di Project:

Semua Dialog dan Tombol yang bisa diklik.

```typescript
// components/admin/delete-dialog.tsx
"use client"; // Penanda Wajib!

import { useState } from "react"; // Hook React hanya jalan di Client

export function DeleteDialog() {
  const [open, setOpen] = useState(false); // Interaktivitas

  return (
    <button onClick={() => setOpen(true)}>Delete</button>
  );
}
```

---

## Kapan Pakai Yang Mana?

| Fitur                        | Server Component  |        Client Component         |
| :--------------------------- | :---------------: | :-----------------------------: |
| Mengambil Data (Fetch)       |  ✅ (Disarankan)  | ⚠️ (Bisa tapi tidak disarankan) |
| Akses Backend (DB/API)       |        ✅         |               ❌                |
| Interaksi User (Click/Input) |        ❌         |               ✅                |
| State Management (Hooks)     |        ❌         |               ✅                |
| SEO (Search Engine)          | ✅ (Sangat Bagus) |           ✅ (Bagus)            |

### Praktik Terbaik (Best Practice)

1. Buat halaman (`page.tsx`) sebagai **Server Component** untuk mengambil data.
2. Buat bagian kecil yang butuh interaksi (seperti tabel, tombol, form) sebagai **Client Component** terpisah.
3. Import Client Component ke dalam Server Component.

**Contoh Struktur:**

```
Page (Server) --> Ambil Data dari DB
  └── Table (Client) --> Tampilkan Data & Sortir
      └── DeleteButton (Client) --> Handle Klik
```

Ini membuat aplikasi cepat (karena data diambil di server) tapi tetap interaktif.
