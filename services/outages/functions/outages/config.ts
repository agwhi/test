import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { sharedCdkEsbuildConfig } from '@lumigo-workshop-innovator-island/serverless-configuration';

interface OutagesProps {
  eventbus: EventBus;
}

export class Outages extends Construct {
  public OutagesFunction: NodejsFunction;

  constructor(scope: Construct, id: string, { eventbus }: OutagesProps) {
    super(scope, id);

    this.OutagesFunction = new NodejsFunction(this, 'OutagesLambda', {
      entry: getCdkHandlerPath(__dirname, { extension: 'js' }),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedCdkEsbuildConfig,
    });

    eventbus.grantPutEventsTo(this.OutagesFunction);
  }
}
