import { Checkpoint, Action } from './types';
export declare class InMemorySaver {
    private store;
    constructor();
    put(threadId: string, checkpoint: Checkpoint): Checkpoint;
    get(threadId: string, checkpointId: string): Checkpoint | null;
    list(threadId: string): Checkpoint[];
    deleteThread(threadId: string): void;
    aput(threadId: string, checkpoint: Checkpoint): Promise<Checkpoint>;
    aget(threadId: string, checkpointId: string): Promise<Checkpoint | null>;
    alist(threadId: string): Promise<Checkpoint[]>;
    adeleteThread(threadId: string): Promise<void>;
}
export declare function generateCheckpointId(): string;
export declare function createCheckpoint(state: any, context: string, allowedActions: Action[], metadata?: Record<string, any>): Checkpoint;
//# sourceMappingURL=checkpoint.d.ts.map