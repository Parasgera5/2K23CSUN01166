import express from 'express';
import cors from 'cors';
import { init, log } from 'affordmed-logger';

const app = express();
app.use(cors());
app.use(express.json());

log("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYXJhc2dlcmEyMDA1QGdtYWlsLmNvbSIsImV4cCI6MTc3Nzk2OTEyMiwiaWF0IjoxNzc3OTY4MjIyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmMwMDI4YmUtMjk3Yy00ODQxLWI0ZjQtZTFkZjVmMjkwZjczIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGFyYXMgZ2VyYSIsInN1YiI6IjZmOTdlOTFjLWRiZjMtNDllMi1hNDI5LTk1NmY1YTgwMzJjNiJ9LCJlbWFpbCI6InBhcmFzZ2VyYTIwMDVAZ21haWwuY29tIiwibmFtZSI6InBhcmFzIGdlcmEiLCJyb2xsTm8iOiIyazIzY3N1bjAxMTY2IiwiYWNjZXNzQ29kZSI6IlhqdlRaeCIsImNsaWVudElEIjoiNmY5N2U5MWMtZGJmMy00OWUyLWE0MjktOTU2ZjVhODAzMmM2IiwiY2xpZW50U2VjcmV0IjoiUGhEUk14U0dqWUNXbXF5WCJ9.B5Bd6SQybR-Z85seaIjpPt5h21OOsiQgmN2ltoW6N2Y");

app.get('/', (req, res) => {
  log("backend", "info", "route", "endpoint");
  res.status(200).json({
    message: "Hello"
});
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  log("backend", "info", "config", `Server port ${PORT}`);
});