import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/fromPromise";

import { map } from "rxjs/operators";
import { createMonoQuery } from "monoquery";

export const Fragments = ({
  providerName = "monoProvider",
  fragments
}) => DecoratedComponent => {
  DecoratedComponent.fragments = fragments;
  Object.defineProperty(DecoratedComponent.prototype, "data", {
    get: function data() {
      Object.defineProperty(this, "data", {
        value: this[providerName].getDataFor(DecoratedComponent),
        writable: false
      });
      return this.data;
    }
  });
  return DecoratedComponent;
};

export const MonoQuery = ({
  fetcher,
  query: queryFn,
  ...options
}) => result => {
  result.prototype.fetchData = function fetchData() {
    const query = queryFn();
    let result = fetcher;
    if (typeof fetcher === "function") {
      result = fetcher({ ...options, query });
    }
    if (result instanceof Observable) {
      this.monoQuery = result.pipe(map(d => createMonoQuery(d)({ query })));
    } else if (result instanceof Promise) {
      this.monoQuery = Observable.fromPromise(
        result.then(d => createMonoQuery(d)({ query }))
      );
    } else {
      this.monoQuery = Observable.of(createMonoQuery(result)({ query }));
    }
    return this.monoQuery;
  };
  result.prototype.getDataFor = function getDataFor(comp) {
    return this.monoQuery.pipe(
      map((d: any) => d.getResultsFor(comp.fragments))
    );
  };
  return result;
};

export { gql } from "monoquery";
