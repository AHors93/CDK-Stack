import * as cdk from '@aws-cdk/core'
import * as codecommit from '@aws-cdk/aws-codecommit'

export class HelloPipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        /**
         * Creates a CodeCommit repo called 'FirstCDKRepo'
         */
        new codecommit.Repository(this, 'FirstCDKRepo', {
            repositoryName: "FirstCDKRepo"
        })
    }
}