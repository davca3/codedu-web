# Postup aplikace optimalizačních technik

Semestrální projekt XOPWS — Codedu Ostrava.
Měřeno [PageSpeed Insights](https://pagespeed.web.dev/) na produkci `codedu.studio` (GitHub Pages).
Screenshoty PSI v `img/psi/`.

---

## Narativní shrnutí

Výchozí bod optimalizace nebyl příliš dobrý — webová stránka záměrně neobsahovala téměř žádné SEO ani performance best-practices, čemuž odpovídalo i nízké hodnocení v PageSpeed Insights.

Postupoval jsem podle konkrétních doporučení z Insights. Nejprve jsem převedl všechny obrázky z PNG na JPG, čímž jsem snížil velikost přibližně **17×** (z ~12 MB na ~700 KB). JPG jsem následně bez ztráty viditelné kvality re-komprimoval pomocí nástroje **ImageMagick** (`-strip -interlace Plane -sampling-factor 4:2:0 -quality 78`), což ušetřilo dalších **~33 %** dat. Pro moderní prohlížeče jsem k JPG dogeneroval i **WebP** varianty pomocí `cwebp`, které byly ještě o **~40 %** menší. Všechny `<img>` jsem zabalil do `<picture>` elementu se `<source type="image/webp">` a JPG fallbackem.

Ke každému obrázku jsem doplnil **`alt`** atribut s SEO-friendly popisem, **`width`/`height`** pro rezervaci layout slotu (prevence CLS) a u off-screen obrázků **`loading="lazy"`**. Hero LCP obrázek naopak dostal **`fetchpriority="high"`** a v `<head>` jeho `<link rel="preload" as="image">` s `imagesrcset`, aby browser jeho stahování zahájil paralelně s parsováním HTML.

Doplnil jsem chybějící meta tagy — **`<title>`**, **`<meta name="description">`**, **`<meta name="viewport">`** — a deklaraci jazyka **`lang="cs"`** na `<html>`. Externí HTTP odkazy na CDN jsem přepnul na **HTTPS**, čímž jsem odstranil mixed-content blokaci.

Z hlediska **přístupnosti** jsem opravil kontrast v patičce, který byl 1.3:1 (WCAG vyžaduje minimálně 4.5:1) — odstranil jsem inline overrides s barvami `#ccc` na `#eee` a 6px velikostí písma a nechal sekci používat design tokeny ze `style.css` se správným kontrastem. Inline content linky v textu dostaly `text-decoration: underline`, aby byly rozlišitelné nejen barvou, ale i tvarem (WCAG SC 1.4.1).

Načítání **Google Fonts** se ukázalo jako úzké hrdlo kritické cesty — vytvářelo řetězec `HTML → fonts.googleapis.com → fonts.gstatic.com`. Stáhl jsem proto Inter Variable woff2 (latin + latin-ext subsety pro češtinu) přímo na hosting do `css/fonts/`, deklaroval lokální `@font-face` a oba subsety **preloadnul** pomocí `<link rel="preload" as="font" crossorigin>`.

Skripty (jQuery, Bootstrap JS, vlastní `main.js`/`gallery.js`) dostaly atribut **`defer`**, aby neblokovaly parser, ale stahovaly se paralelně. Sloučil jsem **`normalize.css`** do **`style.css`** a redukoval tak počet render-blocking CSS požadavků o jeden round-trip.

Nakonec jsem na základě auditu *„Properly size images"* aplikoval **responsive obrázky** — vygeneroval 800px varianty každého obrázku a doplnil `srcset` + `sizes`, aby si prohlížeč podle viewportu a DPR vybral menší variantu místo plné 1200px verze.

---

## Baseline (před optimalizací)

**Commit:** `0b15a08` · **URL:** https://www.codedu.studio · **Datum:** _doplnit_

| Regrese | Cíl PSI |
|---|---|
| 5× nekomprimovaných PNG (1–3 MB) | LCP, Total Bytes |
| HTTP CDN na HTTPS doméně (mixed content) | Best Practices |
| Render-blocking jQuery + Bootstrap JS v `<head>` | FCP, TBT |
| Chybí `loading="lazy"`, `width`/`height`, `alt` | LCP, CLS, A11y, SEO |
| Chybí `<meta viewport>`, `<meta description>`, `lang` | SEO, mobile usability |
| Patička 6 px text, kontrast `#ddd`/`#eee` (1.3:1) | A11y |
| Externí Google Fonts (kritická cesta) | LCP, Network dependency |
| Dva render-blocking CSS (`normalize.css` + `style.css`) | FCP |
| Plná 1200px varianta obrázku i pro 322px karty | Properly size images |

**Skóre Mobile:** Performance _·_ A11y _·_ BP _·_ SEO — _doplnit_
**Screenshot:** `img/psi/psi-baseline-mobile.png`

---

## Optimalizační kroky (přehled)

| # | Krok | Commit | Cíl auditu |
|---|---|---|---|
| 1 | Vyčištění syntetických regresí (HTTP/JS/CSS bloat/analytics) | `664e0d1` … `d2908dd` | Best Practices, TBT, Unused CSS |
| 2 | PNG → JPG (12 MB → 700 KB) | `45e24b4` | Image delivery, LCP |
| 3 | Re-komprese JPG (mozjpeg-style, −33 %) | `d110e08` | Image delivery |
| 4 | WebP varianty (−40 % vůči JPG) | `c8fe02c` | Modern image formats |
| 5 | `<picture>` + `width`/`height`/`alt`/`loading`/`fetchpriority` | `6e6f433` | Next-gen formats, CLS, A11y |
| 6 | Drop nepoužívaných JS knihoven z homepage | `01d75da` | Render-blocking, Unused JS |
| 7 | Meta tagy + resource hints + `defer` | `6b8aa1e`, `c267776` | SEO, LCP discovery |
| 8 | A11y: kontrast patičky a viditelnost odkazů | `8308004` | Color contrast, Use of color |
| 9 | LCP image discoverability na podstránkách | `4830c2e` | LCP load duration |
| 10 | Self-hosting Inter Variable Font (latin + latin-ext) | `75933d2`, `bd51ffa` | Network dependency tree, LCP |
| 11 | Merge `normalize.css` → `style.css` | `22565a8` | Render-blocking requests |
| 12 | Responsive `srcset`/`sizes` + 800px varianty | `d7294fc` | Properly size images |

---

## Výsledné měření

**Commit:** `03d5083` · **Datum:** _doplnit_

| Kategorie | Skóre |
|---|---|
| Performance | _doplnit_ |
| Accessibility | _doplnit_ |
| Best Practices | _doplnit_ |
| SEO | _doplnit_ |

**Screenshot:** `img/psi/psi-final-mobile.png`

---

## Limitace

**Cache lifetimes (~389 KiB úspora dle PSI)** — GitHub Pages servíruje s `Cache-Control: max-age=600` (10 minut), což Lighthouse vyhodnotí jako krátké. Hlavička není na GitHub Pages konfigurovatelná; mitigace by vyžadovala migraci na Netlify, Cloudflare Pages nebo vlastní CDN. Pro tento projekt fixní hosting podle zadání.

**LCP element render delay (~2 800 ms)** — pod throttlingem PSI Mobile (4–6× CPU slowdown, Slow 4G) zbývá zhruba 2,8 s mezi koncem stahování LCP obrázku a jeho vykreslením. Hlavní brzdy: render-blocking `style.css` (~450 ms na throttled CPU), CSS `filter: brightness(0.7)` na hero (forsuje GPU kompoziční vrstvu) a `IntersectionObserver` setup v `main.js`. Možný další krok by byl **inline critical CSS** — extrakce above-the-fold pravidel do `<style>` v `<head>` a asynchronní načtení zbytku přes `<link rel="preload" onload>`. V tomto projektu nebyl aplikován.

**Google Analytics (gtag.js)** — bod 16 zadání vyžaduje napojení na Google Analytics. Měřící ID `G-5Y0FBFEEMH` vloženo do `<head>` všech 11 HTML stránek bezprostředně za `<title>` (oficiální pozice dle Google docs). Script je načítán přes `async`, takže neblokuje HTML parser, ale třetí strana `googletagmanager.com` (~50 KB JS) přesto srazí PSI Performance o ~2–3 body a objeví se v auditu *„Reduce unused JavaScript"*. Cookie consent banner v této iteraci neřešen (školní projekt).
