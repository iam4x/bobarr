import React from 'react';

import { SettingsComponentStyles } from './settings.styles';
import { SettingsFormComponent } from './settings-form.component';
import { ActionsComponents } from './actions.component';
import { QualityParamsComponent } from './quality-params.component';
import { TagsComponent } from './tags.component';

export function SettingsComponent() {
  return (
    <SettingsComponentStyles>
      <div className="wrapper">
        <div className="flex">
          <div className="row">
            <SettingsFormComponent />
            <TagsComponent />
          </div>
          <div className="row">
            <ActionsComponents />
            <QualityParamsComponent />
          </div>
        </div>
      </div>
    </SettingsComponentStyles>
  );
}
