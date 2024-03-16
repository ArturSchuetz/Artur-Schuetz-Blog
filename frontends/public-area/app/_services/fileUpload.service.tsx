import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";
import { Media } from "./media.service";

import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

const filesUrl = getConfig().apiUrl + "/medias";
type Chunk = Uint8Array; // Hier ist ein präziserer Typ.
type WritableStreamWriteMethod = (chunk: Chunk) => void;

interface WritableStream {
  write: WritableStreamWriteMethod;
}

export const uploadFile = async (
  file: File,
  onProgress: (progress: number) => void,
  onComplete: (mediaId: number) => void
): Promise<void> => {
  let fileProgress = 0;
  let responseBody = "";
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithTokenRefresh(filesUrl, {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    if (response.body) {
      const writer = new WritableStream({
        write(chunk: Chunk) {
          fileProgress += chunk.length;
          const progress: number =
            Math.round((fileProgress / file.size) * 100) || 0;
          onProgress(progress);

          responseBody += new TextDecoder("utf-8").decode(chunk);
        },
      });

      await response.body.pipeTo(writer);

      const data: Media = JSON.parse(responseBody);
      onComplete(data.id);
    }
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      console.error(
        "Netzwerkfehler oder Server hat einen Fehlercode zurückgegeben."
      );
      throw new Error(
        "Netzwerkfehler oder Server hat einen Fehlercode zurückgegeben."
      );
    }
  }
};
