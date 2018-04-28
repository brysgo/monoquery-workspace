import tryGet from "try-get";
import { filter } from "graphql-anywhere";
import graphqlPath from "graphql-path";

export const createMonoQuery = graphqlFetcher => graphqlQueryParams => {
  const { query: inputQuery, ...rest } = graphqlQueryParams;
  const graphqlPathResults = inputQuery.parsedQuery
    ? inputQuery
    : graphqlPath([inputQuery]);
  const { fragmentPaths, fragmentNames, parsedQuery } = graphqlPathResults;
  return graphqlFetcher({ query: parsedQuery, ...rest }).then(({data}) => ({
    getResultsFor: fragments =>
      Object.keys(fragments).reduce(
        (acc, key) => (
          (acc[key] = filter(
            fragments[key].parsedQuery || fragments[key],
            tryGet(data, fragmentPaths[fragmentNames.get(fragments[key])])
          )),
          acc
        ),
        {}
      )
  }));
};

export { default as gql } from "graphql-path";
