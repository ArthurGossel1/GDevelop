// @flow
export const aboveMaterialUiMaxZIndex = 1501; // highest z-index used by MaterialUI is 1500

const getStyleAttribute = (element: Element, prop: string) =>
  getComputedStyle(element).getPropertyValue(prop);

const getOverflowAttributes = (element: Element) =>
  getStyleAttribute(element, 'overflow') +
  getStyleAttribute(element, 'overflow-y') +
  getStyleAttribute(element, 'overflow-x');

export const getElementAncestry = (
  element: Element,
  elementPath: Array<Element>
) => {
  if (!element.parentElement) {
    return elementPath;
  }
  return getElementAncestry(
    element.parentElement,
    elementPath.concat([element])
  );
};

const isScrollableElement = (element: Element) => {
  const regex = /(auto|scroll)/;
  return regex.test(getOverflowAttributes(element));
};

// Taken from https://stackoverflow.com/a/49186677/9517183
export const getScrollParent = (element: Element): Element | null => {
  if (!(element instanceof HTMLElement)) {
    return null;
  }

  const elementParent = element.parentElement;
  if (!elementParent) return null;

  const elementAncestry = getElementAncestry(elementParent, []);

  for (let parent of elementAncestry) {
    if (isScrollableElement(parent)) {
      return parent;
    }
  }

  return document.scrollingElement || document.documentElement;
};

export const isContainedInReactRootNode = (element: HTMLElement) => {
  const reactRootNode = document.querySelector('#root');
  if (!reactRootNode) return false;
  return reactRootNode.contains(element);
};

export const getDisplayZIndexForHighlighter = (element: HTMLElement) => {
  if (isContainedInReactRootNode(element)) {
    return getComputedStyle(element).getPropertyPriority('z-index') + 10;
  }
  return aboveMaterialUiMaxZIndex;
};
