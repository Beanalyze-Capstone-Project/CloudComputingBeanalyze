## **Endpoint**: `/register`

### **URL**:
```
https://project-beanalyze.et.r.appspot.com/register
```

### **Metode**: `POST`

### **Deskripsi**:
Endpoint ini memungkinkan pengguna untuk mendaftar dengan menyediakan informasi mereka. Server akan mengenkripsi kata sandi yang diberikan dan menyimpan informasi pengguna (username, password, name, city, email) ke dalam database.

---

### **Request Body**:

| **Field**   | **Tipe**  | **Deskripsi**                               | **Wajib** |
|-------------|-----------|---------------------------------------------|-----------|
| `username`  | `string`  | Username untuk pengguna baru. Harus unik.   | Ya        |
| `password`  | `string`  | Kata sandi untuk pengguna baru. Harus aman dan kuat. | Ya        |
| `name`      | `string`  | Nama lengkap pengguna.                      | Tidak     |
| `city`      | `string`  | Kota tempat tinggal pengguna.               | Tidak     |
| `email`     | `string`  | Alamat email pengguna.                      | Tidak     |

#### **Contoh Request**:
```json
{
  "username": "testuser",
  "password": "securepassword123",
  "name": "John Doe",
  "city": "New York",
  "email": "john.doe@example.com"
}
```

---

### **Responses**:

#### **Respons Sukses**:
- **Kode**: `201 Created`
- **Body**:
```json
{
  "message": "User registered successfully"
}
```

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

2. **Username Duplikat**:
   - **Kode**: `400 Bad Request`
   - **Body**:
   ```json
   {
     "message": "Username is already taken. Please choose a different username."
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi ketika `username` yang diberikan sudah ada di database. Front-end harus memberitahukan pengguna untuk memilih username lain.

3. **Kesalahan Server Internal**:
   - **Kode**: `500 Internal Server Error`
   - **Body**:
   ```json
   {
     "message": "Error registering user. Please try again later."
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada masalah yang tidak terduga selama proses pendaftaran, seperti kegagalan koneksi database atau masalah server lainnya.

---

### **Alur**:
1. Pengguna mengirimkan permintaan `POST` ke endpoint `/register` dengan informasi pengguna yang diperlukan (username, password, name, city, email).
2. Server memeriksa apakah `username` dan `password` disertakan. Jika salah satu tidak ada, server akan merespons dengan `400 Bad Request`.
3. Server memeriksa apakah `username` sudah ada di database. Jika ada, server merespons dengan `400 Bad Request` dan pesan yang sesuai.
4. Jika `username` unik, server akan mengenkripsi kata sandi dan menyimpan data pengguna di database.
5. Jika pendaftaran berhasil, server merespons dengan `201 Created` dan pesan sukses.
6. Jika terjadi kesalahan internal selama pendaftaran, server merespons dengan `500 Internal Server Error`.

---

### **Pertimbangan Keamanan**:
- **Hashing Kata Sandi**: Kata sandi di-hash menggunakan `bcryptjs` sebelum disimpan di database, sehingga kata sandi tidak disimpan dalam bentuk teks asli.
- **Validasi Input**: Pastikan validasi dan sanitasi input pengguna yang tepat untuk mencegah masalah seperti SQL injection atau serangan XSS.

---


### **Catatan**:
- Pastikan front-end menangani respons `400 Bad Request` dan `500 Internal Server Error` dengan baik.
- `username` harus unik di seluruh sistem, dan server akan memberitahukan pengguna untuk memilih username lain jika terjadi konflik.
- Kata sandi harus di-hash sebelum disimpan di database menggunakan algoritma yang aman seperti `bcryptjs`.

