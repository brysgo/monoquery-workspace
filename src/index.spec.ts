import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { createExampleComponent } from "./example/ExampleComponent";
import { createMonoProvider } from "./example/MonoProvider";

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
          of({
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
});
