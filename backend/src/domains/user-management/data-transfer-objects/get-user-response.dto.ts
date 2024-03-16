export class UserMedia {
  id: number;
  filepath: string;
  size: number;
  type: string;
  filename: string;
}

export class GetUserResponse {
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
  role: string;
  isActive: boolean;
  lastLogin: Date;
  metadata: string;
  medias: UserMedia[];
}
