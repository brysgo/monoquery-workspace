import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { createExampleComponent } from "./example/ExampleComponent";
import { createMonoProvider } from "./example/MonoProvider";
import { Observable } from "rxjs/Observable";
import gql from "graphql-path";

describe("MonoQueryModule", () => {
  it(
    "is used to build a MonoProvider",
    fakeAsync(() => {
      const MonoProvider = createMonoProvider({
        fetcher: {
          data: {
            hello: "world"
          }
        }
      });
      const ExampleComponent = createExampleComponent(MonoProvider);
      TestBed.configureTestingModule({
        declarations: [ExampleComponent],
        providers: [MonoProvider]
      });

      const monoProvider = TestBed.get(MonoProvider);
      const fixture = TestBed.createComponent(ExampleComponent);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    })
  );

  it(
    "works when the fetcher returns an observer",
    fakeAsync(() => {
      const MonoProvider = createMonoProvider({
        fetcher: () =>
          Observable.create(function(observer) {
            observer.next({
              data: {
                hello: "world"
              }
            });
            setTimeout(() => {
              observer.next({
                data: {
                  hello: "again"
                }
              });
            }, 1000);
          })
      });
      const ExampleComponent = createExampleComponent(MonoProvider);
      TestBed.configureTestingModule({
        declarations: [ExampleComponent],
        providers: [MonoProvider]
      });

      const monoProvider = TestBed.get(MonoProvider);
      const fixture = TestBed.createComponent(ExampleComponent);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
      tick(2000);
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    })
  );

  it(
    "works when the fetcher returns a promise",
    fakeAsync(() => {
      const MonoProvider = createMonoProvider({
        fetcher: () =>
          Promise.resolve({
            data: {
              hello: "world"
            }
          })
      });
      const ExampleComponent = createExampleComponent(MonoProvider);
      TestBed.configureTestingModule({
        declarations: [ExampleComponent],
        providers: [MonoProvider]
      });

      const monoProvider = TestBed.get(MonoProvider);
      const fixture = TestBed.createComponent(ExampleComponent);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    })
  );
  it(
    "passes through list path resolvers with reference to fragment container",
    fakeAsync(() => {
      const MonoProvider = createMonoProvider({
        query: () => gql`
          query MainQuery {
            ...SimpleFragment
            simpleList {
              ...FragmentInList
            }
          }
          ${ExampleComponent.fragments.simpleFragment}
          ${ExampleComponent.fragments.fragmentInList}
        `,
        listPathResolvers: {
          ListItem: (item, fragmentContainerInstance) => 
             item.keyProp === fragmentContainerInstance.getKeyProp();
 
        },
        fetcher: () =>
          Promise.resolve({
            data: {
              hello: "world",
              simpleList: [
                {
                  __typename: "ListItem",
                  keyProp: "a",
                  message: "hello there"
                },
                {
                  __typename: "ListItem",
                  keyProp: "b",
                  message: "testing, testing, 1, 2, 3..."
                }
              ]
            }
          })
      });
      const ExampleComponent = createExampleComponent(MonoProvider, {
        fragmentInList: gql`
          fragment FragmentInList on ListItem {
            keyProp
            message
          }
        `
      });
      TestBed.configureTestingModule({
        declarations: [ExampleComponent],
        providers: [MonoProvider]
      });

      const monoProvider = TestBed.get(MonoProvider);
      const fixture = TestBed.createComponent(ExampleComponent);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    })
  );
});
