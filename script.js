const body = document.body;
const nav = document.querySelector(".nav");
const mobileNav = document.querySelector(".mobile-nav");
const mobileNavBackdrop = document.querySelector(".mobile-nav-backdrop");
const mobileToggle = document.querySelector(".mobile-toggle");
const closeButton = document.querySelector(".close-button");
const navLinks = [...document.querySelectorAll(".nav__link, .mobile-nav__link")];
const toast = document.querySelector(".toast");
const sections = [...document.querySelectorAll("main > section[id]")];
let toastTimer;

const lenis = typeof window.Lenis === "function"
  ? new window.Lenis({
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      smoothWheel: true,
      lerp: 0.085,
      wheelMultiplier: 0.9,
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
      prevent: (node) => node instanceof HTMLElement && Boolean(node.closest("dialog[open]")),
    })
  : null;

window.lenis = lenis;

function setMenu(open) {
  body.classList.toggle("menu-open", open);
  mobileToggle.setAttribute("aria-expanded", String(open));
  mobileToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  mobileNav?.setAttribute("aria-hidden", String(!open));
  if (mobileNav) mobileNav.inert = !open;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

let navScrollFrame;

function animateNavScroll(target) {
  cancelAnimationFrame(navScrollFrame);

  const startY = window.scrollY;
  const targetY = startY + target.getBoundingClientRect().top;
  const distance = targetY - startY;
  const duration = 1400;
  const startTime = performance.now();

  function updateScroll(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 4);
    const nextY = startY + distance * easedProgress;

    document.documentElement.scrollTop = nextY;
    document.body.scrollTop = nextY;

    if (progress < 1) {
      navScrollFrame = requestAnimationFrame(updateScroll);
    }
  }

  navScrollFrame = requestAnimationFrame(updateScroll);
}

mobileToggle.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
mobileNavBackdrop?.addEventListener("click", () => setMenu(false));

