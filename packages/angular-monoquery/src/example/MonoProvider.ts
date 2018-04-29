import { Injectable } from "@angular/core";

import { ExampleComponent } from "./ExampleComponent";

import { MonoQuery, gql } from "../";

const mockedData = {
  data: {
    hello: "world"
  }
};

@MonoQuery({
  fetcher: mockedData,
  query: () => gql`
    query MainQuery {
      ...SimpleFragment
    }
    ${ExampleComponent.fragments.simpleFragment}
  `
})
@Injectable()
export class MonoProvider {
  constructor() {
    this.fetchData();
  }
}
