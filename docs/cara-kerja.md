# Cara Kerja Fitur: Menghapus Brand (Delete Brand)

Dokumen ini menjelaskan bagaimana sebuah fitur bekerja dari tombol ditekan sampai data terhapus di database. Kita akan menggunakan fitur **Delete Brand** sebagai contoh utama.

---

## 1. UI (Tampilan): Dimana Tombol Berada?

Posisi tombol **Delete** (icon tempat sampah) untuk setiap baris data Brand berada di dalam file definisi kolom tabel.

📂 **File:** `app/(admin)/dashboard/(index)/brands/_components/columns.tsx`

Di file ini, kita mendefinisikan kolom-kolom tabel. Perhatikan bagian `actions`:

```typescript
// ... imports
import { DeleteDialog } from "@/components/admin/delete-dialog" // 1. Kita import komponen dialog
import { deleteBrand } from "../lib/actions" // 2. Kita import fungsi "aksi" untuk menghapus

export const columns: ColumnDef<Brand>[] = [
    // ... kolom lainnya
    {
        id: "actions",
        cell: ({ row }) => {
            const brand = row.original // Mengambil data brand sebaris ini

            return (
                <div className="flex items-center justify-center gap-2">
                    {/* Tombol Edit... */}

                    {/* INI TOMBOL DELETE-NYA */}
                    <DeleteDialog
                        id={brand.id}        // Kirim ID Brand yang mau dihapus
                        action={deleteBrand} // Kirim Fungsi "deleteBrand" yang akan dijalankan
                        itemName="Brand"     // Nama item (untuk teks konfirmasi)
                    />
                </div>
            )
        },
    },
]
```

**Penjelasan Codding:**

- Kita tidak menulis tombol `<Button>` langsung di sini, tapi memanggil komponen siap pakai bernama `<DeleteDialog />`.
- `id={brand.id}`: Ini penting! Kita memberi tahu komponen _mana_ yang harus dihapus. Karena TypeScript, `id` ini dipastikan bertipe `number` (sesuai database).
- `action={deleteBrand}`: Kita mengirim _fungsi_ itu sendiri sebagai props. Ini teknik canggih di mana fungsi Server Action dikirim ke komponen Client.

---

## 2. Shared Component: Logika Dialog

Saat tombol ditekan, sebuah dialog konfirmasi muncul. Logika ini ada di komponen terpisah agar bisa dipakai ulang (oleh Product, Category, dll).

📂 **File:** `components/admin/delete-dialog.tsx`

```typescript
"use client"; // Komponen ini berjalan di browser (ada interaksi klik)

// Kita definisikan Type Props agar aman
interface DeleteDialogProps {
  id: number | string; // ID bisa angka atau text
  // action adalah fungsi Promise yang menerima id dan mengembalikan object
  action: (id: number | any) => Promise<{ success?: boolean; error?: string }>;
  itemName?: string;
}

export function DeleteDialog({ id, action, itemName }: DeleteDialogProps) {
  const [open, setOpen] = useState(false); // State untuk Buka/Tutup dialog
  const [isPending, startTransition] = useTransition(); // State untuk Loading

  function handleDelete() {
    // startTransition membungkus proses async agar UI tidak 'freeze'
    startTransition(async () => {
      // 1. PANGGIL FUNGSI SERVER ACTION DI SINI!
      const result = await action(id);

      // 2. Cek Hasilnya
      if (result?.error) {
        toast.error(result.error); // Gagal? Muncul notifikasi error
      } else {
        setOpen(false); // Berhasil? Tutup dialog
        toast.success(`${itemName} deleted successfully`); // Muncul notifikasi sukses
      }
    });
  }

  // ... (kode tampilan Dialog/Modal) ...
  // Tombol "Delete" di dalam dialog akan memanggil fungsi handleDelete saat diklik.
}
```

**Penjelasan Alur:**

