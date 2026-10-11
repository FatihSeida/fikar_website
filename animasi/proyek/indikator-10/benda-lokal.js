import * as THREE from "three";
import { W, bahanPadat, bahanGaris, garisDari } from "../../kit/index.js";

// Bibir jalan patah mengikuti arah jalan; garis denyut hanya mengenai patahan.
export function tepiJalanPatah({ arah }) {
  const g = new THREE.Group();
  const kanan = new THREE.Vector3(arah.z, 0, -arah.x);
  const pusat = arah.clone().multiplyScalar(0.43);
  const p = [-1, -.73, -.43, -.12, .18, .48, .77, 1].map((x, i) =>
    pusat.clone().addScaledVector(kanan, x).addScaledVector(arah, i % 2 ? -.12 : .08));
  const posisi = [], normal = [];
  for (let i = 1; i < p.length; i++) {
    const a = p[i-1], b = p[i];
    for (const v of [a.clone().setY(.065), a.clone().setY(-.18), b.clone().setY(.065), b.clone().setY(.065), a.clone().setY(-.18), b.clone().setY(-.18)]) posisi.push(v.x,v.y,v.z);
    for (let j=0;j<6;j++) normal.push(arah.x,0,arah.z);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(posisi,3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normal,3));
  const badan = new THREE.Mesh(geo, bahanPadat(W.abuGelap,{side:THREE.DoubleSide}));
  const pasang = [];
  for (let i=1;i<p.length;i++) pasang.push(p[i-1].x,.075,p[i-1].z,p[i].x,.075,p[i].z);
  const tepi = garisDari(pasang,bahanGaris(W.zamrudPijar,3,0));
  tepi.visible=false;
  g.add(badan,tepi);
  g.userData={nama:'ujung jalan patah',penting:true,bagian:{denyut:[],tepi:[tepi]}};
  return g;
}
