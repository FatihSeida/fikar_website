// label3D: label HTML yang menempel pada benda 3D, diproyeksikan ulang setiap frame. Tidak pernah teks 3D.
import * as THREE from "three";
import { videoAktif } from "../inti/aktif.js";
import { halus, rentang } from "../inti/waktu.js";
import { sorot } from "./komponen.js";

const _p = new THREE.Vector3();
const _q = new THREE.Vector3();

// isi: teks (boleh **kata** berwarna) atau HTML bila html: true.
// opsi:
//   pada     Object3D | Vector3 | (t) => Vector3   jangkar dunia
//   geser    [x, y, z] atau Vector3, geser dunia dari jangkar (misalnya [0, 1.6, 0] = di atas benda)
//   gaya     "benda" (bawaan) | "kotak" | "baris" | "mikro" (±15 px) ; kelas: kelas CSS tambahan, mis. varian warna
//            "emas" | "zamrud" | "abu" (benda, kotak, mikro) atau "gelap" (mikro di atas kertas)
//   dx, dy   geser piksel; ax, ay jangkar label 0..1 (bawaan 0.5, 1 = tengah bawah label di titik)
//   masuk    [a, b] atau detik (pudar masuk 0.25 s); keluar [c, d] atau detik
//   opasitas (t) => 0..1, menggantikan masuk/keluar
//   ikutOpasitas  bawaan true bila `pada` berupa Object3D: ikut pudar bersama bendanya
// Objek yang dikembalikan: `pada` (jangkar asli) dan `pengali` ((t) => 0..1, bawaan null) untuk modul gerak seperti segmenKuis.
// Label yang jangkarnya Object3D tersembunyi selama jangkar itu belum masuk adegan (akarnya bukan THREE.Scene).
//   skala    angka atau (t) => angka
export function label3D(isi, opsi = {}) {
  const v = videoAktif("label3D");
  const e = document.createElement("div");
  e.className = `lbl lbl-${opsi.gaya ?? "benda"}${opsi.kelas ? " " + opsi.kelas : ""}`;
  const html = (s) => (opsi.html ? s : sorot(s));
  e.innerHTML = html(isi);
  v.halaman.lapisanLabel.appendChild(e);
  const geser = opsi.geser ? (opsi.geser.isVector3 ? opsi.geser.clone() : new THREE.Vector3(...opsi.geser)) : new THREE.Vector3();
  const masuk = opsi.masuk == null ? null : Array.isArray(opsi.masuk) ? opsi.masuk : [opsi.masuk, opsi.masuk + 0.25];
  const keluar = opsi.keluar == null ? null : Array.isArray(opsi.keluar) ? opsi.keluar : [opsi.keluar, opsi.keluar + 0.25];
  const benda = opsi.pada?.isObject3D ? opsi.pada : null;
  const ikut = opsi.ikutOpasitas ?? !!benda;
  let teksKini = isi;

  const lbl = {
    el: e,
    isi,
    pada: opsi.pada ?? null, // jangkar asli (Object3D, Vector3, fungsi): dibaca modul gerak seperti segmenKuis
    pengali: null, // (t) => 0..1, dikalikan ke opasitas; diisi modul gerak (segmenKuis) untuk memudarkan label berjangkar bukan benda
    ganti: [], // [{ t, teks, durasi }] diisi gerak gantiLabel, urut menurut t
    semuaTeks: () => [isi, ...lbl.ganti.map((g) => g.teks)],
    posisiDunia(t, out = new THREE.Vector3()) {
      const p = opsi.pada;
      if (benda) benda.getWorldPosition(out);
      else if (typeof p === "function") out.copy(p(t));
      else if (p?.isVector3) out.copy(p);
      else out.set(0, 0, 0);
      return out.add(geser);
    },
    perbarui(t) {
      // Teks saat ini dan celup opasitas di sekitar pergantian.
      let teks = isi, celup = 1;
      for (const g of lbl.ganti) {
        const h = g.durasi / 2;
        if (t >= g.t) teks = g.teks;
        if (Math.abs(t - g.t) < h) celup = Math.min(celup, halus(Math.abs(t - g.t) / h));
      }
      if (teks !== teksKini) { e.innerHTML = html(teks); teksKini = teks; }
      let op = opsi.opasitas ? opsi.opasitas(t)
        : (masuk ? halus(rentang(t, masuk[0], masuk[1])) : 1) * (keluar ? 1 - halus(rentang(t, keluar[0], keluar[1])) : 1);
      if (benda) {
        // Jangkar yang belum (atau tidak lagi) berada di adegan tidak punya posisi dunia yang bermakna: label disembunyikan.
        let a = 1, akar = benda;
        for (let o = benda; o; o = o.parent) { akar = o; if (!o.visible) a = 0; else a *= o.userData.opasitas ?? 1; }
        if (!akar.isScene) { e.style.opacity = "0"; return; }
        if (ikut) op *= a;
      }
      op *= celup;
      if (lbl.pengali) op *= lbl.pengali(t);
      if (op <= 0.001) { e.style.opacity = "0"; return; }
      lbl.posisiDunia(t, _q);
      _p.copy(_q).project(v.kamera);
      const { lebar, tinggi } = v.ukuran;
      const w = e.offsetWidth, h = e.offsetHeight;
      const ax = opsi.ax ?? 0.5, ay = opsi.ay ?? 1;
      const x = (_p.x + 1) / 2 * lebar + (opsi.dx ?? 0) - w * ax;
      const y = (1 - _p.y) / 2 * tinggi + (opsi.dy ?? 0) - h * ay;
      // Memudar di luar zona label (zona adegan format, diperlebar sedikit) dan di tepi kiri/kanan layar.
      const b = v.batasLabel;
      let f = halus((y - b.atas) / 24) * halus((b.bawah - (y + h)) / 24);
      f *= halus((x - 40) / 14) * halus((lebar - 40 - (x + w)) / 14);
      const s = typeof opsi.skala === "function" ? opsi.skala(t) : (opsi.skala ?? 1);
      e.style.opacity = (op * f).toFixed(4);
      e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(3)})`;
    },
  };
  v.label.push(lbl);
  return lbl;
}
