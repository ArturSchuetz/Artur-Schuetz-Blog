import { getConfig } from "@/config";

import { fetchWithTokenRefresh } from "./helper.service";

import UnauthorizedException from "../_common/Exceptions/unauthorized-exception";
import NotFoundException from "../_common/Exceptions/not-found-exception";

const contactUrl = getConfig().apiUrl + "/messages";

export async function sendContactFormData(formData: {
  name: string;
  email: string;
  message: string;
}) {
  const response = await fetchWithTokenRefresh(contactUrl, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (response.ok) {
    return {
      success: true,
      message: "Email successfully sent! We will get back to you soon.",
    };
  } else {
    if (response.status === 401) {
      throw new UnauthorizedException();
    } else if(response.status === 404) {
      throw new NotFoundException();
    } else {
      const json = await response.json();
      return {
        success: false,
        message: json.error || "Something went wrong",
      };
    }
  }
}
