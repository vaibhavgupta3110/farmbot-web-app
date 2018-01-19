import * as React from "react";
import { TaggedSequence } from "../resources/tagged_resources";
import { SequenceBodyItem, LegalSequenceKind } from "farmbot/dist";
import { DropArea } from "../draggable/drop_area";
import { StepDragger } from "../draggable/step_dragger";
import { renderCeleryNode } from "./step_tiles/index";
import { ResourceIndex } from "../resources/interfaces";
import { getStepTag } from "../resources/sequence_tagging";

interface AllStepsProps {
  sequence: TaggedSequence;
  onDrop(index: number, key: string): void;
  dispatch: Function;
  resources: ResourceIndex;
}

export class AllSteps extends React.Component<AllStepsProps, {}> {
  render() {
    const { sequence, onDrop, dispatch } = this.props;
    const items = (sequence.body.body || [])
      .map((currentStep: SequenceBodyItem, index, arr) => {
        /** HACK: React's diff algorithm (probably?) can't keep track of steps
         * via `index` alone- the content is too dynamic (copy/splice/pop/push)
         * To get around this, we add a `uuid` property to Steps that
         * is guaranteed to be unique no matter where the step gets moved and
         * allows React to diff the list correctly. */
        const readThatCommentAbove = getStepTag(currentStep);
        return <div className="sequence-steps"
          key={readThatCommentAbove}>
          <DropArea callback={(key) => onDrop(index, key)} />
          <StepDragger
            dispatch={dispatch}
            step={currentStep}
            intent="step_move"
            draggerId={index}>
            <div>
              {renderCeleryNode(currentStep.kind as LegalSequenceKind, {
                currentStep,
                index,
                dispatch: dispatch,
                currentSequence: sequence,
                resources: this.props.resources
              })}
            </div>
          </StepDragger>
        </div>;
      });

    return <div> {items} </div>;
  }
}
