import { map } from "rxjs/operators";

export const MonoQuery = ({
  providerName = "monoProvider",
  fragments
}) => DecoratedComponent => {
  DecoratedComponent.fragments = fragments;
  Object.defineProperty(DecoratedComponent.prototype, "data", {
    get: function data() {
      return this[providerName]
        .getDataFor(DecoratedComponent)
        .pipe(map(x => JSON.stringify(x)));
    }
  });
  return DecoratedComponent;
};
