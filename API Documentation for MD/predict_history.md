## **Endpoint**: `/predict_history`

### **URL**:
```
https://project-beanalyze.et.r.appspot.com/predict_history
```

### **Metode**: `GET`

### **Deskripsi**:
Endpoint ini digunakan untuk mengambil riwayat prediksi penyakit yang telah dilakukan oleh pengguna yang terautentikasi. Data yang dikembalikan mencakup nama penyakit, tingkat kepercayaan, gambar yang diprediksi, dan informasi terkait penyakit, seperti dampak, penyebab, identifikasi, dan solusi.

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
  "user": "Nama Pengguna",
  "history": [
    {
      "disease_name": "Penyakit A",
      "confident": 85.2,
      "image_link_history": "https://storage.googleapis.com/<bucket_name>/predict-images/<image_name>.jpg",
      "image_link_disease": "https://storage.googleapis.com/<bucket_name>/disease-images/<disease_image>.jpg",
      "impact": "Dampak penyakit A",
      "cause": "Penyebab penyakit A",
      "identification": "Cara identifikasi penyakit A",
      "solution": "Solusi untuk penyakit A",
      "date": "2024-11-22"
    },
    {
      "disease_name": "Penyakit B",
      "confident": 76.5,
      "image_link_history": "https://storage.googleapis.com/<bucket_name>/predict-images/<image_name>.jpg",
      "image_link_disease": "https://storage.googleapis.com/<bucket_name>/disease-images/<disease_image>.jpg",
      "impact": "Dampak penyakit B",
      "cause": "Penyebab penyakit B",
      "identification": "Cara identifikasi penyakit B",
      "solution": "Solusi untuk penyakit B",
      "date": "2024-11-20"
    }
  ]
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
     "message": "Error fetching prediction history",
     "error": "Deskripsi kesalahan"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada masalah yang tidak terduga saat mengambil riwayat prediksi dari database.

---

### **Alur**:
1. Pengguna mengirimkan permintaan `GET` ke endpoint `/predict_history` dengan token JWT yang valid.
2. Middleware `authenticateToken` akan memverifikasi token JWT di header `Authorization`. Jika token tidak valid atau tidak ada, server akan merespons dengan `401 Unauthorized`.
3. Jika token valid, server akan mengambil riwayat prediksi penyakit untuk pengguna berdasarkan ID pengguna yang terautentikasi.
4. Server akan mengambil data prediksi dari tabel `prediction_history` yang terhubung dengan tabel `disease`, dan menggabungkan data yang relevan.
5. Riwayat prediksi akan dikirimkan dalam format JSON yang mencakup nama penyakit, tingkat kepercayaan, dan link gambar yang relevan.
6. Jika terjadi kesalahan saat mengambil data, server akan merespons dengan pesan kesalahan yang sesuai.

---

### **Pertimbangan Keamanan**:
- **Autentikasi**: Token JWT diperlukan untuk memastikan bahwa hanya pengguna yang terautentikasi yang dapat mengakses riwayat prediksi mereka.
- **Validasi Input**: Pastikan bahwa token yang diterima valid dan sesuai dengan pengguna yang dimaksud.
- **Penggunaan Google Cloud Storage**: Gambar yang terkait dengan prediksi disimpan di Google Cloud Storage dan diakses melalui URL publik.
