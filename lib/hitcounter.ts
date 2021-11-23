import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export interface HitCounterProps {
    /**
     * Function that will count the URL hits
     */
    downstream: lambda.IFunction
}

export class HitCounter extends cdk.Construct {
    /**
     * Allows accessing the counter function
     */
    public readonly handler: lambda.Function;

    /**
     * Hit Counter Table
     */
    public readonly table: dynamodb.Table;
    
    constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
        super(scope, id)
    
    /**
     * Define a DynamoDB table with path as the partition key
     */
    const table = new dynamodb.Table(this, 'Hits', {
        partitionKey: {name: 'path', type:dynamodb.AttributeType.STRING}
    })
    this.table = table;

/**
 * Define a lambda function which is bound to the lambda/hitcounter.handler code
 * Wired the Lambda's env variables to the functionName and tableName of the resources
 */
    this.handler = new lambda.Function(this, 'HitCounterHandler', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'hitcounter.handler',
        code: lambda.Code.fromAsset('lambda'),
        environment: {
            DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
            HITS_TABLE_NAME: table.tableName
        }
    })
    table.grantReadWriteData(this.handler)

    props.downstream.grantInvoke(this.handler)
    }
}