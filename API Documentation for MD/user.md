## **Endpoint**: `/user`

### **URL**:
```
https://project-beanalyze.et.r.appspot.com/user
```

### **Metode**: `GET`

### **Deskripsi**:
Endpoint ini digunakan untuk mengambil profil pengguna yang terautentikasi. Profil yang dikembalikan mencakup informasi seperti username, nama, kota, dan email pengguna.

---

### **Request Header**:

| **Field**        | **Tipe**  | **Deskripsi**                       | **Wajib** |
|------------------|-----------|-------------------------------------|-----------|
| `Authorization`  | `string`  | Token JWT yang digunakan untuk autentikasi. Format: `Bearer <token>` | Ya        |

### **Request Body**:

Tidak ada body pada request untuk endpoint ini.

---

### **Responses**:

#### **Respons Sukses**:
- **Kode**: `200 OK`
- **Body**:
```json
{
  "username": "user123",
  "name": "John Doe",
  "city": "Jakarta",
  "email": "johndoe@example.com"
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

2. **Kesalahan Server Internal**:
   - **Kode**: `500 Internal Server Error`
   - **Body**:
   ```json
   {
     "message": "Error retrieving user data",
     "error": "Deskripsi kesalahan"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada masalah yang tidak terduga saat mengambil data pengguna dari database.

---

### **Alur**:
1. Pengguna mengirimkan permintaan `GET` ke endpoint `/user` dengan token JWT yang valid.
2. Middleware `authenticateToken` akan memverifikasi token JWT di header `Authorization`. Jika token tidak valid atau tidak ada, server akan merespons dengan `401 Unauthorized`.
3. Jika token valid, server akan mengambil data profil pengguna berdasarkan ID pengguna yang terautentikasi.
4. Server akan mengembalikan informasi profil pengguna, seperti username, nama, kota, dan email.
5. Jika terjadi kesalahan, server akan merespons dengan pesan kesalahan yang sesuai.


