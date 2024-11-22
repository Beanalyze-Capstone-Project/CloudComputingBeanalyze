
## **Endpoint**: `/protected`

### **URL**:
```
https://project-beanalyze.et.r.appspot.com/protected
```
### **Metode**: `GET`

### **Deskripsi**:
Endpoint ini adalah route yang dilindungi (protected route) yang membutuhkan autentikasi menggunakan token JWT. Endpoint ini akan mengembalikan pesan sambutan serta informasi pengguna yang terautentikasi.

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
  "message": "Welcome to the protected route!",
  "user": {
    "id": 1,
    "username": "user123",
    "name": "John Doe",
    "city": "Jakarta",
    "email": "johndoe@example.com"
  }
}
```

#### **Respons Error**:

1. **Token Tidak Ditemukan atau Tidak Valid**:
   - **Kode**: `401 Unauthorized`
   - **Body**:
   ```json
   {
     "message": "Access token required"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika token JWT tidak ditemukan dalam header `Authorization` atau jika token tidak valid.

2. **Token Kedaluwarsa atau Tidak Valid**:
   - **Kode**: `403 Forbidden`
   - **Body**:
   ```json
   {
     "message": "Invalid or expired token"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika token JWT yang disertakan sudah tidak valid atau kedaluwarsa.

3. **Kesalahan Server Internal**:
   - **Kode**: `500 Internal Server Error`
   - **Body**:
   ```json
   {
     "message": "Error accessing the protected route",
     "error": "Deskripsi kesalahan"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada masalah yang tidak terduga saat mengakses endpoint yang dilindungi.

---

### **Alur**:
1. Pengguna mengirimkan permintaan `GET` ke endpoint `/protected` dengan token JWT yang valid di header `Authorization`.
2. Middleware `authenticateToken` akan memverifikasi token JWT. Jika token tidak ditemukan atau tidak valid, server akan merespons dengan `401 Unauthorized` atau `403 Forbidden`.
3. Jika token valid, server akan mengembalikan pesan sambutan bersama dengan data pengguna yang terautentikasi, yang diambil dari payload token.
4. Jika terjadi kesalahan saat mengakses data atau masalah internal, server akan merespons dengan `500 Internal Server Error`.

