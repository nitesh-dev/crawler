import { JSDOM } from 'jsdom';
// import { ScrapData } from './models.js';
import { stringToNumber } from './utils.js';

export default async function startScrapping(url: string) {

    // let html = await fetchHtml(url)
    // if (html.isSuccess == true) {
    //     console.log("url extracted")
    //     let json = await scrapData(html.data as string, url)
    //     console.log("completed")
    //     return json
    // } else {
    //     return null
    // }
}





// async function scrapData(htmlContent: string, scrapUrl: string) {

//     let document = new JSDOM(htmlContent).window.document

//     let jsonData = new ScrapData()
//     jsonData.scrapUrl = scrapUrl


//     const title = document.querySelector("#title")?.textContent?.trim()
//     const rating = document.querySelector("#acrPopover a>span")?.textContent?.trim()
//     const reviewCount = document.querySelector("#acrCustomerReviewText")?.textContent?.trim().split(" ")[0]
//     const priceParent = document.querySelectorAll("#corePriceDisplay_desktop_feature_div>div")
//     const discountPrice = priceParent[0]?.querySelector(".a-offscreen")?.textContent?.trim()
//     const totalPrice = priceParent[1]?.querySelector(".a-offscreen")?.textContent?.trim()

//     // product small info
//     const smallInfoRows = document.querySelectorAll("#productOverview_feature_div table tr")
//     const smallInfo = Array<{ heading: string, content: string }>()
//     smallInfoRows.forEach(row => {
//         let subRow = row.querySelectorAll("td span")
//         let data = { heading: `${subRow[0].textContent?.trim()}`, content: `${subRow[1].textContent?.trim()}` }
//         smallInfo.push(data)
//     });

//     // about items
//     const aboutItems = document.querySelectorAll("#feature-bullets ul li span")
//     const abouts = Array<string>()
//     aboutItems.forEach(row => {
//         abouts.push(`${row.textContent?.trim()}`)
//     });


//     // technical details
//     const productDetail = document.querySelectorAll("#productDetails_techSpec_section_1 tr")
//     const productData = Array<{ heading: string, content: string }>()
//     productDetail.forEach(row => {
//         let heading = row.querySelector("th")?.textContent?.trim()
//         let content = row.querySelector("td")?.textContent?.trim().replace(/[^\x00-\x7F]/g, "")
//         let data = { heading: `${heading}`, content: `${content}` }
//         productData.push(data)

//     });


//     // feature images
//     const featuredImages = document.querySelectorAll("#aplus img")
//     const imagesData = Array<string>()
//     featuredImages.forEach(img => {
//         var src: string | null = (img as HTMLImageElement).src
//         if (src.indexOf(".gif") == -1) {
//             src = filterUrl(src)
//             if (src != null) {
//                 imagesData.push(src)
//             }
//         }
//     });


//     // landing images
//     const landingThumbnails = document.querySelectorAll("#altImages li")
//     const landingImageData = Array<string>()
//     landingThumbnails.forEach(li => {

//         if (li.classList.toString() == "a-spacing-small item") {
//             var src = li.querySelector("img")?.src
//             if (src != undefined) {

//                 let filteredUrl = filterUrl(src)
//                 if (filteredUrl != null) {
//                     landingImageData.push(filteredUrl)
//                 }
//             }
//         }

//     });





//     // setting data
//     jsonData.info.title = `${title}`
//     jsonData.info.rating = stringToNumber(`${rating}`)
//     jsonData.info.reviewCount = stringToNumber(`${reviewCount}`)
//     jsonData.info.price = stringToNumber(`${totalPrice}`)
//     jsonData.info.discountPrice = stringToNumber(`${discountPrice}`)

//     jsonData.smallInfo = smallInfo
//     jsonData.aboutItem = abouts
//     jsonData.technicalDetails = productData
//     jsonData.featureImages = imagesData
//     jsonData.landingImages = landingImageData

//     return JSON.stringify(jsonData)
// }


// function filterUrl(url: string) {
//     let lastDotIndex = url.lastIndexOf('.');  // Find the index of the last dot
//     let secondLastDotIndex = url.lastIndexOf('.', lastDotIndex - 1) - 1;  // Find the index of the second last dot

//     if (lastDotIndex !== -1 && secondLastDotIndex !== -1) {
//         let modifiedUrl = url.slice(0, secondLastDotIndex + 1) + url.slice(lastDotIndex);  // Remove the characters in between
//         return modifiedUrl
//     } else {
//         return null
//     }
// }


