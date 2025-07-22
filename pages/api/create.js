let applications = {}; // In-memory storage for v1

export default function handler(req, res) {
  if (req.method === "POST") {
    const id = Math.random().toString(36).substr(2, 9);
    applications[id] = { ...req.body, responses: [] };
    res.status(200).json({ id });
  } else {
    res.status(405).end();
  }
}

export { applications };
