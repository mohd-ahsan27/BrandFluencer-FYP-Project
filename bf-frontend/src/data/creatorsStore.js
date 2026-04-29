const CREATORS_KEY = "bf_creators_v1";
const CREATOR_IMAGES_KEY = "bf_creator_images_v1";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function getCreators() {
  const creators = safeParse(localStorage.getItem(CREATORS_KEY), []);
  const images = safeParse(localStorage.getItem(CREATOR_IMAGES_KEY), {});

  return creators.map((c) => {
    const imageFromMap = c.imageRef ? images[c.imageRef] : "";
    const imageInline = c.profileImageDataUrl || "";
    const resolvedImage = imageFromMap || imageInline;

    return {
      ...c,
      profileImageDataUrl: resolvedImage,
    };
  });
}

export function getCreatorById(id) {
  const list = getCreators();
  for (let i = 0; i < list.length; i += 1) {
    if (String(list[i].id) === String(id)) return list[i];
  }
  return null;
}

export function addCreator(creator) {
  const creators = safeParse(localStorage.getItem(CREATORS_KEY), []);
  const images = safeParse(localStorage.getItem(CREATOR_IMAGES_KEY), {});

  const nextCreator = { ...creator };
  const img = creator.profileImageDataUrl || "";

  if (img) {
    try {
      if (img.length < 1_000_000) {
        images[creator.id] = img;
        nextCreator.imageRef = creator.id;
        delete nextCreator.profileImageDataUrl;
      }
    } catch {}
  }

  let exists = false;
  for (let i = 0; i < creators.length; i += 1) {
    if (String(creators[i].id) === String(creator.id)) {
      exists = true;
      break;
    }
  }

  let nextCreators = [];
  if (exists) {
    nextCreators = creators.map((c) => {
      if (String(c.id) === String(creator.id)) return nextCreator;
      return c;
    });
  } else {
    nextCreators = [nextCreator, ...creators];
  }

  localStorage.setItem(CREATORS_KEY, JSON.stringify(nextCreators));
  localStorage.setItem(CREATOR_IMAGES_KEY, JSON.stringify(images));

  return nextCreator;
}

export function setCreatorVerified(creatorId, verified) {
  const creators = safeParse(localStorage.getItem(CREATORS_KEY), []);
  if (!Array.isArray(creators)) return creators;

  const updated = creators.map((c) => {
    if (String(c.id) !== String(creatorId)) return c;
    return { ...c, verified: !!verified };
  });

  localStorage.setItem(CREATORS_KEY, JSON.stringify(updated));
  return updated;
}