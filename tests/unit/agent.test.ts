import { describe, it, expect } from 'vitest';
import { Agent } from '../../src/domain/agent';

describe('Agent Domain Entity', () => {
  it('should create a new agent with initial state', () => {
    const agent = Agent.create(
      'owner-123',
      'Test Agent',
      'A test agent',
      ['capability-1'],
    );

    expect(agent.getId()).toBeDefined();
    expect(agent.getOwnerId()).toBe('owner-123');
    expect(agent.getName()).toBe('Test Agent');
    expect(agent.isVerified()).toBe(false);
  });

  it('should allow verification of agent', () => {
    const agent = Agent.create(
      'owner-456',
      'Another Agent',
      'Description',
      ['capability-1', 'capability-2'],
    );

    expect(agent.isVerified()).toBe(false);
    agent.verify();
    expect(agent.isVerified()).toBe(true);
  });

  it('should allow version updates', () => {
    const agent = Agent.create('owner-789', 'Version Agent', 'Desc', ['cap']);

    const persistence = agent.toPersistence();
    expect(persistence.version).toBe('1.0.0');

    agent.updateVersion('2.0.0');
    const updated = agent.toPersistence();
    expect(updated.version).toBe('2.0.0');
  });
});
