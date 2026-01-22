import { Checkpoint, Action } from './types';
import localforage from 'localforage';

export class LocalForageSaver {
  private store = localforage.createInstance({
    name: 'ram-checkpoints'
  });

  constructor() {}

  async put(threadId: string, checkpoint: Checkpoint): Promise<Checkpoint> {
    const listKey = `${threadId}_list`;
    const list = (await this.store.getItem<string[]>(listKey)) || [];
    list.push(checkpoint.id);
    await this.store.setItem(listKey, list);
    await this.store.setItem(`${threadId}_${checkpoint.id}`, checkpoint);
    return checkpoint;
  }

  async get(threadId: string, checkpointId: string): Promise<Checkpoint | null> {
    return await this.store.getItem<Checkpoint>(`${threadId}_${checkpointId}`) || null;
  }

  async list(threadId: string): Promise<Checkpoint[]> {
    const listKey = `${threadId}_list`;
    const ids = (await this.store.getItem<string[]>(listKey)) || [];
    const checkpoints: Checkpoint[] = [];
    for (const id of ids) {
      const cp = await this.get(threadId, id);
      if (cp) checkpoints.push(cp);
    }
    return checkpoints;
  }

  async deleteThread(threadId: string): Promise<void> {
    const listKey = `${threadId}_list`;
    const ids = (await this.store.getItem<string[]>(listKey)) || [];
    for (const id of ids) {
      await this.store.removeItem(`${threadId}_${id}`);
    }
    await this.store.removeItem(listKey);
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

export class InMemorySaver {
  private checkpoints = new Map<string, Checkpoint>();

  async put(threadId: string, checkpoint: Checkpoint): Promise<Checkpoint> {
    const key = `${threadId}_${checkpoint.id}`;
    this.checkpoints.set(key, checkpoint);
    return checkpoint;
  }

  async get(threadId: string, checkpointId: string): Promise<Checkpoint | null> {
    const key = `${threadId}_${checkpointId}`;
    return this.checkpoints.get(key) || null;
  }

  async list(threadId: string): Promise<Checkpoint[]> {
    const prefix = `${threadId}_`;
    return Array.from(this.checkpoints.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([, cp]) => cp);
  }

  async deleteThread(threadId: string): Promise<void> {
    const prefix = `${threadId}_`;
    for (const key of this.checkpoints.keys()) {
      if (key.startsWith(prefix)) {
        this.checkpoints.delete(key);
      }
    }
  }
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