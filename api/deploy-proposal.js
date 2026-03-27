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
    } else if (existing.status === 401) {
      return res.status(500).json({
        error: "GITHUB_TOKEN inválido ou expirado. Gere um novo token em github.com → Settings → Developer settings → Personal access tokens.",
        setup: true,
      });
    } else if (existing.status === 404 && !existing.url.includes("/contents/")) {
      return res.status(500).json({
        error: `Repositório '${owner}/${repo}' não encontrado. Verifique se GITHUB_REPO_OWNER está correto e o repo existe.`,
        setup: true,
      });
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
    const status = response.status;
    let message = err.message || "Erro ao fazer push para GitHub";

    if (status === 401) {
      message = "Token GitHub inválido ou sem permissão de escrita no repositório.";
    } else if (status === 404) {
      message = `Repositório '${owner}/${repo}' não encontrado. Verifique GITHUB_REPO_OWNER e GITHUB_PROPOSALS_REPO.`;
    } else if (status === 422) {
      message = "Erro de validação do GitHub — pode ser conflito de SHA. Tente novamente.";
    }

    return res.status(500).json({ error: message });
  }

  const domain = process.env.PROPOSALS_DOMAIN || "www.sala.bonadio.site";
  return res.status(200).json({
    url: `https://${domain}/${slug}`,
    updated: !!sha,
    repo: `${owner}/${repo}`,
  });
}
