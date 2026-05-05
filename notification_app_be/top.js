import { init, log } from 'affordmed-logger';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYXJhc2dlcmEyMDA1QGdtYWlsLmNvbSIsImV4cCI6MTc3Nzk2OTEyMiwiaWF0IjoxNzc3OTY4MjIyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmMwMDI4YmUtMjk3Yy00ODQxLWI0ZjQtZTFkZjVmMjkwZjczIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGFyYXMgZ2VyYSIsInN1YiI6IjZmOTdlOTFjLWRiZjMtNDllMi1hNDI5LTk1NmY1YTgwMzJjNiJ9LCJlbWFpbCI6InBhcmFzZ2VyYTIwMDVAZ21haWwuY29tIiwibmFtZSI6InBhcmFzIGdlcmEiLCJyb2xsTm8iOiIyazIzY3N1bjAxMTY2IiwiYWNjZXNzQ29kZSI6IlhqdlRaeCIsImNsaWVudElEIjoiNmY5N2U5MWMtZGJmMy00OWUyLWE0MjktOTU2ZjVhODAzMmM2IiwiY2xpZW50U2VjcmV0IjoiUGhEUk14U0dqWUNXbXF5WCJ9.B5Bd6SQybR-Z85seaIjpPt5h21OOsiQgmN2ltoW6N2Y";
init(TOKEN);

const weights = { Placement: 3, Result: 2, Event: 1 };

async function getPriorityInbox() {
    try {
        await log("backend", "info", "service", "Fetching notifications");

        const res = await fetch("http://20.207.122.201/evaluation-service/notifications", {
            headers: { "Authorization": `Bearer ${TOKEN}` }
        });
        const { notifications } = await res.json();

        const top10 = notifications
            .sort((a, b) => (weights[b.Type] || 0) - (weights[a.Type] || 0)).slice(0, 10);

        await log("backend", "info", "service", "Sorted top 10");

        process.stdout.write(JSON.stringify(top10, null, 2) + "\n");

    } catch (error) {
        await log("backend", "error", "service", error.message);
    }
}

getPriorityInbox();