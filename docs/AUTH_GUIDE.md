# Panduan Autentikasi Manual (Manual Auth Guide)

Dokumen ini menjelaskan arsitektur sistem autentikasi manual yang kita bangun menggunakan Prisma, Argon2, dan Session Management. Panduan ini dirancang untuk pembelajaran mendalam tentang keamanan web.

## 1. Arsitektur Flow Diagram

Berikut adalah visualisasi bagaimana data mengalir dalam sistem login dan register kita.

### A. Flow Register (Pendaftaran)

Proses user membuat akun baru.

```mermaid
sequenceDiagram
    participant User as Browser (User)
    participant Server as Server Action (registerAction)
    participant DB as Database (Prisma)

    User->>Server: Submit Form (Nama, Email, Password)
    Server->>Server: Validasi Input (Zod)

    alt Input Invalid
        Server-->>User: Return Error (Lihat Form Merah)
    else Input Valid
        Server->>DB: Cek Email (findUnique)

        alt Email Sudah Ada
            DB-->>Server: User Ditemukan
            Server-->>User: Error "Email sudah dipakai"
        else Email Baru
            Server->>Server: Hash Password (Argon2id)
            Server->>DB: Create User (Simpan Hash, BUKAN Password Asli)
            DB-->>Server: Return User Baru

            note over Server: Auto-Login Process
            Server->>Server: Generate Session Token (Random String)
            Server->>DB: Simpan Session (Hash Token)
            Server->>User: Set Cookie 'session' (HttpOnly)
            Server-->>User: Redirect ke Dashboard
        end
    end
```

### B. Flow Login (Masuk)

Proses user masuk ke akun yang sudah ada.

```mermaid
sequenceDiagram
    participant User as Browser
    participant Server as Server Action (loginAction)
    participant DB as Database

    User->>Server: Submit Login (Email, Password)
    Server->>DB: Cari User by Email

    alt User Tidak Ditemukan
        Server-->>User: Error "Email/Password Salah"
    else User Ada
        Server->>Server: Verify Password (Argon2)

        alt Password Salah
            Server-->>User: Error "Email/Password Salah"
        else Password Valid
            Server->>Server: Generate Session Token
            Server->>DB: Simpan Session Baru
            Server->>User: Set Cookie 'session'
            Server-->>User: Redirect ke Home
        end
    end
```

### C. Flow Validasi Session (Middleware/Layout)

Proses yang terjadi setiap kali user membuka halaman untuk mengecek "Apakah saya sudah login?".

```mermaid
flowchart TD
    A[Browser Request Halaman] --> B{Ada Cookie 'session'?}
    B -- Tidak --> C[Anggap Guest / Belum Login]
    B -- Ya --> D[Kirim Token ke Server]

    D --> E[Server: Hash Token]
    E --> F[DB: Cari Session by Hash]

    F --> G{Session Valid?}
    G -- Tidak Ditemukan --> C
    G -- Expired --> H[Hapus Session di DB]
    H --> I[Hapus Cookie di Browser]
    I --> C

    G -- Valid --> J[Ambil Data User]
    J --> K{Perlu Refresh?}
    K -- Ya (Sisa waktu < 15 hari) --> L[Perpanjang Expired Date di DB]
    L --> M[Return User & Session]
    K -- Tidak --> M
```

---

## 2. Komponen Utama & Kode

### 1. Database (Prisma Schema)

- **User Table**:
  - `email`: Unik, untuk identitas.
  - `password`: Tipe String, tapi isinya adalah **HASH** (bukan teks asli).
- **Session Table**:
  - `id`: Primary key, isinya adalah hash dari session token.
  - `userId`: Foreign key ke User.
  - `expiresAt`: Kapan sesi mati otomatis.

### 2. Utilities (`lib/auth.ts`)

- **`hashPassword(password)`**: Mengubah "rahasia123" menjadi `$argon2id$v=19$m=19456...`. Ini satu arah (tidak bisa dikembalikan).
- **`verifyPassword(hash, password)`**: Menguji apakah password yang dimasukkan user cocok dengan hash di database.
- **`createSession(userId)`**: Membuat tiket masuk (session) baru.
- **`validateSessionToken(token)`**: Mengecek tiket user, apakah asli atau palsu/kadaluwarsa.

### 3. Server Actions (`app/actions/auth.ts`)

- Pintu gerbang logic aplikasi. Frontend tidak boleh akses database langsung, harus lewat sini.
- Menggunakan `zod` untuk memastikan data yang dikirim user bersih dan aman.

---

## 3. Security Best Practices (Keamanan)

Kenapa kita melakukan cara "ribet" ini? Demi keamanan.

1.  **HttpOnly Cookie**:
    Cookie session kita set `HttpOnly`. Artinya, hacker yang berhasil menyusupkan script jahat (XSS) di website kita **TIDAK BISA** membaca cookie ini via JavaScript `document.cookie`. Session user aman.

2.  **Session Hashing**:
    Kita tidak menyimpan token sesi mentah di database. Kita simpan HASH-nya (SHA256).
    _Skenario_: Jika database kita bocor dicuri hacker, mereka dapat daftar session ID. Tapi mereka **tidak bisa** menggunakan ID itu untuk login karena browser butuh token ASLI (yang belum di-hash), dan token asli cuma ada di cookie user masing-masing.

3.  **Argon2 Hashing**:
    Algoritma hashing modern yang didesain "lambat" dan memakan memori (Memory Hard). Ini membuat hacker sangat sulit dan mahal untuk mencoba menebak password dengan Bruteforce Attack menggunakan GPU canggih.

4.  **Zod Validasi**:
    Mencegah user iseng mengirim data aneh (SQL Injection dasar atau input sampah) sebelum data itu menyentuh logic database kita.

---

## 4. Cara Debugging

Jika login gagal atau error, lakukan langkah ini:

1.  **Cek Database (Table Users)**:
    - Apakah user baru masuk?
    - Lihat kolom password. Isinya harus panjang dan acak (hash), bukan teks biasa.
2.  **Cek Database (Table Sessions)**:
    - Login -> Harus muncul baris baru.
    - Logout -> Baris itu harus hilang.
3.  **Cek Browser (Developer Tools -> Application -> Cookies)**:
    - Apakah ada cookie bernama `session`?
    - Apakah domain dan path-nya benar?
4.  **Console Server**:
    - Lihat terminal VS Code tempat `npm run dev` jalan. Error detail biasanya muncul di sana (karena kita pakai `console.error` di `catch` block).
