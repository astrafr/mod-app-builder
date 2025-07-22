import { useState } from "react";

export default function Builder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [appLink, setAppLink] = useState("");

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

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Create Mod Application</h1>
      <input
        placeholder="Application Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%", height: "80px" }}
      />
      <h3>Questions</h3>
      <ul>
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
      <input
        placeholder="Add a question"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <button onClick={addQuestion} style={{ marginBottom: "20px" }}>
        Add Question
      </button>
      <br />
      <button onClick={createApplication}>Create Application</button>
      {appLink && (
        <div style={{ marginTop: "20px" }}>
          <p>Share this link:</p>
          <a href={appLink}>{appLink}</a>
        </div>
      )}
    </div>
  );
}
