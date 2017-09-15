import * as React from "react";
import { t } from "i18next";
import { Widget, WidgetHeader } from "./ui";

export interface NoWidgetProps {
  title: string;
  helpText?: string;
}

export class NoWidget extends
  React.Component<NoWidgetProps, {}> {

  render() {
    return (
      <Widget>
        <WidgetHeader
          title={t(this.props.title)}
          helpText={this.props.helpText} />
        <div className="widget-body">
          {t("Widget load failed.")}
        </div>
      </Widget>
    );
  }
}
