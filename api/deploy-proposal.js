export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, html } = req.body;
  if (!slug || !html) {
    return res.status(400).json({ error: "slug e html são obrigatórios" });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo  = process.env.GITHUB_PROPOSALS_REPO || "bonadio-proposals";

  if (!token || !owner) {
    return res.status(500).json({ error: "GITHUB_TOKEN ou GITHUB_REPO_OWNER não configurados" });
  }

  const filePath = `${slug}.html`;
  const apiBase  = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers  = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "PropLab-Intelligence",
  };

  // Verifica se já existe (precisa do sha para update)
  let sha;
  try {
    const existing = await fetch(apiBase, { headers });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch (_) {}

  const body = {
    message: sha
      ? `update proposal: ${slug}`
      : `add proposal: ${slug}`,
    content: Buffer.from(html).toString("base64"),
    ...(sha ? { sha } : {}),
  };

  const response = await fetch(apiBase, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return res.status(500).json({ error: err.message || "Erro ao fazer push para GitHub" });
  }

  const domain = process.env.PROPOSALS_DOMAIN || "www.sala.bonadio.site";
  return res.status(200).json({
    url: `https://${domain}/${slug}`,
    updated: !!sha,
  });
}
