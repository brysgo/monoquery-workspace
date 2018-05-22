# monoquery

[![CircleCI][build-badge]][build]
[![npm package][npm-badge]][npm]

[build-badge]: https://circleci.com/gh/brysgo/monoquery.svg?style=svg
[build]: https://circleci.com/gh/brysgo/monoquery

[npm-badge]: https://img.shields.io/npm/v/monoquery.png?style=flat-square
[npm]: https://www.npmjs.org/package/monoquery

## What is this for?

Monoquery lets you compose fragments from a bunch of different places, then grab the data relevant to a specific fragment (or group of fragments). It lets you skip having to navigate to where the data lives in the query, grab the data, and filter out the data that the requestor didn't ask for.

This gives you the strong encapsulation of RelayJS with the lightwight Unix Philosophy of Apollo.

## Why is this useful?

Q: "I've been reading that you should just execute all your queries in a granular fasion as you need them."

A: In an ideal world, that would be great, then we wouldn't need to do any of this confusing fragment composition and we can keep things simple. In reality, life is messy, sometimes we have constraints where we can't put loaders on all our components and we just need the data when the app loads.

Q: What's encapsulation and why do I need it?

A: Think of your code like a network. Each node is a file in your codebase. Now lets pretend that every file of your codebase only relied on knowledge from two other files in the code. That doesn't seem so difficult to manage does it? Think again. With that kind of complexity, assuming you have a bad memory for what code you aren't presently looking at does, a 250 file program would require more flipping back and forth more times than there are atoms in the known universe. As of writing this, the number of JS files in this project was 2,4971. Encapsulation fixes this problem by making sure that you only need to understand what is happening right in front of you. By avoiding reaching into the function of unrelated components, it saves you from getting into a mess you may never get out of.

## Usage

Before you start, I suggest if you are using **Angular** or **React** you start with `angular-monoquery` or `react-monoquery` respectively.

> `yarn add monoquery graphql-path`

```javascript
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

```

The result is an object you can use to request fragments from.

```javascript
> result.getResultsFor(fragments)
{
  simpleFragment: { something: "good" },
  withGraphQLTag: { anotherThing: "hey" }
}
```

You can also replace argument in the call to `createMonoQuery` with a function that fetches the data and returns a promise.

```javascript
const monoQuery = createMonoQuery(({ query, variables, operationName }) => {
  return Promise.resolve({
    data: {
      hello: "world",
      something: "good",
      anotherThing: "hey"
    }
  });
});
```

Finally, if your fragment is nested in a list, we don't know which list item you are talking about! Pass an array of list indexes and we can't get you the data you need.

```javascript
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
```

```javascript
> result.getResultsFor(fragments, [1, 0])
{
  fragmentInLists: {
    something: "B1"
  }
}
```
