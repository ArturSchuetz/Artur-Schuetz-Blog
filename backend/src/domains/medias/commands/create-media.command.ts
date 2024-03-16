import { CreateMediaRequest } from '../data-transfer-objects/create-media-request.dto';

export class CreateMediaCommand {
  constructor(public readonly createMediaRequest: CreateMediaRequest) {}
}
