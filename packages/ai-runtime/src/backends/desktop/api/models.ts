import {
  requestDesktopJson,
  requestDesktopVoid,
} from "@/backends/desktop/api/client";

export type DesktopLanguageModelStatus = {
  value: string;
  args?: string[];
  preset?: string;
};

export type DesktopLanguageModel = {
  id: string;
  aliases: string[];
  tags: string[];
  object: string;
  owned_by: string;
  created: number;
  status?: DesktopLanguageModelStatus;
};

type DesktopLanguageModelListResponse = {
  data: DesktopLanguageModel[];
  object: string;
};

// Lists models exposed by the desktop server.
export const listDesktopLanguageModels = async (): Promise<
  DesktopLanguageModel[]
> => {
  const response = await requestDesktopJson<DesktopLanguageModelListResponse>({
    path: "v1/models",
  });

  return response.data;
};

// Tells the desktop server to load the given model id.
export const loadDesktopLanguageModel = async (
  modelId: string,
): Promise<void> => {
  await requestDesktopVoid({
    path: "models/load",
    init: {
      method: "POST",
      body: JSON.stringify({ model: modelId }),
    },
  });
};
