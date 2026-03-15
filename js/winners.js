const form = document.getElementById("form");
const certificate = document.getElementById("certificate");
const download = document.getElementById("download");

const fields = {
  name: document.getElementById("name"),
  roll: document.getElementById("roll"),
  event: document.getElementById("event"),
  position: document.getElementById("position"),
  date: document.getElementById("date"),
  template: document.getElementById("template"),
};

const defaultTemplate = "img/winner-template.png";

function getTemplateSrc() {
  const file = fields.template.files[0];
  if (!file) return Promise.resolve(defaultTemplate);

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

function fitText(el, maxWidth, minSize) {
  let size = parseFloat(window.getComputedStyle(el).fontSize);
  while (el.scrollWidth > maxWidth && size > minSize) {
    size -= 1;
    el.style.fontSize = `${size}px`;
  }
}

function formatOrdinal(value) {
  const txt = value.trim();
  const match = txt.match(/^(\d+)\s*(st|nd|rd|th)?$/i);
  if (!match) return txt;
  const number = match[1];
  const suffix = (match[2] || "th").toLowerCase();
  return `${number}<span class="suffix">${suffix}</span>`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const templateSrc = await getTemplateSrc();
  certificate.className = "winner";
  certificate.innerHTML = `
    <img src="${templateSrc}" alt="Winner template" />
    <div class="overlay">
      <div class="cert-row row-name">
        <span>This Certificate is presented to</span>
        <span class="field-line field-name">${fields.name.value}</span>
      </div>
      <div class="cert-row row-desc">
        <span>Bearing Roll number</span>
        <span class="field-line field-roll">${fields.roll.value}</span>
        <span>In recognition of their active participation </span>
      </div>
      <div class="cert-row row-position">
      <span> and outstanding performance in securing</span>
        <span class="field-line field-position">${formatOrdinal(fields.position.value)}</span>
        <span>position in the event</span>
        <span class="field-line field-event">${fields.event.value}</span>
      </div>
      <div class="cert-row row-org">
        <span>organized by the</span>
        <span class="orange-static">Department of Computer Science and Engineering</span>
        <span>on</span>
        <span class="field-line field-date">${fields.date.value}</span>
      </div>
    </div>
  `;

  form.style.display = "none";
  certificate.style.display = "block";
  download.style.display = "block";

  fitText(certificate.querySelector(".field-name"), certificate.clientWidth * 0.62, 20);
  fitText(certificate.querySelector(".field-roll"), certificate.clientWidth * 0.3, 18);
  fitText(certificate.querySelector(".field-event"), certificate.clientWidth * 0.62, 20);
  fitText(certificate.querySelector(".field-position"), certificate.clientWidth * 0.1, 18);
  fitText(certificate.querySelector(".field-date"), certificate.clientWidth * 0.2, 16);
});

download.addEventListener("click", () => {
  const opt = {
    margin: 0,
    filename: "winner-certificate.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "px", format: "a2", orientation: "landscape" },
  };

  html2pdf().set(opt).from(certificate).save();
});
