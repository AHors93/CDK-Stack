import * as cdk from '@aws-cdk/core'
import * as codecommit from '@aws-cdk/aws-codecommit'
import {CodeBuildStep, CodePipeline, CodePipelineSource} from "@aws-cdk/pipelines"

export class HelloPipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        /**
         * Creates a CodeCommit repo called 'FirstCDKRepo'
         */
        new codecommit.Repository(this, 'FirstCDKRepo', {
            repositoryName: "FirstCDKRepo"
        })

        /**
         * Pipeline declaration
         */
        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'FirstCDKPipeline',
            synth: new CodeBuildStep('SynthStep', {
                input: CodePipelineSource.codeCommit(repo, 'master'),
                installCommands: [
                    'yarn add -g aws-cdk'
                ],
                commands: [
                    'yarn ci',
                    'yarn run build',
                    'yarn cdk synth'
                ]
            })
        })
    }
}