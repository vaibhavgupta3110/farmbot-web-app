import * as React from "react";
import { t } from "i18next";
import { PinGuardMCUInputGroup } from "../pin_guard_input_group";
import { PinGuardProps } from "../interfaces";
import { Header } from "./header";
import { Collapse } from "@blueprintjs/core";
import { Row, Col } from "../../../ui/index";
import { SpacePanelToolTip } from "../space_panel_tool_tip";
import { ToolTips } from "../../../constants";

export function PinGuard(props: PinGuardProps) {

  const { pin_guard } = props.bot.controlPanelState;
  const { dispatch, bot } = props;

  return <section>
    <Header
      bool={pin_guard}
      title={"Pin Guard"}
      name={"pin_guard"}
      dispatch={dispatch} />
    <Collapse isOpen={!!pin_guard}>
      <Row>
        <Col xs={3} xsOffset={3}>
          <label>
            {t("Pin Number")}
          </label>
          <SpacePanelToolTip tooltip={t(ToolTips.PIN_GUARD_PIN_NUMBER)} />
        </Col>
        <Col xs={3}>
          <label>
            {t("Timeout (sec)")}
          </label>
        </Col>
        <Col xs={3}>
          <label style={{ float: "right" }}>
            {t("To State")}
          </label>
        </Col>
      </Row>
      <PinGuardMCUInputGroup
        name={t("Pin Guard 1")}
        pinNumber={"pin_guard_1_pin_nr"}
        timeout={"pin_guard_1_time_out"}
        activeState={"pin_guard_1_active_state"}
        dispatch={dispatch}
        bot={bot} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard 2")}
        pinNumber={"pin_guard_2_pin_nr"}
        timeout={"pin_guard_2_time_out"}
        activeState={"pin_guard_2_active_state"}
        dispatch={dispatch}
        bot={bot} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard 3")}
        pinNumber={"pin_guard_3_pin_nr"}
        timeout={"pin_guard_3_time_out"}
        activeState={"pin_guard_3_active_state"}
        dispatch={dispatch}
        bot={bot} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard 4")}
        pinNumber={"pin_guard_4_pin_nr"}
        timeout={"pin_guard_4_time_out"}
        activeState={"pin_guard_4_active_state"}
        dispatch={dispatch}
        bot={bot} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard 5")}
        pinNumber={"pin_guard_5_pin_nr"}
        timeout={"pin_guard_5_time_out"}
        activeState={"pin_guard_5_active_state"}
        dispatch={dispatch}
        bot={bot} />
    </Collapse>
  </section>;
}