1. User menekan tombol tong sampah -> `open` jadi `true` -> Dialog muncul.
2. User menekan tombol "Confirm Delete" -> `handleDelete()` jalan.
3. `handleDelete` memanggil `action(id)`. Karena tadi kita mengirim `deleteBrand` sebagai `action`, maka kode ini sebenarnya menjalankan `deleteBrand(id)`.

---

## 3. Server Action: Eksekusi di Belakang Layar

Fungsi `deleteBrand` ini berjalan di **Server** (Backend), bukan di browser user. Ini aman karena kode database tidak terekspos ke publik.

📂 **File:** `app/(admin)/dashboard/(index)/brands/lib/actions.ts`

```typescript
"use server"; // Menandakan ini kode Server Action

import { prisma } from "@/lib/prisma"; // Koneksi ke Database
import { revalidatePath } from "next/cache";

export async function deleteBrand(id: number) {
  // Menerima ID (wajib number)
  try {
    // 1. PERINTAH KE DATABASE (PRISMA)
    await prisma.brand.delete({
      where: { id }, // Hapus brand yang id-nya = id yang dikirim
    });

    // 2. UPDATE TAMPILAN
    // Fungsi ajaib Next.js. Ini menyuruh Next.js untuk "me-refresh"
    // data di halaman "/dashboard/brands" karena data sudah berubah.
    revalidatePath("/dashboard/brands");

    // 3. KEMBALIKAN HASIL SUKSES
    return { success: true };
  } catch (error) {
    // Jika gagal (misal database mati), kembalikan error
    console.error("Failed to delete brand:", error);
    return {
      error: "Failed to delete brand. Please try again later.",
    };
  }
}
```

**Penjelasan TypeScript & Prisma:**

- `prisma.brand.delete`: Prisma membaca schema database Anda. Jika tabel `Brand` tidak punya kolom `id`, TypeScript akan error (garis merah) bahkan sebelum Anda menjalankan aplikasinya. Inilah kekuatan Type Safety!
- `try...catch`: Wajib digunakan saat berurusan dengan database untuk menangani kemungkinan error tak terduga.
- `revalidatePath`: Tanpa ini, data di tabel tidak akan hilang sampai Anda me-refresh browser manual. Dengan ini, tabel akan otomatis update instan setelah sukses hapus.

---

## Rangkuman Singkat

1. **User Klik Tombol** di `columns.tsx` -> komponen `DeleteDialog` menerima perintah.
2. **Dialog Muncul** -> User konfirmasi.
3. **Komponen Memanggil Fungsi** `deleteBrand(id)` yang dikirim lewat props.
4. **Server Action Berjalan** di `actions.ts`.
5. **Prisma Menghapus Data** di database MySQL.
6. **Next.js Me-refresh Halaman** berkat `revalidatePath`.
7. **Notifikasi Muncul** di browser ("Brand deleted successfully").

Semua terhubung dengan aman berkat **TypeScript** yang menjaga agar tipe data (seperti `id`) selalu konsisten dari depan (UI) sampai belakang (Database).

---

## Pola yang Sama untuk Create & Edit

Fitur **Create (Tambah)** dan **Edit (Ubah)** menggunakan pola yang hampir sama, hanya beda di komponen Dialog-nya.

### 1. Create (Tambah Data)

- **UI Trigger**: Tombol "Create" di `page.tsx` (lewat `PageHeader`).
- **UI Component**: `create-brand-dialog.tsx`.
- **Logic**: Menggunakan Form (React Hook Form) untuk validasi input.
- **Server Action**: Memanggil `createBrand(values)` di `actions.ts`.

### 2. Edit (Ubah Data)

- **UI Trigger**: Tombol "Edit" (icon pensil) di `columns.tsx`.
- **UI Component**: `edit-brand-dialog.tsx`.
- **Logic**:
  1. Form diisi otomatis dengan data yang ada (`defaultValues`).
  2. Saat disubmit, memanggil `updateBrand(id, values)`.
- **Server Action**: `updateBrand` di `actions.ts` melakukan query `prisma.brand.update`.

Pola ini (**UI -> Component -> Server Action -> Database**) berlaku untuk semua fitur di dashboard ini!
