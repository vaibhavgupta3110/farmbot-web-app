jest.mock("react-redux", () => ({
  connect: jest.fn()
}));

const mockStorj: Dictionary<number | boolean> = {};

jest.mock("../../session", () => {
  return {
    Session: {
      deprecatedGetNum: (k: string) => {
        return mockStorj[k];
      },
      deprecatedSetNum: (k: string, v: number) => {
        mockStorj[k] = v;
      },
      deprecatedGetBool: (k: string) => {
        mockStorj[k] = !!mockStorj[k];
        return mockStorj[k];
      }
    },
    // tslint:disable-next-line:no-any
    safeNumericSetting: (x: any) => x

  };
});

import * as React from "react";
import { mount } from "enzyme";
import { Logs } from "../index";
import { ToolTips } from "../../constants";
import { TaggedLog, SpecialStatus } from "../../resources/tagged_resources";
import { Log } from "../../interfaces";
import { generateUuid } from "../../resources/util";
import { bot } from "../../__test_support__/fake_state/bot";
import { Dictionary } from "farmbot";
import { NumericSetting } from "../../session_keys";

describe("<Logs />", () => {
  function fakeLogs(): TaggedLog[] {
    const logs: Log[] = [{
      id: 1,
      created_at: -1,
      message: "Fake log message 1",
      meta: {
        type: "info"
      },
      channels: []
    },
    {
      id: 2,
      created_at: -1,
      message: "Fake log message 2",
      meta: {
        type: "success"
      },
      channels: []
    }];
    return logs.map((body: Log): TaggedLog => {
      return {
        kind: "Log",
        uuid: generateUuid(body.id, "Log"),
        specialStatus: SpecialStatus.SAVED,
        body
      };
    });
  }

  it("renders", () => {
    const wrapper = mount(<Logs logs={fakeLogs()} bot={bot} timeOffset={0} />);
    ["Logs", ToolTips.LOGS, "Type", "Message", "Time", "Info",
      "Fake log message 1", "Success", "Fake log message 2"]
      .map(string =>
        expect(wrapper.text().toLowerCase()).toContain(string.toLowerCase()));
    const filterBtn = wrapper.find("button").first();
    expect(filterBtn.text().toLowerCase()).toEqual("filters active");
    expect(filterBtn.hasClass("green")).toBeTruthy();
  });

  it("filters logs", () => {
    const wrapper = mount(<Logs logs={fakeLogs()} bot={bot} timeOffset={0} />);
    wrapper.setState({ info: 0 });
    expect(wrapper.text()).not.toContain("Fake log message 1");
    const filterBtn = wrapper.find("button").first();
    expect(filterBtn.text().toLowerCase()).toEqual("filters active");
    expect(filterBtn.hasClass("green")).toBeTruthy();
  });

  it("shows position", () => {
    const logs = fakeLogs();
    logs[0].body.meta.x = 100;
    logs[1].body.meta.x = 0;
    logs[1].body.meta.y = 1;
    logs[1].body.meta.z = 2;
    const wrapper = mount(<Logs logs={logs} bot={bot} timeOffset={0} />);
    expect(wrapper.text()).toContain("Unknown");
    expect(wrapper.text()).toContain("0, 1, 2");
  });

  it("shows verbosity", () => {
    const logs = fakeLogs();
    logs[0].body.meta.verbosity = -999;
    const wrapper = mount(<Logs logs={logs} bot={bot} timeOffset={0} />);
    expect(wrapper.text()).toContain(-999);
  });

  it("loads filter setting", () => {
    mockStorj[NumericSetting.warn_log] = 3;
    const wrapper = mount(<Logs logs={fakeLogs()} bot={bot} timeOffset={0} />);
    expect(wrapper.state().warn).toEqual(3);
  });

  it("shows overall filter status", () => {
    const wrapper = mount(<Logs logs={fakeLogs()} bot={bot} timeOffset={0} />);
    wrapper.setState({
      success: 3, busy: 3, warn: 3, error: 3, info: 3, fun: 3, debug: 3
    });
    const filterBtn = wrapper.find("button").first();
    expect(filterBtn.text().toLowerCase()).toEqual("filter");
    expect(filterBtn.hasClass("gray")).toBeTruthy();
  });

  it("toggles filter", () => {
    mockStorj[NumericSetting.warn_log] = 3;
    const wrapper = mount(<Logs logs={fakeLogs()} bot={bot} timeOffset={0} />);
    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any;
    expect(wrapper.state().warn).toEqual(3);
    instance.toggle("warn")();
    expect(wrapper.state().warn).toEqual(0);
    instance.toggle("warn")();
    expect(wrapper.state().warn).toEqual(1);
  });

  it("sets filter", () => {
    mockStorj[NumericSetting.warn_log] = 3;
    const wrapper = mount(<Logs logs={fakeLogs()} bot={bot} timeOffset={0} />);
    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any;
    expect(wrapper.state().warn).toEqual(3);
    instance.setFilterLevel("warn")(2);
    expect(wrapper.state().warn).toEqual(2);
  });
});
