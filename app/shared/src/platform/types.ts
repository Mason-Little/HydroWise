export type PlatformKind = "web" | "desktop";

export type WebPlatformConfig = {
  kind: "web";
};

export type DesktopPlatformConfig = {
  kind: "desktop";
};

export type PlatformConfig = WebPlatformConfig | DesktopPlatformConfig;