closeButton.addEventListener("click", () => {
  if (window.innerWidth <= 900) {
    setMenu(false);
  } else {
    nav.classList.toggle("is-hidden");
    closeButton.setAttribute("aria-expanded", String(!nav.classList.contains("is-hidden")));
    showToast(nav.classList.contains("is-hidden") ? "Navigation hidden" : "Navigation restored");
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    setMenu(false);

    const targetId = link.getAttribute("href");
    const target = targetId?.startsWith("#")
      ? document.getElementById(targetId.slice(1))
      : null;

    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    if (lenis) {
      lenis.start();
      lenis.scrollTo(target, {
        force: true,
        lerp: 0.05,
      });
    } else {
      animateNavScroll(target);
    }

    if (window.location.hash !== targetId) {
      window.history.pushState(null, "", targetId);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && body.classList.contains("menu-open")) setMenu(false);
}, { passive: true });

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelector(".phone").addEventListener("click", () => {
  showToast("Opening your phone app…");
});

document.querySelectorAll(".round-button[href]").forEach((link) => {
  link.addEventListener("click", () => showToast(`Opening ${link.getAttribute("aria-label")}…`));
});

const teamToggle = document.querySelector(".team-view-all");
const fullTeamPanel = document.querySelector("#full-team-panel");

if (teamToggle && fullTeamPanel) {
  teamToggle.addEventListener("click", () => {
    const willOpen = fullTeamPanel.hidden;
    fullTeamPanel.hidden = !willOpen;
    teamToggle.setAttribute("aria-expanded", String(willOpen));
    teamToggle.textContent = willOpen ? "Show Less" : "View All";
  });
}

const properties = [
  {
    title: "Modern Family Home",
    price: "$4,500,000",
    image: "assets/property-family-home.png",
    alt: "Modern family home in a forest at sunset",
    description: "A stunning modern home with open living space, a private pool, and a spacious backyard.",
    area: "2,100m²",
    beds: "6 Bed",
    baths: "3 Bath",
    parking: "3 spaces",
    location: "Aspen, Colorado",
    type: "Detached residence",
    year: "2024",
    id: "LH-2401",
  },
  {
    title: "Luxury Beachfront Villa",
    price: "$6,850,000",
    image: "assets/property-beach-villa.png",
    alt: "White luxury beachfront villa with an infinity pool",
    description: "A breathtaking villa with ocean views, a private infinity pool, and immaculate tropical gardens.",
    area: "2,850m²",
    beds: "7 Bed",
    baths: "6 Bath",
    parking: "4 spaces",
    location: "Malibu, California",
    type: "Beachfront villa",
    year: "2025",
    id: "LH-2402",
  },
  {
    title: "Cliffside Concrete Retreat",
    price: "$5,200,000",
    image: "assets/property-cliff-retreat.png",
    alt: "Minimalist concrete home on a rocky coast",
    description: "A sculptural coastal residence where raw concrete, glass, and panoramic sea views exist in harmony.",
    area: "1,940m²",
    beds: "4 Bed",
    baths: "4 Bath",
    parking: "3 spaces",
    location: "Big Sur, California",
    type: "Coastal residence",
    year: "2024",
    id: "LH-2403",
  },
  {
    title: "Skyline Penthouse",
    price: "$7,950,000",
    image: "assets/property-penthouse.png",
    alt: "Glass penthouse with a private pool and city skyline",
    description: "An elevated urban sanctuary with landscaped terraces, a private pool, and uninterrupted skyline views.",
    area: "1,480m²",
    beds: "5 Bed",
    baths: "5 Bath",
    parking: "4 spaces",
    location: "Manhattan, New York",
    type: "Luxury penthouse",
    year: "2025",
    id: "LH-2404",
  },
];

const listingSection = document.querySelector(".listing-section");
const listingStage = document.querySelector(".listing-stage");
const listingDots = [...document.querySelectorAll("[data-listing-index]")];
const propertyDialog = document.querySelector("#property-dialog");

const discoveryProperties = [
  {
    title: "The Grand Haven",
    price: "$1,250,000",
    image: "assets/discover-grand-haven.png",
    alt: "Cantilevered luxury residence on a California ocean cliff",
    description: "A luxurious modern home featuring high ceilings, an open-concept kitchen, and uninterrupted coastal views.",
    area: "2,100 ft²",
    beds: "5 Bed",
    baths: "4 Bath",
    parking: "3 spaces",
    location: "Beverly Hills, California",
    type: "Cliffside residence",
    year: "2024",
    id: "LX-101",
  },
  {
    title: "Ocean Breeze Villa",
    price: "$2,300,000",
    image: "assets/discover-ocean-breeze.png",
    alt: "White sculptural ocean villa surrounded by turquoise water",
    description: "A breathtaking beachfront villa with panoramic ocean views, sculptural interiors, and a private infinity pool.",
    area: "4,500 ft²",
    beds: "6 Bed",
    baths: "5 Bath",
    parking: "4 spaces",
    location: "Miami Beach, Florida",
    type: "Beachfront villa",
    year: "2025",
    id: "LX-102",
  },
  {
    title: "Skyline Residence",
    price: "$980,000",
    image: "assets/discover-skyline.png",
    alt: "Dark minimalist residence projecting from a misty coastal cliff",
    description: "A sophisticated architectural retreat pairing dramatic floor-to-ceiling views with precise minimalist interiors.",
    area: "1,800 ft²",
    beds: "3 Bed",
    baths: "3 Bath",
    parking: "2 spaces",
    location: "New York City, New York",
    type: "Luxury residence",
    year: "2024",
    id: "LX-103",
  },
  {
    title: "Greenfield Estate",
    price: "$750,000",
    image: "assets/discover-greenfield.png",
    alt: "Warm modern residence integrated into a limestone sea rock",
    description: "A serene private estate surrounded by nature, with warm material finishes and generous contemporary interiors.",
    area: "2,700 ft²",
    beds: "4 Bed",
    baths: "4 Bath",
    parking: "3 spaces",
    location: "Austin, Texas",
    type: "Modern estate",
    year: "2023",
    id: "LX-104",
  },
  {
    title: "Sunset Ridge",
    price: "$3,100,000",
    image: "assets/property-beach-villa.png",
    alt: "Curved contemporary villa overlooking the ocean",
    description: "An elegant coastal retreat designed around uninterrupted sunset views, open-air living, and a private pool.",
    area: "3,250 ft²",
    beds: "5 Bed",
    baths: "5 Bath",
    parking: "3 spaces",
    location: "Malibu, California",
    type: "Coastal villa",
    year: "2025",
    id: "LX-105",
  },
  {
    title: "Park Avenue Penthouse",
    price: "$4,850,000",
    image: "assets/property-penthouse.png",
    alt: "Luxury glass penthouse with a private pool and skyline views",
    description: "A private urban residence with landscaped terraces, refined entertaining spaces, and panoramic skyline views.",
    area: "2,400 ft²",
    beds: "4 Bed",
    baths: "4 Bath",
    parking: "2 spaces",
    location: "New York City, New York",
    type: "Luxury penthouse",
    year: "2025",
    id: "LX-106",
  },
];

let activePropertyIndex = 0;
let listingTimer;

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderProperty(index, animate = true) {
  if (!listingStage) return;
  activePropertyIndex = (index + properties.length) % properties.length;
  const previousIndex = (activePropertyIndex - 1 + properties.length) % properties.length;
  const nextIndex = (activePropertyIndex + 1) % properties.length;
  const current = properties[activePropertyIndex];
  const previous = properties[previousIndex];
  const next = properties[nextIndex];

  clearTimeout(listingTimer);
  if (animate) listingStage.classList.add("is-changing");

  listingTimer = setTimeout(() => {
    const mainImage = document.querySelector("[data-listing-image]");
    const previousImage = document.querySelector("[data-peek-prev-image]");
    const nextImage = document.querySelector("[data-peek-next-image]");

    if (mainImage) {
      mainImage.src = current.image;
      mainImage.alt = current.alt;
    }
    if (previousImage) previousImage.src = previous.image;
    if (nextImage) nextImage.src = next.image;

    setText("[data-listing-title]", current.title);
    setText("[data-listing-price]", current.price);
    setText("[data-listing-description]", current.description);
    setText("[data-listing-area]", current.area);
    setText("[data-listing-beds]", current.beds);
    setText("[data-listing-baths]", current.baths);
    setText("[data-peek-prev-title]", previous.title);
    setText("[data-peek-prev-price]", previous.price);
    setText("[data-peek-next-title]", next.title);
    setText("[data-peek-next-price]", next.price);

    listingDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activePropertyIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });

    listingStage.classList.remove("is-changing");
  }, animate ? 140 : 0);
}

