
/**
 * If you want to keep chunks loaded and receive notifications on a specific area,
 * extend this class and register it into Level. This will also tick chunks.
 *
 * Register Level->registerChunkLoader($this, $chunkX, $chunkZ)
 * Unregister Level->unregisterChunkLoader($this, $chunkX, $chunkZ)
 *
 * WARNING: When moving this object around in the world or destroying it,
 * be sure to free the existing references from Level, otherwise you'll leak memory.
 */
interface ChunkLoader {

    /**
     * Returns the ChunkLoader id.
     * Call Level.generateChunkLoaderId($this) to generate and save it
     *
     * @return {number}
     */
    getLoaderId(): number;

    /**
     * Returns if the chunk loader is currently active
     *
     * @return {boolean}
     */
    isLoaderActive(): boolean;

    //TODO: Position
    // getPosition();
}