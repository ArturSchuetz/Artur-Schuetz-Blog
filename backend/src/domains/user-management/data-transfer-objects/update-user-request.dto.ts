import { Role } from 'src/infrastructure/models/user.entity';

export class UpdateUserRequest {
  id: number;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  salt: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  verificationToken: string;
  isVerified: boolean;
  avatarImageId: number;
  role: Role;
  isActive: boolean;
  lastLogin: Date;
  metadata: string;
}
