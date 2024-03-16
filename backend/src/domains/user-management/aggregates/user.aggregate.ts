import { AggregateRoot } from '@nestjs/cqrs';
import * as crypto from 'crypto';
import { Role } from 'src/infrastructure/models/user.entity';

function generateSalt(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export class UserAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly username: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly salt: string,
    public readonly resetPasswordToken: string | null,
    public readonly resetPasswordExpires: Date | null,
    public readonly verificationToken: string | null,
    public readonly isVerified: boolean,
    public readonly avatarImageId: number | null,
    public readonly role: Role,
    public readonly isActive: boolean,
    public readonly lastLogin: Date | null,
    public readonly metadata: string | null,
  ) {
    super();
  }

  getId(): number {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getSalt(): string {
    return this.salt;
  }

  getResetPasswordToken(): string | null {
    return this.resetPasswordToken;
  }

  getResetPasswordExpires(): Date | null {
    return this.resetPasswordExpires;
  }

  getVerificationToken(): string | null {
    return this.verificationToken;
  }

  getIsVerified(): boolean {
    return this.isVerified;
  }

  getAvatarImageId(): number | null {
    return this.avatarImageId;
  }

  getRole(): Role {
    return this.role;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getLastLogin(): Date | null {
    return this.lastLogin;
  }

  getMetadata(): string | null {
    return this.metadata;
  }

  static async create(
    id: number,
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    salt: string,
    resetPasswordToken: string | null,
    resetPasswordExpires: Date | null,
    verificationToken: string | null,
    isVerified: boolean,
    avatarImageId: number | null,
    role: Role,
    isActive: boolean,
    lastLogin: Date | null,
    metadata: string | null,
  ): Promise<UserAggregate> {
    const userAggregate = new UserAggregate(
      id,
      email,
      username,
      password,
      firstName,
      lastName,
      salt,
      resetPasswordToken,
      resetPasswordExpires,
      verificationToken,
      isVerified,
      avatarImageId,
      role,
      isActive,
      lastLogin,
      metadata,
    );
    return userAggregate;
  }

  static async createWithRequiredFields(
    email: string,
    username: string,
    password: string,
  ): Promise<UserAggregate> {
    const defaultSalt = generateSalt(16);
    const defaultRole = Role.USER;
    const defaultIsActive = true;
    return this.create(
      0, // id
      email,
      username,
      password,
      '', // firstName
      '', // lastName
      defaultSalt,
      null, // resetPasswordToken
      null, // resetPasswordExpires
      null, // verificationToken
      false, // isVerified
      null, // avatarImageId
      defaultRole,
      defaultIsActive,
      null, // lastLogin
      null, // metadata
    );
  }
}
