import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ApplyPage() {
  const router = useRouter();
  const { formId } = router.query;

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!formId) return;

    // Fetch the form details (replace with your real API)
    fetch(`/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch(() => alert("Failed to load form"));
  }, [formId]);

  if (!form) return <div>Loading form...</div>;

  function handleChange(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    setErrors((prev) => ({ ...prev, [qId]: null }));
  }

  function validate() {
    const newErrors = {};
    form.questions.forEach((q) => {
      if (q.required && !answers[q.id]?.trim()) {
        newErrors[q.id] = "This question is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Submit answers to your API
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, answers }),
      });
      setSubmitted(true);
    } catch (error) {
      alert("Failed to submit. Try again later.");
    }
    setSubmitting(false);
  }

  if (submitted) {
    return <h2>Thanks for applying!</h2>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h1>{form.title}</h1>
      <p>{form.description}</p>

      {form.questions.map((q) => (
        <div key={q.id} style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 5 }}>
            {q.text} {q.required && "*"}
          </label>

          {q.type === "shortAnswer" && (
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              style={inputStyle}
            />
          )}

          {q.type === "longAnswer" && (
            <textarea
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              style={{ ...inputStyle, height: 80 }}
            />
          )}

          {q.type === "multipleChoice" && (
            <div>
              {q.options.map((opt) => (
                <label key={opt} style={{ display: "block", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                    style={{ marginRight: 8 }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {errors[q.id] && <div style={{ color: "red", marginTop: 5 }}>{errors[q.id]}</div>}
        </div>
      ))}

      <button type="submit" disabled={submitting} style={buttonPrimary}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 16,
};

const buttonPrimary = {
  padding: "10px 20px",
  borderRadius: 6,
  border: "none",
  background: "#4cafef",
  color: "white",
  cursor: "pointer",
  fontSize: 16,
};
