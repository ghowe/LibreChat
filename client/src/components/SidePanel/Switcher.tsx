import { isAssistantsEndpoint, isAgentsEndpoint } from 'librechat-data-provider';
import type { SwitcherProps } from '~/common';
import AssistantSwitcher from './AssistantSwitcher';
import AgentSwitcher from './AgentSwitcher';
import ModelSwitcher from './ModelSwitcher';

export default function Switcher(props: SwitcherProps & { openByDefault?: boolean }) {
  const { endpoint, endpointKeyProvided, openByDefault } = props;

  if (isAssistantsEndpoint(endpoint) && endpointKeyProvided) {
    return <AssistantSwitcher {...props} openByDefault={openByDefault} />; // Pass openByDefault
  } else if (isAgentsEndpoint(endpoint) && endpointKeyProvided) {
    return <AgentSwitcher {...props} openByDefault={openByDefault} />; // If you want to handle this similarly
  } else if (isAssistantsEndpoint(endpoint)) {
    return null;
  }

  return <ModelSwitcher {...props} openByDefault={openByDefault} />; // Pass it down here as well
}
