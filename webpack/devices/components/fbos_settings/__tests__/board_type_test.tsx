const mockDevice = {
  updateConfig: jest.fn(() => { return Promise.resolve(); })
};

jest.mock("../../../../device", () => ({
  getDevice: () => (mockDevice)
}));
const mockToast = jest.fn();
jest.mock("farmbot-toastr", () => ({
  success: mockToast,
  info: mockToast,
  error: mockToast
}));

import * as React from "react";
import { mount, shallow } from "enzyme";
import { BoardType } from "../board_type";

describe("<BoardType/>", () => {
  it("Farmduino", () => {
    const wrapper = mount(<BoardType
      firmwareVersion={"5.0.3.F"} />);
    expect(wrapper.text()).toContain("Farmduino");
  });

  it("Arduino/RAMPS", () => {
    const wrapper = mount(<BoardType
      firmwareVersion={"5.0.3.R"} />);
    expect(wrapper.text()).toContain("Arduino/RAMPS");
  });

  it("Other", () => {
    const wrapper = mount(<BoardType
      firmwareVersion={"4.0.2"} />);
    expect(wrapper.text()).toContain("Arduino/RAMPS");
  });

  it("Undefined", () => {
    const wrapper = mount(<BoardType
      firmwareVersion={undefined} />);
    expect(wrapper.text()).toContain("None");
  });

  it("Disconnected", () => {
    const wrapper = mount(<BoardType
      firmwareVersion={"Arduino Disconnected!"} />);
    expect(wrapper.text()).toContain("None");
  });

  it("calls updateConfig", () => {
    const wrapper = shallow(<BoardType
      firmwareVersion={"Arduino Disconnected!"} />);
    wrapper.find("FBSelect").simulate("change",
      { label: "firmware_hardware", value: "farmduino" });
    expect(mockDevice.updateConfig)
      .toBeCalledWith({ firmware_hardware: "farmduino" });
  });
});
