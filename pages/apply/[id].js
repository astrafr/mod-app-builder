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
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetch(`/api/get?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setApplication(data);
        })
        .catch(() => setError("Failed to load application."));
    }
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required";

    if (application?.questions) {
      application.questions.forEach((q, i) => {
        if (q.required && !answers[i]) {
          errors[`q${i}`] = "This question is required";
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, username, answers }),
    });
    setSubmitted(true);
  };

  if (error)
    return (
      <div
        style={{
          color: "red",
          textAlign: "center",
          marginTop: 40,
          padding: 20,
        }}
      >
        {error}
      </div>
    );

  if (!application)
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: 40,
          padding: 20,
        }}
      >
        Loading application...
      </div>
    );

  if (submitted)
    return (
      <p style={{ textAlign: "center", color: "white", marginTop: 40 }}>
        Application submitted!
      </p>
    );

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
          background: "transparent",
          boxShadow: "none",
          textAlign: "center",
        }}
      >
        <h1>{application.title}</h1>
        <p style={{ marginBottom: "20px" }}>{application.description}</p>

        <div style={{ marginBottom: 10, textAlign: "left" }}>
          <label>
            Your Username <span style={{ color: "red" }}>*</span>
          </label>
          <input
            placeholder="Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          {validationErrors.username && (
            <div style={errorStyle}>{validationErrors.username}</div>
          )}
        </div>

        {application.questions.map((q, i) => {
          // Assume question objects can have type & required, e.g.
          // { question: "Your name?", type: "short", required: true }
          // For backward compatibility, if q is a string, treat as short answer and not required
          const questionText = typeof q === "string" ? q : q.question;
          const type = typeof q === "string" ? "short" : q.type || "short";
          const required = typeof q === "string" ? false : q.required || false;

          return (
            <div
              key={i}
              style={{
                marginBottom: 20,
                textAlign: "left",
              }}
            >
              <label>
                {questionText} {required && <span style={{ color: "red" }}>*</span>}
              </label>

              {type === "multiple-choice" && q.options ? (
                <select
                  value={answers[i] || ""}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [i]: e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  <option value="">-- Select an option --</option>
                  {q.options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : type === "long" ? (
                <textarea
                  value={answers[i] || ""}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [i]: e.target.value,
                    })
                  }
                  style={{ ...inputStyle, height: 80 }}
                />
              ) : (
                // default short answer
                <input
                  value={answers[i] || ""}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [i]: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              )}

              {validationErrors[`q${i}`] && (
                <div style={errorStyle}>{validationErrors[`q${i}`]}</div>
              )}
            </div>
          );
        })}

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
  marginTop: 5,
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
  marginTop: 15,
};

const errorStyle = {
  color: "red",
  fontSize: "13px",
  marginTop: 4,
};
