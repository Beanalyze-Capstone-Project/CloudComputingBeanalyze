## **Endpoint**: `/disease`

### **URL**:
```
POST https://project-beanalyze.et.r.appspot.com/disease
```

### **Method**: `GET`

### **Description**:
This endpoint is used to retrieve a list of all disease records from the database. It returns details such as the disease name, image URL, impact, cause, identification, solution, and the dates of creation and update.

---

### **Request Header**:

| **Field**        | **Type**  | **Description**                                               | **Required** |
|------------------|-----------|---------------------------------------------------------------|--------------|
| `Authorization`  | `string`  | JWT token for authentication. Format: `Bearer <token>`        | Yes          |


---

### **Request Body**:

This endpoint does not accept a request body.

---

### **Responses**:

#### **Successful Response**:
- **Code**: `200 OK`
- **Body**:
```json
{
  "diseases": [
    {
      "id": 1,
      "slugs": "covid-19",
      "name": "COVID-19",
      "image_url": "https://storage.googleapis.com/beanalyze-images-storage/disease-images/covid_image.jpg",
      "impact": "High impact on global health",
      "cause": "SARS-CoV-2 virus",
      "identification": "PCR test, symptoms observation",
      "solution": "Vaccination, isolation, and social distancing",
      "date_created": "2020-03-01",
      "date_updated": "2023-05-01"
    },
    {
      "id": 2,
      "slugs": "malaria",
      "name": "Malaria",
      "image_url": "https://storage.googleapis.com/beanalyze-images-storage/disease-images/malaria_image.jpg",
      "impact": "High impact in tropical regions",
      "cause": "Plasmodium parasite",
      "identification": "Blood test",
      "solution": "Antimalarial drugs, prevention of mosquito bites",
      "date_created": "2000-01-01",
      "date_updated": "2022-08-15"
    }
  ]
}
```

#### **Error Responses**:

1. **Internal Server Error**:
   - **Code**: `500 Internal Server Error`
   - **Body**:
   ```json
   {
     "message": "Error fetching diseases",
     "error": "Detailed error description"
   }
   ```
   - **Description**: This error occurs when the server encounters an issue while fetching the disease data from the database.

2. **Unauthorized**:
   - **Code**: `401 Unauthorized`
   - **Body**:
   ```json
   {
     "message": "Unauthorized"
   }
   ```
   - **Description**: This error occurs if the JWT token is missing or invalid.

---

### **Workflow**:
1. The user sends a `GET` request to the `/disease` endpoint with a valid JWT token in the `Authorization` header.
2. The middleware `authenticateToken` verifies the JWT token.
   - If the token is invalid or missing, the server will respond with a `401 Unauthorized` status.
3. If the token is valid, the server fetches disease records from the MySQL database using the `limit` and `offset` query parameters.
4. The server constructs a response, including a full `image_url` for each disease record.
5. The response is returned to the client in JSON format.
6. In case of an error, the server responds with an appropriate error message.
