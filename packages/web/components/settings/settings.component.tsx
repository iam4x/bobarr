import React from 'react';

import { SettingsComponentStyles } from './settings.styles';
import { SettingsFormComponent } from './settings-form.component';
import { ActionsComponents } from './actions.component';

export function SettingsComponent() {
  return (
    <SettingsComponentStyles>
      <div className="wrapper">
        <div className="flex">
          <SettingsFormComponent />
          <ActionsComponents />
        </div>
      </div>
    </SettingsComponentStyles>
  );
}
