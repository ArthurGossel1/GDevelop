// @flow
import { Trans } from '@lingui/macro';
import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import PreferencesContext, {
  type AlertMessageIdentifier,
} from '../../MainFrame/Preferences/PreferencesContext';
import { useScreenType } from '../Reponsive/ScreenTypeMeasurer';
import GDevelopThemeContext from '../Theme/ThemeContext';
import InAppTutorialContext from '../../InAppTutorial/InAppTutorialContext';

type Props = {|
  identifier: AlertMessageIdentifier,
  message: React.Node,
  touchScreenMessage?: React.Node,
  show: boolean,
|};

const DismissableInfoBar = ({
  identifier,
  show,
  touchScreenMessage,
  message,
}: Props) => {
  const { isInAppTutorialRunning } = React.useContext(InAppTutorialContext);
  const preferences = React.useContext(PreferencesContext);
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const screenType = useScreenType();

  return isInAppTutorialRunning ? null : (
    <Snackbar
      open={show && !preferences.values.hiddenAlertMessages[identifier]}
      message={
        screenType === 'touch' && touchScreenMessage
          ? touchScreenMessage
          : message
      }
      action={
        <Button
          key="undo"
          color={
            gdevelopTheme.palette.type === 'light' ? 'secondary' : 'primary'
          }
          size="small"
          onClick={() => {
            preferences.showAlertMessage(identifier, false);
          }}
        >
          <Trans>Got it</Trans>
        </Button>
      }
    />
  );
};

export default DismissableInfoBar;
