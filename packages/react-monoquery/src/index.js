import React from "react";
import { Query } from "react-apollo";
import { createMonoQuery, gql } from "monoquery";

const MonoQueryContext = React.createContext("monoquery");

export const MonoQuery = ({ children, query, ...rest }) => (
  <Query query={query.parsedQuery} {...rest}>
    {({ loading, error, data }) => (
      <MonoQueryContext.Provider
        value={createMonoQuery({ data })({
          query,
          ...rest
        })}
      >
        {children({ loading, error, data })}
      </MonoQueryContext.Provider>
    )}
  </Query>
);

export const Fragments = ({ fragments, children }) => (
  <MonoQueryContext.Consumer>
    {data => children(data.getResultsFor(fragments))}
  </MonoQueryContext.Consumer>
);

export { gql } from "monoquery";
