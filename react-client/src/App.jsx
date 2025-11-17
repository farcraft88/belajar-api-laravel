import React, { useEffect, useState } from "react";
import "./index.css"; // pastikan path sesuai (import CSS global)

const API = "http://127.0.0.1:8000/api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${API}/todos`);
      if (!r.ok) throw new Error("Gagal memuat daftar");
      const data = await r.json();
      setTodos(data);
    } catch (e) {
      setErr(e.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setErr("");
    try {
      const r = await fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!r.ok) throw new Error("Gagal menambah todo");
      setTitle("");
      await load();
    } catch (e) {
      setErr(e.message || "Gagal menambah");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="app-card" role="main">
      <header>
        <h1>My Todos</h1>
        <p>Sederhana, rapi, dan cepat — tinggal sambungkan API.</p>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
          API: <code style={{ background: "rgba(255,255,255,0.03)", padding: "2px 6px", borderRadius: 6 }}>{API}</code>
        </div>
      </header>

      <form onSubmit={create} className="form-row" style={{ marginTop: 12 }}>
        <input
          className="input-text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambahkan tugas..."
          disabled={saving}
        />
        <button className={`btn primary`} type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Tambah"}
        </button>
      </form>

      {err && <div style={{ color: "#ffb4b4", marginTop: 10 }}>{err}</div>}

      <section style={{ marginTop: 12 }}>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.65)" }}>Loading…</div>
        ) : (
          <ul className="todo-list">
            {todos.length === 0 && <li style={{ color: "rgba(255,255,255,0.6)" }}>Belum ada todo — tambahkan yang pertama 😉</li>}

            {todos.map((t) => (
              <li key={t.id} className="todo-item">
                <div className="todo-badge">{t.completed ? "✅" : "🕒"}</div>
                <div className="todo-main">
                  <div className="todo-title">{t.title}</div>
                  <div className="todo-sub">ID: {t.id} • {t.completed ? "Selesai" : "Belum selesai"}</div>
                </div>

                <div className="actions">
                  <button
                    className="action-small"
                    onClick={async () => {
                      try {
                        const r = await fetch(`${API}/todos/${t.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ completed: !t.completed }),
                        });
                        if (!r.ok) throw new Error("Gagal mengubah");
                        await load();
                      } catch (e) {
                        setErr(e.message || "Gagal mengubah");
                      }
                    }}
                  >
                    {t.completed ? "Batal" : "Selesai"}
                  </button>

                  <button
                    className="action-small"
                    onClick={async () => {
                      if (!confirm("Hapus todo ini?")) return;
                      try {
                        const r = await fetch(`${API}/todos/${t.id}`, { method: "DELETE" });
                        if (!r.ok) throw new Error("Gagal menghapus");
                        await load();
                      } catch (e) {
                        setErr(e.message || "Gagal menghapus");
                      }
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer style={{ marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
        Tip: Pastikan server API berjalan di <code style={{ background: "rgba(255,255,255,0.03)", padding: "2px 6px", borderRadius: 6 }}>{API}</code>.
      </footer>
    </div>
  );
}
