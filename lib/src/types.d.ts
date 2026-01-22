export type Effect = (state: any, payload?: any) => any;
export type Action = {
    name: string;
    requires: (state: any) => boolean;
    effects: Effect;
    inputs?: {
        name: string;
        type: string;
        required: boolean;
    }[];
};
export type Invariant = (state: any) => void;
export type AIComponent = (props?: any) => string;
//# sourceMappingURL=types.d.ts.map