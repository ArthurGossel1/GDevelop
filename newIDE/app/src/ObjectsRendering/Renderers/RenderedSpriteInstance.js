// @flow
import RenderedInstance from './RenderedInstance';
import PixiResourcesLoader from '../../ObjectsRendering/PixiResourcesLoader';
import ResourcesLoader from '../../ResourcesLoader';
import * as PIXI from 'pixi.js-legacy';
const gd: libGDevelop = global.gd;

/**
 * Renderer for gd.SpriteObject
 */
export default class RenderedSpriteInstance extends RenderedInstance {
  _renderedAnimation: number;
  _renderedDirection: number;
  _centerX: number;
  _centerY: number;
  _originX: number;
  _originY: number;
  _sprite: ?gdSprite = null;
  _shouldNotRotate: boolean = false;

  constructor(
    project: gdProject,
    layout: gdLayout,
    instance: gdInitialInstance,
    associatedObjectConfiguration: gdObjectConfiguration,
    pixiContainer: PIXI.Container,
    pixiResourcesLoader: Class<PixiResourcesLoader>
  ) {
    super(
      project,
      layout,
      instance,
      associatedObjectConfiguration,
      pixiContainer,
      pixiResourcesLoader
    );

    this._renderedAnimation = 0;
    this._renderedDirection = 0;
    this._centerX = 0;
    this._centerY = 0;
    this._originX = 0;
    this._originY = 0;

    //Setup the PIXI object:
    this._pixiObject = new PIXI.Sprite(
      PixiResourcesLoader.getInvalidPIXITexture()
    );
    this._pixiContainer.addChild(this._pixiObject);
    this.updatePIXITextureAndSprite();
  }

  /**
   * Return a URL for thumbnail of the specified object.
   */
  static getThumbnail(
    project: gdProject,
    resourcesLoader: Class<ResourcesLoader>,
    objectConfiguration: gdObjectConfiguration
  ): string {
    const spriteConfiguration = gd.asSpriteConfiguration(objectConfiguration);

    if (
      spriteConfiguration.getAnimationsCount() > 0 &&
      spriteConfiguration.getAnimation(0).getDirectionsCount() > 0 &&
      spriteConfiguration
        .getAnimation(0)
        .getDirection(0)
        .getSpritesCount() > 0
    ) {
      const imageName = spriteConfiguration
        .getAnimation(0)
        .getDirection(0)
        .getSprite(0)
        .getImageName();
      return ResourcesLoader.getResourceFullUrl(project, imageName, {});
    }

    return 'res/unknown32.png';
  }

  updatePIXISprite(): void {
    this._pixiObject.anchor.x =
      this._centerX / this._pixiObject.texture.frame.width;
    this._pixiObject.anchor.y =
      this._centerY / this._pixiObject.texture.frame.height;
    this._pixiObject.rotation = this._shouldNotRotate
      ? 0
      : RenderedInstance.toRad(this._instance.getAngle());
    if (this._instance.hasCustomSize()) {
      this._pixiObject.scale.x =
        this._instance.getCustomWidth() / this._pixiObject.texture.frame.width;
      this._pixiObject.scale.y =
        this._instance.getCustomHeight() /
        this._pixiObject.texture.frame.height;
    } else {
      this._pixiObject.scale.x = 1;
      this._pixiObject.scale.y = 1;
    }
    this._pixiObject.position.x =
      this._instance.getX() +
      (this._centerX - this._originX) * Math.abs(this._pixiObject.scale.x);
    this._pixiObject.position.y =
      this._instance.getY() +
      (this._centerY - this._originY) * Math.abs(this._pixiObject.scale.y);
  }

  updateSprite(): boolean {
    this._sprite = null;
    this._shouldNotRotate = false;

    const spriteConfiguration = gd.asSpriteConfiguration(
      this._associatedObjectConfiguration
    );
    if (spriteConfiguration.hasNoAnimations()) return false;

    this._renderedAnimation = this._instance.getRawDoubleProperty('animation');
    if (this._renderedAnimation >= spriteConfiguration.getAnimationsCount())
      this._renderedAnimation = 0;

    const animation = spriteConfiguration.getAnimation(this._renderedAnimation);
    if (animation.hasNoDirections()) return false;

    this._renderedDirection = 0;
    if (animation.useMultipleDirections()) {
      let normalizedAngle = Math.floor(this._instance.getAngle()) % 360;
      if (normalizedAngle < 0) normalizedAngle += 360;

      this._renderedDirection = Math.round(normalizedAngle / 45) % 8;
    }

    if (this._renderedDirection >= animation.getDirectionsCount())
      this._renderedDirection = 0;

    const direction = animation.getDirection(this._renderedDirection);

    if (direction.getSpritesCount() === 0) return false;

    this._shouldNotRotate = animation.useMultipleDirections();
    this._sprite = direction.getSprite(0);
    return true;
  }

  updatePIXITextureAndSprite(): void {
    this.updateSprite();
    const sprite = this._sprite;
    if (!sprite) return;

    const texture = PixiResourcesLoader.getPIXITexture(
      this._project,
      sprite.getImageName()
    );
    this._pixiObject.texture = texture;

    if (!texture.baseTexture.valid) {
      // Post pone texture update if texture is not loaded.
      texture.once('update', () => this.updatePIXITextureAndSprite());
      return;
    }

    const origin = sprite.getOrigin();
    this._originX = origin.getX();
    this._originY = origin.getY();

    if (sprite.isDefaultCenterPoint()) {
      this._centerX = texture.width / 2;
      this._centerY = texture.height / 2;
    } else {
      const center = sprite.getCenter();
      this._centerX = center.getX();
      this._centerY = center.getY();
    }

    this.updatePIXISprite();
  }

  update(): void {
    const animation = this._instance.getRawDoubleProperty('animation');
    if (this._renderedAnimation !== animation) {
      this.updatePIXITextureAndSprite();
    } else {
      this.updatePIXISprite();
    }
  }

  getOriginX(): number {
    if (!this._sprite || !this._pixiObject) return 0;

    return this._sprite.getOrigin().getX() * this._pixiObject.scale.x;
  }

  getOriginY(): number {
    if (!this._sprite || !this._pixiObject) return 0;

    return this._sprite.getOrigin().getY() * this._pixiObject.scale.y;
  }

  getDefaultWidth(): number {
    return Math.abs(this._pixiObject.width);
  }

  getDefaultHeight(): number {
    return Math.abs(this._pixiObject.height);
  }
}
