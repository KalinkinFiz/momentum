/* Helpers */
function isHTMLElement(obj) {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return (
      typeof obj === "object" &&
      obj.nodeType === 1 &&
      typeof obj.style === "object" &&
      typeof obj.ownerDocument === "object"
    );
  }
}

function isValidHTMLElement(tag) {
  return tag.toString() !== "[object HTMLUnknownElement]";
}

/**
 *
 * @param {String} el
 * @param {Array<HTMLElement|String>|String|HTMLElement} child
 * @param {Object} options
 */

const defaultOptions = {
  id: null, // String
  classes: null, // String | Array<String>
  htmlAttrs: null, // Object<dataName, dataValue>
  dataAttrs: null, // Object<dataName, dataValue>
};

function createElement(el, child, options = {}) {
  const { id, classes, htmlAttrs, dataAttrs } = {
    ...defaultOptions,
    ...options,
  };

  let element = document.createElement(el);
  if (!isValidHTMLElement(element)) {
    throw new Error(`"${el}" invalid html element`);
  }

  // Set id
  id && typeof id === "string" && (element.id = id);

  // Set class(-es)
  if (typeof classes === "string") {
    element.className = classes;
  } else if (
    Array.isArray(classes) &&
    classes.every((c) => typeof c === "string" || typeof c === "number")
  ) {
    element.className = classes.join(" ");
  }

  // Set HTML attrs
  for (let attrName in htmlAttrs) {
    element.setAttribute(attrName, htmlAttrs[attrName]);
  }

  // Set data atts
  for (let attrName in dataAttrs) {
    element.dataset[attrName] = dataAttrs[attrName];
  }
  if (typeof child === "string") {
    element.innerHTML = child;
  } else if (isHTMLElement(child)) {
    element.appendChild(child);
  } else if (
    Array.isArray(child) &&
    child.every((node) => isHTMLElement(node) || typeof node === "string")
  ) {
    child.forEach((node) => {
      isHTMLElement(node) && element.appendChild(node);
      typeof node === "string" &&
        element.appendChild(document.createTextNode(node));
    });
  }

  return element;
}

// Example
// const span = createElement("span", "span");
// const p = createElement("p", "p");
// const b = createElement("b", "b", { classes: ["class1", "class2", "class3"] });

// const div = createElement("div", [span, p, b, b, b, "test", span], {
//   classes: "class1 class2 class3",
//   htmlAttrs: {
//     id: "id",
//   },
//   dataAttrs: {
//     test: "test",
//   },
// });
