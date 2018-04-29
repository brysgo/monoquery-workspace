import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { ExampleComponent } from "./example/ExampleComponent";
import { MonoProvider } from "./example/MonoProvider";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("MonoQueryModule", () => {
  it(
    "is used to build a MonoProvider",
    fakeAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExampleComponent],
        providers: [MonoProvider]
      });

      const monoProvider = TestBed.get(MonoProvider);
      const fixture = TestBed.createComponent(ExampleComponent);
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    })
  );
});
