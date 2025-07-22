import { applications } from "./create";

export default function handler(req, res) {
  const { id } = req.query;
  if (applications[id]) {
    res.status(200).json(applications[id]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
}
