import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/** Galat dari apiRequest diubah menjadi kalimat yang bisa dibaca orang: pesan dari server bila ada. */
export function isiGalat(galat: unknown): string {
  const cocok = galat instanceof Error ? /^(\d{3}): ([\s\S]*)$/.exec(galat.message) : null;
  if (!cocok) return "Tidak bisa terhubung ke server. Periksa koneksi, lalu coba lagi.";

  const status = Number(cocok[1]);
  if (status === 401) return "Sesi admin sudah berakhir. Muat ulang halaman, masuk lagi, lalu coba simpan kembali.";
  if (status === 413) return "Isi yang dikirim terlalu besar. Kurangi ukuran isi atau gambarnya.";
  if (status >= 500) return "Server sedang bermasalah. Coba lagi sebentar lagi.";
  try {
    const pesan = JSON.parse(cocok[2])?.message;
    if (typeof pesan === "string" && pesan) return pesan;
  } catch {
    // Isi balasan bukan JSON; dipakai apa adanya di bawah.
  }
  return cocok[2] || "Permintaan ditolak server.";
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
