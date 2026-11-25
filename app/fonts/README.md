# UI-1 local fonts

Full original TTF files are vendored to preserve Vietnamese glyph coverage and remove build-time font network requests. No modifications were made to the font binaries. SIL Open Font License 1.1 applies, with copyright notices in the corresponding OFL files.

| File | Upstream path | Upstream Git blob SHA |
|---|---|---|
| BeVietnamPro-Regular.ttf | https://github.com/google/fonts/blob/main/ofl/bevietnampro/BeVietnamPro-Regular.ttf | `dfa34c09fe2bae0626e00aa3265af2119345c27b` |
| BeVietnamPro-Medium.ttf | https://github.com/google/fonts/blob/main/ofl/bevietnampro/BeVietnamPro-Medium.ttf | `d6deb87afdd7ddf003f3d0ab1070ab9df1df0724` |
| BeVietnamPro-SemiBold.ttf | https://github.com/google/fonts/blob/main/ofl/bevietnampro/BeVietnamPro-SemiBold.ttf | `b25bad31fe8984d5db6cbce61a23323bbb68bc97` |
| NotoSerif-Bold.ttf | https://github.com/notofonts/noto-fonts/blob/main/hinted/ttf/NotoSerif/NotoSerif-Bold.ttf | `3d1ffeba22aaf475e37f231b8e159dacab0fe4f9` |
| OFL-BeVietnamPro.txt | https://github.com/google/fonts/blob/main/ofl/bevietnampro/OFL.txt | `9e2c1177b1e7b9b2f63e122d37f8c21bc5dddc65` |
| OFL-NotoSerif.txt | https://github.com/notofonts/noto-fonts/blob/main/LICENSE | `c82d72e422e2d08c5ab439b6bac7c2177ea0c565` |

Next.js uses next/font/local in app/layout.tsx and serves the files from the app origin. Package installation may still require network access. The original TTF files are larger than subsetted WOFF2; no offline-install or performance score is claimed.
