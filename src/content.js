const fs = require("fs");
const path = require("path");

const sourcePages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "source-cache", "wp-pages.json"), "utf8"),
);

const footerText =
  "Ekamra Medical Concierge Pvt. Ltd. Premium Medical Value Partner – The Landmarks, Sanjay Heights, Gadgadia Square, Proof Road, Balasore – 756001, Odisha – India. CIN: U869090D2026PTC052861";

const navItems = [
  { label: "Why Ekamra", href: "/#section-whyus" },
  { label: "About Us", href: "/#section-about" },
  { label: "FAQ", href: "/#section-faq" },
  { label: "Services and Specialties", href: "/#section-medical" },
  { label: "Operating Model", href: "/#section-opmodel" },
  { label: "Patient Journey", href: "/#section-journey" },
  { label: "Contact Us", href: "/#section-contact" },
];

const pageMeta = {
  home: {
    title: "Ekamra Medical Concierge",
    path: "/",
    showTitle: false,
    description:
      "From specialist consultations and treatment planning to hospital coordination, travel arrangements, and post-treatment recovery.",
  },
  whyus: {
    title: "Receive World-Class Medical Treatment in India—With Personal Concierge Support Every Step of the Way",
    path: "/whyus/",
    showTitle: false,
    description:
      "Experience elite Tier-1 tertiary care at comforting Tier-2 costs under the Ekamra canopy.",
  },
  about: {
    title: "About Ekamra",
    path: "/about/",
    showTitle: true,
    description:
      "Learn about Ekamra Medical Concierge and its Healing & Heritage medical value travel experience in Odisha.",
  },
  medical: {
    title: "Your Medical Pathways: Advanced Science. Personal Advocacy",
    path: "/medical/",
    showTitle: true,
    description:
      "Explore Ekamra Medical Concierge clinical specialties and partner hospital pathways.",
  },
  opmodel: {
    title: "How We Operate: Our Integrated Care Model",
    path: "/opmodel/",
    showTitle: true,
    description:
      "Understand Ekamra Medical Concierge's integrated care model across hospitals, hospitality, travel, and post-care.",
  },
  journey: {
    title: "Ekamra Experience Journey",
    path: "/journey/",
    showTitle: true,
    description:
      "See the Ekamra patient journey from pre-travel clarity to arrival, treatment, recovery, and post-care.",
  },
  faq: {
    title: "Frequently Asked Questions",
    path: "/faq/",
    showTitle: true,
    description:
      "Find clear answers to questions about planning your healing journey under the Ekamra canopy.",
  },
  contact: {
    title: "Begin Your Journey to Healing",
    path: "/contact/",
    showTitle: true,
    description:
      "Contact Ekamra Medical Concierge to request a free consultation or discuss corporate outreach.",
  },
};

function normalizeContent(html) {
  return html
    .replace(/https:\/\/ekamra\.life\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^"'<> )]+)/g, "/assets/img/$1")
    .replace(/https:\/\/ekamra\.life\/wp-content\/plugins\/wpforms-lite\/assets\/images\/submit-spin\.svg/g, "/assets/submit-spin.svg")
    .replace(/href="https:\/\/ekamra\.life\/"/g, 'href="/"')
    .replace(/href="https:\/\/ekamra\.life\/([^"#?]+)"/g, (_match, route) => `href="/${route.replace(/^\/+/, "")}"`)
    .replace(/href="\/(whyus|about|faq|medical|opmodel|journey|contact)\/?"/g, (_match, slug) => `href="/#section-${slug}"`)
    .replace(/action="[^"]*"/g, 'action="/contact/"')
    .replace(/enctype="multipart\/form-data"/g, 'enctype="application/x-www-form-urlencoded"')
    .replace(/<form id="contact-form-([^"]+)"/g, '<form method="post" action="/contact/" id="contact-form-$1"')
    .replace(/<input type="hidden" name="page_url" value="[^"]*">/g, '<input type="hidden" name="page_url" value="/contact/">')
    .replace(/<input type="hidden" name="_wp_http_referer" value="[^"]*" \/>/g, '<input type="hidden" name="_wp_http_referer" value="/contact/" />');
}

function findSource(slug) {
  return sourcePages.find((page) => page.slug === slug);
}

const primaryCareOptions = [
  "Cardiology and Heart Care",
  "Oncology and Cancer Care",
  "Orthopedics and Joint Care",
  "Neurology and Spine Care",
  "Womens Health and Maternity",
  "Critical Care and Robotics Surgery",
  "Dental Care",
  "Ophthalmology (Eye Care)",
];

function consultationForm() {
  const options = primaryCareOptions
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");

  return `
    <div class="consultation-form-wrap">
      <form class="consultation-form" method="post" action="/contact/">
        <div class="form-grid">
          <div class="form-field">
            <label for="consultation-first-name">First Name</label>
            <input id="consultation-first-name" name="firstName" type="text" autocomplete="given-name">
          </div>
          <div class="form-field">
            <label for="consultation-last-name">Last Name</label>
            <input id="consultation-last-name" name="lastName" type="text" autocomplete="family-name">
          </div>
          <div class="form-field">
            <label for="consultation-phone">Phone Number</label>
            <input id="consultation-phone" name="phone" type="tel" autocomplete="tel">
          </div>
          <div class="form-field">
            <label for="consultation-email">Email <span aria-hidden="true">*</span></label>
            <input id="consultation-email" name="email" type="email" autocomplete="email" required>
          </div>
          <div class="form-field">
            <label for="consultation-state">State</label>
            <input id="consultation-state" name="state" type="text" autocomplete="address-level1">
          </div>
          <div class="form-field">
            <label for="consultation-country">Country</label>
            <input id="consultation-country" name="country" type="text" autocomplete="country-name">
          </div>
          <div class="form-field form-field-wide">
            <label for="consultation-care">Primary Medical Care Needed</label>
            <select id="consultation-care" name="primaryCare">${options}</select>
          </div>
        </div>
        <button type="submit" data-alt-text="Sending...">Request Free Consultation</button>
      </form>
    </div>`;
}

const pages = Object.entries(pageMeta).map(([slug, meta]) => {
  const sourceSlug = slug === "home" ? "home" : slug;
  const source = findSource(sourceSlug);
  let content = normalizeContent(source ? source.content.rendered : "");

  if (slug === "contact") {
    const introParagraphs = content.match(/<p class="wp-block-paragraph">[\s\S]*?<\/p>/g)?.slice(0, 2) || [];
    const corporateStart = content.lastIndexOf(
      '<hr class="wp-block-separator alignwide has-text-color has-color-3-color',
    );
    const corporateOutreach = corporateStart >= 0 ? content.slice(corporateStart) : "";
    content = `${introParagraphs.join("\n")}${consultationForm()}<div class="corporate-outreach-wrap">${corporateOutreach}</div>`;
  }

  return {
    slug,
    ...meta,
    sectionId: `section-${slug}`,
    canonical: `https://ekamra.life${meta.path}`,
    content,
  };
});

function getPageByPath(requestPath) {
  const cleanPath = requestPath === "/" ? "/" : `/${requestPath.replace(/^\/|\/$/g, "")}/`;
  return pages.find((page) => page.path === cleanPath) || pages[0];
}

module.exports = { pages, navItems, footerText, getPageByPath };
