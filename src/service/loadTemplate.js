export async function loadTemplate(url) {
  const resp = await fetch(url);
  const xmlText = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml"); // XML parse :contentReference[oaicite:0]{index=0}
  // read page settings
  const pageEl = doc.querySelector("page");
  const page = {
    format: pageEl.getAttribute("size"),
    orientation: pageEl.getAttribute("orientation"),
    unit: pageEl.getAttribute("unit"),
  };
  // read font
  const fontEl = doc.querySelector("font");
  const font = {
    family: fontEl.getAttribute("family"),
    size: parseFloat(fontEl.getAttribute("size")),
    color: fontEl.getAttribute("color"),
  };
  // header & footer
  const headerEl = doc.querySelector("header");
  const header = {
    text: headerEl.getAttribute("text"),
    fontSize: parseFloat(headerEl.getAttribute("fontSize")),
    color: headerEl.getAttribute("color"),
    marginTop: parseFloat(headerEl.getAttribute("marginTop")),
  };
  const footerEl = doc.querySelector("footer");
  const footer = {
    text: footerEl.getAttribute("text"),
    fontSize: parseFloat(footerEl.getAttribute("fontSize")),
    color: footerEl.getAttribute("color"),
    marginBottom: parseFloat(footerEl.getAttribute("marginBottom")),
  };
  // columns list
  const columns = Array.from(doc.querySelectorAll("columns > column")).map(
    (c) => ({
      key: c.getAttribute("key"),
      label: c.getAttribute("label"),
    })
  );
  return { page, font, header, footer, columns };
}
