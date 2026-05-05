import React, { useState, useEffect } from 'react';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYXJhc2dlcmEyMDA1QGdtYWlsLmNvbSIsImV4cCI6MTc3Nzk3MTkzOCwiaWF0IjoxNzc3OTcxMDM4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMTkxNmYyZDUtNTYxYS00ZTVkLTgyMTYtOTFmZjNiMmZhMDBmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGFyYXMgZ2VyYSIsInN1YiI6IjZmOTdlOTFjLWRiZjMtNDllMi1hNDI5LTk1NmY1YTgwMzJjNiJ9LCJlbWFpbCI6InBhcmFzZ2VyYTIwMDVAZ21haWwuY29tIiwibmFtZSI6InBhcmFzIGdlcmEiLCJyb2xsTm8iOiIyazIzY3N1bjAxMTY2IiwiYWNjZXNzQ29kZSI6IlhqdlRaeCIsImNsaWVudElEIjoiNmY5N2U5MWMtZGJmMy00OWUyLWE0MjktOTU2ZjVhODAzMmM2IiwiY2xpZW50U2VjcmV0IjoiUGhEUk14U0dqWUNXbXF5WCJ9.r5WX8Bx3bkO8hlFoSKaZ-I2h_r_px68OPVGPu2pPQdU";
const API = "http://20.207.122.201/evaluation-service/notifications";

function App() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const [readList, setReadList] = useState(() => 
    JSON.parse(localStorage.getItem('read')) || []
  );

  useEffect(() => {
    let url = `${API}?page=${page}&limit=10`;
    if (filter !== 'All') url += `&notification_type=${filter}`;

    fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
      .then(res => res.json())
      .then(data => setList(data.notifications));
  }, [page, filter]);

  const handleRead = (id) => {
    const updated = [...readList, id];
    setReadList(updated);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h3>Notifications</h3>

      <select onChange={(e) => { setFilter(e.target.value); setPage(1); }} style={{ width: '100%' }}>
        <option value="All">Show All</option>
        <option value="Placement">Placements</option>
        <option value="Result">Results</option>
        <option value="Event">Events</option>
      </select>


      <div style={{ marginTop: '20px' }}>
        {list.map(n => (
          <div 
            key={n.ID} 
            onClick={() => handleRead(n.ID)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              marginBottom: '5px',
              backgroundColor: readList.includes(n.ID) ? '#eee' : '#fff',
              color: readList.includes(n.ID) ? '#888' : '#000',
              cursor: 'pointer'
            }}
          >
            {n.Message}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>Back</button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

export default App;