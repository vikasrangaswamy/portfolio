import type { ComponentType } from 'react'
import AwsBatch from './aws-batch.mdx'
import AwsLambda from './aws-lambda.mdx'
import UrlShortener from './url-shortener.mdx'
import type { LearningTopic } from '../../../components/learnings/LearningPage'
import { systemDesignMeta } from './meta'

const components: Record<string, ComponentType> = {
  'url-shortener': UrlShortener,
  'aws-batch': AwsBatch,
  'aws-lambda': AwsLambda,
}

// Metadata is the single source of truth (shared with the AI worker); the site
// attaches the MDX body here.
export const systemDesignTopics: readonly LearningTopic[] = systemDesignMeta.map((meta) => ({
  ...meta,
  component: components[meta.slug],
}))
