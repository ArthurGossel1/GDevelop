// @flow
import { type I18n as I18nType } from '@lingui/core';
import { t } from '@lingui/macro';
import { mapVector } from '../Utils/MapFor';
const gd: libGDevelop = global.gd;

// This file contains the logic to declare extension metadata from
// events functions or events based behaviors.
// These are basically adapters from EventsFunctionsExtension, and children, to a
// real extension declaration (like in `JsExtension.js` or `Extension.cpp` files).

/**
 * Declare an extension from an events based extension.
 */
export const declareExtension = (
  extension: gdPlatformExtension,
  eventsFunctionsExtension: gdEventsFunctionsExtension
) => {
  const fullName =
    eventsFunctionsExtension.getFullName() ||
    eventsFunctionsExtension.getName();
  extension
    .setExtensionInformation(
      eventsFunctionsExtension.getName(),
      fullName,
      eventsFunctionsExtension.getDescription(),
      eventsFunctionsExtension.getAuthor(),
      ''
    )
    .setExtensionHelpPath(eventsFunctionsExtension.getHelpPath())
    .setIconUrl(eventsFunctionsExtension.getIconUrl());

  if (fullName) {
    extension
      .addInstructionOrExpressionGroupMetadata(fullName)
      .setIcon(eventsFunctionsExtension.getIconUrl());
  }

  if (eventsFunctionsExtension.getCategory())
    extension.setCategory(eventsFunctionsExtension.getCategory());

  declareExtensionDependencies(extension, eventsFunctionsExtension);
};

/**
 * Declare the dependencies of an extension from an events based extension.
 */
export const declareExtensionDependencies = (
  extension: gdPlatformExtension,
  eventsFunctionsExtension: gdEventsFunctionsExtension
) =>
  mapVector<gdDependencyMetadata, void>(
    eventsFunctionsExtension.getAllDependencies(),
    dependency => extension.addDependency().copyFrom(dependency)
  );

const getExtensionIconUrl = (extension: gdPlatformExtension) => {
  return extension.getIconUrl() || 'res/function24.png';
};

/**
 * Declare the behavior for the given
 * events based behavior.
 */
export const declareBehaviorMetadata = (
  extension: gdPlatformExtension,
  eventsBasedBehavior: gdEventsBasedBehavior
): gdBehaviorMetadata => {
  return extension
    .addEventsBasedBehavior(
      eventsBasedBehavior.getName(),
      eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
      eventsBasedBehavior.getDescription(),
      '',
      getExtensionIconUrl(extension)
    )
    .setObjectType(eventsBasedBehavior.getObjectType());
};

/**
 * Declare the object for the given
 * events based object.
 */
