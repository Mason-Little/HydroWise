const supportedExtensions = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
};

export const getDocumentType = (file: File) => {
  if (file.type.startsWith("image/")) {
    return "image";
  }
  return (
    supportedExtensions[file.type as keyof typeof supportedExtensions] ||
    "unknown"
  );
};
