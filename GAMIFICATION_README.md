# 🏆 Blood Donation Gamification System

A comprehensive gamification system that encourages blood donation through leaderboards, badges, levels, and experience points.

## 🎯 Features

### 📊 Leaderboard System
- **Real-time Rankings**: Users are ranked based on their total donation count
- **Top 50 Display**: Shows the top 50 donors with their stats
- **Podium View**: Special display for top 3 donors with crowns, medals, and awards
- **User Ranking**: Each user can see their current rank among all donors

### 🏅 Badge System
- **First Blood**: Awarded for completing the first donation
- **Regular Donor**: Awarded for completing 5 donations
- **Hero Donor**: Awarded for completing 10 donations
- **Legendary Donor**: Awarded for completing 25 donations
- **Master Donor**: Awarded for completing 50 donations

### 📈 Level & Experience System
- **Experience Points**: 10 XP per donation
- **Level Progression**: Each level requires (level × 100) XP
- **Visual Progress**: Progress bar showing advancement to next level
- **Level Colors**: Different colors for different level ranges

### 📱 User Dashboard Integration
- **Leaderboard Button**: Easy access from user dashboard
- **Stats Overview**: Personal statistics and achievements
- **Badge Display**: Showcase earned badges with dates

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm start
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Seed Sample Data (Optional)
```bash
cd backend
node seed_leaderboard_data.js
```

### 4. Access the Leaderboard
- Log in as a user
- Click "View Leaderboard" button in the dashboard
- Or navigate directly to `/leaderboard`

## 📋 API Endpoints

### Leaderboard Endpoints

#### Get Leaderboard (Public)
```
GET /api/leaderboard
```
**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "name": "John Smith",
      "bloodGroup": "O+",
      "donationCount": 25,
      "totalDonations": 25,
      "level": 5,
      "badges": [...],
      "location": {
        "city": "New York",
        "state": "NY"
      }
    }
  ]
}
```

#### Get User Stats (Authenticated)
```
GET /api/leaderboard/user-stats
Headers: Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "userStats": {
    "name": "John Smith",
    "bloodGroup": "O+",
    "donationCount": 25,
    "totalDonations": 25,
    "level": 5,
    "experience": 250,
    "nextLevelExp": 500,
    "progressToNextLevel": 50.0,
    "rank": 1,
    "badges": [...],
    "lastDonationDate": "2024-01-15T10:30:00.000Z"
  },
  "topDonors": [...]
}
```

#### Complete Donation (Authenticated)
```
POST /api/donate/complete
Headers: Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "message": "Donation completed successfully!",
  "newLevel": 6,
  "newBadges": [
    {
      "name": "Master Donor",
      "description": "Completed 50 blood donations",
      "icon": "⭐"
    }
  ],
  "experience": 60
}
```

## 🗄️ Database Schema

### User Model Updates
```javascript
{
  // ... existing fields ...
  
  // Gamification fields
  donationCount: { type: Number, default: 0 },
  totalDonations: { type: Number, default: 0 },
  lastDonationDate: { type: Date },
  badges: [{
    name: { type: String },
    description: { type: String },
    earnedDate: { type: Date, default: Date.now },
    icon: { type: String }
  }],
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 }
}
```

## 🎨 UI Components

### Leaderboard Component
- **Location**: `frontend/components/Leaderboard.jsx`
- **Features**:
  - Tab navigation (Leaderboard/My Stats)
  - Top 3 podium display
  - Scrollable leaderboard list
  - User statistics dashboard
  - Badge showcase
  - Progress bars

### Integration Points
- **User Dashboard**: "View Leaderboard" button
- **Navigation**: Direct route `/leaderboard`
- **Authentication**: Protected routes for user stats

## 🏆 Badge System Details

### Badge Requirements
| Badge | Requirement | Icon | Description |
|-------|-------------|------|-------------|
| First Blood | 1 donation | 🩸 | Completed your first blood donation |
| Regular Donor | 5 donations | 🏆 | Completed 5 blood donations |
| Hero Donor | 10 donations | 🦸 | Completed 10 blood donations |
| Legendary Donor | 25 donations | 👑 | Completed 25 blood donations |
| Master Donor | 50 donations | ⭐ | Completed 50 blood donations |

### Level System
- **Experience Points**: 10 XP per donation
- **Level Formula**: Each level requires (level × 100) XP
- **Example**: Level 5 requires 500 XP (5 × 100)

## 🧪 Testing

### Manual Testing
1. **Access Leaderboard**:
   - Navigate to `/leaderboard`
   - Verify top 3 podium displays correctly
   - Check leaderboard list shows all users

2. **User Stats**:
   - Log in as a user
   - Click "View Leaderboard" → "My Stats" tab
   - Verify personal statistics display correctly

3. **Donation Completion**:
   - Use API endpoint to complete a donation
   - Verify level up and badge earning

### API Testing
```bash
# Test leaderboard endpoint
curl http://localhost:5000/api/leaderboard

# Test user stats (requires authentication)
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/leaderboard/user-stats

# Test donation completion (requires authentication)
curl -X POST -H "Authorization: Bearer <token>" http://localhost:5000/api/donate/complete
```

## 🔧 Configuration

### Environment Variables
```bash
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/bloodconnection

# Server port
PORT=5000
```

### Customization Options
- **Badge Icons**: Modify icons in `leaderboardController.js`
- **Level Formula**: Change XP calculation in `updateDonationCount()`
- **Badge Requirements**: Update donation thresholds in controller
- **UI Colors**: Modify CSS classes in `Leaderboard.jsx`

## 📊 Sample Data

The system includes sample data with 7 users having different donation counts:

1. **John Smith** - 25 donations (Level 5, Legendary Donor)
2. **Sarah Johnson** - 18 donations (Level 4, Hero Donor)
3. **Michael Brown** - 12 donations (Level 3, Hero Donor)
4. **Emily Davis** - 8 donations (Level 2, Regular Donor)
5. **David Wilson** - 5 donations (Level 1, Regular Donor)
6. **Lisa Anderson** - 3 donations (Level 1, First Blood)
7. **Robert Taylor** - 1 donation (Level 1, First Blood)

## 🚀 Future Enhancements

### Planned Features
- **Achievement System**: More diverse badges and achievements
- **Donation Streaks**: Track consecutive donation months
- **Social Features**: Share achievements on social media
- **Rewards System**: Real-world rewards for top donors
- **Seasonal Events**: Special badges for holiday donations
- **Team Challenges**: Group donation goals

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live leaderboard
- **Caching**: Redis caching for better performance
- **Analytics**: Detailed donation analytics and insights
- **Mobile App**: Native mobile application
- **Push Notifications**: Achievement notifications

## 🐛 Troubleshooting

### Common Issues

#### Leaderboard Not Loading
- Check if backend server is running
- Verify MongoDB connection
- Check browser console for errors

#### User Stats Not Showing
- Ensure user is authenticated
- Check if user has donation data
- Verify token is valid

#### Badges Not Earning
- Check donation completion endpoint
- Verify badge requirements in controller
- Check database for user data

### Debug Commands
```bash
# Check MongoDB connection
mongo bloodconnection --eval "db.users.find().pretty()"

# Test API endpoints
curl http://localhost:5000/api/leaderboard

# Check server logs
tail -f backend/logs/server.log
```

## 📝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Standards
- Follow existing code style
- Add comments for complex logic
- Update API documentation
- Include error handling

## 📄 License

This gamification system is part of the BloodConnection project and follows the same licensing terms.

---

**Note**: This gamification system is designed to encourage blood donation while maintaining the serious nature of the life-saving activity. The focus is on recognition and motivation rather than competition.
