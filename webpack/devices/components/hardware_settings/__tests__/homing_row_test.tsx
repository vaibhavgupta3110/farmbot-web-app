const mockDevice = {
  findHome: jest.fn()
};

jest.mock("../../../../device", () => ({
  getDevice: () => (mockDevice)
}));
import * as React from "react";
import { mount } from "enzyme";
import { HomingRow } from "../homing_row";
import { bot } from "../../../../__test_support__/fake_state/bot";

describe("<HomingRow />", () => {
  beforeEach(function () {
    jest.clearAllMocks();
  });
  // TODO: fix this test
  //       Code being run is {t("HOME {{axis}}", { axis })}
  //       Result string is "HOME {{axis}}HOME {{axis}}HOME {{axis}}"
  xit("renders three buttons", () => {
    const wrapper = mount(<HomingRow hardware={bot.hardware.mcu_params} />);
    const txt = wrapper.text();
    ["X", "Y", "Z"].map(function (axis) {
      expect(txt).toContain(`HOME ${axis}`);
    });
  });
  it("calls device", () => {
    const result = mount(<HomingRow hardware={bot.hardware.mcu_params} />);
    [0, 1, 2].map(i =>
      result.find("LockableButton").at(i).simulate("click"));
    [{ axis: "x", speed: 100 }, { axis: "y", speed: 100 }].map(x =>
      expect(mockDevice.findHome).toHaveBeenCalledWith(x));
  });
});
