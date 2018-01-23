import * as React from "react";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";
import { StepParams } from "../interfaces";
import { ToolTips } from "../../constants";
import { setPinMode, PIN_MODES, currentModeSelection } from "./tile_pin_support";
import { StepWrapper, StepHeader, StepContent } from "../step_ui/index";
import { Row, Col, FBSelect } from "../../ui/index";

export function TileReadPin(props: StepParams) {
  const { dispatch, currentStep, index, currentSequence } = props;
  const className = "read-pin-step";
  return <StepWrapper>
    <StepHeader
      className={className}
      helpText={ToolTips.READ_PIN}
      currentSequence={currentSequence}
      currentStep={currentStep}
      dispatch={dispatch}
      index={index} />
    <StepContent className={className}>
      <Row>
        <Col xs={6} md={3}>
          <label>{t("Pin Number")}</label>
          <StepInputBox dispatch={dispatch}
            step={currentStep}
            sequence={currentSequence}
            index={index}
            field="pin_number" />
        </Col>
        <Col xs={6} md={3}>
          <label>{t("Data Label")}</label>
          <StepInputBox dispatch={dispatch}
            index={index}
            step={currentStep}
            sequence={currentSequence}
            field="label" />
        </Col>
        <Col xs={6} md={3}>
          <label>{t("Pin Mode")}</label>
          <FBSelect
            onChange={(x) => setPinMode(x, props)}
            selectedItem={currentModeSelection(currentStep)}
            list={PIN_MODES} />
        </Col>
      </Row>
    </StepContent>
  </StepWrapper>;
}
