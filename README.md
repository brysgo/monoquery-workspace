# angular-monoquery

This project is meant to provide a more seamless experience for using [monoquery](https://github.com/brysgo/monoquery) with an Angular project.

As it stands, this project provides two decorators:

1. `MonoQuery`
  Meant to provide an easy way to declair main monoquery provider on which fragments are composed.
2. `Fragments`
  Makes it easier to declair fragments for a component and adds a data instance variable that you can subscribe to for the requested fragments.
  
Note: `angular-monoquery` is not a requirement when using `monoquery` with angular. I have been trying to think of a way to make the API less cumbersome. If you have any ideas leave an issue in the comments, otherwise, it is perfectly acceptable to just use monoquery directly and skip this package.
