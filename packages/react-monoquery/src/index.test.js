import React from "react";
import graphql from "graphql-tag";

import { makeExecutableSchema } from "graphql-tools";

import { MockedProvider } from "react-apollo/test-utils";

import { MonoQuery, Fragments, gql } from "./";
import renderer from "react-test-renderer";

const mockedData = {
  currentUser: {
    __typename: "User",
    name: "John Doe",
    email: "user@example.com",
    phone: "5555555555"
  },
  otherThing: {
    __typename: "Thing",
    stuff: "foo"
  }
};

test("build, run distribute simple query", async () => {
  const fragments = {
    testing: graphql`
      fragment TestingTesting on User {
        __typename
        name
        email
        phone
      }
    `
  };
  const query = gql`
    query MainQuery {
      currentUser {
        ...TestingTesting
      }
      otherThing {
        stuff
      }
    }
    ${fragments.testing}
  `;
  let done;
  const promise = new Promise(resolve => (done = resolve));
  const component = renderer.create(
    <MockedProvider
      mocks={[
        {
          request: {
            query: query.parsedQuery
          },
          result: { data: mockedData }
        }
      ]}
    >
      <MonoQuery query={query}>
        {data =>
          data.loading ? (
            <div>loading</div>
          ) : (
            (setTimeout(done, 0),
            (
              <div>
                <Fragments fragments={fragments}>
                  {({testing}) => (<div>{JSON.stringify(testing, null, 2)}</div>)}
                </Fragments>
              </div>
            ))
          )
        }
      </MonoQuery>
    </MockedProvider>
  );
  await promise;
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
