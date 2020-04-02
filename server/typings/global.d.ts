type EventSourceEvent = Event & {
    data?: any;
    target: Record<string, any> | null;
};
