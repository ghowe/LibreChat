import type { FC } from 'react';
import { Close } from '@radix-ui/react-popover';
import { EModelEndpoint, SystemRoles, alternateName } from 'librechat-data-provider';
import { useGetEndpointsQuery } from 'librechat-data-provider/react-query';
import MenuSeparator from '../UI/MenuSeparator';
import { getEndpointField } from '~/utils';
import MenuItem from './MenuItem';
import { useAuthContext } from '~/hooks/AuthContext';

const EndpointItems: FC<{
  endpoints: EModelEndpoint[];
  selected: EModelEndpoint | '';
}> = ({ endpoints, selected }) => {
  const { login, user, roles } = useAuthContext();

  // console.log(user, roles, endpoints, 'endpoints');
  const { data: endpointsConfig } = useGetEndpointsQuery();

  // Filter out endpoints based on user role
  const filteredEndpoints =
    user && user.role === 'USER'
      ? endpoints.filter(
          (endpoint) => endpoint !== 'google' && endpoint !== 'bingAI' && endpoint !== 'anthropic',
        )
      : endpoints;

  return (
    <>
      {filteredEndpoints &&
        filteredEndpoints.map((endpoint, i) => {
          if (!endpoint) {
            return null;
          } else if (!endpointsConfig?.[endpoint]) {
            return null;
          }
          const userProvidesKey: boolean | null | undefined = getEndpointField(
            endpointsConfig,
            endpoint,
            'userProvide',
          );
          return (
            <Close asChild key={`endpoint-${endpoint}`}>
              <div key={`endpoint-${endpoint}`}>
                <MenuItem
                  key={`endpoint-item-${endpoint}`}
                  title={alternateName[endpoint] || endpoint}
                  value={endpoint}
                  selected={selected === endpoint}
                  data-testid={`endpoint-item-${endpoint}`}
                  userProvidesKey={!!userProvidesKey}
                  // description="With DALL·E, browsing and analysis"
                />
                {i !== filteredEndpoints.length - 1 && <MenuSeparator />}
              </div>
            </Close>
          );
        })}
    </>
  );
};

export default EndpointItems;
