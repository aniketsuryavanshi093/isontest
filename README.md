# 🎉 Event Management System

A comprehensive web-based event management platform that allows users to create, manage, and participate in events seamlessly.

## 📋 Description

This Event Management System is a full-featured web application designed to streamline the process of organizing and managing events. Whether you're planning corporate meetings, social gatherings, conferences, or community events, this platform provides all the tools you need to create successful events.

### Key Features

- **Event Creation & Management**: Create detailed events with descriptions, dates, venues, and capacity limits
- **User Registration & Authentication**: Secure user accounts with registration and login functionality
- **Event Registration**: Allow attendees to register for events with real-time capacity tracking
- **Dashboard Interface**: Intuitive dashboard for both event organizers and attendees
- **Event Categories**: Organize events by type, date, or category
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Real-time Updates**: Live updates on event status and registration counts
- **RESTful API**: Complete API endpoints for mobile app integration

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14+ (for frontend dependencies)
- pip (Python package installer)
- npm or yarn
- Virtual environment (recommended)
- Postman (for API testing)

## 🔧 Backend Setup

### 1. Clone the repository:
```bash
git clone <repository-url>
cd event-management-system
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb+srv://adityasuryavanshi239:lRZIWAD2T1AbWY2e@cluster0.alfp2cw.mongodb.net/
JWT_SECRET=iskon
NODE_ENV=development
```

### 2. Run the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000/`

## 🎨 Frontend Setup

### 1. Navigate to frontend directory:
```bash
cd frontend
```

### 2. Install Node.js dependencies:
```bash
npm install
```

### 3. Start the frontend development server:
```bash
npm start
```

The frontend will be available at `http://localhost:5173`

### 5. Build for production:
```bash
npm run build
```

## 📡 API Documentation & Testing

### Postman Collection

Import our comprehensive Postman collection to test all API endpoints:

**📎 [Download Postman Collection](https://documenter.getpostman.com/view/19316758/2sB34hGLiB)**

*Alternative: Import the collection file directly*
```bash
curl -o event-management-api.postman_collection.json https://raw.githubusercontent.com/your-username/event-management-system/main/postman/event-management-api.postman_collection.json
```

### Setting up Postman:

1. **Import Collection:**
   - Open Postman
   - Click "Import" → "Link" → Paste the collection URL above
   - Or drag and drop the downloaded JSON file

2. **Environment Setup:**
   - Create a new environment in Postman
   - Add these variables:
     ```
     base_url: http://localhost:8000/api
     auth_token: {{token}} (will be set automatically after login)
     ```

3. **Authentication:**
   - First, run the "User Registration" or "User Login" request
   - The auth token will be automatically set for subsequent requests

### Key API Endpoints:

- **Authentication:**
  - `POST /api/auth/register/` - User registration
  - `POST /api/auth/login/` - User login

- **Events:**
  - `GET /api/events/` - List all events
  - `POST /api/events/` - Create new event
  - `GET /api/events/{id}/` - Get event details
  - `PUT /api/events/{id}/` - Update event
  - `DELETE /api/events/{id}/` - Delete event

- **Registrations:**
  - `POST /api/events/{id}/register/` - Register for event
  - `DELETE /api/events/{id}/unregister/` - Unregister from event
  - `GET /api/my-registrations/` - Get user's registrations

## 🛠️ Technology Stack

### Backend:
- **Framework**: Django 4.2+ with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT Token Authentication
- **API Documentation**: Django REST Framework Browsable API

### Frontend:
- **Framework**: React.js 18+
- **State Management**: Redux Toolkit / Context API
- **Styling**: Tailwind CSS / Bootstrap 5
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Development Tools:
- **API Testing**: Postman
- **Code Formatting**: Black (Python), Prettier (JavaScript)
- **Linting**: Flake8 (Python), ESLint (JavaScript)

## 📁 Project Structure

```
event-management-system/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── events/
│   │   ├── users/
│   │   └── core/
│   └── static/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── postman/
│   └── event-management-api.postman_collection.json
├── docs/
├── .env.example
└── README.md
```

## 🎯 Usage

### For Event Organizers:
1. Register/Login to your account
2. Navigate to "Create Event" 
3. Fill in event details (title, description, date, venue, capacity)
4. Publish your event
5. Monitor registrations through your dashboard

### For Attendees:
1. Browse available events
2. Register for events of interest
3. View your registered events in your profile
4. Receive event updates and notifications

### For Developers:
1. Use the Postman collection to test API endpoints
2. Check the browsable API at `http://localhost:8000/api/`
3. Frontend communicates with backend via REST API

## 🧪 Testing

### Backend Tests:
```bash
python manage.py test
```

### Frontend Tests:
```bash
cd frontend
npm test
```

### API Testing with Postman:
1. Import the collection
2. Set up the environment variables
3. Run the collection with the Collection Runner

## 🚀 Deployment

### Backend Deployment:
```bash
pip install gunicorn
gunicorn config.wsgi:application
```

### Frontend Deployment:
```bash
npm run build
# Deploy the build folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Aniet Suryavanshi- Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Inspiration from modern event management platforms
- Django and React communities for excellent documentation and support

## 📞 Support

If you have any questions or need help with the project, please:
- Open an issue on GitHub
- Contact: aniketsuryavanshi093@gmail.com
- Check the API documentation at `(https://documenter.getpostman.com/view/19316758/2sB34hGLiB)`

---

**Happy Event Planning! 🎊**
