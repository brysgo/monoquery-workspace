import { createMonoQuery, gql } from "./";
import graphql from "graphql-tag";
import { print } from "graphql/language";

test("build, run distribute simple query", async () => {
  const fragments = {
    simpleFragment: gql`
      fragment SimpleFragment on Query {
        something
      }
    `,
    withGraphQLTag: graphql`
      fragment AnotherFragment on Query {
        anotherThing
      }
    `
  };
  const monoQuery = createMonoQuery(({ query, variables, operationName }) => {
    expect(print(query)).toMatchSnapshot();
    return Promise.resolve({
      data: {
        hello: "world",
        something: "good",
        anotherThing: "hey"
      }
    });
  });
  const result = await monoQuery({
    query: gql`
      {
        hello
        ...SimpleFragment
        ...AnotherFragment
      }
      ${fragments.simpleFragment}
      ${fragments.withGraphQLTag}
    `
  });
  expect(result.getResultsFor(fragments)).toEqual({
    simpleFragment: { something: "good" },
    withGraphQLTag: { anotherThing: "hey" }
  });
});
