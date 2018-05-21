import React from "react";

import renderer from "react-test-renderer";

import { ListProvider, ListPathConsumer } from "./";

test("complex list path example", () => {
  const component = renderer.create(
    <div>
      <ListProvider>
        {[0, 1, 2, 3].map(i => (
          <div key={i}>
            <ListProvider>
              {[0, 1, 2, 3].map(i => (
                <ListPathConsumer key={i}>
                  {listPath => <div>{JSON.stringify(listPath)}</div>}
                </ListPathConsumer>
              ))}
            </ListProvider>
          </div>
        ))}
      </ListProvider>
    </div>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
