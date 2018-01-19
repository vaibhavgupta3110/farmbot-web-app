jest.mock("react-redux", () => ({
  connect: jest.fn()
}));

import * as React from "react";
import { FarmDesigner } from "../index";
import { mount } from "enzyme";
import { Props } from "../interfaces";
import { GardenMapLegendProps } from "../map/interfaces";
import { bot } from "../../__test_support__/fake_state/bot";

describe("<FarmDesigner/>", () => {
  function fakeProps(): Props {
    return {
      dispatch: jest.fn(),
      selectedPlant: undefined,
      designer: {
        selectedPlants: undefined,
        hoveredPlant: {
          plantUUID: undefined,
          icon: ""
        },
        cropSearchQuery: "",
        cropSearchResults: [],
        chosenLocation: { x: undefined, y: undefined, z: undefined },
      },
      hoveredPlant: undefined,
      points: [],
      plants: [],
      toolSlots: [],
      crops: [],
      botLocationData: {
        position: { x: undefined, y: undefined, z: undefined },
        scaled_encoders: { x: undefined, y: undefined, z: undefined },
        raw_encoders: { x: undefined, y: undefined, z: undefined },
      },
      botMcuParams: bot.hardware.mcu_params,
      stepsPerMmXY: { x: undefined, y: undefined },
      peripherals: [],
      eStopStatus: false
    };
  }

  it("loads default map settings", () => {
    localStorage["showPoints"] = "false";
    const wrapper = mount(<FarmDesigner { ...fakeProps() } />);
    const legendProps = wrapper.find("GardenMapLegend").props() as GardenMapLegendProps;
    expect(legendProps.zoomLvl).toEqual(1);
    expect(legendProps.legendMenuOpen).toBeFalsy();
    expect(legendProps.showPlants).toBeTruthy();
    expect(legendProps.showPoints).toBeTruthy();
    expect(legendProps.showSpread).toBeFalsy();
    expect(legendProps.showFarmbot).toBeTruthy();
    expect(legendProps.botOriginQuadrant).toEqual(2);
    // tslint:disable-next-line:no-any
    const gardenMapProps = wrapper.find("GardenMap").props() as any;
    expect(gardenMapProps.gridSize.x).toEqual(2900);
    expect(gardenMapProps.gridSize.y).toEqual(1400);
  });

  it("renders nav titles", () => {
    const wrapper = mount(<FarmDesigner { ...fakeProps() } />);
    ["Designer", "Plants", "Farm Events"].map(string =>
      expect(wrapper.text()).toContain(string));
  });
});
