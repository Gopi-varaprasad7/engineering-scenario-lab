# 01 - Scenario: Input Validation

## 1. Problem

Build a user registration system where users can create an account by providing:

* Name
* Email
* Age
* Password

The system must validate user input before storing the data in PostgreSQL.

The application must handle both valid and invalid requests safely.

The frontend should provide immediate validation for a better user experience, but the backend must independently validate every request because the frontend cannot be trusted.

---

## 2. Requirements

The application should provide a registration form with the following fields:

```text
name
email
age
password
```

The system must:

* Validate user input on the frontend
* Validate user input again on the backend
* Reject invalid data
* Reject missing fields
* Reject incorrect data types
* Reject unexpected fields
* Prevent duplicate email registration
* Store valid users in PostgreSQL
* Never store passwords as plaintext
* Return meaningful HTTP status codes
* Handle invalid requests without crashing
* Handle database errors safely

---

## 3. User Fields

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `name`     | string | Yes      |
| `email`    | string | Yes      |
| `age`      | number | Yes      |
| `password` | string | Yes      |

---

## 4. Validation Rules

### 4.1 Name

The name must:

* Be present
* Be a string
* Have a minimum length of 4 characters
* Have a maximum length of 25 characters
* Not be empty
* Not contain numbers
* Not contain special characters
* Allow spaces between names

#### Examples

```text
Gopi                → Valid
Gopi Varaprasad     → Valid
Mary Jane           → Valid

Go                  → Invalid
Gopi123             → Invalid
Gopi@               → Invalid
""                  → Invalid
"   "               → Invalid
```

> These rules are intentionally simplified for this engineering exercise. Real-world name validation can be more flexible.

---

### 4.2 Email

The email must:

* Be present
* Be a string
* Have a valid email format
* End with `@gmail.com`
* Be unique

#### Examples

```text
gopi@gmail.com      → Valid
Gopi@gmail.com      → Valid

gopi                → Invalid
gopi@               → Invalid
@gmail.com          → Invalid
gopi@yahoo.com      → Invalid
```

> Only allowing Gmail addresses is a business rule for this exercise, not a general email-validation rule.

---

### 4.3 Age

The age must:

* Be present
* Be a number
* Be an integer
* Be greater than 0
* Be less than or equal to 100

Valid range:

```text
1 - 100
```

#### Examples

```text
1       → Valid
25      → Valid
100     → Valid

0       → Invalid
-1      → Invalid
101     → Invalid
25.5    → Invalid
"25"    → Invalid
"hello" → Invalid
null    → Invalid
```

---

### 4.4 Password

The password must:

* Be present
* Be a string
* Have a minimum length of 8 characters
* Have a maximum length of 64 characters
* Contain at least one uppercase letter
* Contain at least one lowercase letter
* Contain at least one number
* Contain at least one special character

#### Examples

```text
Gopi123!       → Valid
Password1!     → Valid

password       → Invalid
PASSWORD1!     → Invalid
Password!      → Invalid
Password1      → Invalid
Pass1!         → Invalid
```

The password must never be stored as plaintext.

---

## 5. API Contract

### Endpoint

```http
POST /api/users
```

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Gopi",
  "email": "gopi@gmail.com",
  "age": 25,
  "password": "Gopi123!"
}
```

---

### 5.1 Success Response

#### Status

```http
201 Created
```

#### Response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "Gopi",
    "email": "gopi@gmail.com",
    "age": 25
  }
}
```

The password must not be returned.

---

### 5.2 Validation Error

#### Status

```http
400 Bad Request
```

#### Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "fields": {
      "email": "Invalid Gmail address",
      "age": "Age must be between 1 and 100"
    }
  }
}
```

---

### 5.3 Duplicate Email

#### Status

```http
409 Conflict
```

#### Response

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email is already registered"
  }
}
```

---

### 5.4 Server Error

#### Status

```http
500 Internal Server Error
```

#### Response

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

Internal errors, database details, stack traces, passwords, and other sensitive information must not be exposed.

---

## 6. Database Design

The database will contain a `users` table.

```text
users
│
├── id
├── name
├── email
├── age
├── password_hash
├── created_at
└── updated_at
```

### Important Distinction

The user provides:

```text
password
```

The database stores:

```text
password_hash
```

The original password must never be stored directly.

---

### 6.1 Database Constraints

The database should enforce:

```text
id              → PRIMARY KEY
name            → NOT NULL
email           → NOT NULL
email           → UNIQUE
age             → NOT NULL
password_hash   → NOT NULL
```

The backend validates the request, but the database also protects its own data integrity.

---

## 7. Frontend Validation

Frontend validation is mainly responsible for:

