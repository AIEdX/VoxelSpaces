import { VoxelSpace } from "./Classes/VoxelSpace.js";
const merge = (target, newObject) => {
    return Object.assign(target, newObject);
};
export const VoxelSpaces = {
    zeroPointSpace: new VoxelSpace({
        getPosition(space) {
            return space._position;
        },
        getIndex() {
            return 0;
        },
    }),
    getVoxelSpaces() {
        const regionSpace = merge(new VoxelSpace({
            getPosition(space) {
                return VoxelSpace.simpleCubeHash(space);
            },
            getIndex(space) {
                return -Infinity;
            },
        }), {
            chunkBounds: { x: 0, y: 0, z: 0 },
            columnBounds: { x: 0, y: 0, z: 0 },
            getChunkVolume() {
                return this.chunkBounds.x * this.chunkBounds.y * this.chunkBounds.z;
            },
            getColumnVolume() {
                return this.chunkBounds.x * this.chunkBounds.y * this.chunkBounds.z;
            },
        });
        const columnSpace = new VoxelSpace({
            getPosition(space) {
                return VoxelSpace.simpleCubeHash(space);
            },
            getIndex(space) {
                return VoxelSpace.getIndex(VoxelSpace.spatialHash(space, regionSpace, space._bounds), regionSpace.columnBounds);
            },
        });
        const chunkSpace = merge(new VoxelSpace({
            getPosition(space) {
                return VoxelSpace.simpleCubeHash(space);
            },
            getIndex(space) {
                const ry = (space._position.y >> regionSpace._boundsPower2.y) <<
                    regionSpace._boundsPower2.y;
                const cy = (space._position.y >> space._boundsPower2.y) << space._boundsPower2.y;
                return (cy - ry) / space._bounds.y;
            },
        }), {
            _regionPosition: { x: 0, y: 0, z: 0 },
            getRegionPositonx() {
                chunkSpace.getPosition();
                return VoxelSpace.spatialHash(chunkSpace, regionSpace, chunkSpace._bounds);
            },
            getRegionPositonxXYZ(x, y, z) {
                return chunkSpace.setXYZ(x, y, z).getRegionPositonx();
            },
            getRegionIndex() {
                return VoxelSpace.getIndex(chunkSpace._hashedPosition, regionSpace.chunkBounds);
            },
            getRegionIndexXYZ(x, y, z) {
                chunkSpace.getRegionPositonxXYZ(x, y, z);
                return chunkSpace.getRegionIndex();
            },
        });
        const voxelSpace = new VoxelSpace({
            getPosition(space) {
                VoxelSpace.spatialHash(space, chunkSpace);
                space._position.x = space._hashedPosition.x;
                space._position.y = space._hashedPosition.y;
                space._position.z = space._hashedPosition.z;
                return space._position;
            },
            getIndex(space) {
                return VoxelSpace.getIndex(space._hashedPosition, space._bounds);
            },
        });
        return {
            region: regionSpace,
            column: columnSpace,
            chunk: chunkSpace,
            voxel: voxelSpace,
            setDimensions(data) {
                regionSpace.setCubeBounds(data.regions);
                columnSpace.setCubeBounds(data.columns);
                chunkSpace.setCubeBounds(data.chunks);
                voxelSpace.setCubeBounds(data.chunks);
                regionSpace.chunkBounds.x = regionSpace._bounds.x / chunkSpace._bounds.x;
                regionSpace.chunkBounds.y = regionSpace._bounds.y / chunkSpace._bounds.y;
                regionSpace.chunkBounds.z = regionSpace._bounds.z / chunkSpace._bounds.z;
                regionSpace.columnBounds.x = regionSpace._bounds.x / columnSpace._bounds.x;
                regionSpace.columnBounds.y = regionSpace._bounds.y / columnSpace._bounds.y;
                regionSpace.columnBounds.z = regionSpace._bounds.z / columnSpace._bounds.z;
            },
        };
    },
    getZeroPointVoxelSpace(dimensions) {
        const space = new VoxelSpace({
            getPosition(space) {
                VoxelSpace.spatialHash(space, VoxelSpaces.zeroPointSpace);
                space._position.x = space._hashedPosition.x;
                space._position.y = space._hashedPosition.y;
                space._position.z = space._hashedPosition.z;
                return space._position;
            },
            getIndex(space) {
                return VoxelSpace.getIndex(space._hashedPosition, space._bounds);
            },
        });
        space.setBounds(dimensions);
        return space;
    },
};
