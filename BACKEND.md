# B&B Shoes - Professional Backend Documentation

## 🏗️ Backend Architecture

The B&B Shoes backend is built with **professional-grade patterns** following industry best practices for security, scalability, and maintainability.

## 📁 Backend Structure

```
src/
├── lib/                        # Core Backend Utilities
│   ├── mongodb.ts              # MongoDB connection with caching
│   ├── auth.ts                 # JWT authentication & authorization
│   ├── apiResponse.ts          # Standardized API responses
│   ├── errorHandler.ts         # Centralized error handling
│   ├── validation.ts           # Input validation utilities
│   ├── dbService.ts            # Database service layer
│   ├── logger.ts               # Professional logging system
│   └── security.ts             # Security & sanitization utilities
│
├── models/                     # MongoDB Models (Mongoose)
│   ├── User.ts                 # User authentication model
│   ├── Product.ts              # E-commerce product model
│   ├── Order.ts                # Order management model
│   ├── Review.ts               # Product reviews model
│   └── index.ts                # Model exports
│
└── app/api/                    # Next.js API Routes
    ├── auth/
    │   ├── register/route.ts   # User registration
    │   └── login/route.ts      # User authentication
    ├── products/
    │   ├── route.ts            # Get all & create products
    │   └── [id]/route.ts       # Get, update, delete product
    ├── orders/
    │   ├── route.ts            # Get all & create orders
    │   └── [id]/route.ts       # Get, update order
    └── test-db/route.ts        # Database connection test
```

## 🔐 Security Features

### 1. **Authentication (JWT-based)**
- **JWT Token Generation** with 7-day expiration
- **BCrypt Password Hashing** (10 rounds)
- **Token Verification** middleware
- **Role-based Authorization** (User/Admin)

### 2. **Input Validation**
- Email format validation
- Password strength requirements (min 6 characters)
- Phone number validation (Pakistan format)
- Product data validation
- Order data validation

### 3. **Security Utilities**
- XSS prevention (HTML sanitization)
- SQL/NoSQL injection protection
- Rate limiting helpers
- Sensitive data masking
- Parameter pollution prevention

## 🛠️ Core Utilities

### **1. API Response Handler** (`apiResponse.ts`)
Standardized response format across all endpoints:

```typescript
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "timestamp": "2024-02-10T12:00:00.000Z"
}
```

Available helpers:
- `successResponse()` - 200 OK
- `createdResponse()` - 201 Created
- `errorResponse()` - Error responses
- `validationErrorResponse()` - 400 Validation errors
- `unauthorizedResponse()` - 401 Unauthorized
- `notFoundResponse()` - 404 Not Found

### **2. Error Handler** (`errorHandler.ts`)
Automatic error handling with proper status codes:

- MongoDB duplicate key error (409)
- Validation errors (400)
- Cast errors (400)
- JWT errors (401)
- Custom error classes

### **3. Authentication** (`auth.ts`)
JWT-based authentication system:

```typescript
// Generate token
const token = generateToken({ userId, email, role, isAdmin });

// Verify token
const user = verifyToken(token);

// Middleware
const user = authenticateRequest(req);       // Require login
const admin = authorizeAdmin(req);          // Require admin
const user = optionalAuth(req);             // Optional auth
```

### **4. Validation** (`validation.ts`)
Input validation helpers:

- `validateRegistration()` - User signup
- `validateLogin()` - User login
- `validateProduct()` - Product data
- `validateOrder()` - Order data
- `isValidEmail()` - Email format
- `isValidPassword()` - Password strength
- `isValidPhone()` - Phone number (Pakistan)

### **5. Database Service** (`dbService.ts`)
Reusable database operations:

```typescript
// Find all with filters
const products = await findAll(Product, { category: 'Nike' });

// Find by ID
const product = await findById(Product, id);

// Create document
const newProduct = await create(Product, data);

// Update by ID
const updated = await updateById(Product, id, data);

// Delete by ID
await deleteById(Product, id);

// Paginated results
const { documents, pagination } = await findPaginated(Product, filters, {
  page: 1,
  limit: 10
});
```

### **6. Logger** (`logger.ts`)
Professional logging system:

```typescript
logger.success('User registered', { email: user.email });
logger.error('Database error', error);
logger.api('POST', '/api/products', 201);
logger.db('Found 25 products');
logger.auth('User logged in', { userId });
logger.perf('Database query', 45); // 45ms
```

### **7. Security** (`security.ts`)
Security utilities:

- HTML sanitization (XSS prevention)
- Query sanitization (injection prevention)
- Email/phone masking
- Rate limiting
- Strong password validation
- Random token generation

## 📡 API Endpoints

