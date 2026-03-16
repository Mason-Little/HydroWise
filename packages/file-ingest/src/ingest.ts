export const ingestFile = async (file: File): Promise<void> => {
  console.log("[file-ingest] received file:", file.name, file.type, file.size, "bytes");
};
