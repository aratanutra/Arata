/**
 * Minimal GitHub Contents API client — commits site-content.json to `main`
 * from the admin console. Uses native fetch, no @octokit dependency.
 *
 * Configured via env vars set in Netlify:
 *   GITHUB_TOKEN         — fine-grained PAT scoped to the repo, Contents: R/W
 *   GITHUB_REPO_OWNER    — default "aratanutra"
 *   GITHUB_REPO_NAME     — default "Arata"
 *   GITHUB_CONTENT_BRANCH — default "main"
 *   GITHUB_CONTENT_PATH  — default "content/site-content.json"
 */

const OWNER = process.env.GITHUB_REPO_OWNER ?? "aratanutra";
const REPO = process.env.GITHUB_REPO_NAME ?? "Arata";
const BRANCH = process.env.GITHUB_CONTENT_BRANCH ?? "main";
const CONTENT_PATH = process.env.GITHUB_CONTENT_PATH ?? "content/site-content.json";

type GithubFile = { sha: string };

export function githubCommitEnabled(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

async function githubFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "aratanutra-admin",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });
}

async function getCurrentFileSha(): Promise<string> {
  const res = await githubFetch(
    `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(CONTENT_PATH)}?ref=${encodeURIComponent(BRANCH)}`
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as GithubFile;
  return json.sha;
}

async function getFileShaAt(repoPath: string): Promise<string | undefined> {
  const res = await githubFetch(
    `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(repoPath)}?ref=${encodeURIComponent(BRANCH)}`
  );
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as GithubFile;
  return json.sha;
}

/**
 * Commit an arbitrary file (used by /api/upload for image binaries).
 * `repoPath` is the target path in the repo, e.g. "public/uploads/foo-123.png".
 */
export async function commitBinary(
  repoPath: string,
  bytes: Buffer,
  authorEmail: string,
  commitLabel: string
): Promise<{ commitSha: string; commitUrl: string }> {
  const contentBase64 = bytes.toString("base64");
  const sha = await getFileShaAt(repoPath);

  const stamp = new Date().toISOString().replace("T", " ").replace(/\..+/, " UTC");
  const message = `admin: ${commitLabel} by ${authorEmail} (${stamp})`;

  const res = await githubFetch(
    `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(repoPath)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
        committer: { name: "AETERNYX Admin", email: authorEmail }
      })
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub commit failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { commit: { sha: string; html_url: string } };
  return { commitSha: json.commit.sha, commitUrl: json.commit.html_url };
}

export async function commitContent(
  next: unknown,
  authorEmail: string
): Promise<{ commitSha: string; commitUrl: string }> {
  const serialised = JSON.stringify(next, null, 2) + "\n";
  const contentBase64 = Buffer.from(serialised, "utf8").toString("base64");
  const sha = await getCurrentFileSha();

  const stamp = new Date().toISOString().replace("T", " ").replace(/\..+/, " UTC");
  const message = `content: admin update by ${authorEmail} (${stamp})`;

  const res = await githubFetch(
    `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(CONTENT_PATH)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch: BRANCH,
        sha,
        committer: {
          name: "AETERNYX Admin",
          email: authorEmail
        }
      })
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub commit failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { commit: { sha: string; html_url: string } };
  return { commitSha: json.commit.sha, commitUrl: json.commit.html_url };
}
