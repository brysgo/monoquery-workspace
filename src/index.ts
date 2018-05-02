import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

import { map, mergeAll } from "rxjs/operators";
import { createMonoQuery } from "monoquery";

export const Fragments = ({
  providerName = "monoProvider",
  fragments
}) => DecoratedComponent => {
  DecoratedComponent.fragments = fragments;
  Object.defineProperty(DecoratedComponent.prototype, "data", {
    get: function data() {
      return this[providerName].getDataFor(DecoratedComponent);
    }
  });
  return DecoratedComponent;
};

export const MonoQuery = ({ fetcher, query, ...options }) => result => {
  result.prototype.fetchData = function fetchData() {
    this.monoQuery =
      this.monoQuery ||
      createMonoQuery((...args) => {
        let result = fetcher;
        if (typeof fetcher === "function") {
          result = fetcher(...args);
        }
        if (result instanceof Observable) {
          return result.toPromise();
        } else {
          return Promise.resolve(result);
        }
      });
    return (this.data = new Observable(observer => {
      observer.next(this.monoQuery({ ...options, query: query() }));
      observer.complete();
    }));
  };
  result.prototype.getDataFor = function getDataFor(comp) {
    return this.data.pipe(
      mergeAll(),
      map((d: any) => d.getResultsFor(comp.fragments))
    );
  };
  return result;
};

export { gql } from "monoquery";
