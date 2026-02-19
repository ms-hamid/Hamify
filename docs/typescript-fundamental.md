# TypeScript Fundamentals: Interface, Type & Generics

Dokumen ini menjelaskan konsep dasar TypeScript yang sering kita gunakan di project ini, seperti mengapa kita pakai `interface`, apa itu `type`, dan sihir dibalik `<T>`.

---

## 1. Interface vs Type Alias

Di project ini, Anda sering melihat dua cara mendefinisikan bentuk data object:

### Interface

Biasanya digunakan untuk **mendefinisikan props komponen** atau **struktur object**.

```typescript
// Contoh di component Dialog
interface DeleteDialogProps {
    id: number;
    itemName: string;
}

export function DeleteDialog({ id, itemName }: DeleteDialogProps) { ... }
```

**Kapan pakai Interface?**

- Jika Anda mendefinisikan struktur object baru (seperti Props).
- Interface bisa di-"extend" (diwariskan), mirip Class.

### Type Alias

Lebih fleksibel, bisa merepresentasikan object, union (pilihan), atau primitive.

```typescript
// Contoh di schema.ts
export type TBrand = z.infer<typeof brandSchema>; // Hasil inferensi Zod

// Contoh Union Type (Pilihan)
type Status = "pending" | "success" | "failed"; // Hanya boleh 3 nilai ini
```

**Kapan pakai Type?**

- Jika Anda butuh Union Type (`A | B`).
- Jika Anda mengambil tipe dari library lain (seperti `z.infer` dari Zod).

---

## 2. Generics: Tipe Data yang "Fleksibel" `<T>`

Generics memungkinkan kita membuat komponen atau fungsi yang bisa bekerja dengan **berbagai tipe data**, tidak terkunci pada satu tipe saja.

### Analogi Sederhana

Bayangkan sebuah **Kotak**.

- Tanpa Generics: Kotak ini HANYA boleh diisi Apel (`BoxOfApple`).
- Dengan Generics: Kotak ini boleh diisi APA SAJA, tapi label luarnya akan mengikuti isinya (`Box<Apel>`, `Box<Jeruk>`).

### Contoh di Project: Data Table

Kita punya komponen `DataTable` yang harus bisa menampilkan data `Brand`, `Product`, `Category`, dll.

📂 **File:** `components/ui/data-table.tsx`

```typescript
// TData adalah variabel untuk Tipe Datanya!
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[]; // Array dari TData
}

// Saat dipakai untuk Brand:
<DataTable columns={columns} data={brands} />
// Di sini, secara otomatis <TData> berubah menjadi <Brand>

// Saat dipakai untuk Product:
<DataTable columns={columns} data={products} />
// Di sini, <TData> berubah menjadi <Product>
```

**Kenapa ini penting?**
Tanpa Generics, kita harus membuat `BrandTable`, `ProductTable`, `CategoryTable` secara terpisah. Dengan Generics, kita cukup buat satu `DataTable<TData>` yang bisa dipakai untuk semua.

---

## 3. `as` Keyword (Type Assertion)

Terkadang kita tahu lebih banyak daripada TypeScript. `as` digunakan untuk "memaksa" TypeScript memperlakukan data sebagai tipe tertentu.

```typescript
// Contoh di EditProductDialog
// Kita yakin stock ini valid sesuai Enum, meski database bilangnya string
stock: product.stock as "ready" | "preorder";
```

⚠️ **Hati-hati:** Gunakan `as` hanya jika Anda yakin 100%. Jika datanya ternyata salah, aplikasi bisa error saat dijalankan (runtime).

---

## 4. Studi Kasus: `ProductTablesProps`

Mari bedah kode yang Anda tanyakan di `product-tables.tsx`:

```typescript
// 1. Type Intersection (&)
// "ProductWithRelations" adalah Product GABUNGAN Brand, Category, Location
type ProductWithRelations = Product & {
  brand: Brand;
  category: Category;
  location: Location;
};

// 2. Interface untuk Props
interface ProductTablesProps {
  products: ProductWithRelations[]; // Array of ProductWithRelations
  brands: Brand[]; // Array of Brand
  categories: Category[]; // Array of Category
  locations: Location[]; // Array of Location
}
```

**Penjelasan:**

1.  **`interface ProductTablesProps`**: Kita membuat "cetakan" untuk data yang **WAJIB** diterima oleh komponen `ProductTables`.
2.  **`products: ProductWithRelations[]`**:
    - Komponen ini butuh daftar produk.
    - Tapi bukan produk biasa! Harus produk yang **sudah ada data brand, category, dan location-nya**.
    - Tanda `[]` artinya "Banyak" (Array/List).
3.  **`brands: Brand[]`**: Butuh daftar brand (untuk pilihan di filter/edit).

Dengan definisi ini, jika kita lupa mengirim `brands` saat memanggil `<ProductTables />`, TypeScript akan error (garis merah) memberi tahu kita: _"Hei, properti 'brands' hilang!"_.
