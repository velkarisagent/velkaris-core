import { v4 as uuidv4 } from 'uuid';

export interface AgentProps {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Agent {
  private props: AgentProps;

  private constructor(props: AgentProps) {
    this.props = props;
  }

  static create(
    ownerId: string,
    name: string,
    description: string,
    capabilities: string[],
  ): Agent {
    return new Agent({
      id: uuidv4(),
      ownerId,
      name,
      description,
      version: '1.0.0',
      capabilities,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: AgentProps): Agent {
    return new Agent(props);
  }

  getId(): string {
    return this.props.id;
  }

  getOwnerId(): string {
    return this.props.ownerId;
  }

  getName(): string {
    return this.props.name;
  }

  getDescription(): string {
    return this.props.description;
  }

  getCapabilities(): string[] {
    return this.props.capabilities;
  }

  isVerified(): boolean {
    return this.props.verified;
  }

  verify(): void {
    this.props.verified = true;
    this.props.updatedAt = new Date();
  }

  updateVersion(newVersion: string): void {
    this.props.version = newVersion;
    this.props.updatedAt = new Date();
  }

  toPersistence(): AgentProps {
    return { ...this.props };
  }
}
