import { useState } from "react";

export default function Builder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  // New question state: text, type, required, options string (for multiple choice)
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("shortAnswer");
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [newQuestionOptions, setNewQuestionOptions] = useState(""); // comma separated for multipleChoice

  const addQuestion = () => {
    if (!newQuestionText.trim()) return alert("Question text is required");

    let options = [];
    if (newQuestionType === "multipleChoice") {
      options = newQuestionOptions
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0);
      if (options.length === 0) return alert("Multiple choice must have options");
    }

    const newQ = {
      id: Date.now().toString(),
      text: newQuestionText,
      type: newQuestionType,
      required: newQuestionRequired,
      options,
    };

    setQuestions([...questions, newQ]);

    // Reset new question inputs
    setNewQuestionText("");
    setNewQuestionType("shortAnswer");
    setNewQuestionRequired(false);
    setNewQuestionOptions("");
  };

  // Rest of your code for createApplication, fetchSubmissions...

  return (
    <div style={{ /* your styles */ }}>
      <h1>Create Mod Application</h1>
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

      <h3>Questions</h3>
      <ul style={{ textAlign: "left" }}>
        {questions.map((q) => (
          <li key={q.id}>
            <b>{q.text}</b> [{q.type}] {q.required && "*"}
            {q.type === "multipleChoice" && (
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <h4>Add a Question</h4>
      <input
        placeholder="Question text"
        value={newQuestionText}
        onChange={(e) => setNewQuestionText(e.target.value)}
        style={inputStyle}
      />

      <label>
        Type:{" "}
        <select
          value={newQuestionType}
          onChange={(e) => setNewQuestionType(e.target.value)}
          style={{ marginBottom: 10 }}
        >
          <option value="shortAnswer">Short Answer</option>
          <option value="longAnswer">Long Answer</option>
          <option value="multipleChoice">Multiple Choice</option>
        </select>
      </label>

      {newQuestionType === "multipleChoice" && (
        <input
          placeholder="Options (comma separated)"
          value={newQuestionOptions}
          onChange={(e) => setNewQuestionOptions(e.target.value)}
          style={inputStyle}
        />
      )}

      <label style={{ display: "block", marginTop: "10px" }}>
        <input
          type="checkbox"
          checked={newQuestionRequired}
          onChange={(e) => setNewQuestionRequired(e.target.checked)}
        />{" "}
        Required
      </label>

      <button style={buttonPrimary} onClick={addQuestion}>
        Add Question
      </button>

      {/* Your existing createApplication and submissions UI here */}

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
