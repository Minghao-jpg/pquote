# PPP Client Dashboard MVP

A professional client portal for managing inventory, orders, and client relationships.

## Features

### Client Features
- **Secure Authentication**: Client-specific login with session management
- **Inventory Browser**: View available items with stock levels, pricing, and MOQ
- **Order Placement**: Easy ordering with quantity validation and total calculation
- **Order History**: Track order status from pending to delivered
- **Responsive Design**: Works seamlessly on desktop and mobile

### Admin Features
- **Order Management**: View and update all client orders
- **Inventory Control**: Update stock quantities, pricing, and product details
- **Client Overview**: Monitor client activity and revenue
- **Status Tracking**: Manage order and payment status updates

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Simple session-based auth (ready for upgrade)
- **Data Storage**: JSON-based mock data (ready for database integration)
- **Deployment**: Vercel-ready

## Getting Started

1. **Demo Credentials**:
   - Email: `john@acmecorp.com`
   - Password: `password123`

2. **Client Dashboard**: `/dashboard`
   - Browse inventory and place orders
   - View order history and status

3. **Admin Dashboard**: `/admin`
   - Manage all orders and inventory
   - Update order status and payment tracking

## Production Migration

This MVP is designed for easy migration to production systems:

### Database Integration
- Replace mock data in `lib/data.ts` with database calls
- Current structure supports Google Sheets, Airtable, or SQL databases
- API routes in `app/api/` are ready for backend integration

### Authentication
- Upgrade from localStorage to secure session management
- Add password hashing and proper security measures
- Consider OAuth integration for enterprise clients

### Email Notifications
- Add order confirmation emails
- Low stock alerts for admin
- Status update notifications

### Payment Integration
- Add payment processing (Stripe, PayPal, etc.)
- Invoice generation and tracking
- Automated payment status updates

## File Structure

\`\`\`
app/
├── api/                 # API routes for orders and admin
├── dashboard/           # Client dashboard pages
├── admin/              # Admin dashboard
└── globals.css         # Professional styling theme

components/
├── ui/                 # shadcn/ui components
├── auth-guard.tsx      # Authentication protection
├── dashboard-nav.tsx   # Client navigation
├── inventory-view.tsx  # Product catalog
├── order-dialog.tsx    # Order placement
├── order-history.tsx   # Order tracking
└── admin-dashboard.tsx # Admin interface

lib/
├── data.ts            # Mock data structure
├── auth.ts            # Authentication logic
├── api.ts             # Client API calls
└── admin-api.ts       # Admin API calls
\`\`\`

## Customization

The design uses a professional B2B aesthetic with:
- Neutral color palette suitable for business use
- Clean typography and spacing
- Responsive card-based layouts
- Consistent iconography and status indicators

All styling can be customized through the design tokens in `globals.css`.
