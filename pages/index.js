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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #3b0d5c, #1a1a2e)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      color: "white",
      padding: 20
    }}>
      <div style={{ background: "rgba(0,0,0,0.6)", padding: 30, borderRadius: 10, width: "400px" }}>
        <h1 style={{ textAlign: "center" }}>Create Mod Application</h1>
        <input
          placeholder="Application Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <h3>Questions</h3>
        <ul>{questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
        <input
          placeholder="Add a question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <button onClick={addQuestion} style={{ marginBottom: "20px" }}>Add Question</button>
        <br />
        <button onClick={createApplication}>Create Application</button>
        {appLink && (
          <div style={{ marginTop: "20px" }}>
            <p>Share this link:</p>
            <a href={appLink} style={{ color: "#a5d6ff" }}>{appLink}</a>
          </div>
        )}
        <button onClick={() => setShowSubmissions(!showSubmissions)} style={{ marginTop: "20px" }}>
          {showSubmissions ? "Close Submissions" : "View Submissions"}
        </button>
      </div>

      {/* Slide-out Submissions Panel */}
      {showSubmissions && (
        <div style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100%",
          width: "300px",
          background: "#222",
          color: "white",
          padding: "20px",
          overflowY: "auto",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.5)"
        }}>
          <h2>Submissions</h2>
          {submissions.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            submissions.map((s, i) => (
              <div key={i} style={{ marginBottom: "15px", borderBottom: "1px solid #444", paddingBottom: "10px" }}>
                <strong>Application ID:</strong> {s.id}<br />
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{JSON.stringify(s.answers, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
