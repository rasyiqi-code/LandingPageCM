import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const tokenSet = Boolean(process.env.GITHUB_PAT);
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_PAT) {
        headers["Authorization"] = `token ${process.env.GITHUB_PAT}`;
    }

    const probe = async (url: string) => {
        try {
            const res = await fetch(url, { headers, cache: "no-store" });
            const body = res.status === 200 ? undefined : await res.json().catch(() => null);
            return {
                status: res.status,
                ratelimitRemaining: res.headers.get("x-ratelimit-remaining"),
                message: body?.message,
            };
        } catch (error) {
            return { status: "throw", error: (error as Error).message };
        }
    };

    return NextResponse.json({
        tokenSet,
        publicEnvKeys: Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_")),
        userRepos: await probe("https://api.github.com/users/rasyiqi-code/repos?per_page=1"),
        orgRepos: await probe("https://api.github.com/orgs/crediblemark-official/repos?per_page=1"),
    });
}