export const declareObjectMetadata = (
  i18n: I18nType,
  extension: gdPlatformExtension,
  eventsBasedObject: gdEventsBasedObject
): gdObjectMetadata => {
  const objectMetadata = extension.addEventsBasedObject(
    eventsBasedObject.getName(),
    eventsBasedObject.getFullName() || eventsBasedObject.getName(),
    eventsBasedObject.getDescription(),
    getExtensionIconUrl(extension)
  );

  // TODO EBO Use full type to identify object to avoid collision.
  // Objects are identified by their name alone.
  const objectType = eventsBasedObject.getName();

  objectMetadata
    .addAction(
      'Width',
      i18n._('Width'),
      i18n._('Change the width of an object.'),
      i18n._('the width'),
      i18n._('Size'),
      'res/actions/scaleWidth24_black.png',
      'res/actions/scale_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .useStandardOperatorParameters('number')
    .markAsAdvanced()
    .getCodeExtraInformation()
    .setFunctionName('setWidth')
    .setGetter('getWidth');

  objectMetadata
    .addAction(
      'Height',
      i18n._('Height'),
      i18n._('Change the height of an object.'),
      i18n._('the height'),
      i18n._('Size'),
      'res/actions/scaleHeight24_black.png',
      'res/actions/scale_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .useStandardOperatorParameters('number')
    .markAsAdvanced()
    .getCodeExtraInformation()
    .setFunctionName('setHeight')
    .setGetter('getHeight');

  objectMetadata
    .addAction(
      'Scale',
      i18n._('Scale'),
      i18n._('Modify the scale of the specified object.'),
      i18n._('the scale'),
      i18n._('Size'),
      'res/actions/scale24_black.png',
      'res/actions/scale_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .useStandardOperatorParameters('number')
    .markAsAdvanced()
    .getCodeExtraInformation()
    .setFunctionName('setScale')
    .setGetter('getScale');

  objectMetadata
    .addExpressionAndConditionAndAction(
      'number',
      'ScaleX',
      i18n._('Scale on X axis'),
      i18n._("the width's scale of an object"),
      i18n._("the width's scale"),
      i18n._('Size'),
      'res/actions/scaleWidth24_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .useStandardParameters('number')
    .markAsAdvanced()
    .setFunctionName('setScaleX')
    .setGetter('getScaleX');

  objectMetadata
    .addExpressionAndConditionAndAction(
      'number',
      'ScaleY',
      i18n._('Scale on Y axis'),
      i18n._("the height's scale of an object"),
      i18n._("the height's scale"),
      i18n._('Size'),
      'res/actions/scaleHeight24_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .useStandardParameters('number')
    .markAsAdvanced()
    .setFunctionName('setScaleY')
    .setGetter('getScaleY');

  objectMetadata
    .addAction(
      'FlipX',
      i18n._('Flip the object horizontally'),
      i18n._('Flip the object horizontally'),
      i18n._('Flip horizontally _PARAM0_: _PARAM1_'),
      i18n._('Effects'),
      'res/actions/flipX24_black.png',
      'res/actions/flipX_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .addParameter('yesorno', i18n._('Activate flipping'))
    .markAsSimple()
    .getCodeExtraInformation()
    .setFunctionName('flipX');

  objectMetadata
    .addAction(
      'FlipY',
      i18n._('Flip the object vertically'),
      i18n._('Flip the object vertically'),
      i18n._('Flip vertically _PARAM0_: _PARAM1_'),
      i18n._('Effects'),
      'res/actions/flipY24_black.png',
      'res/actions/flipY_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .addParameter('yesorno', i18n._('Activate flipping'))
    .markAsSimple()
    .getCodeExtraInformation()
    .setFunctionName('flipY');

  objectMetadata
    .addCondition(
      'FlippedX',
      i18n._('Horizontally flipped'),
      i18n._('Check if the object is horizontally flipped'),
      i18n._('_PARAM0_ is horizontally flipped'),
      i18n._('Effects'),
      'res/actions/flipX24_black.png',
      'res/actions/flipX_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .getCodeExtraInformation()
    .setFunctionName('isFlippedX');

  objectMetadata
    .addCondition(
      'FlippedY',
      i18n._('Vertically flipped'),
      i18n._('Check if the object is vertically flipped'),
      i18n._('_PARAM0_ is vertically flipped'),
      i18n._('Effects'),
      'res/actions/flipY24_black.png',
      'res/actions/flipY_black.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .getCodeExtraInformation()
    .setFunctionName('isFlippedY');

  objectMetadata
    .addExpressionAndConditionAndAction(
      'number',
      'Opacity',
      i18n._('Opacity'),
      i18n._(
        'the opacity of an object, between 0 (fully transparent) to 255 (opaque)'
      ),
      i18n._('the opacity'),
      i18n._('Visibility'),
      'res/conditions/opacity24.png'
    )
    .addParameter('object', i18n._('Object'), objectType)
    .useStandardParameters('number')
    .setFunctionName('getOpacity');

  return objectMetadata;
};

/**
 * Check if the name of the function is the name of a lifecycle function (for events-based behaviors),
 * that will be called automatically by the game engine.
 */
export const isBehaviorLifecycleEventsFunction = (functionName: string) => {
  return (
    [
      'onCreated',
      'onActivate',
      'onDeActivate',
      'doStepPreEvents',
      'doStepPostEvents',
      'onDestroy',
      // Compatibility with GD <= 5.0 beta 75
      'onOwnerRemovedFromScene',
      // end of compatibility code
    ].indexOf(functionName) !== -1
  );
};

/**
 * Check if the name of the function is the name of a lifecycle function (for events-based objects),
 * that will be called automatically by the game engine.
 */
export const isObjectLifecycleEventsFunction = (functionName: string) => {
  return (
    ['onCreated', 'doStepPostEvents', 'onDestroy', 'onHotReloading'].indexOf(
      functionName
    ) !== -1
  );
};

/**
 * Check if the name of the function is the name of a lifecycle function (for events-based extensions),
 * that will be called automatically by the game engine.
 */
export const isExtensionLifecycleEventsFunction = (functionName: string) => {
  return gd.EventsFunctionsExtension.isExtensionLifecycleEventsFunction(
    functionName
  );
};

/**
 * Declare the instruction (action/condition) or expression for the given
 * (free) events function.
 */
export const declareInstructionOrExpressionMetadata = (
  extension: gdPlatformExtension,
  eventsFunctionsExtension: gdEventsFunctionsExtension,
  eventsFunction: gdEventsFunction
): gdInstructionMetadata | gdExpressionMetadata => {
  const functionType = eventsFunction.getFunctionType();
  if (functionType === gd.EventsFunction.Expression) {
    return extension.addExpression(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getGroup() || '',
      getExtensionIconUrl(extension)
    );
  } else if (functionType === gd.EventsFunction.StringExpression) {
    return extension.addStrExpression(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getGroup() || '',
      getExtensionIconUrl(extension)
    );
  } else if (functionType === gd.EventsFunction.Condition) {
    return extension.addCondition(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getSentence(),
      eventsFunction.getGroup() || '',
      getExtensionIconUrl(extension),
      getExtensionIconUrl(extension)
    );
  } else {
    return extension.addAction(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getSentence(),
      eventsFunction.getGroup() || '',
      getExtensionIconUrl(extension),
      getExtensionIconUrl(extension)
    );
  }
};

/**
 * Declare the instruction (action/condition) or expression for the given
 * behavior events function.
 */
export const declareBehaviorInstructionOrExpressionMetadata = (
  extension: gdPlatformExtension,
  behaviorMetadata: gdBehaviorMetadata,
  eventsBasedBehavior: gdEventsBasedBehavior,
  eventsFunction: gdEventsFunction
): gdInstructionMetadata | gdExpressionMetadata => {
  const functionType = eventsFunction.getFunctionType();
  if (functionType === gd.EventsFunction.Expression) {
    return behaviorMetadata.addExpression(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getGroup() ||
        eventsBasedBehavior.getFullName() ||
        eventsBasedBehavior.getName(),
      getExtensionIconUrl(extension)
    );
  } else if (functionType === gd.EventsFunction.StringExpression) {
    return behaviorMetadata.addStrExpression(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getGroup() ||
        eventsBasedBehavior.getFullName() ||
        eventsBasedBehavior.getName(),
      getExtensionIconUrl(extension)
    );
  } else if (functionType === gd.EventsFunction.Condition) {
    // Use the new "scoped" way to declare an instruction, because
    // we want to prevent any conflict between free functions and
    // behaviors (that can totally have functions with the same name).
    return behaviorMetadata.addScopedCondition(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getSentence(),
      eventsFunction.getGroup() ||
        eventsBasedBehavior.getFullName() ||
        eventsBasedBehavior.getName(),
      getExtensionIconUrl(extension),
      getExtensionIconUrl(extension)
    );
  } else {
    // Use the new "scoped" way to declare an instruction, because
    // we want to prevent any conflict between free functions and
    // behaviors (that can totally have functions with the same name).
    return behaviorMetadata.addScopedAction(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getSentence(),
      eventsFunction.getGroup() ||
        eventsBasedBehavior.getFullName() ||
        eventsBasedBehavior.getName(),
      getExtensionIconUrl(extension),
      getExtensionIconUrl(extension)
    );
  }
};

/**
 * Declare the instruction (action/condition) or expression for the given
 * object events function.
 */
export const declareObjectInstructionOrExpressionMetadata = (
  extension: gdPlatformExtension,
  objectMetadata: gdObjectMetadata,
  eventsBasedObject: gdEventsBasedObject,
  eventsFunction: gdEventsFunction
): gdInstructionMetadata | gdExpressionMetadata => {
  const functionType = eventsFunction.getFunctionType();
  if (functionType === gd.EventsFunction.Expression) {
    return objectMetadata.addExpression(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getGroup() ||
        eventsBasedObject.getFullName() ||
        eventsBasedObject.getName(),
      getExtensionIconUrl(extension)
    );
  } else if (functionType === gd.EventsFunction.StringExpression) {
    return objectMetadata.addStrExpression(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getGroup() ||
        eventsBasedObject.getFullName() ||
        eventsBasedObject.getName(),
      getExtensionIconUrl(extension)
    );
  } else if (functionType === gd.EventsFunction.Condition) {
    // Use the new "scoped" way to declare an instruction, because
    // we want to prevent any conflict between free functions and
    // objects (that can totally have functions with the same name).
    return objectMetadata.addScopedCondition(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getSentence(),
      eventsFunction.getGroup() ||
        eventsBasedObject.getFullName() ||
        eventsBasedObject.getName(),
      getExtensionIconUrl(extension),
      getExtensionIconUrl(extension)
    );
  } else {
    // Use the new "scoped" way to declare an instruction, because
    // we want to prevent any conflict between free functions and
    // objects (that can totally have functions with the same name).
    return objectMetadata.addScopedAction(
      eventsFunction.getName(),
      eventsFunction.getFullName() || eventsFunction.getName(),
      eventsFunction.getDescription() || eventsFunction.getFullName(),
      eventsFunction.getSentence(),
      eventsFunction.getGroup() ||
        eventsBasedObject.getFullName() ||
        eventsBasedObject.getName(),
      getExtensionIconUrl(extension),
      getExtensionIconUrl(extension)
    );
  }
};

type gdInstructionOrExpressionMetadata =
  | gdInstructionMetadata
  | gdExpressionMetadata;

/**
 * Declare the instructions (actions/conditions) and expressions for the
 * properties of the given events based behavior.
 * This is akin to what would happen by manually declaring a JS extension
 * (see `JsExtension.js` files of extensions).
 */
export const declareBehaviorPropertiesInstructionAndExpressions = (
  i18n: I18nType,
  extension: gdPlatformExtension,
  behaviorMetadata: gdBehaviorMetadata,
  eventsBasedBehavior: gdEventsBasedBehavior
): void => {
  const addObjectAndBehaviorParameters = <T: gdInstructionOrExpressionMetadata>(
    instructionOrExpression: T
  ): T => {
    // By convention, first parameter is always the object:
    instructionOrExpression.addParameter(
      'object',
      'Object',
      '', // See below for adding the extra information
      false
    );

    // Manually add the "extra info" without relying on addParameter
    // as this method is prefixing the value passed with the extension namespace (this
    // was done to ease extension declarations when dealing with object).
    instructionOrExpression
      .getParameter(instructionOrExpression.getParametersCount() - 1)
      .setExtraInfo(eventsBasedBehavior.getObjectType());

    // By convention, second parameter is always the behavior:
    instructionOrExpression.addParameter(
      'behavior',
      'Behavior',
      eventsBasedBehavior.getName(),
      false
    );

    // All property actions/conditions/expressions are private, meaning
    // they can only be used from the behavior events.
    instructionOrExpression.setPrivate();

    return instructionOrExpression;
  };

  mapVector(eventsBasedBehavior.getPropertyDescriptors(), property => {
    const propertyType = property.getType();
    const propertyName = property.getName();
    const getterName = gd.BehaviorCodeGenerator.getBehaviorPropertyGetterName(
      propertyName
    );
    const setterName = gd.BehaviorCodeGenerator.getBehaviorPropertySetterName(
      propertyName
    );
    const propertyLabel =
      property.getLabel() || i18n._(t`${propertyName} property`);

    if (propertyType === 'String' || propertyType === 'Choice') {
      addObjectAndBehaviorParameters(
        behaviorMetadata.addStrExpression(
          gd.EventsBasedBehavior.getPropertyExpressionName(propertyName),
          propertyLabel,
          propertyLabel,
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedCondition(
          gd.EventsBasedBehavior.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Compare the content of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardRelationalOperatorParameters('string')
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedAction(
          gd.EventsBasedBehavior.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Change the content of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardOperatorParameters('string')
        .getCodeExtraInformation()
        .setFunctionName(setterName)
        .setManipulatedType('string')
        .setGetter(getterName);
    } else if (propertyType === 'Number') {
      addObjectAndBehaviorParameters(
        behaviorMetadata.addExpression(
          gd.EventsBasedBehavior.getPropertyExpressionName(propertyName),
          propertyLabel,
          propertyLabel,
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedCondition(
          gd.EventsBasedBehavior.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Compare the value of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardRelationalOperatorParameters('number')
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedAction(
          gd.EventsBasedBehavior.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Change the value of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardOperatorParameters('number')
        .getCodeExtraInformation()
        .setFunctionName(setterName)
        .setGetter(getterName);
    } else if (propertyType === 'Boolean') {
      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedCondition(
          gd.EventsBasedBehavior.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Check the value of ${propertyLabel}`),
          i18n._(t`Property ${propertyName} of _PARAM0_ is true`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedAction(
          gd.EventsBasedBehavior.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Update the value of ${propertyLabel}`),
          i18n._(t`Set property ${propertyName} of _PARAM0_ to _PARAM2_`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .addParameter('yesorno', i18n._(t`New value to set`), '', false)
        .getCodeExtraInformation()
        .setFunctionName(setterName);
    } else if (propertyType === 'Color') {
      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedCondition(
          gd.EventsBasedBehavior.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Check the color ${propertyLabel}`),
          i18n._(t`Color ${propertyName}`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardRelationalOperatorParameters('string')
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectAndBehaviorParameters(
        behaviorMetadata.addScopedAction(
          gd.EventsBasedBehavior.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Update the color of ${propertyLabel}`),
          i18n._(t`Change color ${propertyName} of _PARAM0_ to _PARAM2_`),
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .addParameter('color', i18n._(t`New color to set`), '', false)
        .getCodeExtraInformation()
        .setFunctionName(setterName);

      addObjectAndBehaviorParameters(
        behaviorMetadata.addStrExpression(
          gd.EventsBasedBehavior.getPropertyExpressionName(propertyName),
          propertyLabel,
          propertyLabel,
          eventsBasedBehavior.getFullName() || eventsBasedBehavior.getName(),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);
    }
  });
};

/**
 * Declare the instructions (actions/conditions) and expressions for the
 * properties of the given events based object.
 * This is akin to what would happen by manually declaring a JS extension
 * (see `JsExtension.js` files of extensions).
 */
export const declareObjectPropertiesInstructionAndExpressions = (
  i18n: I18nType,
  extension: gdPlatformExtension,
  objectMetadata: gdObjectMetadata,
  eventsBasedObject: gdEventsBasedObject
): void => {
  const addObjectParameter = <T: gdInstructionOrExpressionMetadata>(
    instructionOrExpression: T
  ): T => {
    // By convention, first parameter is always the object:
    instructionOrExpression.addParameter(
      'object',
      'Object',
      eventsBasedObject.getName(),
      false
    );

    // All property actions/conditions/expressions are private, meaning
    // they can only be used from the object events.
    instructionOrExpression.setPrivate();

    return instructionOrExpression;
  };

  mapVector(eventsBasedObject.getPropertyDescriptors(), property => {
    const propertyType = property.getType();
    const propertyName = property.getName();
    const getterName = gd.ObjectCodeGenerator.getObjectPropertyGetterName(
      propertyName
    );
    const setterName = gd.ObjectCodeGenerator.getObjectPropertySetterName(
      propertyName
    );
    const propertyLabel =
      property.getLabel() || i18n._(t`${propertyName} property`);

    if (propertyType === 'String' || propertyType === 'Choice') {
      addObjectParameter(
        objectMetadata.addStrExpression(
          gd.EventsBasedObject.getPropertyExpressionName(propertyName),
          propertyLabel,
          propertyLabel,
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectParameter(
        objectMetadata.addScopedCondition(
          gd.EventsBasedObject.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Compare the content of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardRelationalOperatorParameters('string')
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectParameter(
        objectMetadata.addScopedAction(
          gd.EventsBasedObject.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Change the content of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardOperatorParameters('string')
        .getCodeExtraInformation()
        .setFunctionName(setterName)
        .setManipulatedType('string')
        .setGetter(getterName);
    } else if (propertyType === 'Number') {
      addObjectParameter(
        objectMetadata.addExpression(
          gd.EventsBasedObject.getPropertyExpressionName(propertyName),
          propertyLabel,
          propertyLabel,
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectParameter(
        objectMetadata.addScopedCondition(
          gd.EventsBasedObject.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Compare the value of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardRelationalOperatorParameters('number')
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectParameter(
        objectMetadata.addScopedAction(
          gd.EventsBasedObject.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Change the value of ${propertyLabel}`),
          i18n._(t`the property ${propertyName}`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardOperatorParameters('number')
        .getCodeExtraInformation()
        .setFunctionName(setterName)
        .setGetter(getterName);
    } else if (propertyType === 'Boolean') {
      addObjectParameter(
        objectMetadata.addScopedCondition(
          gd.EventsBasedObject.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Check the value of ${propertyLabel}`),
          i18n._(t`Property ${propertyName} of _PARAM0_ is true`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectParameter(
        objectMetadata.addScopedAction(
          gd.EventsBasedObject.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Update the value of ${propertyLabel}`),
          i18n._(t`Set property ${propertyName} of _PARAM0_ to _PARAM2_`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .addParameter('yesorno', i18n._(t`New value to set`), '', false)
        .getCodeExtraInformation()
        .setFunctionName(setterName);
    } else if (propertyType === 'Color') {
      addObjectParameter(
        objectMetadata.addScopedCondition(
          gd.EventsBasedObject.getPropertyConditionName(propertyName),
          propertyLabel,
          i18n._(t`Check the color ${propertyLabel}`),
          i18n._(t`Color ${propertyName}`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .useStandardRelationalOperatorParameters('string')
        .getCodeExtraInformation()
        .setFunctionName(getterName);

      addObjectParameter(
        objectMetadata.addScopedAction(
          gd.EventsBasedObject.getPropertyActionName(propertyName),
          propertyLabel,
          i18n._(t`Update the color of ${propertyLabel}`),
          i18n._(t`Change color ${propertyName} of _PARAM0_ to _PARAM2_`),
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension),
          getExtensionIconUrl(extension)
        )
      )
        .addParameter('color', i18n._(t`New color to set`), '', false)
        .getCodeExtraInformation()
        .setFunctionName(setterName);

      addObjectParameter(
        objectMetadata.addStrExpression(
          gd.EventsBasedObject.getPropertyExpressionName(propertyName),
          propertyLabel,
          propertyLabel,
          eventsBasedObject.getFullName() || eventsBasedObject.getName(),
          getExtensionIconUrl(extension)
        )
      )
        .getCodeExtraInformation()
        .setFunctionName(getterName);
    }
  });
};

/**
 * Add to the instruction (action/condition) or expression the parameters
 * expected by the events function.
 */
export const declareEventsFunctionParameters = (
  eventsFunction: gdEventsFunction,
  instructionOrExpression: gdInstructionMetadata | gdExpressionMetadata
) => {
  mapVector(
    eventsFunction.getParameters(),
    (parameter: gdParameterMetadata) => {
      if (!parameter.isCodeOnly()) {
        instructionOrExpression.addParameter(
          parameter.getType(),
          parameter.getDescription(),
          '', // See below for adding the extra information
          parameter.isOptional()
        );
        instructionOrExpression.setParameterLongDescription(
          parameter.getLongDescription()
        );
        instructionOrExpression.setDefaultValue(parameter.getDefaultValue());
      } else {
        instructionOrExpression.addCodeOnlyParameter(
          parameter.getType(),
          '' // See below for adding the extra information
        );
      }
      // Manually add the "extra info" without relying on addParameter (or addCodeOnlyParameter)
      // as these methods are prefixing the value passed with the extension namespace (this
      // was done to ease extension declarations when dealing with object).
      instructionOrExpression
        .getParameter(instructionOrExpression.getParametersCount() - 1)
        .setExtraInfo(parameter.getExtraInfo());
    }
  );

  // By convention, latest parameter is always the eventsFunctionContext of the calling function
  // (if any).
  instructionOrExpression.addCodeOnlyParameter('eventsFunctionContext', '');
};
