import { Checkpoint, Action } from './types';

export class InMemorySaver {
  private store: Map<string, Checkpoint[]> = new Map();

  constructor() {}

  put(threadId: string, checkpoint: Checkpoint): Checkpoint {
    if (!this.store.has(threadId)) {
      this.store.set(threadId, []);
    }
    this.store.get(threadId)!.push(checkpoint);
    return checkpoint;
  }

  get(threadId: string, checkpointId: string): Checkpoint | null {
    const list = this.store.get(threadId) ?? [];
    return list.find((cp) => cp.id === checkpointId) ?? null;
  }

  list(threadId: string): Checkpoint[] {
    return this.store.get(threadId) ?? [];
  }

  deleteThread(threadId: string): void {
    this.store.delete(threadId);
  }

  // Async versions
  async aput(threadId: string, checkpoint: Checkpoint): Promise<Checkpoint> {
    return this.put(threadId, checkpoint);
  }

  async aget(threadId: string, checkpointId: string): Promise<Checkpoint | null> {
    return this.get(threadId, checkpointId);
  }

  async alist(threadId: string): Promise<Checkpoint[]> {
    return this.list(threadId);
  }

  async adeleteThread(threadId: string): Promise<void> {
    this.deleteThread(threadId);
  }
}

// Helper functions
export function generateCheckpointId(): string {
  return `cp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createCheckpoint(
  state: any,
  context: string,
  allowedActions: Action[],
  metadata?: Record<string, any>
): Checkpoint {
  return {
    id: generateCheckpointId(),
    timestamp: new Date().toISOString(),
    state,
    context,
    allowedActions,
    metadata,
  };
}