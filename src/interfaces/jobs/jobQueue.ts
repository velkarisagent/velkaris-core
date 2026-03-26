import { logger } from '@shared/logger';

export interface Job {
  id: string;
  name: string;
  schedule: string; // cron expression
  handler: () => Promise<void>;
}

export class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private running: Set<string> = new Set();

  registerJob(job: Job): void {
    this.jobs.set(job.id, job);
    logger.info('Job registered', { jobId: job.id, jobName: job.name });
  }

  async executeJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      logger.warn('Job not found', { jobId });
      return;
    }

    if (this.running.has(jobId)) {
      logger.warn('Job already running', { jobId });
      return;
    }

    try {
      this.running.add(jobId);
      logger.info('Job started', { jobId, jobName: job.name });

      await job.handler();

      logger.info('Job completed', { jobId, jobName: job.name });
    } catch (error) {
      logger.error('Job failed', {
        jobId,
        jobName: job.name,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      this.running.delete(jobId);
    }
  }

  getJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  isJobRunning(jobId: string): boolean {
    return this.running.has(jobId);
  }
}

// TODO: Implement scheduled job examples
// Example jobs could include:
// - Settlement processing
// - Review rating aggregation
// - Seller reputation updates
// - Transaction verification
