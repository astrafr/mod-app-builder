import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Apply() {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState(null);
  const [answers, setAnswers] = useState({});
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
      body: JSON.stringify({ id, answers }),
    });
    setSubmitted(true);
  };

  if (!application) return <p>Loading...</p>;
  if (submitted) return <p>Application submitted!</p>;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>{application.title}</h1>
      <p>{application.description}</p>
      {application.questions.map((q, i) => (
        <div key={i}>
          <p>{q}</p>
          <input
            onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
        </div>
      ))}
      <button onClick={submit}>Submit</button>
    </div>
  );
}
