"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: any; reset: any }) {
  useEffect(() => {
    console.log("Error: ", error);
  }, [error]);

  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{error}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