document.querySelector(".listing-arrow--previous")?.addEventListener("click", () => renderProperty(activePropertyIndex - 1));
document.querySelector(".listing-arrow--next")?.addEventListener("click", () => renderProperty(activePropertyIndex + 1));

listingDots.forEach((dot) => {
  dot.addEventListener("click", () => renderProperty(Number(dot.dataset.listingIndex)));
});

listingSection?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") renderProperty(activePropertyIndex - 1);
  if (event.key === "ArrowRight") renderProperty(activePropertyIndex + 1);
});

function openPropertyDialog(current) {
  const dialogImage = document.querySelector("[data-dialog-image]");
  const whatsappButton = document.querySelector("[data-dialog-whatsapp]");

  if (dialogImage) {
    dialogImage.src = current.image;
    dialogImage.alt = current.alt;
  }

  setText("[data-dialog-title]", current.title);
  setText("[data-dialog-price]", current.price);
  setText("[data-dialog-description]", current.description);
  setText("[data-dialog-area]", current.area);
  setText("[data-dialog-beds]", current.beds.split(" ")[0]);
  setText("[data-dialog-baths]", current.baths.split(" ")[0]);
  setText("[data-dialog-parking]", current.parking);
  setText("[data-dialog-location]", current.location);
  setText("[data-dialog-type]", current.type);
  setText("[data-dialog-year]", current.year);
  setText("[data-dialog-id]", `ID ${current.id}`);

  if (whatsappButton) {
    const message = `Hello, I would like to schedule a private viewing of ${current.title} (${current.id}), listed at ${current.price}.`;
    whatsappButton.href = `https://wa.me/923199492066?text=${encodeURIComponent(message)}`;
  }

  if (propertyDialog && !propertyDialog.open) {
    propertyDialog.scrollTop = 0;
    propertyDialog.showModal();
  }
}

document.querySelector(".view-detail")?.addEventListener("click", () => {
  openPropertyDialog(properties[activePropertyIndex]);
});

document.querySelectorAll(".discover-card__open").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-discover-index]");
    const property = discoveryProperties[Number(card?.dataset.discoverIndex)];
    if (property) openPropertyDialog(property);
  });
});

const discoverAllButton = document.querySelector(".discover-section__all");
const additionalDiscoverCards = [...document.querySelectorAll(".discover-card--additional")];

discoverAllButton?.addEventListener("click", () => {
  const willExpand = discoverAllButton.getAttribute("aria-expanded") !== "true";
  discoverAllButton.setAttribute("aria-expanded", String(willExpand));
  discoverAllButton.textContent = willExpand ? "Show Less" : "See All Property";
  additionalDiscoverCards.forEach((card) => {
    card.hidden = !willExpand;
  });
});

