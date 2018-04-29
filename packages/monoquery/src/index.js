import tryGet from "try-get";
import { filter } from "graphql-anywhere";

export const createMonoQuery = fetcherOrData => graphqlQueryParams => {
  const { query: inputQuery, ...rest } = graphqlQueryParams;
  const { fragmentPaths, fragmentNames, parsedQuery } = inputQuery;
  const resultsFromData = data => ({
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
  });
  if (typeof fetcherOrData === "function") {
    return fetcherOrData({ query: parsedQuery, ...rest }).then(({ data }) =>
      resultsFromData(data)
    );
  } else {
    return resultsFromData(fetcherOrData.data);
  }
};

export { default as gql } from "graphql-path";
