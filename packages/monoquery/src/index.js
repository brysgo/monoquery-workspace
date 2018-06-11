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
    getResultsFor: (fragments, arrayPathOrResolvers = []) =>
      Object.keys(fragments).reduce(
        (acc, key) => (
          (acc[key] = filter(
            fragments[key].parsedQuery || fragments[key],
            tryGet(
              data,
              fragmentPaths[fragmentNames.get(fragments[key])],
              {},
              typeof arrayPathOrResolvers === "string" ||
              Array.isArray(arrayPathOrResolvers)
                ? arrayPathOrResolvers
                : currentArray =>
                    currentArray.indexOf(
                      currentArray.find((item, i) =>
                        tryGet(arrayPathOrResolvers, item.__typename, () => {
                          throw new Error(
                            "Missing list path resolver for: " + item.__typename
                          );
                        })(item, i)
                      )
                    )
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
