export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      status: 'success',
      message: 'Project state managed via client-side storage on production cloud deployment.'
    });
  }

  // GET
  return res.status(200).json({
    projects: []
  });
}
