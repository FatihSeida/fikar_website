// Dunia dasar kit, satu berkas per dunia (KONTRAK.md §7).
import { duniaKader } from "./kader.js";
import { duniaJenjang } from "./jenjang.js";
import { duniaSimpul } from "./simpul.js";
import { duniaPustaka } from "./pustaka.js";
import { duniaRencana } from "./rencana.js";
import { duniaArsip } from "./arsip.js";

export { duniaKader, duniaJenjang, duniaSimpul, duniaPustaka, duniaRencana, duniaArsip };

// Semua dunia untuk halaman katalog.
export const DAFTAR_DUNIA = [
  { nama: "kader", buat: duniaKader },
  { nama: "jenjang", buat: duniaJenjang },
  { nama: "simpul", buat: duniaSimpul },
  { nama: "pustaka", buat: duniaPustaka },
  { nama: "rencana", buat: duniaRencana },
  { nama: "arsip", buat: duniaArsip },
];