const insights = [
  {
    image: "assets/insights-sunset-villa.png",
    alt: "Contemporary coastal villa at sunset",
    avatar: "assets/agent-anika.png",
    name: "David Thompson",
    role: "Investment Banker",
    company: "Spherule",
    property: "The Grand Haven",
    quote: "“Luxira Real Estate made the entire home-buying process seamless. The team was professional, and they found me the perfect modern home in Beverly Hills. Highly recommended!”",
    rating: "4.9",
  },
  {
    image: "assets/discover-ocean-breeze.png",
    alt: "Sculptural white ocean villa surrounded by turquoise water",
    avatar: "assets/agent-tiana-k.png",
    name: "Sophia Bennett",
    role: "Creative Director",
    company: "Northstar",
    property: "Ocean Breeze Villa",
    quote: "“Every detail was handled with care, from the first private tour to the final signing. The team understood exactly what I wanted and made the experience effortless.”",
    rating: "5.0",
  },
  {
    image: "assets/discover-skyline.png",
    alt: "Minimalist dark residence above a dramatic misty coastline",
    avatar: "assets/agent-tiana-d.png",
    name: "Michael Chen",
    role: "Technology Founder",
    company: "Aurelia",
    property: "Skyline Residence",
    quote: "“The market insight and discretion were exceptional. I was presented with a focused selection of properties, and the right opportunity became immediately clear.”",
    rating: "4.8",
  },
  {
    image: "assets/property-penthouse.png",
    alt: "Glass penthouse with private pool and panoramic city views",
    avatar: "assets/agent-anika.png",
    name: "Elena Brooks",
    role: "Architect",
    company: "Meridian",
    property: "Park Avenue Penthouse",
    quote: "“Luxira balanced architectural quality, location, and long-term value beautifully. Their guidance gave me complete confidence throughout the purchase.”",
    rating: "4.9",
  },
];

const insightsSlider = document.querySelector(".insights-slider");
const insightImage = document.querySelector("[data-insight-image]");
const insightAvatar = document.querySelector("[data-insight-avatar]");
const insightRating = document.querySelector(".testimonial-card__rating");
const insightProgress = document.querySelector("[data-insight-progress]");
let activeInsightIndex = 0;
let insightsTimer;
let insightPointerStart;

function renderInsight(index, animate = true) {
  if (!insightsSlider) return;
  activeInsightIndex = (index + insights.length) % insights.length;
  const current = insights[activeInsightIndex];

  clearTimeout(insightsTimer);
  if (animate) insightsSlider.classList.add("is-changing");

  insightsTimer = setTimeout(() => {
    if (insightImage) {
      insightImage.src = current.image;
      insightImage.alt = current.alt;
    }
    if (insightAvatar) {
      insightAvatar.src = current.avatar;
      insightAvatar.alt = current.name;
    }

    setText("[data-insight-name]", current.name);
    setText("[data-insight-role]", current.role);
    setText("[data-insight-company]", current.company);
    setText("[data-insight-property]", current.property);
    setText("[data-insight-quote]", current.quote);
    setText("[data-insight-rating]", current.rating);
    setText("[data-insight-count]", `${activeInsightIndex + 1} / ${insights.length}`);

    if (insightProgress) insightProgress.style.width = `${((activeInsightIndex + 1) / insights.length) * 100}%`;
    insightRating?.setAttribute("aria-label", `Rated ${current.rating} out of 5`);
    insightsSlider.classList.remove("is-changing");
  }, animate ? 180 : 0);
}

document.querySelector(".testimonial-card__arrow--previous")?.addEventListener("click", () => renderInsight(activeInsightIndex - 1));
document.querySelector(".testimonial-card__arrow--next")?.addEventListener("click", () => renderInsight(activeInsightIndex + 1));

insightsSlider?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") renderInsight(activeInsightIndex - 1);
  if (event.key === "ArrowRight") renderInsight(activeInsightIndex + 1);
});

insightsSlider?.addEventListener("pointerdown", (event) => {
  if (event.isPrimary) insightPointerStart = event.clientX;
});

insightsSlider?.addEventListener("pointerup", (event) => {
  if (insightPointerStart === undefined) return;
  const distance = event.clientX - insightPointerStart;
  insightPointerStart = undefined;
  if (Math.abs(distance) < 55) return;
  renderInsight(activeInsightIndex + (distance < 0 ? 1 : -1));
});

