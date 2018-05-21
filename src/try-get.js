'use strict'

module.exports = function (object, path, otherwise, arrayPath) {
  if (path && typeof path === "string") path = path.split('.')
  if (arrayPath && typeof arrayPath === "string") arrayPath = arrayPath.split('.')

  if (object === null || object === undefined) return otherwise

  if (!path) return object
  else {
    var totalLength = path.length;
  }
  if (!!arrayPath) totalLength = totalLength + arrayPath.length;

  var current = object
  var prop

  var i = 0, j = 0;
  while (i + j < totalLength) {
    if (!!arrayPath && Array.isArray(current)) {
      if (j > (arrayPath.length - 1)) throw new Error("Array path provided was not long enough");
      prop = arrayPath[j]
      j++;
    } else {
      prop = path[i]
      i++;
    }
    if (current[prop] === null || current[prop] === undefined) return otherwise
    current = current[prop]
  }

  return current
}