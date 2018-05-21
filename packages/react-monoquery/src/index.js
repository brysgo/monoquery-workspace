import React from "react";
import { Query } from "react-apollo";
import { createMonoQuery, gql } from "monoquery";

try {
  var { ListPathConsumer } = require("react-listpath");
} catch (e) {
  var ListPathConsumer = ({ children }) => children();
}

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
    {data => (
        <ListPathConsumer>
        {listPath => children(data.getResultsFor(fragments, listPath))}
      </ListPathConsumer>
    )}
  </MonoQueryContext.Consumer>
);

export { gql } from "monoquery";
