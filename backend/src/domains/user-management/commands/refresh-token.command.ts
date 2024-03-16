import { RefreshTokenRequest } from '../data-transfer-objects/refresh-token-request.dto';

export class RefreshTokenCommand {
  constructor(public readonly refreshTokenRequest: RefreshTokenRequest) {}
}
