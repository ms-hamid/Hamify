# Advanced TypeScript Symbols & Concepts

Review kode Anda mungkin menemukan simbol-simbol "asing" selain `interface` dan `type`. Berikut penjelasannya.

---

## 1. Enum (`enum`)

Enum (Enumeration) adalah sekumpulan nilai konstan yang bernama. Di project ini, Enum datang dari **Prisma Schema**.

📂 **Sumber:** `prisma/schema.prisma` -> Digenerate ke `node_modules/@prisma/client`

```prisma
// Di schema.prisma
enum RoleUser {
  superadmin
  customer
}
```

```typescript
// Di kode TypeScript (otomatis)
import { RoleUser } from "@prisma/client";

if (user.role === RoleUser.superadmin) {
  // Sama dengan: user.role === "superadmin"
  // Tapi lebih aman karena anti typo!
}
```

**Kapan muncul?**
Saat Anda mendefinisikan kolom database yang pilihannya terbatas (seperti Role, Status Order, Stock Status).

---

## 2. Union dengan Pipe (`|`)

Simbol garis tegak `|` artinya "ATAU" (Union Type). Variable boleh memiliki salah satu dari tipe yang didaftarkan.

```typescript
// Contoh Sederhana
type Status = "success" | "error";

// Contoh di Project (Zod Schema)
// image boleh berupa File (saat upload) ATAU string (URL dari database)
image: z.instanceof(File) | z.string();
```

---

## 3. Intersection dengan Ampersand (`&`)

Simbol `&` artinya "DAN" (Intersection Type). Menggabungkan dua tipe menjadi satu tipe baru yang memiliki properti dari keduanya.

```typescript
type User = { name: string };
type Admin = { permission: string[] };

// SuperUser punya name DAN permission
type SuperUser = User & Admin;
```

**Contoh di Project:** `types/index.ts` (jika ada) atau saat memperluas tipe Prisma.

```typescript
import { Brand, Product } from "@prisma/client";

// Tipe baru: Product yang didalamnya SUDAH ADA data Brand-nya
type ProductWithBrand = Product & { brand: Brand };
```

---

## 4. Tanda Tanya (`?`) dan Seru (`!`)

### Optional Chaining (`?`)

Digunakan untuk mengakses properti dari object yang _mungkin_ `null` atau `undefined`.

```typescript
// row.original.user mungkin null jika data user terhapus
// Tanpa tanda tanya, aplikasi crash jika user null.
// Dengan tanda tanya, hasilnya undefined (aman).
<div className="capitalize">{row.original.user?.name || "Unknown"}</div>
```

### Non-null Assertion (`!`)

Kebalikan dari `?`. Anda memaksa/menjamin ke TypeScript bahwa "Variable ini PASTI ada isinya, jangan khawatir!".
**Gunakan dengan sangat hati-hati.**

```typescript
// Saya yakin product pasti punya images[0], jadi force string!
const mainImage = product.images[0]!;
```

---

## 5. `Omit` dan `Pick` (Utility Types)

TypeScript punya "fungsi" bawaan untuk memmanipulasi tipe object.

- **`Pick<Type, Keys>`**: Hanya ambil sebagian properti.
- **`Omit<Type, Keys>`**: Ambil semua KECUALI kunci tertentu.

```typescript
type User = {
  id: number;
  name: string;
  password: string; // Rahasia!
};

// Tipe baru tanpa password untuk dikirim ke Client
type SafeUser = Omit<User, "password">;
// Hasilnya: { id: number, name: string }
```

Ini sering dipakai saat kita ingin membuang field sensitif sebelum mengirim data ke frontend.
