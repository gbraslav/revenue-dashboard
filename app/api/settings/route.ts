const VALID_FONTS = ["playfair", "inter", "roboto", "opensans", "lato", "merriweather", "montserrat", "nunito", "raleway", "sourcesans", "poppins", "dmsans"] as const;
type FontOption = (typeof VALID_FONTS)[number];

interface Settings {
  font: FontOption;
  backgroundColor: string;
}

const DEFAULTS: Settings = {
  font: "playfair",
  backgroundColor: "#0b1120",
};

let currentSettings: Settings = { ...DEFAULTS };

function isValidHexColor(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

export async function GET() {
  return Response.json(currentSettings);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const { font, backgroundColor } = body;

  if (font !== undefined && !VALID_FONTS.includes(font)) {
    return Response.json(
      { error: `Invalid font. Must be one of: ${VALID_FONTS.join(", ")}` },
      { status: 400 }
    );
  }

  if (backgroundColor !== undefined && !isValidHexColor(backgroundColor)) {
    return Response.json(
      { error: "Invalid backgroundColor. Must be a hex color like #ff00aa" },
      { status: 400 }
    );
  }

  if (font !== undefined) currentSettings.font = font;
  if (backgroundColor !== undefined)
    currentSettings.backgroundColor = backgroundColor;

  return Response.json(currentSettings);
}
