# Coffee Shop Management System - API Documentation

## 🚀 Project Overview

A comprehensive full-stack coffee shop management system built with **Nuxt 3**, **PostgreSQL**, and **Prisma ORM**. The system features a role-based architecture supporting **3 user roles**: Customer, Barista, and Admin.

---

## 📦 Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS, @nuxt/icon
- **Backend**: Nuxt Server API (h3)
- **Database**: PostgreSQL (hosted on Prisma.io cloud)
- **ORM**: Prisma 6.19.2
- **Authentication**: Session-based auth with bcryptjs
- **Payment**: Simulated payment gateway (CASH, COD, DANA, OVO, GOPAY, VIRTUAL_ACCOUNT)

---

## 🗂️ Database Schema

### User Models
- **User**: id, email, phone, password, name, role, avatar, isActive
- **Session**: token-based session management
- **Address**: delivery addresses with city, province, postal code
- **UserPreference**: favorite ice/sugar levels, size preferences

### Menu Models
- **Menu**: name, description, category, image, availability
- **MenuPrice**: size-based pricing (SMALL, MEDIUM, LARGE)
- **Topping**: pearl, pudding, jelly, cream cheese, etc.
- **Ingredient**: stock tracking with unit and price

### Order Models
- **Order**: orderNumber, status, type, subtotal, tax, discount, total, QR code
- **OrderItem**: menu items with customizations (ice/sugar level)
- **OrderStatusHistory**: status change tracking
- **Payment**: method, status, transactionId, amount, proof image

### Loyalty & Promo Models
- **LoyaltyPoint**: point balance per user
- **LoyaltyTransaction**: earn/redeem history
- **Voucher**: percentage/fixed discount codes with quota
- **UserVoucher**: tracks which users claimed which vouchers

### Store Models
- **StoreSetting**: key-value configuration
- **OperationalHour**: daily opening hours (dayOfWeek 0-6)

---

## 🔐 Authentication API

### POST `/api/auth/register`
**Description**: Register a new customer account

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "081234567890" // optional
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "cmlmc8ldh0003ulzk0ck4fzn8",
    "email": "customer@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "avatar": null,
    "createdAt": "2026-02-14T13:20:56.783Z"
  },
  "token": "session_token_here"
}
```

**Validation**:
- Email must be valid format
- Password must be at least 6 characters
- Email and phone must be unique

**Default Role**: CUSTOMER

---

### POST `/api/auth/login`
**Description**: Login with email and password

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "cmlmc8ldh0003ulzk0ck4fzn8",
    "email": "customer@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  },
  "token": "session_token_here"
}
```

**Error Codes**:
- 400: Missing email or password
- 401: Invalid credentials

**Session**: Auto-creates session cookie (httpOnly, 7 days expiry)

---

### POST `/api/auth/logout`
**Description**: Logout and destroy session

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`
**Description**: Get current authenticated user

**Headers**: `Cookie: session_token=xxx`

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "cmlmc8ldh0003ulzk0ck4fzn8",
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "081234567890",
    "role": "CUSTOMER",
    "avatar": null,
    "createdAt": "2026-02-14T13:20:56.783Z"
  }
}
```

**Error Codes**:
- 401: Not authenticated or session expired

---

## 🛒 Customer API

### GET `/api/menu`
**Description**: Get all available menus with prices and toppings

**Public Endpoint** (no auth required)

**Response**:
```json
{
  "success": true,
  "menus": [
    {
      "id": "menu_id",
      "name": "Caffe Latte",
      "description": "Rich espresso with steamed milk",
      "category": "COFFEE",
      "image": "https://...",
      "isAvailable": true,
      "prices": [
        { "size": "SMALL", "price": 25000 },
        { "size": "MEDIUM", "price": 30000 },
        { "size": "LARGE", "price": 35000 }
      ],
      "toppings": [
        {
          "topping": {
            "id": "topping_id",
            "name": "Pearl",
            "price": 5000,
            "isAvailable": true
          }
        }
      ]
    }
  ]
}
```

---

### POST `/api/orders/create`
**Description**: Create a new order

**Role**: CUSTOMER

