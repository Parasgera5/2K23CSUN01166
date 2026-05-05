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
for fetching
const notifications = await Notification.find({ studentId: "1", isRead: false })
  .sort({ createdAt: -1 })
for marking as read
await Notification.findByIdAndUpdate("id", { isRead: true });


## Stage 3

### Query
* **Is it accurate?** Yes, the logic to fetch unread notifications is correct.
* **Why is it slow?** With 5,000,000 rows, the database is doing a full scan. It has to check every single row as there are no indexes to help it find the data quickly.
* **Fix:** Add a index on `(studentID, isRead, createdAt)`. 

### Should we use index on every column?
**No** make reading fast but slows down the writing as tree has to rebuild every time new data comes in. Wastes a lot of storage space. We should only index the columns we actually search or sort by.

### SQL Query (Placement in last 7 days)
```sql
SELECT DISTINCT studentID 
FROM notifications 
WHERE notificationType = 'Placement' 
AND createdAt >= NOW() - INTERVAL 7 DAY;




## Stage 4

### The Problem
The system is fetching notifications on every single page load means the database is constantly being heavily loaded with queries, even when there are no new notifications to show. 

### Solutions to Improve Performance

I would implement a combination of **Caching** and a **Push-based model**.

**Strategy 1: Caching Layer (Redis)**
*   **How it works:** Instead of querying the main database on every load, we store the user's unread notifications (or just the unread count) in a fast, in-memory cache like Redis.
*   **Performance Improvement:** Redis is very fast. Reading from memory takes milliseconds compared to disk-based database queries, reducing the load on the database.
*   **Tradeoffs:** It adds complexity.. We have to manage cache, which wants us to write extra code to ensure the cache updates whenever a new notification is added or read in the database.

**Strategy 2: Real-time Push via WebSockets**
*   **How it works:** Instead of the frontend constantly asking the server for updates, we establish a persistent WebSocket connection. The frontend only loads the initial state once. After that, the server pushes new notifications directly to the client the moment they are created.
*   **Performance Improvement:** It completely eliminates the need for the client to ask the server for data on subsequent page loads, dropping database read queries significantly.
*   **Tradeoffs:** Maintaining thousands of active WebSocket connections open simultaneously requires more RAM.



## Stage 5

### 1. Current code
* **It is slow:** Calling an Email API takes a second. Doing this 50,000 times in a single for loop will take hours and the server will crash.
* **No failure safety:** If the send_email function fails on the 200th student, the entire loop crashes. The remaining 49,800 students will get absolutely nothing, and there is no way to resume where it left off.

### 2. Should DB saving and Emails happen together?
**No.** Saving to a database takes milliseconds, but sending an email takes much longer because it relies on an external network API. If the email API goes down, it shouldn't stop us from saving the notification to the database or pushing it to the app. They must be separated.

### 3. The Redesign (Reliable & Fast)
To fix this, we need to use a Message Queue (like Redis or RabbitMQ). 
Instead of sending the emails directly, the main function just creates 50,000 "jobs" and throws them into a queue instantly. Then, background process these jobs safely. If an email fails, the queue just tries that specific job again later.

### 4. Revised Pseudocode
```javascript
function notify_all(student_ids, message) {
    for (let id of student_ids) {
        MessageQueue.add("notify", { student_id: id, message: message });
    }
    return "processing";
}

function process_job(job) {
    save_to_db(job.student_id, job.message);
    push_to_app(job.student_id, job.message); 
    
    try {
        send_email(job.student_id, job.message);
    } catch (error) {
        MessageQueue.retryLater(job); 
    }
}




## Stage 6

### Approach for Priority Inbox
To prioritize the inbox, I assigned a numeric weight to each notification type: **Placement = 3, Result = 2, Event = 1**. 
When I fetch the list, I sort the array first by Weight. If two notifications have the exact same weight, I sort them by Timestamp. After sorting, I just slice the first 10 items.

### Maintaining Top 10 Efficiently
Sorting the entire list every time a new notification streams in is slow O(n log n). 
To maintain the top 10 efficiently in a real app, I would use a **Min-Heap (Priority Queue)** of size 10. When a new notification arrives, I compare it to the lowest priority item in the heap (the root). If the new one is more important, I replace the root and re-balance the heap. This makes the update time instant `O(log 10)`.


