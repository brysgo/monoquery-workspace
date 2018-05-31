"use strict";

module.exports = function(object, path, otherwise, arrayPath) {
  if (path && typeof path === "string") path = path.split(".");
  if (arrayPath && typeof arrayPath === "string")
    arrayPath = arrayPath.split(".");

  if (object === null || object === undefined) return otherwise;

  if (!path) return object;

  var totalLength = path.length;

  var current = object;
  var prop;

  var i = 0,
    j = 0;
  while (i < totalLength || Array.isArray(current)) {
    if (!!arrayPath && Array.isArray(current)) {
      if (typeof arrayPath === "function") {
        prop = arrayPath(current);
        if (!(prop < current.length))
          throw new Error(
            "currentArray[" +
              prop +
              "] does not exist, check your array path resolver"
          );
      } else {
        if (j > arrayPath.length - 1)
          throw new Error("Array path provided was not long enough");
        prop = arrayPath[j];
        j++;
      }
    } else {
      prop = path[i];
      i++;
    }
    if (current[prop] === null || current[prop] === undefined) return otherwise;
    current = current[prop];
  }

  return current;
};
