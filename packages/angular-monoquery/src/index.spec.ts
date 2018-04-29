import { HttpClientModule } from "@angular/common/http";
import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";

import { TestBed } from "@angular/core/testing";

import gql from "graphql-tag";

import { MonoQueryModule } from "./";

describe("MonoQueryModule", () => {
  it("does things", async () => {
    const FakeModule = { fragments: { aFragment: `` } };
    const FakeMonoProvider = MonoQueryModule.forChild(FakeModule);
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        MonoQueryModule.forRoot()
      ],
      providers: [
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        FakeMonoProvider
      ]
    });
    fakeMonoProvider = TestBed.get(FakeMonoProvider);
    expect(await fakeMonoProvider).toMatchSnapshot();
  });
});
