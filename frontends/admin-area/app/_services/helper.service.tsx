import { getConfig } from "@/config";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faTwitter, faFacebookF, faYoutube, faLinkedinIn, faGithub} from '@fortawesome/fontawesome-free-brands';

const authUrl = getConfig().apiUrl + "/auth";

const getSocialIconClass = (url: string): IconProp | null => {
  const regex = /(github|twitter|facebook|youtube|linkedin)/i;

  const match = url.match(regex);

  if (match && match[1]) {
    if(match[1].toLowerCase() == "github") {
      return faGithub as IconProp;
    }

    if(match[1].toLowerCase() == "twitter") {
      return faTwitter as IconProp;
    }

    if(match[1].toLowerCase() == "facebook") {
      return faFacebookF as IconProp;
    }

    if(match[1].toLowerCase() == "youtube") {
      return faYoutube as IconProp;
    }

    if(match[1].toLowerCase() == "linkedin") {
      return faLinkedinIn as IconProp;
    }

    return null;
  } else {
    return null;
  }
};

async function fetchWithTokenRefresh(
  url: RequestInfo | URL,
  options: RequestInit | undefined
) {
  if (typeof window !== 'undefined') {
    {
      let accessToken = localStorage.getItem("access_token");
      let refreshToken = localStorage.getItem("refresh_token");

      if (isTokenExpired(accessToken) && refreshToken?.trim()) {
        const newTokens = await fetch(`${authUrl}/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }).then((res) => res.json());

        if (newTokens) {
          localStorage.setItem("access_token", newTokens.accessToken);
          localStorage.setItem("refresh_token", newTokens.refreshToken);
        }
      }
    }

    {
      let accessToken = localStorage.getItem("access_token");
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  } else {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
      },
    });
  }
}

function isTokenExpired(token: string | null) {
  if (token) {
    const [, payload] = token.split(".");
    const decodedPayload = JSON.parse(atob(payload));
    const exp = decodedPayload.exp;

    if (!exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= exp;
  } else {
    return true;
  }
}

export { fetchWithTokenRefresh, getSocialIconClass };
