const INDEX_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Propostas — Avestra</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      text-align: center;
      padding: 60px 40px;
      border: 1px solid rgba(167,139,113,0.2);
      border-radius: 24px;
      background: rgba(255,255,255,0.03);
      max-width: 420px;
    }
    h1 { font-size: 28px; color: #c9b8a0; margin-bottom: 12px; }
    p { font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Avestra</h1>
    <p>Esta página contém propostas personalizadas.<br/>Acesse o link enviado para você.</p>
  </div>
</body>
</html>`;

const VERCEL_JSON = JSON.stringify({ cleanUrls: true, trailingSlash: false }, null, 2);

async function upsertFile(apiBase, headers, content, message) {
  let sha;
  try {
    const existing = await fetch(apiBase, { headers });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch (_) {}

  const body = {
    message,
    content: Buffer.from(content).toString("base64"),
    ...(sha ? { sha } : {}),
  };

  return fetch(apiBase, { method: "PUT", headers, body: JSON.stringify(body) });
}

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

  if (!token) {
    return res.status(500).json({
      error: "GITHUB_TOKEN não configurado no Vercel. Vá em Settings → Environment Variables e adicione GITHUB_TOKEN.",
      setup: true,
    });
  }
  if (!owner) {
    return res.status(500).json({
      error: "GITHUB_REPO_OWNER não configurado no Vercel. Adicione GITHUB_REPO_OWNER com o valor 'marketingavestra'.",
      setup: true,
    });
  }

  const repoBase = `https://api.github.com/repos/${owner}/${repo}/contents`;
  const headers  = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "PropLab-Intelligence",
  };

  // Verifica se index.html existe — se não, cria junto com vercel.json
  let needsInit = false;
  try {
    const check = await fetch(`${repoBase}/index.html`, { headers });
    if (!check.ok) needsInit = true;
  } catch (_) { needsInit = true; }

  if (needsInit) {
    await upsertFile(`${repoBase}/index.html`, headers, INDEX_HTML, "init: add landing page");
    await upsertFile(`${repoBase}/vercel.json`, headers, VERCEL_JSON, "init: configure vercel");
  }

  // Faz o deploy da proposta
  const proposalApi = `${repoBase}/${slug}.html`;
  let sha;
  try {
    const existing = await fetch(proposalApi, { headers });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    } else if (existing.status === 401) {
      return res.status(500).json({
        error: "GITHUB_TOKEN inválido ou expirado. Gere um novo token em github.com → Settings → Developer settings.",
        setup: true,
      });
    }
  } catch (_) {}

  const body = {
    message: sha ? `update proposal: ${slug}` : `add proposal: ${slug}`,
    content: Buffer.from(html).toString("base64"),
    ...(sha ? { sha } : {}),
  };

  const response = await fetch(proposalApi, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const status = response.status;
    let message = err.message || "Erro ao fazer push para GitHub";
    if (status === 401) message = "Token GitHub inválido ou sem permissão de escrita no repositório.";
    else if (status === 404) message = `Repositório '${owner}/${repo}' não encontrado.`;
    return res.status(500).json({ error: message });
  }

  const domain = process.env.PROPOSALS_DOMAIN || "www.sala.bonadio.site";
  return res.status(200).json({
    url: `https://${domain}/${slug}`,
    updated: !!sha,
  });
}
