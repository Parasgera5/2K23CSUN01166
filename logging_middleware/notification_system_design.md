## Stage 1

### 1. Core Actions
* **Fetch:** Get notifications.
* **Mark Read:** Update a single notification to read.
* **Mark All Read:** Clear all unread messages in one go.
* **Count:** Get the unread number for the UI.

### 2. Real-Time Setup
**WebSockets (Socket.io)**. 
*Why?* It is the most common and standard way to build real-time features in the MERN stack. It keeps a live connection open so the server can instantly push new notifications to the React frontend.

### 3. API Contract & JSON Schema
*All endpoints require header:* `Authorization: Bearer <token>`

**A. Fetch Notifications**
* **GET** `/api/v1/notifications`
* **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type": "Placement",
      "message": "msg",
      "isRead": false,
      "timestamp": "2025-12-15"
    }
  ]
}
```

**Patch**
```json
{
  "success": true,
  "message": "Marked as read"
}
```



## Stage 2

### Database Choice
**MongoDB (NoSQL)**. 
*Why?* As we are using mern it is obvoius to use mongodb, It is also very fast at handling high volumes of rapid reads and writes, which is necessary in a real-time notification system.

### Database Schema (Mongoose)
```javascript
const notificationSchema = new mongoose.Schema({
  studentId: { type: String, required: true, index: true },
  type: { type: String, enum: ['Event', 'Result', 'Placement'], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

### Scaling Issues & Fixes
**1. Issue** - As millions of notifications pile up, searching for a specific student's unread messages will get very slow (database has to scan everything).
**Fix** - add indexing which instantly tell the db that whether the user had read or not. -> like isRead or unRead
**2. Issue** - Storage shotage
**Fix** - use timetolive to auto delete.

```javascript
const notifications = await Notification.find({ studentId: "1", isRead: false })
  .sort({ createdAt: -1 })
await Notification.findByIdAndUpdate("id", { isRead: true });
