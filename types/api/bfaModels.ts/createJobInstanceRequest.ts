/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * BackendForAdmin
 * OpenAPI spec version: v1
 */
import type { JobInstanceModel } from './jobInstanceModel';

export interface CreateJobInstanceRequest {
  jobId: string;
  /** @nullable */
  instances: JobInstanceModel[] | null;
}
