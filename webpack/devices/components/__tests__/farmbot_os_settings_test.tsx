let mockReleaseNoteData = {};
jest.mock("axios", () => ({
  default: {
    get: jest.fn(() => { return Promise.resolve(mockReleaseNoteData); })
  }
}));

import * as React from "react";
import { FarmbotOsSettings } from "../farmbot_os_settings";
import { mount } from "enzyme";
import { bot } from "../../../__test_support__/fake_state/bot";
import { fakeResource } from "../../../__test_support__/fake_resource";
import { FbosDetails } from "../fbos_settings/farmbot_os_row";
import { FarmbotOsProps } from "../../interfaces";
import axios from "axios";

describe("<FarmbotOsSettings/>", () => {
  function fakeProps(): FarmbotOsProps {
    return {
      account: fakeResource("Device", { id: 0, name: "", tz_offset_hrs: 0 }),
      dispatch: jest.fn(),
      bot: bot,
      botToMqttStatus: "up"
    };
  }

  it("renders settings", () => {
    const osSettings = mount(<FarmbotOsSettings {...fakeProps() } />);
    expect(osSettings.find("input").length).toBe(1);
    expect(osSettings.find("button").length).toBe(6);
    ["NAME", "TIME ZONE", "LAST SEEN", "FARMBOT OS", "CAMERA", "FIRMWARE"]
      .map(string => expect(osSettings.text()).toContain(string));
  });

  it("fetches OS release notes", async () => {
    mockReleaseNoteData = { data: "intro\n\n# v6\n\n* note" };
    const osSettings = await mount(<FarmbotOsSettings {...fakeProps() } />);
    await expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("RELEASE_NOTES.md"));
    expect(osSettings.state().osReleaseNotes)
      .toEqual("# FarmBot OS v6\n* note");
  });

  it("doesn't fetch OS release notes", async () => {
    mockReleaseNoteData = { data: "empty notes" };
    const osSettings = await mount(<FarmbotOsSettings {...fakeProps() } />);
    await expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("RELEASE_NOTES.md"));
    expect(osSettings.state().osReleaseNotes)
      .toEqual("Could not get release notes.");
  });
});

describe("<FbosDetails />", () => {
  it("renders", () => {
    const wrapper = mount(<FbosDetails {...bot} />);
    ["Environment: ---",
      "Commit: ---",
      "Target: ---",
      "Node name: ---",
      "Firmware: "].map(string =>
        expect(wrapper.text()).toContain(string));
  });
});
