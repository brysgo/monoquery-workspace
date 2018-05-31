import tryGet from "./try-get";
describe("tryGet", () => {
  it("gets a data path when it is there", () => {
    expect(tryGet({ a: { b: [{ c: "blah" }] } }, "a.b.0.c")).toEqual("blah");
  });

  it("works with an array path", () => {
    expect(tryGet({ a: { b: [{ c: "blah" }] } }, [ "a","b",0,"c" ])).toEqual("blah");
  });

  it("returns undefined when it isn't", () => {
    expect(tryGet({ a: { b: { c: "blah" } } }, "a.b.0.c")).toEqual(undefined);
  });

  it("falls back to default when third param exists", () => {
    expect(tryGet({ a: { b: { c: "blah" } } }, "a.b.0.c", "default")).toEqual(
      "default"
    );
  });

  describe("optional array path separate from object path", () => {
    it("gets the correct array indexes", () => {
      expect(
        tryGet(
          { a: [{ b: [{ c: "blah" }, {c: "ok"}] }, { b: [{ c: "baz", c: "nope" }] }] },
          "a.b.c",
          null,
          [0,1]
        )
      ).toEqual("ok");
    });
  });

  describe("optional array path resolver turns array into single item", () => {
    it("gets the correct array items", () => {
      const data = { a: [{ b: [{ c: "blah" }, {c: "ok"}] }, { b: [{ c: "baz", c: "nope" }] }] };
      const results = new Map();
      results.set(data.a, 0)
      results.set(data.a[0].b, 1)
      expect(
        tryGet(
          data,
          "a.b.c",
          null,
          (list) => results.get(list)
        )
      ).toEqual("ok");
    });
  });
});
