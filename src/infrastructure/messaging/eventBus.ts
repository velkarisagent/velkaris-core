export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

export interface EventSubscriber {
  handle(event: DomainEvent): Promise<void>;
}

export class EventBus {
  private subscribers: Map<string, EventSubscriber[]> = new Map();
  private eventHistory: DomainEvent[] = [];

  subscribe(eventType: string, subscriber: EventSubscriber): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(subscriber);
  }

  async publish(event: DomainEvent): Promise<void> {
    this.eventHistory.push(event);

    const subscribers = this.subscribers.get(event.type) || [];

    await Promise.all(subscribers.map(subscriber => subscriber.handle(event)));
  }

  getEventHistory(eventType?: string): DomainEvent[] {
    if (!eventType) {
      return [...this.eventHistory];
    }
    return this.eventHistory.filter(e => e.type === eventType);
  }

  clearEventHistory(): void {
    this.eventHistory = [];
  }
}

// Singleton instance
export const eventBus = new EventBus();