**Request Body**:
```json
{
  "items": [
    {
      "menuId": "menu_123",
      "size": "MEDIUM",
      "quantity": 2,
      "iceLevel": "NORMAL",
      "sugarLevel": "LESS_SUGAR",
      "notes": "Extra hot please",
      "toppingIds": ["topping_1", "topping_2"]
    }
  ],
  "orderType": "DINE_IN", // DINE_IN | TAKEAWAY | DELIVERY
  "addressId": "address_id", // required for DELIVERY
  "voucherCode": "WELCOME10", // optional
  "paymentMethod": "DANA" // CASH | COD | DANA | OVO | GOPAY | VIRTUAL_ACCOUNT
}
```

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-ABC123-XYZ",
    "status": "PENDING",
    "type": "DINE_IN",
    "subtotal": 60000,
    "tax": 6000,
    "deliveryFee": 0,
    "discount": 6000,
    "total": 60000,
    "qrCode": "base64_encoded_string",
    "estimatedTime": 15,
    "items": [...],
    "payment": {
      "method": "DANA",
      "status": "PENDING",
      "amount": 60000
    }
  }
}
```

**Order Flow**:
1. Validates menu availability
2. Calculates prices including toppings
3. Applies voucher discount if valid
4. Calculates tax (10%) and delivery fee (Rp 10.000 for DELIVERY)
5. Creates order with PENDING status
6. Generates QR code for pickup verification

**Delivery Fee**: Rp 10.000 (only for DELIVERY type)
**Tax**: 10% of subtotal

---

### GET `/api/orders`
**Description**: Get all orders for current user

**Role**: CUSTOMER

**Response**:
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "orderNumber": "ORD-ABC123-XYZ",
      "status": "READY",
      "total": 60000,
      "estimatedTime": 15,
      "createdAt": "2026-02-14T13:20:56.783Z",
      "items": [...],
      "payment": {...},
      "statusHistory": [...]
    }
  ]
}
```

---

### GET `/api/orders/[id]`
**Description**: Get order details by ID

**Role**: CUSTOMER (only own orders)

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-ABC123-XYZ",
    "status": "READY",
    "qrCode": "base64_string",
    "items": [...],
    "payment": {...},
    "statusHistory": [
      {
        "status": "PENDING",
        "notes": "Order created",
        "createdAt": "2026-02-14T13:20:56.783Z"
      },
      {
        "status": "PROCESSING",
        "notes": "Payment confirmed",
        "createdAt": "2026-02-14T13:25:56.783Z"
      }
    ]
  }
}
```

---

### POST `/api/payments/process`
**Description**: Process payment for an order

**Role**: CUSTOMER

**Request Body**:
```json
{
  "orderId": "order_123",
  "paymentProof": "https://..." // optional for non-CASH methods
}
```

**Response**:
```json
{
  "success": true,
  "payment": {
    "id": "payment_id",
    "method": "DANA",
    "status": "SUCCESS",
    "transactionId": "TRX-XYZ123",
    "amount": 60000,
    "paidAt": "2026-02-14T13:20:56.783Z"
  },
  "message": "Payment confirmed"
}
```

**Payment Logic**:
- CASH: Stays PENDING until barista confirms
- Other methods: Auto-confirmed as SUCCESS
- On success: Order status → PROCESSING
- Awards loyalty points (1 point per Rp 10.000)

**Loyalty Points**: Rp 10.000 = 1 point

---

### GET `/api/loyalty/points`
**Description**: Get loyalty points balance and transaction history

**Role**: CUSTOMER

**Response**:
```json
{
  "success": true,
  "loyaltyPoints": 150,
  "transactions": [
    {
      "id": "trans_id",
      "points": 6,
      "type": "EARN",
      "description": "Earned 6 points from order ORD-ABC123",
      "createdAt": "2026-02-14T13:20:56.783Z",
      "order": {
        "orderNumber": "ORD-ABC123"
      }
    }
  ]
}
```

---

### GET `/api/vouchers`
**Description**: Get all active vouchers

**Public Endpoint** (shows usage status if authenticated)

**Response**:
```json
{
  "success": true,
  "vouchers": [
    {
      "id": "voucher_id",
      "code": "WELCOME10",
      "name": "Welcome Discount",
      "description": "Get 10% off your first order",
      "type": "PERCENTAGE",
      "value": 10,
      "maxDiscount": 20000,
      "quota": 100,
      "usedCount": 15,
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-05-31T23:59:59.000Z",
      "isUsed": false,
      "remainingQuota": 85
    }
  ]
}
```

**Voucher Types**:
- PERCENTAGE: % discount with optional maxDiscount cap
- FIXED: flat amount discount

---

## ☕ Barista API

### GET `/api/barista/orders`
**Description**: Get orders queue for barista dashboard

**Role**: BARISTA, ADMIN

**Query Params**:
- `status` (optional): PENDING | PROCESSING | READY | COMPLETED | all

**Response**:
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "orderNumber": "ORD-ABC123",
      "status": "PROCESSING",
      "type": "DINE_IN",
      "total": 60000,
      "estimatedTime": 15,
      "createdAt": "2026-02-14T13:20:56.783Z",
      "user": {
        "name": "John Doe",
        "phone": "081234567890"
      },
      "items": [
        {
          "quantity": 2,
          "menu": {
            "name": "Caffe Latte"
          },
          "size": "MEDIUM",
          "iceLevel": "NORMAL",
          "sugarLevel": "LESS_SUGAR",
          "notes": "Extra hot",
          "toppings": [
            {
              "topping": {
                "name": "Pearl"
              },
              "quantity": 2
            }
          ]
        }
      ]
    }
  ]
}
```

