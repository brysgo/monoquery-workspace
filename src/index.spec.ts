import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { ExampleComponent } from "./example/ExampleComponent";
import { MonoProvider } from "./example/MonoProvider";

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
      tick();
      expect(fixture).toMatchSnapshot();
    })
  );
});
