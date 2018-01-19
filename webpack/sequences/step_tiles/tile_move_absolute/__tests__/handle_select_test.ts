import { handleSelect } from "../handle_select";
import { fakeResourceIndex } from "../test_helpers";

describe("handleSelect()", () => {
  it("returns location data: point", () => {
    const location = handleSelect(fakeResourceIndex(),
      {
        headingId: "GenericPointer",
        label: "Map Point: Point 1 (10, 20, 30) ",
        value: 2
      });
    expect(location).toEqual({
      kind: "point", args: { pointer_id: 2, pointer_type: "GenericPointer" }
    });
  });

  it("returns location data: tool", () => {
    const location = handleSelect(fakeResourceIndex(),
      {
        headingId: "Tool",
        label: "Tool: Generic Tool",
        value: 1
      });
    expect(location).toEqual({ kind: "tool", args: { tool_id: 1 } });
  });

  it("returns location data: default", () => {
    const location = handleSelect(fakeResourceIndex(),
      { label: "None", value: "" });
    expect(location).toEqual({
      kind: "coordinate", args: { x: 0, y: 0, z: 0 }
    });
  });

  it("returns location data: ToolSlot", () => {
    const location = handleSelect(fakeResourceIndex(),
      {
        headingId: "ToolSlot",
        label: "Map Point: Point 1 (10, 20, 30) ",
        value: 3
      });
    expect(location).toEqual({
      kind: "point", args: { pointer_id: 3, pointer_type: "ToolSlot" }
    });
  });
});
