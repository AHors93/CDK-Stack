import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export interface HitCounterProps {
    /**
     * Function that will count the URL hits
     */
    downstream: lambda.IFunction;
    /**
     * Read capacity units for the table
     * Must be greater than 5 and lower than 20 - default = 5
     */
    readCapacity?: number
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
        if (props.readCapacity !== undefined && (props.readCapacity < 5 || props.readCapacity > 20)) {
            throw new Error('readCapacity must be greater than 5 and less than 20')
        }
        super(scope, id)
    
    /**
     * Define a DynamoDB table with path as the partition key
     */
    const table = new dynamodb.Table(this, 'Hits', {
        partitionKey: {name: 'path', type:dynamodb.AttributeType.STRING},
        encryption: dynamodb.TableEncryption.AWS_MANAGED,
        readCapacity: props.readCapacity ?? 5
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