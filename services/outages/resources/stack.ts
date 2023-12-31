import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

import { Metric } from 'functions/metrics/config';
import { Outages } from 'functions/outages/config';
import { Publish } from 'functions/publish/config';

interface OutagesProps {
  stage: string;
}

export class OutagesStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps & OutagesProps) {
    super(scope, id, props);

    const { stage } = props;

    const eventbus = new EventBus(this, 'EventBus', {});

    const topicArn = Fn.importValue(`${stage}-RideUpdatesSNStopic`);

    const topic = Topic.fromTopicArn(this, 'RideUpdatesSNStopic', topicArn);

    new Metric(this, 'Metric');

    new Outages(this, 'Outages', { eventbus });

    new Publish(this, 'Publish', { eventbus, topic });
  }
}
