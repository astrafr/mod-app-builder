import { applications } from "./create";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id, username, answers } = req.body;
    if (applications[id]) {
      applications[id].responses.push({ username, answers });
      res.status(200).json({ message: "Saved" });
    } else {
      res.status(404).json({ error: "Application not found" });
    }
  } else {
    res.status(405).end();
  }
}
