"use server";

import { safeUnstableCache as unstable_cache } from "@/lib/shared/cache";
import { fetchRenderedHtml as fetchFromCloudflare } from "@/lib/server/cloudflare-rendering";

export interface PortfolioItem {
    id: string;
    title: string;
    slug: string;
    category: string;
    description?: string;
    externalUrl?: string;
    imageUrl?: string;
    htmlContent?: string;
    createdAt: Date | string;
    source?: "database" | "github";
}

async function fetchGithubReposReal(): Promise<PortfolioItem[]> {
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_PAT) {
        headers["Authorization"] = `token ${process.env.GITHUB_PAT}`;
    }

    try {
        // Fetch dari user rasyiqi-code
        const resUser = await fetch("https://api.github.com/users/rasyiqi-code/repos?sort=updated&per_page=10", {
            headers,
            next: { revalidate: 2592000 } // Cache 30 hari
        });
        const reposUser = resUser.ok ? await resUser.json() : [];

        // Fetch dari org crediblemark-official
        const resOrg = await fetch("https://api.github.com/orgs/crediblemark-official/repos?sort=updated&per_page=10", {
            headers,
            next: { revalidate: 2592000 } // Cache 30 hari
        });
        const reposOrg = resOrg.ok ? await resOrg.json() : [];

        // Gabungkan
        const allRepos = [...reposOrg, ...reposUser];

        // Filter: Hanya tampilkan repositori publik (karena repositori privat akan memicu error muat gambar di browser)
        const publicRepos = allRepos.filter((repo: { private?: boolean }) => !repo.private);

        // Map ke PortfolioItem
        return publicRepos.map((repo: {
            id: string | number;
            name: string;
            description?: string;
            html_url: string;
            homepage?: string | null;
            language?: string | null;
            fork?: boolean;
            created_at: string;
        }) => ({
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
    return unstable_cache(
        async () => {
            return await fetchGithubReposReal();
        },
        ["portfolios-list-combined"],
        { revalidate: 3600, tags: ["portfolios"] }
    )();
}

// Pending promise map to handle parallel requests for the same URL in the same process
const pendingRequests = new Map<string, Promise<string>>();

/**
 * Fetches rendered HTML with persistent caching and deduplication.
 */
export async function getRenderedHtml(url: string, localBaseUrl?: string): Promise<string> {
    const cacheKey = `portfolio-render-${url}`;

    if (pendingRequests.has(url)) {
        return pendingRequests.get(url)!;
    }

    const fetchAction = async () => {
        return unstable_cache(
            async () => {
                try {
                    return await fetchFromCloudflare(url, localBaseUrl);
                } catch {
                    console.warn(`[ProxyCache] Rendering failed for ${url}, using fallback text.`);
                    return `<html><body><h1>Content currently unavailable</h1><p>${url}</p></body></html>`;
                }
            },
            [cacheKey],
            { revalidate: 3600 * 6, tags: ["portfolio-render"] } // Cache for 6 hours
        )();
    };

    const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => reject(new Error("Cloudflare render timeout")), 20000);
        timer.unref();
    });

    const promise = Promise.race([fetchAction(), timeoutPromise]);
    pendingRequests.set(url, promise);

    try {
        return await promise;
    } finally {
        pendingRequests.delete(url);
    }
}