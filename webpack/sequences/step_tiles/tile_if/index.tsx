import * as _ from "lodash";
import * as React from "react";
import { t } from "i18next";
import { DropDownItem } from "../../../ui";
import { TaggedSequence } from "../../../resources/tagged_resources";
import { If, Execute, Nothing } from "farmbot/dist";
import { ResourceIndex } from "../../../resources/interfaces";
import { selectAllSequences, findSequenceById } from "../../../resources/selectors";
import { isRecursive } from "../index";
import { If_ } from "./if";
import { Then } from "./then";
import { Else } from "./else";
import { defensiveClone } from "../../../util";
import { overwrite } from "../../../api/crud";
import { NULL_CHOICE } from "../../../ui/fb_select";
import { range } from "lodash";
import { ToolTips } from "../../../constants";
import { StepWrapper, StepHeader, StepContent } from "../../step_ui/index";

export interface IfParams {
  currentSequence: TaggedSequence;
  currentStep: If;
  dispatch: Function;
  index: number;
  resources: ResourceIndex;
}

export type Operator = "lhs"
  | "op"
  | "rhs"
  | "_then"
  | "_else";

export const LHSOptions: DropDownItem[] = [
  { value: "x", label: "X position" },
  { value: "y", label: "Y Position" },
  { value: "z", label: "Z position" }
].concat(range(0, 70).map(x => ({ value: `pin${x}`, label: `Pin ${x}` })));

export const operatorOptions: DropDownItem[] = [
  { value: "<", label: "is less than" },
  { value: ">", label: "is greater than" },
  { value: "is", label: "is equal to" },
  { value: "not", label: "is not equal to" },
  { value: "is_undefined", label: "is unknown" }
];

export function seqDropDown(i: ResourceIndex) {
  const results: DropDownItem[] = [];
  selectAllSequences(i)
    .map(function (x) {
      const { body } = x;
      if (_.isNumber(body.id)) {
        results.push({ label: body.name, value: body.id });
      }
    });
  return results;
}

export function initialValue(input: Execute | Nothing, index: ResourceIndex) {
  switch (input.kind) {
    case "execute":
      const id = input.args.sequence_id;
      const seq = findSequenceById(index, id).body;
      if (_.isNumber(seq.id)) {
        return { label: seq.name, value: seq.id };
      } else {
        throw new Error("Failed seq id type assertion.");
      }
    case "nothing":
      return { label: "None", value: 0 };
    default:
      throw new Error("Only _else or _then");
  }
}

export function InnerIf(props: IfParams) {
  const {
    index,
    dispatch,
    currentStep,
    currentSequence
  } = props;
  const recursive = isRecursive(currentStep, currentSequence);
  const className = "if-step";
  return <StepWrapper>
    <StepHeader
      className={className}
      helpText={ToolTips.IF}
      currentSequence={currentSequence}
      currentStep={currentStep}
      dispatch={dispatch}
      index={index}>
      {recursive && (
        <span>
          <i className="fa fa-exclamation-triangle"></i>
          &nbsp;{t("Recursive condition.")}
        </span>
      )}
    </StepHeader>
    <StepContent className={className}>
      <If_ {...props} />
      <Then {...props} />
      <Else {...props} />
    </StepContent>
  </StepWrapper>;
}

/** Creates a function that can be used in the `onChange` event of a _else or
 * _then block in the sequence editor.
 */
export let IfBlockDropDownHandler = (props: IfParams,
  key: "_else" | "_then") => {

  const { dispatch, index } = props;
  const step = props.currentStep;
  const sequence = props.currentSequence;
  const block = step.args[key];
  const selectedItem = () => {
    if (block.kind === "nothing") {
      return NULL_CHOICE;
    } else {
      const value = (block.kind === "execute") && block.args.sequence_id;
      const label = value && findSequenceById(props.resources, value).body.name;
      if (_.isNumber(value) && _.isString(label)) {
        return { label, value };
      } else {
        throw new Error("Failed type assertion");
      }
    }
  };

  function overwriteStep(input: Execute | Nothing) {
    const update = defensiveClone(step);
    const nextSequence = defensiveClone(sequence).body;
    update.args[key] = input;
    (nextSequence.body || [])[index] = update;
    dispatch(overwrite(sequence, nextSequence));
  }

  function onChange(e: DropDownItem) {
    if (e.value && _.isNumber(e.value)) {
      const v = e.value;
      overwriteStep({ kind: "execute", args: { sequence_id: v } });
    } else {
      overwriteStep({ kind: "nothing", args: {} });
    }
  }

  return { onChange, selectedItem };
};
