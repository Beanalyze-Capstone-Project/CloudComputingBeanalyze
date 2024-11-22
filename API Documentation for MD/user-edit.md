## **Endpoint**: `/user/edit`

### **URL**:
```
https://project-beanalyze.et.r.appspot.com/user/edit
```
### **Metode**: `POST`

### **Deskripsi**:
Endpoint ini digunakan untuk memperbarui profil pengguna yang terautentikasi. Pengguna dapat memperbarui data seperti username, nama, kota, dan email. Jika tidak ada nilai baru yang diberikan, data yang ada tetap dipertahankan.

---

### **Request Header**:

| **Field**        | **Tipe**  | **Deskripsi**                       | **Wajib** |
|------------------|-----------|-------------------------------------|-----------|
| `Authorization`  | `string`  | Token JWT yang digunakan untuk autentikasi. Format: `Bearer <token>` | Ya        |

### **Request Body**:

| **Field**        | **Tipe**  | **Deskripsi**                       | **Wajib** |
|------------------|-----------|-------------------------------------|-----------|
| `username`       | `string`  | Username baru yang ingin diatur.    | Opsional  |
| `name`           | `string`  | Nama baru pengguna.                 | Opsional  |
| `city`           | `string`  | Kota baru pengguna.                 | Opsional  |
| `email`          | `string`  | Email baru pengguna.                | Opsional  |

---

### **Responses**:

#### **Respons Sukses**:
- **Kode**: `200 OK`
- **Body**:
```json
{
  "message": "User updated successfully"
}
```

#### **Respons Error**:

1. **Pengguna Tidak Ditemukan**:
   - **Kode**: `404 Not Found`
   - **Body**:
   ```json
   {
     "message": "User not found"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika pengguna dengan ID yang diberikan tidak ditemukan di database.

2. **Field yang Tidak Lengkap**:
   - **Kode**: `400 Bad Request`
   - **Body**:
   ```json
   {
     "message": "All fields are required"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada field yang tidak diisi dalam request body.

3. **Tidak Ada Perubahan yang Dilakukan**:
   - **Kode**: `404 Not Found`
   - **Body**:
   ```json
   {
     "message": "User not found or no changes made"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika tidak ada perubahan data yang dilakukan atau pengguna tidak ditemukan.

4. **Kesalahan Server Internal**:
   - **Kode**: `500 Internal Server Error`
   - **Body**:
   ```json
   {
     "message": "Error updating user",
     "error": "Deskripsi kesalahan"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada masalah yang tidak terduga saat memperbarui data pengguna.

---

### **Alur**:
1. Pengguna mengirimkan permintaan `POST` ke endpoint `/user/edit` dengan token JWT yang valid dan data yang ingin diperbarui.
2. Middleware `authenticateToken` akan memverifikasi token JWT di header `Authorization`. Jika token tidak valid atau tidak ada, server akan merespons dengan `401 Unauthorized`.
3. Server akan memeriksa apakah pengguna ditemukan di database. Jika tidak ditemukan, server akan merespons dengan `404 Not Found`.
4. Jika ada field yang tidak diisi, nilai default yang sudah ada di database akan dipertahankan.
5. Server akan memperbarui informasi pengguna di database dengan data baru yang diberikan atau mempertahankan nilai yang ada.
6. Jika ada perubahan yang berhasil dilakukan, server akan merespons dengan pesan keberhasilan.
7. Jika tidak ada perubahan atau pengguna tidak ditemukan, server akan merespons dengan `404 Not Found`.
