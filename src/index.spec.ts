import { HttpClientModule } from "@angular/common/http";
import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";


import { TestBed } from "@angular/core/testing";

import gql from "graphql-tag";

describe("MonoQueryProvider", () => {
  let monoQueryProvider: MonoQueryProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ApolloModule, HttpLinkModule],
      providers: [
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        MonoQueryProvider
      ]
    });
    monoQueryProvider = TestBed.get(MonoQueryProvider);
  });

  it("should exist", () => {
    expect(monoQueryProvider).toBeDefined();
  });

  it("should use HttpClient", async () => {
    await monoQueryProvider.fetchData();
  });
});
