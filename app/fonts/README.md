# UI-1 local WOFF2 fonts

Official Be Vietnam Pro webfonts and Fontsource Noto Serif Latin, Vietnamese and Latin Extended subsets. No binary modification. OFL 1.1 licenses are included. Next.js next/font/local serves from the app origin. Only Latin and Vietnamese Noto Serif are preloaded; Latin Extended loads on demand. Browser QA checks actual custom font rendering of Vietnamese glyphs. Other scripts outside the supported subsets fall back to Georgia/serif.

Sources: [Be Vietnam Pro](https://github.com/bettergui/BeVietnamPro/tree/main/fonts/webfonts), [Noto Serif](https://github.com/fontsource/font-files/tree/main/fonts/google/noto-serif).

| File | Git blob SHA | Bytes |
|---|---|---:|
| BeVietnamPro-Regular.woff2 | `a207d2c87c43cb680e5189fe18164a40aed15817` | 38064 |
| BeVietnamPro-Medium.woff2 | `ddfb15dca96b24e321f9c9d2ff87c9418b7a5c49` | 40232 |
| BeVietnamPro-SemiBold.woff2 | `8a59077b5358addf1941f60196eb2194316a4731` | 40464 |
| NotoSerif-Bold-latin.woff2 | `e2501373c85f3e74ce8a919a40cd3fb299929636` | 15232 |
| NotoSerif-Bold-latin-ext.woff2 | `76fa4898bf51d38af3cef4cbf65cb75991cb3d32` | 65496 |
| NotoSerif-Bold-vietnamese.woff2 | `98e799ab8d91fe0cca96ea7414091027d5f9f55d` | 5820 |
| OFL-NotoSerif.txt | `4f3a63e2ea427307308782d4c459f39b2284179c` | 4519 |

The original TTF files are removed from the active tree. Package installation may still require network access. Performance remains subject to Lighthouse on the final commit.
