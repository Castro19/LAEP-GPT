import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

function detectDeviceType(): DeviceType {
  // If `navigator` is unavailable (e.g., SSR), default to "desktop"
  if (typeof navigator === "undefined") {
    return "desktop";
  }

  const ua = navigator.userAgent.toLowerCase();
  const { platform, maxTouchPoints } = navigator;

  // iPad detection for iPadOS 13+
  // iPad can appear as "MacIntel" with touch points > 1
  const isIpad =
    (platform === "MacIntel" && maxTouchPoints > 1) || /ipad/.test(ua);

  // Phone detection
  const isPhone = /mobi|android|iphone|ipod|windows phone/.test(ua);

  // Tablet detection (additional patterns for e-readers/tablets if needed)
  const isTablet = /tablet|playbook|silk/.test(ua) || isIpad;

  if (isPhone) {
    return "mobile";
  } else if (isTablet) {
    return "tablet";
  }
  return "desktop";
}

export default function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    setDeviceType(detectDeviceType());
    // Since user agent or platform won't change during a session,
    // no need to listen to `resize` unless you want additional
    // logic that partially depends on width.
  }, []);

  return deviceType;
}
