import { useState, useEffect } from "react";

export default function Builder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [appLink, setAppLink] = useState("");
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    }
  };

  const createApplication = async () => {
    const res = await fetch("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, questions }),
    });
    const data = await res.json();
    setAppLink(`${window.location.origin}/apply/${data.id}`);
  };

  const fetchSubmissions = async () => {
    const res = await fetch("/api/all");
    const data = await res.json();
    setSubmissions(data);
  };

  useEffect(() => {
    if (showSubmissions) fetchSubmissions();
  }, [showSubmissions]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2b5876, #4e4376)",
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
          background: "transparent", // removed white box
          boxShadow: "none",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Create Mod Application</h1>
        <input
          placeholder="Application Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: "80px" }}
        />
        <h3 style={{ marginTop: "20px", textAlign: "left" }}>Questions</h3>
        <ul style={{ textAlign: "left" }}>
          {questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
        <input
          placeholder="Add a question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={inputStyle}
        />
        <button style={buttonPrimary} onClick={addQuestion}>
          Add Question
        </button>
        <button style={buttonAccent} onClick={createApplication}>
          Create Application
        </button>

        {appLink && (
          <div style={{ marginTop: "20px" }}>
            <p>Share this link:</p>
            <a href={appLink} style={{ color: "#76e6ff" }}>
              {appLink}
            </a>
          </div>
        )}

        <button
          style={{ ...buttonPrimary, marginTop: "20px", background: "#ff8a65" }}
          onClick={() => setShowSubmissions(!showSubmissions)}
        >
          {showSubmissions ? "Close Submissions" : "View Submissions"}
        </button>
      </div>

      {showSubmissions && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            height: "100%",
            width: "350px",
            background: "#2c2c3c",
            color: "white",
            padding: "20px",
            overflowY: "auto",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.5)",
          }}
        >
          <h2>Submissions</h2>
          {submissions.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            submissions.map((s, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid #444",
                  paddingBottom: "10px",
                  textAlign: "left",
                }}
              >
                <strong>User:</strong> {s.username || "Unknown"}
                <br />
                <strong>Application ID:</strong> {s.id}
                <br />
                <strong>Answers:</strong>
                <ul>
                  {Object.entries(s.answers).map(([qIndex, answer]) => (
                    <li key={qIndex}>{answer}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
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
  color: "white",
};

const buttonPrimary = {
  display: "block",
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  marginTop: "10px",
  background: "#4cafef",
  color: "white",
  cursor: "pointer",
};

const buttonAccent = {
  ...buttonPrimary,
  background: "#66bb6a",
};
