import React from "react";
import graphql from "graphql-tag";

import { makeExecutableSchema } from "graphql-tools";
import { MockedProvider } from "react-apollo/test-utils";

import { MonoQuery, Fragments, gql } from "./";
import renderer from "react-test-renderer";

import { ListProvider } from "react-listpath";

const mockedData = {
  currentUser: {
    __typename: "User",
    name: "John Doe",
    email: "user@example.com",
    phone: "5555555555",
    orders: [
      {
        __typename: "Order",
        address: "1 North Pole",
        items: [
          {
            __typename: "Item",
            name: "only one thing"
          }
        ]
      },
      {
        __typename: "Order",
        address: "123 Street Street, Place, Country 12345",
        items: [
          {
            __typename: "Item",
            name: "Super cool stuff"
          },
          {
            __typename: "Item",
            name: "really cool nested thing"
          }
        ]
      }
    ]
  },
  otherThing: {
    __typename: "Thing",
    stuff: "foo"
  }
};

describe("when react-listpath is not installed", () => {
  beforeAll(() => {
    jest.mock("react-listpath", () => {
      throw new Error("Cannot find module 'react-listpath'");
    });
  });
  afterAll(() => {
    jest.unmock("react-listpath");
  });

  it("can build, run distribute simple query", async () => {
    const other = gql`
      fragment Other on User {
        email
      }
    `
    const fragments = {
      other,
      testing: gql`
        fragment TestingTesting on User {
          __typename
          name
          ...Other      
          phone
        }
        ${other}
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
                    {({ testing, other }) => (
                      <div>
                      <div>{JSON.stringify(testing, null, 2)}</div>
                      <div>{JSON.stringify(other, null, 2)}</div>
                      </div>
                    )}
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
});

describe("with react-listpath", () => {
  it("supports nesting fragments in lists", async () => {
    const item = gql`
      fragment ItemFragment on Item {
        __typename
        name
      }
    `;
    const testing = gql`
      fragment AnotherTest on User {
        __typename
        name
        email
        phone
        orders {
          items {
            ...ItemFragment
          }
        }
      }
      ${item}
    `;
    const query = gql`
      query MainQuery {
        currentUser {
          ...AnotherTest
        }
        otherThing {
          stuff
        }
      }
      ${testing}
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
                  <Fragments fragments={{ testing }}>
                    {({ testing }) => (
                      <div>
                        {JSON.stringify(testing, null, 2)}
                        <div>
                          <ListProvider>
                            {testing.orders.map(({ items }, i) => (
                              <ListProvider key={i}>
                                {items.map((x, j) => (
                                  <Fragments key={j} fragments={{ item }}>
                                    {({ item: { name } }) => <div>{name}</div>}
                                  </Fragments>
                                ))}
                              </ListProvider>
                            ))}
                          </ListProvider>
                        </div>
                      </div>
                    )}
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
});
