import 'three';

declare module 'three' {
  export class IcosahedronBufferGeometry extends PolyhedronBufferGeometry {
    constructor(radius: number, detail: number);
  }
}