* Immediate user feedback
* Better user experience
* Preventing unnecessary API requests
* Displaying field-level errors

The frontend should validate:

```text
name
email
age
password
```

However:

> Frontend validation is not a security boundary.

A user can bypass the frontend and directly call the backend API.

---

## 8. Backend Validation

The backend must independently validate every request.

The backend must validate:

```text
Required fields
Data types
String lengths
Number ranges
Email format
Business rules
Password rules
Unexpected fields
Malformed requests
```

The backend must never assume that data received from the frontend is valid.

---

## 9. Unknown Fields

The API should reject fields that are not part of the expected request.

### Example

```json
{
  "name": "Gopi",
  "email": "gopi@gmail.com",
  "age": 25,
  "password": "Gopi123!",
  "isAdmin": true
}
```

`isAdmin` is not an accepted registration field.

Expected response:

```http
400 Bad Request
```

---

## 10. Error Handling

Invalid input must not crash the backend.

### Invalid Request

```json
{}
```

### Invalid Data Types

```json
{
  "name": 123,
  "email": true,
  "age": "hello",
  "password": []
}
```

The backend should return a controlled `400 Bad Request` response.

The API must not expose:

```text
Stack traces
Database credentials
SQL queries
Internal file paths
Passwords
Password hashes
Internal infrastructure details
```

---

## 11. Edge Cases

### Name

```text
""
" "
"   "
"Go"
"Gopi"
"Gopi123"
"Gopi@"
"_Gopi"
"Mary Jane"
"José"
"aaaaaaaaaaaaaaaaaaaaaaaaaa"
123
null
{}
[]
```

### Email

```text
""
" "
"gopi"
"gopi@"
"@gmail.com"
"gopi@gmail"
"gopi@gmail.com"
"GOPI@gmail.com"
"gopi@yahoo.com"
123
null
{}
```

### Age

```text
-1
0
1
25
100
101
9999
25.5
"25"
"hello"
null
{}
[]
```

### Password

```text
""
"123"
"abcdefgh"
"ABCDEFGH"
"12345678"
"Abcdefgh"
"Abcdefg1"
"Abcdefg1!"
12345678
null
{}
[]
```

---

## 12. Missing Fields

The API must correctly handle missing fields.

### Missing Email

```json
{
  "name": "Gopi",
  "age": 25,
  "password": "Gopi123!"
}
```

Expected:

```http
400 Bad Request
```

### Missing Age

```json
{
  "name": "Gopi",
  "email": "gopi@gmail.com",
  "password": "Gopi123!"
}
```

Expected:

```http
400 Bad Request
```

### Empty Request

```json
{}
```

Expected:

```http
400 Bad Request
```

---

## 13. Wrong Data Types

The API must reject incorrect data types.

### Example

```json
{
  "name": 12345,
  "email": true,
  "age": "twenty-five",
  "password": []
}
```

Expected:

```http
400 Bad Request
```

The server must not crash.

---

## 14. Security Considerations

This scenario establishes the API's input boundary.

Important considerations:

* Never trust client input
* Validate on the backend
* Reject unexpected fields
* Validate data types
* Validate input length
* Prevent malformed requests from crashing the server
* Never store plaintext passwords
* Never return passwords
* Never expose password hashes
* Use database constraints
* Handle database errors safely

Advanced security topics will be covered in later scenarios.

---

## 15. Testing Strategy

Testing will be performed at multiple levels.

### 15.1 Frontend Testing

Test:

* Valid input
* Invalid input
* Empty fields
* Boundary values
* Field-level error messages
* Successful submission
* API error handling

---

### 15.2 API Testing

The backend must also be tested directly using:

```text
Postman
curl
```

This is important because it bypasses frontend validation.

---

### 15.3 Automated Testing

Automated tests will eventually cover:

* Successful registration
* Missing fields
* Invalid data types
* Invalid email
* Invalid age
* Invalid password
* Unknown fields
* Duplicate email
* Empty body
* Malformed requests
* Boundary values
* Database errors

---

## 16. Initial Test Matrix

