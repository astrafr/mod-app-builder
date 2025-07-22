import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Apply() {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState(null);
  const [answers, setAnswers] = useState({});
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/get?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error);
          else setApplication(data);
        })
        .catch(() => setError("Failed to load application."));
    }
  }, [id]);

  const submit = async () => {
    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }
    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username, answers }),
    });
    setSubmitted(true);
  };

  if (error) return <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>{error}</div>;
  if (!application) return <div style={{ color: "white", textAlign: "center", marginTop: 40 }}>Loading application...</div>;
  if (submitted) return <p style={{ textAlign: "center", color: "white", marginTop: 40 }}>Application submitted!</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4e4376, #2b5876)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, sans-serif",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "420px",
          padding: 30,
          borderRadius: 12,
          // Removed background and boxShadow for no white box
          background: "transparent",
          boxShadow: "none",
          textAlign: "center",
        }}
      >
        <h1>{application.title}</h1>
        <p style={{ marginBottom: "20px" }}>{application.description}</p>

        <input
          placeholder="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        {application.questions.map((q, i) => (
          <div key={i} style={{ textAlign: "left", marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 6 }}>{q}</label>
            <input
              onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              style={inputStyle}
            />
          </div>
        ))}

        <button style={buttonAccent} onClick={submit}>
          Submit Application
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#2e2e40",
  color: "white",
  marginBottom: "10px",
};

const buttonAccent = {
  display: "block",
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  background: "#66bb6a",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};
