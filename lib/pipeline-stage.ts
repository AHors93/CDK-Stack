import {HelloPipelineStack} from './pipeline-stack'
import {Stage, Construct, StageProps} from '@aws-cdk/core'

export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props)

        new HelloPipelineStack(this, 'WebService')
    }
}