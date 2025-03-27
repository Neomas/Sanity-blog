import { useState, useEffect } from "react";

export function useHardwareAcceleration() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHardwareAcceleration = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        // WebGL not supported at all
        setIsEnabled(false);
        return;
      }

      // Get debug info
      // @ts-ignore

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (!debugInfo) {
        // Can't determine graphics card
        setIsEnabled(null);
        return;
      }

      // Get renderer info
      // @ts-ignore
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

      // Check if software rendering is being used
      const isSoftwareRenderer =
        renderer.toLowerCase().includes("swiftshader") ||
        renderer.toLowerCase().includes("software") ||
        renderer.toLowerCase().includes("microsoft basic render");

      // Clean up
      // @ts-ignore

      gl.getExtension("WEBGL_lose_context")?.loseContext();

      setIsEnabled(!isSoftwareRenderer);
    };

    checkHardwareAcceleration();
  }, []);

  return isEnabled;
}

export default useHardwareAcceleration;