**Filter**: Only shows orders with payment status = SUCCESS

---

### POST `/api/barista/update-status`
**Description**: Update order status

**Role**: BARISTA, ADMIN

**Request Body**:
```json
{
  "orderId": "order_123",
  "status": "READY",
  "notes": "Order is ready for pickup"
}
```

**Valid Status Transitions**:
- PENDING → PROCESSING (after payment)
- PROCESSING → READY (order complete)
- READY → COMPLETED (picked up)
- Any → CANCELLED

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "status": "READY",
    "completedAt": null
  }
}
```

**Auto-sets**: `completedAt` timestamp when status = COMPLETED

---

### POST `/api/barista/scan-qr`
**Description**: Scan QR code to complete order pickup

**Role**: BARISTA, ADMIN

**Request Body**:
```json
{
  "qrCode": "base64_encoded_qr_code"
}
```

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-ABC123",
    "status": "COMPLETED",
    "completedAt": "2026-02-14T13:45:56.783Z",
    "user": {
      "name": "John Doe",
      "phone": "081234567890"
    },
    "items": [...]
  }
}
```

**Validation**: Only orders with status = READY can be scanned

---

## 👨‍💼 Admin API

### GET `/api/admin/users`
**Description**: Get all users with filtering

**Role**: ADMIN

**Query Params**:
- `search` (optional): search by name, email, or phone
- `role` (optional): CUSTOMER | BARISTA | ADMIN

**Response**:
```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "email": "customer@example.com",
      "name": "John Doe",
      "phone": "081234567890",
      "role": "CUSTOMER",
      "avatar": null,
      "createdAt": "2026-02-14T13:20:56.783Z"
    }
  ]
}
```

---

### PUT `/api/admin/users/[id]`
**Description**: Update user role or name

**Role**: ADMIN

**Request Body**:
```json
{
  "role": "BARISTA",
  "name": "John Updated"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "role": "BARISTA",
    "name": "John Updated"
  }
}
```

---

### GET `/api/admin/orders`
**Description**: Get all orders with statistics

**Role**: ADMIN

**Query Params**:
- `status` (optional): filter by status
- `dateFrom` (optional): filter by start date
- `dateTo` (optional): filter by end date

**Response**:
```json
{
  "success": true,
  "orders": [...],
  "statistics": {
    "totalOrders": 150,
    "totalRevenue": 9000000,
    "statusCounts": {
      "COMPLETED": 120,
      "PROCESSING": 20,
      "PENDING": 10
    }
  }
}
```

---

### POST `/api/admin/menu/create`
**Description**: Create new menu item

**Role**: ADMIN

**Request Body**:
```json
{
  "name": "New Coffee",
  "description": "Delicious coffee",
  "category": "COFFEE",
  "image": "https://...",
  "prices": [
    { "size": "SMALL", "price": 25000 },
    { "size": "MEDIUM", "price": 30000 },
    { "size": "LARGE", "price": 35000 }
  ],
  "ingredients": [
    { "ingredientId": "ing_123", "quantity": 0.02 }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "menu": {
    "id": "menu_id",
    "name": "New Coffee",
    "category": "COFFEE",
    "prices": [...]
  }
}
```

---

### PUT `/api/admin/menu/[id]`
**Description**: Update menu item

