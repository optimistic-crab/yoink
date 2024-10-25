import { hosts } from "../config/hosts.ts";
export const TIMEOUT_MS = 30000;
export const DEFAULT_HEADERS = {
    "Accept-Encoding": "gzip, deflate, br",
};
export const RESPONSE_HEADERS = {
    "cache-control": "public, max-age=3600",
};

export default {
    async handleRequest(
        _req: Request,
        _info: Deno.ServeHandlerInfo<Deno.Addr> | undefined,
        params: URLPatternResult | undefined | null,
    ) {
        const src = params?.pathname.groups.src || "";
        const path = params?.pathname.groups["0"] || "";
        const host = hosts[src] || src;
        const protocol = host.startsWith("http://") || host.startsWith("https://") ? "" : "https://";

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            const fetchedData = await fetch(
                `${protocol}${host}/${path}`,
                {
                    signal: controller.signal,
                    headers: DEFAULT_HEADERS,
                },
            );

            clearTimeout(timeout);

            return new Response(
                fetchedData.body,
                {
                    status: fetchedData.status,
                    headers: new Headers({
                        "content-type": fetchedData.headers.get("content-type") || "application/octet-stream",
                        "content-encoding": fetchedData.headers.get("content-encoding") || "",
                        ...RESPONSE_HEADERS,
                    }),
                },
            );
        } catch (_error) {
            clearTimeout(timeout);
            return new Response("Failed to fetch resource", { status: 502 });
        }
    },
};