### **Authentication**

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { success, message, data: { user, token } }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { success, message, data: { user, token } }
```

### **Products**

#### Get All Products
```
GET /api/products?category=Nike&isOnSale=true&search=shoes

Response: {
  success, 
  message, 
  data: { count, products: [...] }
}
```

#### Create Product
```
POST /api/products
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "name": "Nike Air Max",
  "price": 12000,
  "category": "Nike",
  "brand": "Nike",
  "sizes": [7, 8, 9, 10],
  "colors": ["Black", "White"],
  ...
}

Response: { success, message, data: product }
```

### **Orders**

#### Get All Orders
```
GET /api/orders?status=Pending&email=customer@example.com

Response: {
  success,
  message,
  data: { count, orders: [...] }
}
```

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "03001234567",
  "customerAddress": "123 Street, Karachi",
  "items": [...],
  "total": 25000,
  "paymentMethod": "COD"
}

Response: { success, message, data: order }
```

## 🔄 Request/Response Flow

```
1. Client Request
   ↓
2. API Route Handler (asyncHandler wrapper)
   ↓
3. Database Connection (cached)
   ↓
4. Input Validation
   ↓
5. Business Logic
   ↓
6. Database Operation
   ↓
7. Standardized Response
   ↓
8. Automatic Error Handling (if error occurs)
```

## 🚀 Key Features

### ✅ **Professional Patterns**
- **Async Handler Wrapper**: Auto-catches errors
- **Service Layer**: Reusable database operations
- **Repository Pattern**: Clean data access
- **DTO Pattern**: Consistent response formatting

### ✅ **Error Handling**
- Global error handler
- Custom error classes
- Proper HTTP status codes
- Production-safe error messages

### ✅ **Security**
- JWT authentication
- BCrypt password hashing
- Input validation
- XSS prevention
- SQL injection protection
- Rate limiting

### ✅ **Logging**
- Structured logging
- Performance tracking
- Database operation logs
- API request logs
- Error tracking

### ✅ **TypeScript**
- Full type safety
- Interface definitions
- Type validations
- Auto-completion support

## 🗄️ Database Models

### **User Model**
- Email/password authentication
- Role-based access (user/admin)
- Wishlist & cart support
- Profile information

### **Product Model**
- Full e-commerce fields
- Size & color variants
- Stock management
- Rating & reviews
- Sale prices

### **Order Model**
- Customer details
- Order items
- Payment tracking
- Status management
- Order history

### **Review Model**
- Product ratings
- User reviews
- Verified purchases

## 🔧 Environment Variables

```env
MONGODB_URI="mongodb+srv://..."
JWT_SECRET="your-secret-key"
ADMIN_PASSWORD="admin-password"
SHIPPING_FEE="200"
CURRENCY="PKR"
CONTACT_PHONE="03361673742"
CONTACT_EMAIL="B&Bshoessupport@gmail.com"
```

## 📊 Performance Optimizations

- **MongoDB Connection Caching**: Prevents connection pool growth
- **Indexed Queries**: Fast product search
- **Lean Queries**: Memory optimization
- **Select Queries**: Fetch only needed fields
- **Pagination**: Efficient large dataset handling

## 🎯 Best Practices Implemented

1. ✅ Consistent API response structure
2. ✅ Centralized error handling
3. ✅ Input validation on all endpoints
4. ✅ Secure password storage (BCrypt)
5. ✅ JWT-based stateless authentication
6. ✅ Professional logging system
7. ✅ TypeScript for type safety
8. ✅ Database service layer
9. ✅ Rate limiting support
10. ✅ Security utilities (XSS, injection prevention)

## 📝 Usage Examples

### Using Async Handler
```typescript
export const POST = asyncHandler(async (req: NextRequest) => {
  // Your code - errors automatically caught
  const data = await someAsyncOperation();
  return successResponse(data);
});
```

### Using Validation
```typescript
const validation = validateProduct(body);
if (!validation.isValid) {
  return validationErrorResponse(validation.errors);
}
```

### Using Database Service
```typescript
const products = await findAll(Product, { category: 'Nike' });
const product = await create(Product, productData);
```

### Using Logger
```typescript
logger.success('Operation completed', { id: product._id });
logger.error('Failed to save', error);
```

---

## 🎓 Code Quality

- ✅ **Production-Ready**: Industry-standard patterns
- ✅ **Maintainable**: Clean, organized code structure
- ✅ **Scalable**: Service-oriented architecture
- ✅ **Secure**: Multiple security layers
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Tested**: Error-free compilation

---

**Backend Version**: 1.0.0  
**Last Updated**: February 10, 2024  
**Developer**: Professional E-commerce Backend System
