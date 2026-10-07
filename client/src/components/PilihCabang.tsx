import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { badkoCabang, CABANG_LAINNYA } from "@shared/cabang";

/**
 * Pencarian cabang per kata, bukan huruf berserakan: nama yang diawali kata yang
 * diketik tampil paling atas, lalu nama yang mengandungnya, lalu nama Badko-nya.
 * Nilai setiap pilihan berbentuk "Nama cabang · Badko".
 */
function cocokCabang(nilai: string, cari: string) {
  const kata = cari.trim().toLowerCase();
  if (!kata) return 1;
  const [nama, badko = ""] = nilai.toLowerCase().split(" · ");
  if (nama.startsWith(kata)) return 1;
  if (nama.includes(kata)) return 0.8;
  if (badko.includes(kata)) return 0.4;
  return 0;
}

/** Nama cabang yang dipakai: pilihan dari daftar, atau ketikan sendiri bila "Cabang lainnya". */
export const namaCabangDipilih = (pilihan: string, lainnya: string) => (pilihan === CABANG_LAINNYA ? lainnya.trim() : pilihan);

/** Cabang dicari dan dipilih dari daftar per Badko; cabang yang belum terdata bisa diketik sendiri. */
export default function PilihCabang({ pilihan, setPilihan, lainnya, setLainnya }: {
  pilihan: string;
  setPilihan: (nilai: string) => void;
  lainnya: string;
  setLainnya: (nilai: string) => void;
}) {
  const [buka, setBuka] = useState(false);
  const pilih = (nilai: string) => {
    setPilihan(nilai);
    setBuka(false);
  };
  return (
    <div className="grid gap-2">
      <Popover open={buka} onOpenChange={setBuka}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={buka}
            aria-label="Pilih cabang"
            className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-left text-sm"
          >
            <span className={`truncate ${pilihan ? "" : "text-muted-foreground"}`}>
              {pilihan === CABANG_LAINNYA ? "Cabang lainnya" : pilihan || "Pilih cabang"}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[--radix-popover-trigger-width] min-w-[260px] p-0">
          <Command filter={cocokCabang}>
            <CommandInput placeholder="Ketik nama cabang…" />
            <CommandList>
              <CommandEmpty>Cabang tidak ditemukan.</CommandEmpty>
              {badkoCabang.map((badko) => (
                <CommandGroup key={badko.badko} heading={badko.badko}>
                  {badko.cabang.map((nama) => (
                    <CommandItem key={nama} value={`${nama} · ${badko.badko}`} onSelect={() => pilih(nama)}>
                      <Check className={`h-4 w-4 ${pilihan === nama ? "opacity-100" : "opacity-0"}`} />
                      {nama}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              {/* Selalu tampil, juga saat pencarian tidak menemukan apa pun. */}
              <CommandGroup forceMount>
                <CommandItem forceMount value="Cabang lainnya" onSelect={() => pilih(CABANG_LAINNYA)}>
                  <Check className={`h-4 w-4 ${pilihan === CABANG_LAINNYA ? "opacity-100" : "opacity-0"}`} />
                  Cabang lainnya (belum ada di daftar)
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {pilihan === CABANG_LAINNYA && (
        <Input value={lainnya} onChange={(e) => setLainnya(e.target.value)} maxLength={80} placeholder="Tulis nama cabang" aria-label="Nama cabang" />
      )}
    </div>
  );
}
