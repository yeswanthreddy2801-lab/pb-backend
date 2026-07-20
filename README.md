# ProteinBox Backend

A production-ready Express.js backend for the ProteinBox monthly subscription service.

## Prerequisites
- Node.js 20+
- Supabase Account

## Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

3. **Database Schema**
   Run the SQL found in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

4. **Seed Database**
   Run the SQL found in `supabase/seed.sql` in your Supabase SQL editor.
   This will insert subscription plans, food items, and the default admin user.

5. **Start Server**
   ```bash
   npm run dev
   ```

## Default Admin Credentials
- **Mobile**: `8297364002`
- **Password**: `Admin@1234`

## Connecting the Frontend
In your Lovable frontend project, set the following environment variable:
```
this is used to connect frontend with backend
VITE_API_BASE_URL=http://localhost:3001/api
```

## API Endpoint Reference

### Auth
- `POST /api/auth/login` - User login (mobile only)
- `POST /api/auth/admin/login` - Admin login (mobile + password)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user from token

### Users
- `GET /api/users/me` - Get profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/me/addresses` - Get addresses
- `POST /api/users/me/addresses` - Create address
- `PATCH /api/users/me/addresses/:id` - Update address
- `DELETE /api/users/me/addresses/:id` - Delete address
- `PATCH /api/users/me/addresses/:id/set-default` - Set default address

### Food Items
- `GET /api/food-items` - List items (query: category, planType, isActive)
- `GET /api/food-items/:id` - Single item

### Subscriptions
- `GET /api/subscriptions/my` - Get user's subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/:id` - Get subscription
- `POST /api/subscriptions/:id/renew` - Renew subscription

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Unread count
- `PATCH /api/notifications/:id/read` - Mark read
- `PATCH /api/notifications/read-all` - Mark all read

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `GET /api/admin/orders/:id` - Single order
- `PATCH /api/admin/orders/:id/approve` - Approve order
- `PATCH /api/admin/orders/:id/reject` - Reject order
- `GET /api/admin/customers` - All customers
- `GET /api/admin/customers/:id` - Single customer
- `GET /api/admin/inventory` - All food items
- `POST /api/admin/inventory` - Create food item
- `PATCH /api/admin/inventory/:id` - Update food item
- `DELETE /api/admin/inventory/:id` - Soft delete item
- `PATCH /api/admin/inventory/:id/toggle` - Toggle availability

## How to change Admin Password
Admin passwords are hashed using bcrypt (10 rounds). 
To change a password manually, generate a bcrypt hash for the new password and update the `password_hash` column in the `admins` table.
Example using Node:
```js
const bcrypt = require('bcrypt');
console.log(bcrypt.hashSync('NewPassword123', 10));
```

## Deployment Guide
This application can be deployed to Render, Railway, or Google Cloud Run.
1. Create a PostgreSQL database on Supabase and note the URL and Service Role Key.
2. Connect your GitHub repository to your chosen platform.
3. Set the Build Command to `npm run build` or `tsc`.
4. Set the Start Command to `npm start` or `node dist/index.js`.
5. Add all required Environment Variables from `.env` to the deployment platform.


everything is working perfectly