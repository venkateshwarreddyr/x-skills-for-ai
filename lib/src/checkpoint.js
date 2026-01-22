"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckpoint = exports.generateCheckpointId = exports.InMemorySaver = void 0;
class InMemorySaver {
    constructor() {
        this.store = new Map();
    }
    put(threadId, checkpoint) {
        if (!this.store.has(threadId)) {
            this.store.set(threadId, []);
        }
        this.store.get(threadId).push(checkpoint);
        return checkpoint;
    }
    get(threadId, checkpointId) {
        var _a, _b;
        const list = (_a = this.store.get(threadId)) !== null && _a !== void 0 ? _a : [];
        return (_b = list.find((cp) => cp.id === checkpointId)) !== null && _b !== void 0 ? _b : null;
    }
    list(threadId) {
        var _a;
        return (_a = this.store.get(threadId)) !== null && _a !== void 0 ? _a : [];
    }
    deleteThread(threadId) {
        this.store.delete(threadId);
    }
    // Async versions
    async aput(threadId, checkpoint) {
        return this.put(threadId, checkpoint);
    }
    async aget(threadId, checkpointId) {
        return this.get(threadId, checkpointId);
    }
    async alist(threadId) {
        return this.list(threadId);
    }
    async adeleteThread(threadId) {
        this.deleteThread(threadId);
    }
}
exports.InMemorySaver = InMemorySaver;
// Helper functions
function generateCheckpointId() {
    return `cp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
exports.generateCheckpointId = generateCheckpointId;
function createCheckpoint(state, context, allowedActions, metadata) {
    return {
        id: generateCheckpointId(),
        timestamp: new Date().toISOString(),
        state,
        context,
        allowedActions,
        metadata,
    };
}
exports.createCheckpoint = createCheckpoint;
//# sourceMappingURL=checkpoint.js.map