|  # | Test Case                          | Expected |
| -: | ---------------------------------- | -------- |
|  1 | Valid user                         | 201      |
|  2 | Missing name                       | 400      |
|  3 | Missing email                      | 400      |
|  4 | Missing age                        | 400      |
|  5 | Missing password                   | 400      |
|  6 | Empty request                      | 400      |
|  7 | Empty name                         | 400      |
|  8 | Name shorter than 4                | 400      |
|  9 | Name longer than 25                | 400      |
| 10 | Name contains number               | 400      |
| 11 | Name contains special character    | 400      |
| 12 | Invalid email format               | 400      |
| 13 | Non-Gmail email                    | 400      |
| 14 | Duplicate email                    | 409      |
| 15 | Age = 0                            | 400      |
| 16 | Age = 1                            | Valid    |
| 17 | Age = 100                          | Valid    |
| 18 | Age = 101                          | 400      |
| 19 | Age is string                      | 400      |
| 20 | Password shorter than 8            | 400      |
| 21 | Password missing uppercase         | 400      |
| 22 | Password missing lowercase         | 400      |
| 23 | Password missing number            | 400      |
| 24 | Password missing special character | 400      |
| 25 | Unknown field                      | 400      |
| 26 | Null values                        | 400      |
| 27 | Array instead of string            | 400      |
| 28 | Object instead of string           | 400      |
| 29 | Extremely large input              | 400      |
| 30 | Malformed JSON                     | 400      |

---

## 17. Engineering Questions

By the end of this scenario, I should be able to answer:

1. Why do we validate on the frontend?
2. Why do we validate again on the backend?
3. Can frontend validation be bypassed?
4. Why can't TypeScript alone validate API input?
5. Why should email have a database `UNIQUE` constraint?
6. What happens if two users register with the same email simultaneously?
7. Why should passwords be hashed?
8. Why shouldn't password hashes be returned?
9. What is the difference between validation and sanitization?
10. What should happen when an unknown field is received?
11. What happens when the request body is `{}`?
12. What happens when the client sends the wrong data type?
13. Why should invalid input return `400`?
14. When should the API return `409 Conflict`?
15. Why should database constraints exist even when backend validation exists?

---

## 18. Definition of Done

* [ ] GitHub repository created
* [ ] Scenario folder created
* [ ] React frontend created
* [ ] Node.js/Express backend created
* [ ] PostgreSQL database connected
* [ ] Users table created
* [ ] Registration form implemented
* [ ] Frontend validation implemented
* [ ] Backend validation implemented
* [ ] API contract implemented
* [ ] Database constraints implemented
* [ ] Password hashing implemented
* [ ] Error handling implemented
* [ ] Unknown fields handled
* [ ] Manual API testing completed
* [ ] Automated tests completed
* [ ] Edge cases tested
* [ ] Frontend bypass tested
* [ ] Duplicate email tested
* [ ] Database failure tested
* [ ] Documentation completed
* [ ] Git commits created
* [ ] Changes pushed to GitHub

---

## 19. Expected Architecture

```text
                    ┌─────────────────────┐
                    │    React Client     │
                    │                     │
                    │ Registration Form   │
                    │ Client Validation   │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │                     │
                    │ Request Parsing     │
                    │ Input Validation    │
                    │ Business Rules      │
                    │ Error Handling       │
                    │ Password Hashing    │
                    └──────────┬──────────┘
                               │
                               │ SQL
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │                     │
                    │       users         │
                    │                     │
                    │ UNIQUE email        │
                    │ NOT NULL fields     │
                    └─────────────────────┘
```

---

## 20. Engineering Principle

The most important lesson of this scenario:

> **Never trust data just because it came from your own frontend.**

Every request crossing the application boundary should be treated as untrusted input.

```text
Client
  │
  │ Untrusted data
  ▼
API Boundary
  │
  │ Validate
  ▼
Business Logic
  │
  │ Enforce rules
  ▼
Database
  │
  │ Protect data integrity
  ▼
Persistent State
```

---

## 21. What I Learned

This section will be completed after implementing the scenario.

Answer these questions after completion:

1. What did I initially misunderstand?
2. What validation rules did I change and why?
3. What could the frontend not protect against?
4. What did I learn about database constraints?
5. What happened when I bypassed the frontend?
6. Which edge case surprised me?
7. Which test initially failed?
8. How did I debug it?
9. What would I change in a production system?
10. What engineering trade-offs did I make?

---

## 22. Implementation Plan

```text
Stage 1
Project initialization
        ↓
Stage 2
Frontend setup
        ↓
Stage 3
Backend setup
        ↓
Stage 4
PostgreSQL setup
        ↓
Stage 5
Basic registration flow
        ↓
Stage 6
Manual validation
        ↓
Stage 7
Frontend validation
        ↓
Stage 8
Backend validation
        ↓
Stage 9
Database constraints
        ↓
Stage 10
Error handling
        ↓
Stage 11
Automated testing
        ↓
Stage 12
Break the API
        ↓
Stage 13
Fix discovered problems
        ↓
Stage 14
Final engineering review
```

### Final Goal

The goal is not simply to make the registration API work.

The goal is to understand:

> **Why every protection exists, what problem it solves, what happens when it is removed, and what trade-offs the solution has.**
