import { alternateName } from 'librechat-data-provider';
import { Content, Portal, Root } from '@radix-ui/react-popover';
import { useEffect, useState, useMemo, type FC } from 'react';
import { useChatContext, useAgentsMapContext, useAssistantsMapContext } from '~/Providers';
import { mapEndpoints, getEntity } from '~/utils';
import EndpointItems from './Endpoints/MenuItems';
import TitleButton from './UI/TitleButton';
import Switcher from '~/components/SidePanel/Switcher';
import { useGetEndpointsQuery, useUserKeyQuery } from 'librechat-data-provider/react-query';
import type { TEndpointsConfig } from 'librechat-data-provider';
import { cn, getEndpointField } from '~/utils';
import { useAuthContext } from '~/hooks';

const EndpointsMenu: FC = () => {
  const { data: endpoints = [] } = useGetEndpointsQuery({
    select: mapEndpoints,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const agentsMap = useAgentsMapContext();
  const assistantMap = useAssistantsMapContext();
  const { conversation } = useChatContext();
  const { endpoint = '' } = conversation ?? {};
  const { data: endpointsConfig = {} as TEndpointsConfig } = useGetEndpointsQuery();
  const { data: keyExpiry = { expiresAt: undefined } } = useUserKeyQuery(endpoint ?? '');

  const userProvidesKey = useMemo(
    () => !!(endpointsConfig?.[endpoint ?? '']?.userProvide ?? false),
    [endpointsConfig, endpoint],
  );
  const keyProvided = useMemo(
    () => (userProvidesKey ? !!(keyExpiry.expiresAt ?? '') : true),
    [keyExpiry.expiresAt, userProvidesKey],
  );

  if (!endpoint) {
    console.warn('No endpoint selected');
    return null;
  }

  const { entity } = getEntity({
    endpoint,
    agentsMap,
    assistantMap,
    agent_id: conversation?.agent_id,
    assistant_id: conversation?.assistant_id,
  });

  const primaryText = entity
    ? entity.name
    : (alternateName[endpoint] as string | undefined) ?? endpoint;
  const { user } = useAuthContext(); // Get user data from Auth context

  return (
    <Root>
      <TitleButton primaryText={primaryText + ' '} />
      <Portal>
        <div
          style={{
            position: 'fixed',
            left: '0px',
            top: '0px',
            transform: 'translate3d(268px, 50px, 0px)',
            minWidth: 'max-content',
            zIndex: 'auto',
          }}
        >
          <Content
            side="bottom"
            align="start"
            className="mt-2 max-h-[65vh] min-w-[340px] overflow-y-auto rounded-lg border border-border-light bg-header-primary text-text-primary shadow-lg lg:max-h-[75vh]"
          >
            <EndpointItems endpoints={endpoints} selected={endpoint} />
            {user && user.role !== '' ? (
              <div
                className={cn(
                  'sticky left-0 right-0 top-0 z-[100] flex h-[52px] flex-wrap items-center justify-center bg-background',
                  isCollapsed ? 'h-[52px]' : 'px-2',
                )}
              >
                <Switcher
                  isCollapsed={isCollapsed}
                  endpointKeyProvided={keyProvided}
                  endpoint={endpoint}
                  openByDefault={true} // Set to false to keep it closed by default
                />
              </div>
            ) : null}
          </Content>
        </div>
      </Portal>
    </Root>
  );
};

export default EndpointsMenu;
