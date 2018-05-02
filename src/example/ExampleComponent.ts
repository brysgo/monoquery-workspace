import { Component, Inject, forwardRef } from "@angular/core";
import { map } from "rxjs/operators";
import { Fragments } from "../";

import gql from "graphql-tag";

export const createExampleComponent = MonoProvider => {
  @Fragments({
    fragments: {
      simpleFragment: gql`
        fragment SimpleFragment on Query {
          hello
        }
      `
    }
  })
  @Component({
    selector: "example-component",
    template: "{{jsonData | async}}"
  })
  class ExampleComponent {
    jsonData: string;
    constructor(
      @Inject(forwardRef(() => MonoProvider))
      monoProvider: MonoProvider
    ) {
      this.monoProvider = monoProvider;
      this.jsonData = this.data.pipe(map(d => JSON.stringify(d)));
    }
  }
  return ExampleComponent;
};
