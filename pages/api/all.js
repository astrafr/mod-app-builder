import { applications } from "./create";

export default function handler(req, res) {
  const all = Object.entries(applications).flatMap(([id, data]) =>
    data.responses.map(r => ({
      id,
      username: r.username,
      answers: r.answers
    }))
  );
  res.status(200).json(all);
}
