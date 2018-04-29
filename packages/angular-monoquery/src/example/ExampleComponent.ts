import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Fragments } from "../";

import gql from "graphql-tag";

import { MonoProvider } from "./MonoProvider";

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
  template: "{{data | async}}"
})
export class ExampleComponent {
  constructor(monoProvider: MonoProvider) {
    this.monoProvider = monoProvider;
  }
}
