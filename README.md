# CloudComputingBeanalyze

## API Overview

This project provides a set of RESTful APIs for user management, authentication, registration, profile management, and classification, built using **Express.js**, **MySQL**, and **JWT** for secure token-based authentication. It also includes endpoints for prediction history and a classification model.

### Key API Endpoints:

1. **POST /register**
   - **Description**: Register a new user with a unique username and password.
   - **Request Body**:
     ```json
     {
       "username": "newuser123",
       "password": "securePassword123",
       "name": "John Doe",
       "city": "Jakarta",
       "email": "johndoe@example.com"
     }
     ```
   - **Response**: Success or error message indicating registration status.
     ```json
     {
       "message": "User registered successfully"
     }
     ```


1. **POST /login**
   - **Description**: Authenticate user and generate a JWT token for further API requests.
   - **Request Body**:
     ```json
     {
       "username": "existinguser",
       "password": "userpassword"
     }
     ```
   - **Response**: A JWT token for user authentication in subsequent requests.
     ```json
     {
       "message": "Login successful",
       "token": "JWT_TOKEN_HERE"
     }
     ```

2. **GET /user**
   - **Description**: Retrieve the authenticated user's profile details.
   - **Authentication**: Requires a valid JWT token.
     ### **Request Header**:

      | **Field**        | **Tipe**  | **Deskripsi**                       | **Wajib** |
      |------------------|-----------|-------------------------------------|-----------|
      | `Authorization`  | `string`  | Format: `Bearer <token>` | Ya        |

   - **Response**: User profile details (username, name, city, email).
     ```json
     {
       "username": "user123",
        "name": "John Doe",
        "city": "Jakarta",
        "email": "johndoe@example.com"
     }
     ```

3. **POST /user/edit**
   - **Description**: Update user profile information such as username, name, city, and email.
   - **Authentication**: Requires a valid JWT token for authorization.
   - **Request Body**:
     ```json
     {
       "username": "newusername",
       "name": "Updated Name",
       "city": "New City",
       "email": "newemail@example.com"
     }
     ```
   - **Response**: Success message on successful update or error if no changes were made.
     ```json
     {
       "message": "User registered successfully"
     }
     ```

4. **GET /protected**
   - **Description**: A protected route that returns a message for authenticated users only.
   - **Authentication**: Requires a valid JWT token.
     
   - **Request Header**:
     | Field         | Type    | Description                       | Required |
     |---------------|---------|-----------------------------------|----------|
     | Authorization | string  | Format: `Bearer <token>`          | Yes      |

   - **Response**: Success message with user data from the decoded JWT token.
     ```json
     {
        "message": "Welcome to the protected route!",
        "user": {
            "id": 7,
            "username": "testuser",
            "iat": 1732281202,
            "exp": 1732886002
              }
      }
     ```

5. **GET /predict_history**
   - **Description**: Retrieve the prediction history of the authenticated user.
   - **Authentication**: Requires a valid JWT token.
     
   - **Request Header**:
     | Field         | Type    | Description                       | Required |
     |---------------|---------|-----------------------------------|----------|
     | Authorization | string  | Format: `Bearer <token>`          | Yes      |

   - **Response**: List of previous predictions made by the user.
     ```json
      {
        "user": "John Doe",
        "history": [
        {
            "disease_name": "Yellow Deases",
            "confident": "87.24",
            "image_link_history": "https://storage.googleapis.com/imangehistory.jpg",
            "image_link_disease": "https://storage.googleapis.com/imagedisease.jpeg",
            "impact": "",
            "cause": "",
            "identification": "",
            "solution": "",
             "date": "2024-11-22"
            },
            {
            "disease_name": "Yellow Deases",
            "confident": "87.24",
            "image_link_history": "https://storage.googleapis.com/imangehistory.jpg",
            "image_link_disease": "https://storage.googleapis.com/imagedisease.jpeg",
            "impact": "",
            "cause": "",
            "identification": "",
            "solution": "",
            "date": "2024-11-22"
           }
             ]
          }
      ```

### Key Features:
- **User Registration**: Allows new users to register with hashed passwords.
- **User Authentication**: JWT token-based authentication for secure access to protected routes.
- **User Profile Management**: Retrieve and update user details after authentication.
- **Classification**: Perform real-time classification with a trained model.
- **Prediction History**: View the history of user predictions.
- **Protected Routes**: Access specific routes that require user authentication.
- **Error Handling**: Detailed error messages for failed requests (e.g., user not found, invalid token).

### Technologies Used:
- **Express.js** for the web framework.
- **MySQL** for database management.
- **JWT** for secure authentication.
- **bcryptjs** for password hashing.
- **Machine Learning Model** for classification tasks.

---

This summary provides a clear overview of all your API endpoints, their functionality, and the technologies used, making it suitable for your GitHub main page.