**Role**: ADMIN

**Request Body**:
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isAvailable": false
}
```

---

### GET `/api/admin/inventory`
**Description**: Get all ingredients with stock levels

**Role**: ADMIN

**Response**:
```json
{
  "success": true,
  "ingredients": [
    {
      "id": "ing_id",
      "name": "Coffee Beans",
      "unit": "KG",
      "stock": 50,
      "minStock": 10,
      "price": 150000,
      "_count": {
        "menus": 12
      }
    }
  ]
}
```

---

### PUT `/api/admin/inventory/[id]`
**Description**: Update ingredient stock

**Role**: ADMIN

**Request Body**:
```json
{
  "quantity": 10, // positive = add, negative = remove
  "notes": "Restocked coffee beans"
}
```

**Response**:
```json
{
  "success": true,
  "ingredient": {
    "id": "ing_id",
    "stock": 60
  }
}
```

**Auto-creates**: StockHistory record for tracking

---

### GET `/api/admin/vouchers`
**Description**: Get all vouchers with usage stats

**Role**: ADMIN

**Response**:
```json
{
  "success": true,
  "vouchers": [
    {
      "id": "voucher_id",
      "code": "WELCOME10",
      "name": "Welcome Discount",
      "type": "PERCENTAGE",
      "value": 10,
      "quota": 100,
      "usedCount": 15,
      "_count": {
        "userVouchers": 15
      }
    }
  ]
}
```

---

### POST `/api/admin/vouchers/create`
**Description**: Create new voucher

**Role**: ADMIN

**Request Body**:
```json
{
  "code": "NEWYEAR2026",
  "name": "New Year Promo",
  "description": "Special discount for new year",
  "type": "PERCENTAGE",
  "value": 20,
  "maxDiscount": 50000,
  "quota": 200,
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-01-31T23:59:59.000Z"
}
```

**Validation**: Code must be unique

---

### GET `/api/admin/reports`
**Description**: Get analytics and reports

**Role**: ADMIN

**Query Params**:
- `period`: 7d | 30d | 90d | 1y

**Response**:
```json
{
  "success": true,
  "period": "30d",
  "statistics": {
    "totalOrders": 450,
    "totalRevenue": 27000000,
    "averageOrderValue": 60000,
    "ordersByStatus": [
      { "status": "COMPLETED", "_count": 400 }
    ],
    "topItems": [
      {
        "menu": {
          "name": "Caffe Latte",
          "category": "COFFEE"
        },
        "totalQuantity": 250,
        "orderCount": 180
      }
    ],
    "dailyRevenue": {
      "2026-02-01": 900000,
      "2026-02-02": 950000
    }
  }
}
```

---

## 🗄️ Database Seeding

Run `npm run seed` to populate the database with sample data:

### Sample Accounts

**Admin**:
- Email: admin@coffeeshop.com
- Password: admin123

**Baristas**:
- Email: barista1@coffeeshop.com / Password: barista123
- Email: barista2@coffeeshop.com / Password: barista123

**Customers**:
- Email: customer1@example.com / Password: customer123
- Email: customer2@example.com / Password: customer123
- (customer3, customer4, customer5 also available)

### Seed Data Includes:
- ✅ 8 users (1 admin, 2 baristas, 5 customers)
- ✅ 3 delivery addresses
- ✅ 21 menu items from products.json
- ✅ 6 toppings (Pearl, Pudding, Jelly, Cream Cheese, Ice Cream, Whipped Cream)
- ✅ 9 ingredients with stock tracking
- ✅ 3 active vouchers (WELCOME10, DISC20K, FREESHIP)
- ✅ Store settings (name, address, phone, delivery fee, tax)
- ✅ 7 operational hours (Monday-Sunday)

---

## 🔒 Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Not authenticated or invalid credentials |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource (e.g., email already exists) |
| 500 | Internal Server Error |

---

## 🚦 Order Status Flow

```
PENDING → PROCESSING → READY → COMPLETED
         ↓
    CANCELLED (can be cancelled from any status)
