import { useEffect } from "react";
import { init, log } from "affordmed-logger";

function App() {
  useEffect(() => {
    init("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYXJhc2dlcmEyMDA1QGdtYWlsLmNvbSIsImV4cCI6MTc3Nzk2OTEyMiwiaWF0IjoxNzc3OTY4MjIyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmMwMDI4YmUtMjk3Yy00ODQxLWI0ZjQtZTFkZjVmMjkwZjczIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGFyYXMgZ2VyYSIsInN1YiI6IjZmOTdlOTFjLWRiZjMtNDllMi1hNDI5LTk1NmY1YTgwMzJjNiJ9LCJlbWFpbCI6InBhcmFzZ2VyYTIwMDVAZ21haWwuY29tIiwibmFtZSI6InBhcmFzIGdlcmEiLCJyb2xsTm8iOiIyazIzY3N1bjAxMTY2IiwiYWNjZXNzQ29kZSI6IlhqdlRaeCIsImNsaWVudElEIjoiNmY5N2U5MWMtZGJmMy00OWUyLWE0MjktOTU2ZjVhODAzMmM2IiwiY2xpZW50U2VjcmV0IjoiUGhEUk14U0dqWUNXbXF5WCJ9.B5Bd6SQybR-");

    log("frontend", "info", "page", "frontend");
  }, []);

  const handleClick = () => {
    log("frontend", "info", "component", "clicked");
  };

  return (
    <main>
      <button type="button" onClick={handleClick}>
        Click to log
      </button>
    </main>
  );
}

export default App;
