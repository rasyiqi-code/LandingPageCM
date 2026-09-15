"use server";

import { safeUnstableCache as unstable_cache } from "@/lib/shared/cache";

export interface PortfolioItem {
    id: string;
    title: string;
    slug: string;
    category: string;
    description?: string;
    externalUrl?: string;
    imageUrl?: string;
    createdAt: Date | string;
    source?: "database" | "github";
}

interface GitHubRepo {
    id: string | number;
    name: string;
    description?: string | null;
    html_url: string;
    homepage?: string | null;
    language?: string | null;
    fork?: boolean;
    private?: boolean;
    created_at: string;
}

async function fetchRepos(url: string): Promise<GitHubRepo[]> {
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_PAT) {
        headers["Authorization"] = `token ${process.env.GITHUB_PAT}`;
    }

    for (let attempt = 0; attempt < 2; attempt++) {
        const res = await fetch(url, {
            headers,
            next: { revalidate: 2592000 } // Cache 30 hari
        });
        if (res.ok) {
            return (await res.json()) as GitHubRepo[];
        }
        console.warn(
            `[Portfolios] GitHub ${url} -> ${res.status} (attempt ${attempt + 1}, ratelimit remaining: ${res.headers.get("x-ratelimit-remaining")})`
        );
        if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }
    return [];
}

async function fetchGithubReposReal(): Promise<PortfolioItem[]> {
    try {
        // Fetch dari user rasyiqi-code
        const reposUser = await fetchRepos("https://api.github.com/users/rasyiqi-code/repos?sort=updated&per_page=10");

        // Fetch dari org crediblemark-official
        const reposOrg = await fetchRepos("https://api.github.com/orgs/crediblemark-official/repos?sort=updated&per_page=10");

        // Gabungkan
        const allRepos = [...reposOrg, ...reposUser];

        // Filter: Hanya tampilkan repositori publik (karena repositori privat akan memicu error muat gambar di browser)
        const publicRepos = allRepos.filter((repo) => !repo.private);

        // Map ke PortfolioItem
        return publicRepos.map((repo: GitHubRepo) => ({
            id: repo.id.toString(),
            title: repo.name.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            slug: repo.name,
            category: "GitHub",
            description: repo.description || "No description provided.",
            externalUrl: repo.html_url,
            imageUrl: undefined,
            createdAt: repo.created_at,
            source: "github"
        }));
    } catch (error) {
        console.error("[Portfolios] GitHub API fetch failed:", error);
        return [];
    }
}

export async function getPortfolios(): Promise<PortfolioItem[]> {
    const cachedResult = await unstable_cache(
        async () => {
            return await fetchGithubReposReal();
        },
        ["portfolios-list-combined"],
        { revalidate: 3600, tags: ["portfolios"] }
    )();

    // Jika cache kosong (kemungkinan rate-limit saat cache pertama kali diisi),
    // fetch langsung agar tidak menunggu cache expiry
    if (cachedResult.length === 0) {
        const freshResult = await unstable_cache(
            async () => {
                return await fetchGithubReposReal();
            },
            ["portfolios-list-fallback"],
            { revalidate: 1 } // Singkat agar tidak nyangkut terlalu lama jika memang kosong
        )();
        if (freshResult.length > 0) {
            // Jika fetch segar menghasilkan data, langsung tampilkan
            return freshResult;
        }
    }

    return cachedResult;
}