const faqData = {
  buying: {
    title: "Buying a Home",
    items: [
      ["What types of properties does LeonHome offer?", "We curate contemporary houses, beachfront villas, penthouses, private estates, and select off-market residences in exceptional locations."],
      ["Can I schedule a private property viewing?", "Yes. Choose any property and contact an advisor through WhatsApp or by phone. We arrange private in-person or virtual tours around your schedule."],
      ["How long does the home-buying process take?", "A straightforward purchase commonly takes four to eight weeks. Financing, inspections, legal reviews, and international documentation can affect the timeline."],
      ["Can international clients purchase a property?", "Yes. Our advisors coordinate with local legal and tax specialists to guide international buyers through eligibility, documentation, and closing requirements."],
      ["Can I submit an offer remotely?", "Yes. Offers and supporting documents can be prepared and signed securely online, with your dedicated advisor coordinating each step."],
      ["Are inspections included before purchase?", "We can arrange independent structural, technical, and property-condition inspections before contracts become final."],
      ["Do you offer private or off-market listings?", "Selected off-market residences are available to qualified clients after a confidential consultation with one of our property advisors."],
    ],
  },
  selling: {
    title: "Selling a Property",
    items: [
      ["How is my property's market value calculated?", "We combine comparable sales, location data, architectural quality, condition, market demand, and current buyer behavior to prepare a detailed valuation."],
      ["How will LeonHome market my property?", "Our strategy can include architectural photography, cinematic video, targeted digital campaigns, private client outreach, and carefully managed viewings."],
      ["How long does it usually take to sell?", "Timing depends on pricing, location, property type, and demand. Your advisor will provide a realistic strategy and update it as market feedback arrives."],
      ["Can you manage private viewings for me?", "Yes. We qualify prospective buyers, coordinate every appointment, and provide concise feedback after each private viewing."],
      ["What documents do I need to begin?", "Typically we need proof of ownership, identification, current property records, tax information, and any relevant plans or permits."],
      ["Can my sale remain confidential?", "Yes. We offer discreet off-market representation with controlled distribution to a qualified private-client network."],
    ],
  },
  financing: {
    title: "Financing & Payments",
    items: [
      ["Does LeonHome provide mortgage assistance?", "We introduce clients to trusted lending specialists who can explain available products, eligibility, rates, and approval requirements."],
      ["How much deposit is normally required?", "Deposit requirements vary by country, financing structure, and seller terms. Your advisor will confirm the exact amount before an offer is submitted."],
      ["Are there costs beyond the purchase price?", "Buyers should plan for legal fees, taxes, registration, inspections, financing costs, and any applicable service charges."],
      ["Can I purchase without financing?", "Yes. Cash acquisitions are supported, with the same legal, identity, and source-of-funds checks required by local regulations."],
      ["Are property prices negotiable?", "Some sellers will consider well-supported offers. We use market evidence and current interest levels to help you negotiate with confidence."],
      ["Which currencies are accepted?", "The transaction currency depends on the property's jurisdiction and contract. Specialists can help coordinate compliant international transfers when needed."],
    ],
  },
  legal: {
    title: "Documents & Legal",
    items: [
      ["Will I need an independent lawyer?", "We strongly recommend independent legal representation. We can introduce experienced property lawyers, while you remain free to appoint your own."],
      ["How is property ownership verified?", "Legal professionals review title records, ownership history, restrictions, liens, permits, and other registered information before closing."],
      ["Can contracts be signed digitally?", "Many documents can be signed securely online, subject to local law and the requirements of the lawyers, lender, and registry involved."],
      ["What identity documents are required?", "Valid identification, proof of address, and source-of-funds documentation are commonly required for compliance and contract preparation."],
      ["How is client information protected?", "Documents are shared only with authorized professionals involved in the transaction and handled according to applicable privacy requirements."],
    ],
  },
  support: {
    title: "Customer Support",
    items: [
      ["How do I contact a LeonHome advisor?", "Use the WhatsApp or call buttons on any property detail window. An advisor will respond and continue the conversation personally."],
      ["What are your service hours?", "Digital enquiries are accepted at any time. Advisor availability varies by market, and urgent requests are routed to the appropriate local team."],
      ["Do you support clients after completion?", "Yes. We can coordinate trusted providers for moving, property management, maintenance, interiors, and local services after closing."],
      ["Can I receive updates about new listings?", "Yes. Tell an advisor your preferred locations, budget, and requirements to receive a focused selection of relevant new opportunities."],
      ["Can I change or cancel a viewing?", "Yes. Contact your advisor as soon as possible and they will rearrange the appointment with the owner or listing representative."],
    ],
  },
};

