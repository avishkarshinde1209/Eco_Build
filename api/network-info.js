export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const origin = `${proto}://${host}`;

  res.status(200).json({
    localhost_url: origin,
    lan_url: origin,
    lan_ip: host,
    port: proto === 'https' ? 443 : 80,
    download_url: `${origin}/EcoBuildSmart_App.zip`,
    zip_name: 'EcoBuildSmart_App.zip'
  });
}
