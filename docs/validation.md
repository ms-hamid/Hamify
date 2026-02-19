# Validation: Zod & React Hook Form

Validasi data adalah benteng pertahanan aplikasi kita. Di project ini, kita menggunakan kombinasi maut: **Zod** (Schema) dan **React Hook Form** (UI Management).

---

## 1. Zod: Sang Penjaga Schema

Zod digunakan untuk mendefinisikan "Bentuk Data yang Benar". Ia bekerja di dua tempat:

1. **Client**: Memastikan user tidak mengirim form kosong/salah.
2. **Server**: Memastikan data yang masuk ke database aman.

### Contoh Schema

📂 **File:** `lib/schema.ts`

```typescript
import { z } from "zod";

export const productSchema = z.object({
  // Name wajib string, minimal 2 huruf
  name: z.string().min(2, "Product Name must be at least 2 characters"),

  // Price wajib angka, minimal 1
  price: z.coerce.number().min(1, "Price must be greater than 0"),

  // Stock hanya boleh salah satu dari enum ini
  stock: z.enum(["ready", "preorder"]),
});

// Zod bisa otomatis membuat Type TypeScript dari schema ini!
export type TProduct = z.infer<typeof productSchema>;
```

**Kenapa `z.coerce`?**
Input HTML form (`<input type="number">`) sebenarnya mengembalikan string ("1000"). `z.coerce.number()` memaksanya jadi number (1000) sebelum divalidasi.

---

## 2. React Hook Form: Sang Manajer Form

Mengurus state form (isi input, error message, loading state) secara efisien tanpa membuat aplikasi lambat.

### Integrasi dengan Zod

Kita menggunakan `zodResolver` untuk menghubungkan mereka.

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, TProduct } from "./lib/schema";

export function CreateProductDialog() {
  // 1. Setup Form
  const form = useForm<TProduct>({
    resolver: zodResolver(productSchema), // Gunakan aturan Zod
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  // 2. Fungsi Submit (Hanya jalan jika validasi sukses)
  function onSubmit(values: TProduct) {
    // Kirim ke server
    createProduct(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ... INPUT FIELDS ... */}
      </form>
    </Form>
  );
}
```

### Keuntungan Type Safety

Karena kita menghubungkan `TProduct` ke `useForm`, TypeScript akan marah jika:

- Kita salah mengetik nama field (`form.watch("nmae")` -> Error!)
- Kita memberi default value yang salah tipe.

---

## Rangkuman Alur Data

1. **User Mengetik**: React Hook Form mencatat perubahan.
2. **User Submit**: `zodResolver` mengecek data user vs `productSchema`.
   - **Salah?** Muncul pesan error ("Name too short") di bawah input.
   - **Benar?** Fungsi `onSubmit` dijalankan.
3. **Server Action**: Menerima data bersih yang sudah tervalidasi.

Dengan cara ini, kita tidak perlu menulis `if (name.length < 2)` secara manual berulang-ulang!