const faqList = document.querySelector("[data-faq-list]");
const faqCategoryTitle = document.querySelector("[data-faq-category-title]");
const faqCategoryButtons = [...document.querySelectorAll("[data-faq-category]")];

function renderFaq(categoryKey) {
  const category = faqData[categoryKey];
  if (!faqList || !category) return;

  if (faqCategoryTitle) faqCategoryTitle.textContent = category.title;
  faqCategoryButtons.forEach((button) => {
    const isActive = button.dataset.faqCategory === categoryKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  faqList.replaceChildren();

  category.items.forEach(([question, answer], index) => {
    const item = document.createElement("article");
    const button = document.createElement("button");
    const questionText = document.createElement("span");
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const answerWrapper = document.createElement("div");
    const answerInner = document.createElement("div");
    const answerText = document.createElement("p");
    const questionId = `faq-${categoryKey}-question-${index}`;
    const answerId = `faq-${categoryKey}-answer-${index}`;
    const startsOpen = index === 0;

    item.className = `faq-item${startsOpen ? " is-open" : ""}`;
    button.className = "faq-question";
    button.type = "button";
    button.id = questionId;
    button.setAttribute("aria-expanded", String(startsOpen));
    button.setAttribute("aria-controls", answerId);
    questionText.textContent = question;
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    iconPath.setAttribute("d", "m6 9 6 6 6-6");
    icon.append(iconPath);
    button.append(questionText, icon);

    answerWrapper.className = "faq-answer";
    answerWrapper.id = answerId;
    answerWrapper.setAttribute("role", "region");
    answerWrapper.setAttribute("aria-labelledby", questionId);
    answerWrapper.setAttribute("aria-hidden", String(!startsOpen));
    answerText.textContent = answer;
    answerInner.append(answerText);
    answerWrapper.append(answerInner);
    item.append(button, answerWrapper);

    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      faqList.querySelectorAll(".faq-item").forEach((otherItem) => {
        otherItem.classList.remove("is-open");
        otherItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
        otherItem.querySelector(".faq-answer")?.setAttribute("aria-hidden", "true");
      });
      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      answerWrapper.setAttribute("aria-hidden", String(!willOpen));
    });

    faqList.append(item);
  });
}

faqCategoryButtons.forEach((button, index) => {
  button.addEventListener("click", () => renderFaq(button.dataset.faqCategory));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextButton = faqCategoryButtons[(index + direction + faqCategoryButtons.length) % faqCategoryButtons.length];
    nextButton.focus();
    nextButton.click();
  });
});

const journeyContactForm = document.querySelector(".journey-contact-form");
const journeyFields = [...(journeyContactForm?.querySelectorAll("input, textarea") ?? [])];

journeyContactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const invalidField = journeyFields.find((field) => !field.checkValidity());

  journeyFields.forEach((field) => {
    field.toggleAttribute("aria-invalid", !field.checkValidity());
  });

  if (invalidField) {
    invalidField.focus();
    showToast("Please complete the contact form.");
    return;
  }

  const formData = new FormData(journeyContactForm);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const requirements = String(formData.get("requirements") ?? "").trim();
  const subject = `Property enquiry from ${name}`;
  const message = `Name: ${name}\nEmail: ${email}\n\nWhat I'm looking for:\n${requirements}`;
  const mailto = `mailto:contact@luxirarestate.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  showToast("Opening your email app…");
  window.location.href = mailto;
});

journeyFields.forEach((field) => {
  field.addEventListener("input", () => field.removeAttribute("aria-invalid"));
});

document.querySelectorAll("[data-legal-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.querySelector(`#${button.dataset.legalDialog}`);
    if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
  });
});

