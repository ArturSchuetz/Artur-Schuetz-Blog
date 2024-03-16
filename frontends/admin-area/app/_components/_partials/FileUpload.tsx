"use client";

import React, { use, useEffect, useState } from "react";
import { uploadFile } from "@/app/_services/fileUpload.service";

export default function FileUpload({
  onComplete,
}: {
  onComplete: (mediaId: number) => void;
}) {
  const [inputKey, setInputKey] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [progress, setProgress] = useState<number>(0);

  const fileSelectedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadFile(
        selectedFile,
        (progress) => setProgress(progress),
        (mediaId) => {
          setProgress(0);
          onComplete(mediaId);
          setSelectedFile(undefined);
          setInputKey((prevKey) => prevKey + 1);
        }
      );
    }
  }, [onComplete, selectedFile]);

  return (
    <>
      <div>
        <input
          type="file"
          className="form-control"
          onChange={fileSelectedHandler}
          key={inputKey}
        />
        <div style={{ height: "20px" }}></div>
        <div>Progress: {progress}%</div>
      </div>
    </>
  );
}
