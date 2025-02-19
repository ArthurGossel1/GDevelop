import { integer, float } from "../model/CommonTypes";
import { TiledMap } from "../tiled/TiledFormat";
import {
  EditableObjectLayer,
  EditableTileMap,
  EditableTileMapLayer,
} from "../model/TileMapModel";
import { TileTextureCache } from "./TileTextureCache";

import PIXI = GlobalPIXIModule.PIXI;
import { getTileIdFromTiledGUI } from "../tiled/TiledLoaderHelper";

export class PixiTileMapHelper {
  /**
   * Split an atlas image into Pixi textures.
   *
   * @param tiledMap A tile map exported from Tiled.
   * @param atlasTexture The texture containing the whole tile set.
   * @param getTexture A getter to load a texture. Used if atlasTexture is not specified.
   * @returns A textures cache.
   */
  static parseAtlas(
    tiledMap: TiledMap,
    atlasTexture: PIXI.BaseTexture<PIXI.Resource> | null,
    getTexture: (textureName: string) => PIXI.BaseTexture<PIXI.Resource>
  ): TileTextureCache | null {
    if (!tiledMap.tiledversion) {
      console.warn(
        "The loaded Tiled map does not contain a 'tiledversion' key. Are you sure this file has been exported from Tiled (mapeditor.org)?"
      );

      return null;
    }

    // We only handle tileset embedded in the tilemap. Warn if it's not the case.
    if (!tiledMap.tilesets.length || "source" in tiledMap.tilesets[0]) {
      console.warn(
        "The loaded Tiled map seems not to contain any tileset data (nothing in 'tilesets' key)."
      );
      return null;
    }

    const tiledSet = tiledMap.tilesets[0];
    const {
      tilewidth,
      tileheight,
      tilecount,
      image,
      columns,
      spacing,
      margin,
    } = tiledSet;
    const firstGid = tiledSet.firstgid === undefined ? 1 : tiledSet.firstgid;
    if (!atlasTexture) atlasTexture = getTexture(image);

    // We try to detect what size Tiled is expecting.
    const rows = tilecount / columns;
    const expectedAtlasWidth =
      tilewidth * columns + spacing * (columns - 1) + margin * 2;
    const expectedAtlasHeight =
      tileheight * rows + spacing * (rows - 1) + margin * 2;
    // When users use an atlas images that are not divisible by the tile width,
    // Tiled automatically chooses a number of column that fit in the atlas for
    // a given tile size.
    // So the atlas images can have unused pixels at the right and bottom.
    if (
      (atlasTexture.width !== 1 && atlasTexture.width < expectedAtlasWidth) ||
      atlasTexture.width >= expectedAtlasWidth + spacing + tilewidth ||
      (atlasTexture.height !== 1 &&
        atlasTexture.height < expectedAtlasHeight) ||
      atlasTexture.height >= expectedAtlasHeight + spacing + tileheight
    ) {
      console.error(
        "It seems the atlas file was resized, which is not supported. " +
          `It should be ${expectedAtlasWidth}x${expectedAtlasHeight} px, ` +
          `but it's ${atlasTexture.width}x${atlasTexture.height} px.`
      );
      return null;
    }
    if (
      (atlasTexture.width !== 1 && atlasTexture.width !== expectedAtlasWidth) ||
      (atlasTexture.height !== 1 && atlasTexture.height !== expectedAtlasHeight)
    ) {
      console.warn(
        "It seems the atlas file has unused pixels. " +
          `It should be ${expectedAtlasWidth}x${expectedAtlasHeight} px, ` +
          `but it's ${atlasTexture.width}x${atlasTexture.height} px.`
      );
      return null;
    }

    // Prepare the textures pointing to the base "Atlas" Texture for each tile.
    // Note that this cache can be augmented later with rotated/flipped
    // versions of the tile textures.
    const textureCache = new TileTextureCache();
    for (let tileSetIndex = 0; tileSetIndex < tilecount; tileSetIndex++) {
      const columnMultiplier = Math.floor(tileSetIndex % columns);
      const rowMultiplier = Math.floor(tileSetIndex / columns);
      const x = margin + columnMultiplier * (tilewidth + spacing);
      const y = margin + rowMultiplier * (tileheight + spacing);
      const tileId = getTileIdFromTiledGUI(firstGid + tileSetIndex);

      try {
        const rect = new PIXI.Rectangle(x, y, tilewidth, tileheight);
        const texture = new PIXI.Texture(atlasTexture!, rect);

        textureCache.setTexture(tileId, false, false, false, texture);
      } catch (error) {
        console.error(
          "An error occurred while creating a PIXI.Texture to be used in a TileMap:",
          error
        );
      }
    }

    return textureCache;
  }

