## **Endpoint**: `/classification`

### **URL**:
```
POST https://project-beanalyze.et.r.appspot.com/classification
```

### **Metode**: `POST`

### **Deskripsi**:
Endpoint ini digunakan untuk mengirim gambar yang akan diprediksi jenis penyakitnya. Pengguna harus mengirim gambar bersama dengan token JWT yang valid untuk autentikasi. Gambar akan dikirim ke API eksternal untuk diproses, dan hasilnya akan dicocokkan dengan data penyakit yang ada di database. Hasil prediksi akan disimpan dalam tabel `prediction_history`.

---

### **Request Header**:

| **Field**        | **Tipe**  | **Deskripsi**                       | **Wajib** |
|------------------|-----------|-------------------------------------|-----------|
| `Authorization`  | `string`  | Token JWT yang digunakan untuk autentikasi. Format: `Bearer <token>` | Ya        |

### **Request Body**:

| **Field**   | **Tipe**  | **Deskripsi**                               | **Wajib** |
|-------------|-----------|---------------------------------------------|-----------|
| `image`     | `file`    | Gambar yang akan diprediksi. Dikirim sebagai bagian dari form-data. | Ya        |

#### **Contoh Request**:
```bash
POST /classification
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

Form-data:
```
image: <image_file>
```

---

### **Responses**:

#### **Respons Sukses**:
- **Kode**: `200 OK`
- **Body**:
```json
{
  "message": "Prediction classified successfully",
  "disease_name": "Penyakit A",
  "confident": 85.2,
  "image_predict_link": "https://storage.googleapis.com/<bucket_name>/predict-images/<image_name>.jpg",
  "image_disease_link": "https://storage.googleapis.com/<bucket_name>/disease-images/<disease_image_name>.jpg",
  "impact": "Dampak penyakit A",
  "cause": "Penyebab penyakit A",
  "identification": "Cara identifikasi penyakit A",
  "solution": "Solusi untuk penyakit A",
  "date": "2024-11-22"
}
```

#### **Respons Error**:

1. **Gambar Tidak Dikirim**:
   - **Kode**: `400 Bad Request`
   - **Body**:
   ```json
   {
     "message": "Image is required"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika gambar tidak disertakan dalam permintaan.

2. **Token Tidak Valid**:
   - **Kode**: `401 Unauthorized`
   - **Body**:
   ```json
   {
     "message": "Unauthorized"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika token JWT tidak ada atau tidak valid.

3. **Jenis Penyakit Tidak Ditemukan**:
   - **Kode**: `404 Not Found`
   - **Body**:
   ```json
   {
     "message": "Disease type not found"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika jenis penyakit yang diprediksi tidak ditemukan di database.

4. **Kesalahan Server Internal**:
   - **Kode**: `500 Internal Server Error`
   - **Body**:
   ```json
   {
     "message": "Error processing classification",
     "error": "Deskripsi kesalahan"
   }
   ```
   - **Deskripsi**: Kesalahan ini terjadi jika ada masalah yang tidak terduga selama proses prediksi atau pengolahan gambar.

---

### **Alur**:
1. Pengguna mengirimkan permintaan `POST` ke endpoint `/classification` dengan gambar dan token JWT yang valid.
2. Middleware `authenticateToken` akan memverifikasi token JWT di header `Authorization`. Jika token tidak valid atau tidak ada, server akan merespons dengan `401 Unauthorized`.
3. Jika token valid, gambar akan dikirim ke API eksternal untuk diprediksi jenis penyakitnya.
4. Berdasarkan hasil prediksi, server akan mencari data penyakit terkait di database.
5. Jika ditemukan, hasil prediksi, informasi penyakit, dan gambar akan disimpan di tabel `prediction_history`.
6. Server akan merespons dengan hasil prediksi, termasuk nama penyakit, tingkat kepercayaan, dan link ke gambar yang diprediksi dan gambar penyakit.
7. Jika terjadi kesalahan pada salah satu langkah, server akan merespons dengan kode status dan pesan kesalahan yang sesuai.

---

### **Pertimbangan Keamanan**:
- **Autentikasi**: Token JWT diperlukan untuk memastikan bahwa hanya pengguna yang terautentikasi yang dapat mengakses endpoint ini.
- **Validasi Input**: Pastikan bahwa gambar yang diterima adalah file yang valid dan dapat diproses.
- **Penggunaan Google Cloud Storage**: Gambar yang diprediksi disimpan di Google Cloud Storage untuk memastikan akses yang aman dan mudah dibagikan.