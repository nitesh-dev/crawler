export function generateId() {
  return new Date().getTime();
}

export function stringToNumber(text: string) {
  var t = text.replace(/\D/g, "");
  if (t == "") {
    t = "0";
  }
  return parseInt(t);
}

export async function fetchHtml(url: string) {
  // console.log("fetching html")
  // console.log(url)

  try {
    if (!(await isHTML(url))) {
      console.error("Not a HTML page:", url);
      return { isSuccess: false };
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        "Accept-Language": "en-US, en;q=0.5",
      },
    });

    if (response.ok) {
      const htmlContent = await response.text();
      return { isSuccess: true, data: htmlContent };
    } else {
      console.error(
        "Failed to download the page:",
        response.status,
        response.statusText
      );
      return { isSuccess: false };
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    return { isSuccess: false };
  }
}

async function isHTML(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) return true;
  } catch (error) {
    console.error("Error checking content type:", error);
  }

  return false;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
