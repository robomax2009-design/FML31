# LG webOS layout adaptation

This version keeps the original HTML content and design styles, and loads `css/webos.css` after `css/style.css`. The override uses flexbox and explicit dimensions for the main layout and QR cards, following the simple flex positioning pattern used by the working FML31 site (`.cardholder` / `.card_full`).

Only the `television/` folder is included. Do not replace the existing `stats/` directory. `js/main.js` uses the relative API path `/fml31/stats/telemetry.php`.

Test on the TV after uploading. This archive has not been tested on the physical TV; if anything still shifts, send a photo of the full screen and the TV model if available.
