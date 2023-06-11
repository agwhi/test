import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

import { sharedCdkEsbuildConfig } from '@lumigo-workshop-innovator-island/serverless-configuration';

export class Metric extends Construct {
  public metricFunction: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.metricFunction = new NodejsFunction(this, 'MetricLambda', {
      entry: getCdkHandlerPath(__dirname, { extension: 'js' }),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedCdkEsbuildConfig,
    });

    this.metricFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['cloudwatch:PutMetricData'],
        resources: ['*'],
      }),
    );

    const rule = new Rule(this, 'metricsRule', {
      eventPattern: {
        source: ['themepark.rides'],
        detailType: ['waitTimesSummary'],
      },
    });

    const dlQueue = new Queue(this, 'Queue');

    rule.addTarget(
      new LambdaFunction(this.metricFunction, {
        deadLetterQueue: dlQueue,
        retryAttempts: 3,
      }),
    );
  }
}
