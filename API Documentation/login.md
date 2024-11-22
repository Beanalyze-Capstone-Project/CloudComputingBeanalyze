## **Endpoint**: `/login`

### **URL**:
```
https://project-beanalyze.et.r.appspot.com/login
```
### **Metode**: `POST`

### **Deskripsi**:
Endpoint ini digunakan untuk melakukan autentikasi pengguna. Pengguna harus memberikan `username` dan `password`. Jika kredensial valid, server akan mengirimkan token JWT yang dapat digunakan untuk autentikasi pada endpoint lainnya.

---

### **Request Body**:

| **Field**   | **Tipe**  | **Deskripsi**                               | **Wajib** |
|-------------|-----------|---------------------------------------------|-----------|
| `username`  | `string`  | Username yang digunakan untuk login.        | Ya        |
| `password`  | `string`  | Kata sandi pengguna yang digunakan untuk login. | Ya        |

#### **Contoh Request**:
```json
{
  "username": "testuser",
  "password": "securepassword123"
}
```

---

### **Responses**:

#### **Respons Sukses**:
- **Kode**: `200 OK`
- **Body**:
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE"
}
```
- **`message`**: Menyatakan bahwa login berhasil.
- **`token`**: Token JWT yang digunakan untuk autentikasi di endpoint lainnya.

#### **Respons Error**:

1. **Field Wajib Tidak Ada**:
   - **Kode**: `400 Bad Request`
   - **Body**:
   ```json
   {
     "message": "Username and password are required"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika `username` atau `password` tidak ada dalam body permintaan.

2. **Pengguna Tidak Ditemukan**:
   - **Kode**: `404 Not Found`
   - **Body**:
   ```json
   {
     "message": "User not found"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika `username` yang dimasukkan tidak terdaftar di sistem.

3. **Password Tidak Valid**:
   - **Kode**: `401 Unauthorized`
   - **Body**:
   ```json
   {
     "message": "Invalid password"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika `password` yang dimasukkan tidak cocok dengan yang ada di database.

4. **Kesalahan Server Internal**:
   - **Kode**: `500 Internal Server Error`
   - **Body**:
   ```json
   {
     "message": "Error logging in",
     "error": "Error details here"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada masalah pada server, misalnya kesalahan koneksi database atau kesalahan lain yang tidak terduga.

---

### **Alur**:
1. Pengguna mengirimkan permintaan `POST` ke endpoint `/login` dengan `username` dan `password`.
2. Server memeriksa apakah `username` dan `password` ada dalam body permintaan. Jika salah satu tidak ada, server merespons dengan `400 Bad Request`.
3. Server mencari `username` dalam database.
   - Jika tidak ditemukan, server merespons dengan `404 Not Found` dan pesan `User not found`.
4. Jika `username` ditemukan, server memeriksa apakah password yang diberikan sesuai dengan password yang ada di database.
   - Jika tidak cocok, server merespons dengan `401 Unauthorized` dan pesan `Invalid password`.
5. Jika kredensial valid, server membuat token JWT dan merespons dengan `200 OK` dan token.
6. Jika terjadi kesalahan pada server, server merespons dengan `500 Internal Server Error`.

---

### **Pertimbangan Keamanan**:
- **Enkripsi Kata Sandi**: Kata sandi yang dimasukkan oleh pengguna akan dibandingkan dengan kata sandi yang sudah dienkripsi menggunakan algoritma `bcryptjs`, sehingga kata sandi tidak disimpan dalam bentuk teks asli.
- **JWT Token**: Token JWT yang diberikan akan digunakan untuk autentikasi pengguna pada permintaan berikutnya. Pastikan token disimpan dengan aman di aplikasi klien (misalnya, di header Authorization atau cookie yang aman).

---

### **Catatan**:
- Pastikan bahwa frontend menangani respons error dengan baik, seperti menampilkan pesan yang jelas jika pengguna tidak ditemukan atau jika kata sandi salah.
- Server mengeluarkan token JWT dengan masa berlaku 7 hari, setelah itu pengguna perlu login kembali untuk mendapatkan token baru.
