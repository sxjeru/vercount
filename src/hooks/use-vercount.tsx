"use client";
import * as React from "react";

interface VercountData {
  sitePv: number;
  pagePv: number;
  siteUv: number;
}

/**
 * 本地版 useVercount Hook
 * 直接调用相对路径 API，避免硬编码外部 URL
 */
export function useVercount(): VercountData {
  const [data, setData] = React.useState<VercountData>({
    sitePv: 0,
    pagePv: 0,
    siteUv: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const currentUrl = window.location.href;
      
      // Skip tracking for non-HTTP URLs
      if (!currentUrl.startsWith("http")) {
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // 使用相对路径，让浏览器自动解析到当前域名
        const response = await fetch("/api/v2/log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: currentUrl }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (result?.status === "success" && result.data) {
          setData({
            sitePv: result.data.site_pv || 0,
            pagePv: result.data.page_pv || 0,
            siteUv: result.data.site_uv || 0,
          });
        } else if (result?.data) {
          setData({
            sitePv: result.data.site_pv || 0,
            pagePv: result.data.page_pv || 0,
            siteUv: result.data.site_uv || 0,
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.warn("Vercount request timeout");
        } else {
          console.warn("Vercount API error:", error);
        }
      }
    };

    fetchData();
  }, []);

  return data;
}
