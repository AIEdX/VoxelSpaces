<h1 align="center">
  Voxel Spaces
</h1>


<p align="center">
<img src="https://divine-star-software.github.io/DigitalAssets/images/logo-small.png">
</p>

---

```ts
import { VoxelSpaces } from "../out/VoxelSpaces.js";

const spaces = VoxelSpaces.getVoxelSpaces();

spaces.setDimensions({
  regions: { x: 9, y: 8, z: 9 },
  columns: { x: 4, y: 8, z: 4 },
  chunks: { x: 4, y: 4, z: 4 },
});

const chunkVoxel = spaces.chunk.getVolume();
const chunkArea = spaces.chunk.getArea();
console.log(chunkVoxel, chunkArea);

const chunkPosition = spaces.chunk.getPositionXYZ(-1, 16, 3);
console.log(chunkPosition);
const chunkIndex = spaces.chunk.getIndexXYZ(-11, 45, 2);
console.log(chunkIndex);
const chunkRegionIndex = spaces.chunk.getRegionIndexXYZ(100, 34, 2);
console.log(chunkRegionIndex);

const voxelIndex = spaces.voxel.getIndexXYZ(12, 123, 122);
console.log(voxelIndex);
```

```console
4096 256
{ x: -16, y: 16, z: 0 }
2
70
2748
```