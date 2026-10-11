import * as THREE from 'three';
import { W, bahanPadat, titik } from '../../kit/index.js';
export function kabelKarya() {
  const g = new THREE.Group();
  g.userData = { nama: 'kabel karya terputus', penting: true, bagian: {} };
  const tabung = pts => {
    const kurva = new THREE.CatmullRomCurve3(pts.map(p=>titik(...p)));
    const m = new THREE.Mesh(new THREE.TubeGeometry(kurva,32,.045,8,false), bahanPadat(W.abuGelap));
    m.geometry.computeBoundingBox();
    const pusat = m.geometry.boundingBox.getCenter(new THREE.Vector3());
    m.geometry.translate(-pusat.x,-pusat.y,-pusat.z);
    m.position.copy(pusat);
    m.castShadow = m.receiveShadow = true;
    return m;
  };
  const kiri = tabung([[-1.36,.45,.42],[-1.03,.6,.35],[-.77,.68,.11]]);
  const kanan = tabung([[-.13,.3,.42],[-.36,.6,.32],[-.44,.68,.11]]);
  const sambung = tabung([[-.77,.68,.11],[-.62,.72,.08],[-.44,.68,.11]]);
  g.add(kiri,kanan,sambung);
  g.userData.sambung = k => {
    sambung.visible = k>0;
    sambung.scale.setScalar(Math.max(.0001,k));
    for (const m of [kiri,kanan,sambung]) m.material.color.copy(W.abuGelap).lerp(W.zamrudPijar,k);
  };
  return g;
}
