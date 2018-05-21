import tryGet from "./try-get";
import graphql from "graphql-anywhere";

// custom graphql filter to avoid following fragments
export function filter(doc, data) {
  const resolver = (fieldName, root, args, context, info) => {
    return root[info.resultKey];
  };

  return graphql(resolver, doc, data, null, null, {
    fragmentMatcher: () => false
  });
}

export const createMonoQuery = fetcherOrData => graphqlQueryParams => {
  const { query: inputQuery, ...rest } = graphqlQueryParams;
  const { fragmentPaths, fragmentNames, parsedQuery } = inputQuery;
  const resultsFromData = data => ({
    getResultsFor: (fragments, arrayPath = []) =>
      Object.keys(fragments).reduce(
        (acc, key) => (
          (acc[key] = filter(
            fragments[key].parsedQuery || fragments[key],
            tryGet(
              data,
              fragmentPaths[fragmentNames.get(fragments[key])],
              {},
              arrayPath
            )
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