document.querySelectorAll(".legal-dialog").forEach((dialog) => {
  dialog.querySelector(".legal-dialog__close")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelector(".property-dialog__close")?.addEventListener("click", () => propertyDialog?.close());
propertyDialog?.addEventListener("click", (event) => {
  if (event.target === propertyDialog) propertyDialog.close();
});

renderProperty(0, false);
renderInsight(0, false);
renderFaq("buying");

function initPremiumMotion() {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("motion-ready");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    root.classList.add("hero-complete");
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        element.classList.add("is-revealed");
        observer.unobserve(element);

        const finishReveal = (event) => {
          if (event.target !== element || event.animationName !== "premium-element-reveal") return;
          element.classList.remove("is-revealed");
          element.removeAttribute("data-reveal");
          element.style.removeProperty("--reveal-delay");
          element.removeEventListener("animationend", finishReveal);
        };

        element.addEventListener("animationend", finishReveal);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.12 },
  );

  function registerReveal(target, type = "up", delay = 0) {
    const elements = typeof target === "string" ? document.querySelectorAll(target) : target;

    [...elements].forEach((element, index) => {
      if (!(element instanceof HTMLElement) || element.dataset.motionRegistered === "true") return;
      element.dataset.motionRegistered = "true";
      element.dataset.reveal = type;
      element.style.setProperty("--reveal-delay", `${delay * index}ms`);
      revealObserver.observe(element);
    });
  }

  registerReveal(".excellence-section > h2");
  registerReveal(".excellence-intro", "left");
  registerReveal(".excellence-photo", "image");
  registerReveal(".service-item", "right", 90);
  registerReveal(".reviews", "right");

  registerReveal(".team-card", "up", 90);
  registerReveal(".team-copy", "right");

  registerReveal(".listing-heading");
  registerReveal(".listing-peek--previous", "left");
  registerReveal(".listing-card", "image");
  registerReveal(".listing-peek--next", "right");
  registerReveal(".listing-controls", "fade");

  registerReveal(".discover-section__heading");
  registerReveal(".discover-card:not(.discover-card--additional)", "up", 85);
  registerReveal(".discover-section__all", "fade");

  registerReveal(".insights-section__heading h2", "left");
  registerReveal(".insights-section__heading p", "right");
  registerReveal(".insights-slider", "image");

  registerReveal(".faq-section__heading");
  registerReveal(".faq-categories button", "left", 55);
  registerReveal(".faq-content > h3", "fade");
  registerReveal(".faq-item", "up", 55);

  registerReveal(".journey-hero__image", "image");
  registerReveal(".journey-hero__copy > *", "right", 110);
  registerReveal(".journey-connect__intro > *", "left", 110);
  registerReveal(".journey-actions > a", "right", 100);

  registerReveal(".site-footer__top", "fade");
  registerReveal(".site-footer__grid > section", "up", 75);
  registerReveal(".site-footer__bottom", "fade");

  const faqListElement = document.querySelector("[data-faq-list]");
  if (faqListElement) {
    new MutationObserver(() => registerReveal(faqListElement.querySelectorAll(".faq-item"), "up", 55)).observe(faqListElement, {
      childList: true,
    });
  }

  const parallaxElements = [
    [document.querySelector(".excellence-photo img"), 13],
    [document.querySelector(".insights-slider__image"), 10],
    [document.querySelector(".journey-hero__image img"), 14],
  ].filter(([element]) => element instanceof HTMLElement);

  parallaxElements.forEach(([element, distance]) => {
    element.dataset.parallax = "";
    element.dataset.parallaxDistance = String(distance);
  });

  let parallaxFrame = 0;

  function updateParallax() {
    parallaxFrame = 0;
    const viewportHeight = window.innerHeight;
    const mobileFactor = window.innerWidth < 760 ? 0.55 : 1;

    parallaxElements.forEach(([element, distance]) => {
      const bounds = element.parentElement.getBoundingClientRect();
      if (bounds.bottom < -80 || bounds.top > viewportHeight + 80) return;

      const sectionCenter = bounds.top + bounds.height / 2;
      const progress = (viewportHeight / 2 - sectionCenter) / (viewportHeight + bounds.height);
      const offset = Math.max(-distance, Math.min(distance, progress * distance * 2.4)) * mobileFactor;
      element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    });
  }

  function queueParallax() {
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
  }

  if (lenis) lenis.on("scroll", queueParallax);
  else window.addEventListener("scroll", queueParallax, { passive: true });
  window.addEventListener("resize", queueParallax, { passive: true });
  queueParallax();

  requestAnimationFrame(() => root.classList.add("hero-ready"));
  window.setTimeout(() => {
    root.classList.remove("hero-ready");
    root.classList.add("hero-complete");
  }, 1900);
}

initPremiumMotion();
