/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * BackendForAdmin
 * OpenAPI spec version: v1
 */
import type { JobInstanceDto } from './jobInstanceDto';
import type { JobLog } from './jobLog';

export interface JobDto {
  id?: string;
  createdAt?: string;
  /** @nullable */
  method: string | null;
  /** @nullable */
  url: string | null;
  /** @nullable */
  jobInstances?: JobInstanceDto[] | null;
  /** @nullable */
  jobLogs?: JobLog[] | null;
  enable: boolean;
}
