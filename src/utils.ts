export function generateId() {
    return new Date().getTime()
}

export function stringToNumber(text: string) {
    var t = text.replace(/\D/g, "")
    if (t == "") {
        t = "0"
    }
    return parseInt(t);
}



export async function fetchHtml(url: string) {

    console.log("fetching html")
    console.log(url)

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                'Accept-Language': 'en-US, en;q=0.5'
            }
        });

        if (response.ok) {
            const htmlContent = await response.text();
            return { isSuccess: true, data: htmlContent }

        } else {
            console.error('Failed to download the page:', response.status, response.statusText);
            return { isSuccess: false }
        }
    } catch (error: any) {
        console.error('Error:', error.message);
        return { isSuccess: false }
    }
}