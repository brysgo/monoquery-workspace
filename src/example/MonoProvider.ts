import { Injectable } from "@angular/core";

import { createExampleComponent } from "./ExampleComponent";
const ExampleComponent = createExampleComponent();

import { MonoQuery, gql } from "../";

@Injectable()
class MonoProvider {
  fetchData: any;
  constructor() {
    this.fetchData();
  }
}
export const createMonoProvider = options => {
  return MonoQuery({
    query: () => gql`
      query MainQuery {
        ...SimpleFragment
      }
      ${ExampleComponent.fragments.simpleFragment}
    `,
    ...options
  })(MonoProvider);
};