```

**Status Meanings**:
- PENDING: Waiting for payment
- PROCESSING: Payment confirmed, preparing order
- READY: Order ready for pickup/delivery
- COMPLETED: Order picked up/delivered
- CANCELLED: Order cancelled

---

## 💰 Payment Methods

| Method | Code | Description |
|--------|------|-------------|
| Cash | CASH | Pay at counter (manual verification) |
| Cash on Delivery | COD | Pay when delivered |
| DANA | DANA | E-wallet payment |
| OVO | OVO | E-wallet payment |
| GoPay | GOPAY | E-wallet payment |
| Virtual Account | VIRTUAL_ACCOUNT | Bank transfer |

**Note**: All payment methods are simulated. In production, integrate with real payment gateways.

---

## 📊 Enums Reference

### UserRole
- CUSTOMER
- BARISTA
- ADMIN

### OrderStatus
- PENDING
- PROCESSING
- READY
- COMPLETED
- CANCELLED

### OrderType
- DINE_IN
- TAKEAWAY
- DELIVERY

### MenuCategory
- COFFEE
- NON_COFFEE
- FOOD
- DRINKS

### MenuSize
- SMALL
- MEDIUM
- LARGE

### IceLevel
- NO_ICE
- LESS_ICE
- NORMAL
- EXTRA_ICE

### SugarLevel
- NO_SUGAR
- LESS_SUGAR
- NORMAL
- EXTRA_SUGAR

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run database migrations
npx prisma migrate dev

# Seed database
npm run seed

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## 🌐 Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NUXT_SESSION_PASSWORD="your-32-character-secret-key"
```

---

## 📁 Project Structure

```
coffeShop/
├── app/
│   ├── app.vue
│   └── data/
│       └── products.json
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── CartSidebar.vue
│   ├── ContactForm.vue
│   ├── Footer.vue
│   ├── Hero.vue
│   ├── Navbar.vue
│   ├── ProductCard.vue
│   ├── ProductFilter.vue
│   └── TestimonialCard.vue
├── composables/
│   ├── useCart.ts
│   └── useProducts.ts
├── layouts/
│   └── default.vue
├── pages/
│   ├── about.vue
│   ├── cart.vue
│   ├── contact.vue
│   ├── index.vue
│   └── menu.vue
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register.post.ts
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── me.get.ts
│   │   ├── orders/
│   │   │   ├── create.post.ts
│   │   │   ├── index.get.ts
│   │   │   └── [id].get.ts
│   │   ├── payments/
│   │   │   └── process.post.ts
│   │   ├── loyalty/
│   │   │   └── points.get.ts
│   │   ├── vouchers/
│   │   │   └── index.get.ts
│   │   ├── menu/
│   │   │   └── index.get.ts
│   │   ├── barista/
│   │   │   ├── orders.get.ts
│   │   │   ├── update-status.post.ts
│   │   │   └── scan-qr.post.ts
│   │   └── admin/
│   │       ├── users/
│   │       │   ├── index.get.ts
│   │       │   └── [id].put.ts
│   │       ├── orders/
│   │       │   └── index.get.ts
│   │       ├── menu/
│   │       │   ├── create.post.ts
│   │       │   └── [id].put.ts
│   │       ├── inventory/
│   │       │   ├── index.get.ts
│   │       │   └── [id].put.ts
│   │       ├── vouchers/
│   │       │   ├── index.get.ts
│   │       │   └── create.post.ts
│   │       └── reports/
│   │           └── index.get.ts
│   └── utils/
│       ├── prisma.ts
│       ├── auth.ts
│       └── helpers.ts
├── .env
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 📝 Notes

- **Session Management**: Uses httpOnly cookies with 7-day expiry
- **Password Hashing**: bcryptjs with 10 salt rounds
- **QR Code**: Base64-encoded order IDs (use proper QR library in production)
- **Tax**: Fixed 10% on all orders
- **Delivery Fee**: Fixed Rp 10.000 for delivery orders
- **Loyalty Points**: 1 point per Rp 10.000 spent
- **Order Number Format**: ORD-{timestamp36}-{random5}
- **Transaction ID Format**: TRX-{timestamp36}-{random9}

---

## 🎯 Features Roadmap

- [ ] Add frontend authentication pages
- [ ] Create barista dashboard UI
- [ ] Build admin panel with charts
- [ ] Integrate real payment gateway
- [ ] Add real-time order updates (WebSocket)
- [ ] Implement email notifications
- [ ] Add customer reviews and ratings
- [ ] Create mobile app version
- [ ] Add multi-language support
- [ ] Implement advanced analytics

---

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Built with ❤️ using Nuxt 3 and Prisma**
