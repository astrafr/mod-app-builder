import { applications } from "./create";

export default function handler(req, res) {
  const all = Object.entries(applications).map(([id, data]) => ({
    id,
    responses: data.responses,
    questions: data.questions
  }));
  res.status(200).json(all);
}
