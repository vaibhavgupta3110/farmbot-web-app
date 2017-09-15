import * as React from "react";
import { connect } from "react-redux";
import { Peripherals } from "./peripherals";
import { Row, Page, Col } from "../ui";
import { mapStateToProps } from "./state_to_props";
import { WebcamPanel } from "./webcam_panel";
import { Props } from "./interfaces";
import { Move } from "./move";
import { NoWidget } from "../no_widget";
import { ToolTips } from "../constants";

@connect(mapStateToProps)
export class Controls extends React.Component<Props, {}> {
  render() {
    const arduinoBusy = !!this
      .props
      .bot
      .hardware
      .informational_settings
      .busy;
    return <Page className="controls">
      <Row>
        <Col xs={12} sm={6} md={5} mdOffset={1}>
          <Move bot={this.props.bot}
            user={this.props.user}
            dispatch={this.props.dispatch}
            disabled={arduinoBusy} />
          <Peripherals
            bot={this.props.bot}
            peripherals={this.props.peripherals}
            dispatch={this.props.dispatch}
            resources={this.props.resources}
            disabled={arduinoBusy} />
        </Col>
        <Col xs={12} sm={6}>
          {this.props.feed
            ? <WebcamPanel bot={this.props.bot}
              feed={this.props.feed}
              dispatch={this.props.dispatch} />
            : <NoWidget title="Camera" helpText={ToolTips.WEBCAM_SAVE} />}
        </Col>
      </Row>
    </Page>;
  }
}
