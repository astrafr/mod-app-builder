import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Apply() {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState(null);
  const [answers, setAnswers] = useState({});
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/get?id=${id}`)
        .then(res => res.json())
        .then(data => setApplication(data));
    }
  }, [id]);

  const submit = async () => {
    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username, answers }),
    });
    setSubmitted(true);
  };

  if (!application) return <p>Loading...</p>;
  if (submitted) return <p style={{ textAlign: "center", color: "white" }}>Application submitted!</p>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #4e4376, #2b5876)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Segoe UI, sans-serif",
      color: "white",
      padding: 20
    }}>
      <div style={{
        background: "#1e1e2f",
        padding: 30,
        borderRadius: 12,
        width: "420px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.5)"
      }}>
        <h1 style={{ textAlign: "center" }}>{application.title}</h1>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>{application.description}</p>
        <input
          placeholder="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        {application.questions.map((q, i) => (
          <div key={i}>
            <p>{q}</p>
            <input
              onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              style={inputStyle}
            />
          </div>
        ))}
        <button style={buttonAccent} onClick={submit}>Submit Application</button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  marginBottom: "10px",
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#2e2e40",
  color: "white"
};

const buttonAccent = {
  display: "block",
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  marginTop: "10px",
  background: "#66bb6a",
  color: "white",
  cursor: "pointer"
};
