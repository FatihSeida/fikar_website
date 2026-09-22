import type { Note } from "@shared/schema";

/**
 * Menentukan ke mana sebuah entri mengarah.
 *
 * Liputan dan publikasi hidup di situs lain. Situs ini hanya menunjuk ke
 * sumbernya, jadi tautannya keluar. Sebaliknya opini dan pemikiran adalah
 * tulisan Ahmad Zulfikar sendiri yang naskahnya dimuat di sini, jadi tautannya
 * masuk ke halaman catatan meskipun entrinya juga punya tautan sumber.
 */
const TAG_TULISAN_SENDIRI = ["opini", "pemikiran", "catatan"];

export interface TujuanCatatan {
  href: string;
  eksternal: boolean;
}

export function tujuanCatatan(note: Note): TujuanCatatan {
  const tulisanSendiri = TAG_TULISAN_SENDIRI.includes(note.tag.trim().toLowerCase());

  if (!tulisanSendiri && note.sourceUrl) {
    return { href: note.sourceUrl, eksternal: true };
  }

  return { href: `/catatan/${note.slug}`, eksternal: false };
}
