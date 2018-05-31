import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

import { map, switchMap } from "rxjs/operators";
import { createMonoQuery } from "monoquery";

export const Fragments = ({
  providerName = "monoProvider",
  fragments
}) => DecoratedComponent => {
  DecoratedComponent.fragments = fragments;
  Object.defineProperty(DecoratedComponent.prototype, "data", {
    get: function data() {
      Object.defineProperty(this, "data", {
        value: this[providerName].getDataFor(DecoratedComponent, this),
        writable: false
      });
      return this.data;
    }
  });
  return DecoratedComponent;
};

export const MonoQuery = ({
  fetcher,
  listPathResolvers = {},
  query: queryFn,
  ...options
}) => result => {
  let firstFetch = false;
  const observable = Observable.of(null).pipe(
    switchMap(() =>
      Observable.create(observer => {
        result.prototype.fetchData = function fetchData() {
          const query = queryFn();
          let result = fetcher;
          if (typeof fetcher === "function") {
            result = fetcher({ ...options, query: query.parsedQuery });
          }
          if (result instanceof Observable || !!result[Symbol.observable]) {
            result.subscribe(d => observer.next(createMonoQuery(d)({ query })));
          } else if (result instanceof Promise) {
            result.then(d => observer.next(createMonoQuery(d)({ query })));
          } else {
            observer.next(createMonoQuery(result)({ query }));
          }
          return observer;
        };
        if (firstFetch) result.prototype.fetchData();
      })
    )
  );
  result.prototype.fetchData = function fetchDataLoading() {
    firstFetch = true;
    return observable;
  };
  result.prototype.getDataFor = function getDataFor(comp, compInstance) {
    const injectedListPathResolvers = {};
    Object.keys(listPathResolvers).forEach(
      listPathTypeKey =>
        (injectedListPathResolvers[listPathTypeKey] = (...args) =>
          listPathResolvers[listPathTypeKey](...args, compInstance))
    );
    return observable.pipe(
      map((d: any) =>
        d.getResultsFor(comp.fragments, injectedListPathResolvers)
      )
    );
  };
  return result;
};

export { gql } from "monoquery";
