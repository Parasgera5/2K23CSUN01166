# Campus Hiring Evaluation - Notification System

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

**Patch**
```json
{
  "success": true,
  "message": "Marked as read"
}