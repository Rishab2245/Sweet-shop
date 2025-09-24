# Setup Instructions

## Prerequisites

Before setting up the Sweet Shop Management System, ensure you have the following installed:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **pnpm** (recommended)
- **Git** (optional, for version control)

## Step-by-Step Setup

### 1. Extract and Navigate to Project

```bash
# Extract the zip file
unzip sweet_shop_project.zip

# Navigate to project directory
cd sweet_shop_project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (optional - defaults will work)
cp .env.example .env  # If you want to customize settings

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:3001`

**Backend Commands:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

### 3. Frontend Setup

Open a new terminal window/tab and:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
# OR if you prefer pnpm:
# pnpm install

# Start the frontend development server
npm run dev
# OR with pnpm:
# pnpm run dev
```

The frontend will start on `http://localhost:5173`

**Frontend Commands:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### 4. Access the Application

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You should see the Sweet Shop Management System homepage

### 5. Create Your First Admin Account

1. Click "Register" in the top navigation
2. Fill in the registration form:
   - Username: Choose any username
   - Password: At least 6 characters
   - Check "Register as Admin" for admin privileges
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### 6. Test the System

#### As a Regular User:
- Browse sweets on the dashboard
- Use search and filter functionality
- Purchase sweets (watch inventory decrease)

#### As an Admin:
- Click "Admin Panel" in the navigation
- View inventory statistics
- Add new sweets
- Edit existing sweets
- Restock items
- Delete sweets

## Troubleshooting

### Common Issues

#### Port Already in Use
If you get a "port already in use" error:

**Backend (port 3001):**
```bash
# Kill process using port 3001
npx kill-port 3001
# OR manually find and kill:
lsof -ti:3001 | xargs kill -9
```

**Frontend (port 5173):**
```bash
# Kill process using port 5173
npx kill-port 5173
# OR manually find and kill:
lsof -ti:5173 | xargs kill -9
```

#### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database Issues
The SQLite database is created automatically. If you encounter issues:
```bash
# Delete the database file (it will be recreated)
rm backend/database.sqlite
```

#### CORS Issues
If you encounter CORS errors, ensure:
1. Backend is running on port 3001
2. Frontend is configured to use the correct API URL
3. Check `frontend/.env` file for correct `VITE_API_BASE_URL`

### Environment Configuration

#### Backend (.env file)
```env
PORT=3001
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
DB_PATH=./database.sqlite
```

#### Frontend (.env file)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Testing

### Run Backend Tests
```bash
cd backend
npm test
```

This will run 21 comprehensive tests covering:
- User authentication
- Sweet management
- Inventory operations
- Error handling

### Test Coverage
The test suite provides comprehensive coverage of:
- API endpoints
- Authentication flows
- Database operations
- Input validation
- Error scenarios

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Backend: Uses `nodemon` for automatic server restart
- Frontend: Uses Vite's hot module replacement

### API Testing
You can test the API endpoints using tools like:
- **Postman** - GUI-based API testing
- **curl** - Command-line testing
- **Thunder Client** - VS Code extension

Example API call:
```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Database Inspection
The SQLite database file is located at `backend/database.sqlite`. You can inspect it using:
- **DB Browser for SQLite** - GUI tool
- **sqlite3** command-line tool

## Production Deployment

### Backend Deployment
1. Set environment variables for production
2. Use `npm start` instead of `npm run dev`
3. Configure proper JWT secret
4. Set up proper database (PostgreSQL recommended for production)

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API URL

### Recommended Hosting Platforms
- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: PostgreSQL on Railway, Supabase, or PlanetScale

## Support

If you encounter any issues:
1. Check this setup guide
2. Review the main README.md file
3. Check the console for error messages
4. Ensure all prerequisites are installed correctly

Happy coding! 🍭

