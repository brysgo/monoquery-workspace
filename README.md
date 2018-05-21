# React ListPath

[![CircleCI](https://circleci.com/gh/brysgo/react-listpath.svg?style=shield)](https://circleci.com/gh/brysgo/react-listpath)

_Let me start by saying I have no clue how this will be useful to you. For me, it is useful in the context of `react-monoquery` where you get graphql data encapsulation without having to pass down your data._

Say you have a component that sits in a couple nested lists. You don't feel like using any fancy data frameworks, and you don't want to have to pass indexes through react just to know what data to get from your component.

=> React List Path <=

It lets you wrap your lists with a `ListProvider` and then in your items, you can use the `ListPathConsumer` that will get back a render prop with an array of indexes.

## Usage

`yarn add react-listpath`

Then wrap the lists you want to track.

```jsx
const myData = [...];

const MyItem = ({someData}) => (<div>
  {someData}
</div>);

const MyPage = () => (
  myData.map((moreData) =>
    <div>{moreData.anotherList.map((someData) =>
      <MyItem someData={someData}/>
    )}</div>
 )
);
```

Could become:

```jsx
import { ListProvider, ListPathConsumer } from "react-listpath";

const myData = [];

const MyItem = ({ someData }) => (<ListPathConsumer>
  {listPath => <div>{myData[listPath[0]].anotherList[listPath[1]]}</div>}
</ListPathConsumer>);

const MyPage = () => (
  <ListProvider>
    myData.map((moreData) =>
    <div>
      <ListProvider>
        {moreData.anotherList.map((someData) =>
          <MyItem />
        )}
      </ListProvider>
    </div>
    )
 </ListProvider>
);
```

Why should I care about this? The example above doesn't give me any superpowers, it actually looks uglier the second way. However, in the context of `react-monoquery` I will not need to use the `ListPathConsumer`, since it will be queried for me, I just need to use the `ListProvider`, and then when I use the `Fragments` component my fragments will get me the right data magically without having to pass anything around. Fully declarative, single query composed react data without having to pass around props.