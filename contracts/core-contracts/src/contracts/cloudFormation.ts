import { CloudFormationContract } from '@swarmion/serverless-contracts';

import { projectName } from '@lumigo-workshop-innovator-island/serverless-configuration';

export const httpApiResourceContract = new CloudFormationContract({
  id: 'core-httpApi',
  name: `CoreHttpApi-${projectName}`,
});
