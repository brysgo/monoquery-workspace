import React, { Fragment } from "react";

const ListTrackingContext = React.createContext([]);

export const ListProvider = ({ children }) => {
  if (Array.isArray(children)) {
    return (
      <ListTrackingContext.Consumer>
        {listPath =>
          children.map((child, i) => (
            <ListTrackingContext.Provider key={i} value={[...listPath, i]}>
              {child}
            </ListTrackingContext.Provider>
          ))
        }
      </ListTrackingContext.Consumer>
    );
  } else {
    throw new Error("Children of ListProvider must be an array!");
  }
};

export const ListPathConsumer = ListTrackingContext.Consumer;
