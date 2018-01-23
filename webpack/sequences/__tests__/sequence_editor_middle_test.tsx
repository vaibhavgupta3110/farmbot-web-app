import * as React from "react";
import { SequenceEditorMiddle } from "../sequence_editor_middle";
import { mount } from "enzyme";
import { SequenceEditorMiddleProps } from "../interfaces";
import {
  FAKE_RESOURCES, buildResourceIndex
} from "../../__test_support__/resource_index_builder";
import { fakeSequence } from "../../__test_support__/fake_state/resources";

describe("<SequenceEditorMiddle/>", () => {
  function fakeProps(): SequenceEditorMiddleProps {
    return {
      dispatch: jest.fn(),
      sequence: fakeSequence(),
      resources: buildResourceIndex(FAKE_RESOURCES).index,
      syncStatus: "synced",
      consistent: true,
      autoSyncEnabled: false
    };
  }

  it("active editor", () => {
    const wrapper = mount(<SequenceEditorMiddle {...fakeProps() } />);
    expect(wrapper.text()).toContain("Delete");
  });

  it("inactive editor", () => {
    const p = fakeProps();
    p.sequence = undefined;
    const wrapper = mount(<SequenceEditorMiddle {...p } />);
    expect(wrapper.text()).toContain("No Sequence selected");
  });
});
