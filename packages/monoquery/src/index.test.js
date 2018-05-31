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

test("you can pass data instead of a fetcher", () => {
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
  const monoQuery = createMonoQuery({
    data: {
      hello: "world",
      something: "good",
      anotherThing: "hey"
    }
  });
  const result = monoQuery({
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

test("it can handle null data", () => {
  const fragments = {
    simpleFragment: gql`
      fragment SimpleFragment on Query {
        something
      }
    `
  };
  const monoQuery = createMonoQuery({
    data: {}
  });
  const result = monoQuery({
    query: gql`
      {
        aThingThatIsNull {
          ...SimpleFragment
        }
      }
      ${fragments.simpleFragment}
    `
  });
  expect(result.getResultsFor(fragments)).toEqual({
    simpleFragment: {}
  });
});

describe("when fragments are nested", () => {
  it("masks data from child fragments", () => {
    const maskedChildFragment = gql`
      fragment MaskedChild on Query {
        cantSeeThis
      }
    `;
    const visibleFragmentData = gql`
      fragment VisibleData on Query {
        thisShouldBeVisible
        ...MaskedChild
      }
      ${maskedChildFragment}
    `;
    const monoQuery = createMonoQuery({
      data: {
        thisShouldBeVisible: "yay, it is!",
        cantSeeThis: "darn, there it is..."
      }
    });
    const result = monoQuery({
      query: gql`
        {
          ...VisibleData
        }
        ${visibleFragmentData}
      `
    });
    expect(result.getResultsFor({ visibleFragmentData })).toEqual({
      visibleFragmentData: {
        thisShouldBeVisible: "yay, it is!"
      }
    });
  });
});

describe("when fragments are nested under lists", () => {
  it("follows the list index parameters passed", () => {
    const fragments = {
      fragmentInLists: gql`
        fragment FragmentInLists on Query {
          something
        }
      `
    };
    const createListItem = name => ({
      anotherList: [{ something: name + "1" }, { something: name + "2" }]
    });
    const monoQuery = createMonoQuery({
      data: {
        someList: [createListItem("A"), createListItem("B")]
      }
    });
    const result = monoQuery({
      query: gql`
        {
          someList {
            anotherList {
              ...FragmentInLists
            }
          }
        }
        ${fragments.fragmentInLists}
      `
    });
    expect(result.getResultsFor(fragments, [1, 0])).toEqual({
      fragmentInLists: {
        something: "B1"
      }
    });
  });
  it("throws an error when there are no list indexes", () => {
    const fragments = {
      fragmentInLists: gql`
        fragment FragmentInLists on Query {
          something
        }
      `
    };
    const monoQuery = createMonoQuery({
      data: {
        someList: [{ aThing: { something: "foo" } }]
      }
    });
    const result = monoQuery({
      query: gql`
        {
          someList {
            aThing {
              ...FragmentInLists
            }
          }
        }
        ${fragments.fragmentInLists}
      `
    });
    expect(() => result.getResultsFor(fragments)).toThrow(
      "Array path provided was not long enough"
    );
  });
  it("accepts list path resolvers (by type) instead of a list path", () => {
    const fragments = {
      fragmentInLists: gql`
        fragment FragmentInLists on Query {
          something
        }
      `
    };
    const createListItem = name => ({
      __typename: "SomeListItem",
      name,
      anotherList: [
        { __typename: "AnotherListItem", something: name + "1" },
        { __typename: "AnotherListItem", something: name + "2" }
      ]
    });
    const monoQuery = createMonoQuery({
      data: {
        __typename: "SomeList",
        someList: [createListItem("A"), createListItem("B")]
      }
    });
    const result = monoQuery({
      query: gql`
        {
          someList {
            name
            anotherList {
              ...FragmentInLists
            }
          }
        }
        ${fragments.fragmentInLists}
      `
    });
    expect(
      result.getResultsFor(fragments, {
        SomeListItem: arg => arg.name === "B",
        AnotherListItem: arg => arg.something === "B1"
      })
    ).toEqual({
      fragmentInLists: {
        something: "B1"
      }
    });
  });
});
