export default function handler(req, res) {
  res.writeHead(302, { Location: '/EcoBuildSmart_App.zip' });
  res.end();
}
