import { useState, useEffect } from "react";

const API = "https://aatmanshah-backend.onrender.com";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({
    device_name: "", location: "", incident_type: "",
    severity: "low", description: "", status: "open"
  });
  const [message, setMessage] = useState("");

  useEffect(() => { if (token) fetchIncidents(); }, [token]);

  async function fetchIncidents() {
    const res = await fetch(`${API}/incidents`);
    const data = await res.json();
    setIncidents(data);
  }

  async function register() {
    const res = await fetch(`${API}/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    setMessage(data.message || data.detail);
  }

  async function login() {
    const res = await fetch(`${API}/token`, {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${username}&password=${password}`
    });
    const data = await res.json();
    if (data.access_token) {
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      setMessage("Logged in successfully!");
    } else {
      setMessage(data.detail);
    }
  }

  async function createIncident() {
    const res = await fetch(`${API}/incidents`, {
      method: "POST", headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.id) { setMessage("Incident created!"); fetchIncidents(); }
    else setMessage(data.detail);
  }

  async function deleteIncident(id) {
    await fetch(`${API}/incidents/${id}`, {
      method: "DELETE", headers: { "Authorization": `Bearer ${token}` }
    });
    fetchIncidents();
  }

  function logout() {
    setToken("");
    localStorage.removeItem("token");
    setMessage("Logged out.");
  }

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>🌐 Network Incident Reporting System</h1>

      {!token ? (
        <div>
          <h2>Login / Register</h2>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br /><br />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
          <button onClick={login}>Login</button>
          <button onClick={register} style={{ marginLeft: 10 }}>Register</button>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>
          <h2>Create Incident</h2>
          <input placeholder="Device Name" value={form.device_name} onChange={e => setForm({ ...form, device_name: e.target.value })} /><br /><br />
          <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /><br /><br />
          <input placeholder="Incident Type" value={form.incident_type} onChange={e => setForm({ ...form, incident_type: e.target.value })} /><br /><br />
          <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select><br /><br />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /><br /><br />
          <button onClick={createIncident}>Create Incident</button>

          <h2>Incidents</h2>
          {incidents.map(i => (
            <div key={i.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
              <b>{i.device_name}</b> — {i.incident_type} — {i.severity} — {i.status}<br />
              {i.location} — {i.description}
              <br />
              <button onClick={() => deleteIncident(i.id)} style={{ color: "red" }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {message && <p style={{ color: "green" }}><b>{message}</b></p>}
    </div>
  );
}