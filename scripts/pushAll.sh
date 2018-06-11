#!/bin/bash

git push
git subtree push monoquery master --prefix=packages/monoquery
git subtree push graphql-path master --prefix=packages/graphql-path
git subtree push angular-monoquery master --prefix=packages/angular-monoquery
git subtree push react-listpath master --prefix=packages/react-listpath
git subtree push react-monoquery master --prefix=packages/react-monoquery