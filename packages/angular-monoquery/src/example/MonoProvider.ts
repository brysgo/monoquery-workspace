import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { createMonoQuery, gql } from "monoquery";

import { ExampleComponent } from "./ExampleComponent.ts";

const mockedData = {
  hello: "world"
};

@Injectable()
export class MonoProvider {
  data: any;
  monoQuery: any;
  query: any;

  constructor() {
    this.query = gql`
      query MainQuery {
        ...SimpleFragment
      }
      ${ExampleComponent.fragments.simpleFragment}
    `;

    this.monoQuery = createMonoQuery({ data: mockedData });

    this.getDataFor = this.getDataFor.bind(this);
    this.refetchData = this.refetchData.bind(this);
    this.refetchData();
  }

  refetchData() {
    return (this.data = new Observable(observer => {
      observer.next(this.monoQuery({ query: this.query }));
      observer.complete();
    }));
  }

  getDataFor(comp) {
    return this.data.pipe(map(d => d.getResultsFor(comp.fragments)));
  }
}
