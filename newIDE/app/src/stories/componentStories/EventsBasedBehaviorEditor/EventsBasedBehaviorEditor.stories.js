// @flow

import * as React from 'react';
import { action } from '@storybook/addon-actions';

// Keep first as it creates the `global.gd` object:
import { testProject } from '../../GDevelopJsInitializerDecorator';

import muiDecorator from '../../ThemeDecorator';
import paperDecorator from '../../PaperDecorator';
import EventsBasedBehaviorEditor from '../../../EventsBasedBehaviorEditor/';

export default {
  title: 'EventsBasedBehaviorEditor/index',
  component: EventsBasedBehaviorEditor,
  decorators: [paperDecorator, muiDecorator],
};

export const Default = () => (
  <EventsBasedBehaviorEditor
    project={testProject.project}
    eventsFunctionsExtension={testProject.testEventsFunctionsExtension}
    eventsBasedBehavior={testProject.testEventsBasedBehavior}
    onPropertiesUpdated={action('properties updated')}
    onTabChanged={action('tab changed')}
    onRenameProperty={action('property rename')}
  />
);

export const WithoutFunction = () => (
  <EventsBasedBehaviorEditor
    project={testProject.project}
    eventsFunctionsExtension={testProject.testEventsFunctionsExtension}
    eventsBasedBehavior={testProject.testEmptyEventsBasedBehavior}
    onPropertiesUpdated={action('properties updated')}
    onTabChanged={action('tab changed')}
    onRenameProperty={action('property rename')}
  />
);
