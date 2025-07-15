# Event Management API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Events Endpoints

### Get All Events
- **GET** `/events`
- **Query Parameters:**
  - `date` - Filter by specific date (YYYY-MM-DD)
  - `startDate` & `endDate` - Filter by date range
  - `category` - Filter by category (case-insensitive)
  - `location` - Filter by location name/city/state

### Get Single Event
- **GET** `/events/:id`

### Create Event (Admin Only)
- **POST** `/events`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "React Workshop",
  "description": "Learn React basics",
  "date": "2025-02-01",
  "category": "Workshop",
  "locationId": "ObjectId"
}
```

### Update Event (Admin Only)
- **PUT** `/events/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as create (all fields optional)

### Delete Event (Admin Only)
- **DELETE** `/events/:id`
- **Headers:** `Authorization: Bearer <token>`

### Register for Event
- **POST** `/events/:id/register`
- **Headers:** `Authorization: Bearer <token>`

### Get User's Registrations
- **GET** `/events/registrations`
- **Headers:** `Authorization: Bearer <token>`

## Locations Endpoints

### Get All Locations
- **GET** `/locations`

### Create Location (Admin Only)
- **POST** `/locations`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Tech Park",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA"
}
```

## Sample Data

### Users
- **Admin:** alice.admin@example.com / password123
- **User:** bob.user@example.com / password123
- **User:** charlie.user@example.com / password123

### Test with cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.admin@example.com","password":"password123"}'

# Get all events
curl http://localhost:5000/api/events

# Get events filtered by category
curl "http://localhost:5000/api/events?category=Workshop"
```
