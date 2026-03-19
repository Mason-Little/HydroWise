import {
  requestDesktopJson,
  requestDesktopVoid,
} from "@/backends/desktop/api/client";

export type DesktopServerModelStatus = {
  value: string;
  args?: string[];
  preset?: string;
};

export type DesktopServerModel = {
  id: string;
  aliases: string[];
  tags: string[];
  object: string;
  owned_by: string;
  created: number;
  status?: DesktopServerModelStatus;
};

type DesktopServerModelListResponse = {
  data: DesktopServerModel[];
  object: string;
};

const MODEL_ALREADY_LOADED_MESSAGE = '"message":"model is already loaded"';

const isModelAlreadyLoadedError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    error.message.includes(MODEL_ALREADY_LOADED_MESSAGE)
  );
};

// Lists models exposed by the desktop server.
export const listDesktopServerModels = async (): Promise<
  DesktopServerModel[]
> => {
  const response = await requestDesktopJson<DesktopServerModelListResponse>({
    path: "v1/models",
  });

  return response.data;
};

// Tells the desktop server to load the given model id.
export const loadDesktopServerModel = async (
  modelId: string,
): Promise<void> => {
  try {
    await requestDesktopVoid({
      path: "models/load",
      init: {
        method: "POST",
        body: JSON.stringify({ model: modelId }),
      },
    });
  } catch (error) {
    if (isModelAlreadyLoadedError(error)) {
      return;
    }

    throw error;
  }
};

// Tells the desktop server to unload the given model id.
export const coolDesktopServerModel = async (
  modelId: string,
): Promise<void> => {
  await requestDesktopVoid({
    path: "models/unload",
    init: { method: "POST", body: JSON.stringify({ model: modelId }) },
  });
};