  /**
   * Re-renders the tile map whenever its rendering settings have been changed
   *
   * @param pixiTileMap the tile map renderer
   * @param tileMap the tile map model
   * @param textureCache the tile set textures
   * @param displayMode What to display:
   * - only a single layer (`index`)
   * - only visible layers (`visible`)
   * - everything (`all`).
   * @param layerIndex If `displayMode` is set to `index`, the layer index to be
   * displayed.
   */
  static updatePixiTileMap(
    untypedPixiTileMap: any,
    tileMap: EditableTileMap,
    textureCache: TileTextureCache,
    displayMode: "index" | "visible" | "all",
    layerIndex: number
  ): void {
    // The extension doesn't handle the Pixi sub-namespace very well.
    const pixiTileMap = untypedPixiTileMap as PIXI.tilemap.CompositeTilemap;
    if (!pixiTileMap) return;
    pixiTileMap.clear();

    for (const layer of tileMap.getLayers()) {
      if (
        (displayMode === "index" && layerIndex !== layer.id) ||
        (displayMode === "visible" && !layer.isVisible())
      ) {
        continue;
      }

      if (layer instanceof EditableObjectLayer) {
        const objectLayer = layer as EditableObjectLayer;
        for (const object of objectLayer.objects) {
          const texture = textureCache.findTileTexture(object.getTileId());
          if (texture) {
            const rotate = textureCache.getPixiRotate(
              object.isFlippedHorizontally(),
              object.isFlippedVertically(),
              object.isFlippedDiagonally()
            );
            pixiTileMap.tile(
              texture,
              object.x,
              object.y - objectLayer.tileMap.getTileHeight(),
              { rotate }
            );
          }
        }
      } else if (layer instanceof EditableTileMapLayer) {
        const tileLayer = layer as EditableTileMapLayer;

        const tileWidth = tileLayer.tileMap.getTileWidth();
        const tileHeight = tileLayer.tileMap.getTileHeight();
        const dimensionX = tileLayer.tileMap.getDimensionX();
        const dimensionY = tileLayer.tileMap.getDimensionY();

        for (let y = 0; y < dimensionY; y++) {
          for (let x = 0; x < dimensionX; x++) {
            const xPos = tileWidth * x;
            const yPos = tileHeight * y;

            const tileId = tileLayer.get(x, y);
            if (tileId === undefined) {
              continue;
            }
            const tileTexture = textureCache.findTileTexture(tileId);
            if (!tileTexture) {
              console.warn(`Unknown tile id: ${tileId} at (${x}, ${y})`);
              continue;
            }
            const rotate = textureCache.getPixiRotate(
              tileLayer.isFlippedHorizontally(x, y),
              tileLayer.isFlippedVertically(x, y),
              tileLayer.isFlippedDiagonally(x, y)
            );
            const pixiTilemapFrame = pixiTileMap.tile(tileTexture, xPos, yPos, {
              rotate,
            });

            const tileDefinition = tileLayer.tileMap.getTileDefinition(tileId);

            // Animated tiles have a limitation:
            // they are only able to use frames arranged horizontally one next
            // to each other on the atlas.
            if (tileDefinition && tileDefinition.getAnimationLength() > 0) {
              pixiTilemapFrame.tileAnimX(
                tileWidth,
                tileDefinition.getAnimationLength()
              );
            }
          }
        }
      }
    }
  }

  /**
   * Re-renders the collision mask
   */
  static updatePixiCollisionMask(
    pixiGraphics: PIXI.Graphics,
    tileMap: EditableTileMap,
    typeFilter: string,
    outlineSize: integer,
    outlineColor: integer,
    outlineOpacity: float,
    fillColor: integer,
    fillOpacity: float
  ): void {
    if (!pixiGraphics) return;
    pixiGraphics.clear();

    pixiGraphics.lineStyle(outlineSize, outlineColor, outlineOpacity);
    pixiGraphics.drawRect(0, 0, tileMap.getWidth(), tileMap.getHeight());

    for (const layer of tileMap.getLayers()) {
      const tileWidth = tileMap.getTileWidth();
      const tileHeight = tileMap.getTileHeight();

      if (layer instanceof EditableTileMapLayer) {
        const tileLayer = layer as EditableTileMapLayer;

        for (let y = 0; y < tileLayer.tileMap.getDimensionY(); y++) {
          for (let x = 0; x < tileLayer.tileMap.getDimensionX(); x++) {
            const xPos = tileWidth * x;
            const yPos = tileHeight * y;

            const tileId = tileLayer.get(x, y)!;
            const isFlippedHorizontally = tileLayer.isFlippedHorizontally(x, y);
            const isFlippedVertically = tileLayer.isFlippedVertically(x, y);
            const isFlippedDiagonally = tileLayer.isFlippedDiagonally(x, y);
            const tileDefinition = tileLayer.tileMap.getTileDefinition(tileId);
            if (!tileDefinition) {
              continue;
            }
            const hitboxes = tileDefinition.getHitBoxes(typeFilter);
            if (!hitboxes) {
              continue;
            }
            for (const vertices of hitboxes) {
              if (vertices.length === 0) continue;

              pixiGraphics.beginFill(fillColor, fillOpacity);
              for (let index = 0; index < vertices.length; index++) {
                let vertexX = vertices[index][0];
                let vertexY = vertices[index][1];
                // It's important to do the diagonal flipping first,
                // because the other flipping "move" the origin.
                if (isFlippedDiagonally) {
                  const swap = vertexX;
                  vertexX = vertexY;
                  vertexY = swap;
                }
                if (isFlippedHorizontally) {
                  vertexX = tileWidth - vertexX;
                }
                if (isFlippedVertically) {
                  vertexY = tileHeight - vertexY;
                }
                if (index === 0) {
                  pixiGraphics.moveTo(xPos + vertexX, yPos + vertexY);
                } else {
                  pixiGraphics.lineTo(xPos + vertexX, yPos + vertexY);
                }
              }
              pixiGraphics.closePath();
              pixiGraphics.endFill();
            }
          }
        }
      }
    }
  }
}
