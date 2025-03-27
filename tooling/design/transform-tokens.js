const StyleDictionary = require("style-dictionary");
const TinyColor = require("@ctrl/tinycolor");
const _ = require("style-dictionary/lib/utils/es6_");

const notDefault = (value, defaultValue) => (value !== defaultValue ? value : "");
const fontFamily = ({ fontFamily }, { fontFamilies } = {}) =>
  fontFamilies && fontFamilies[fontFamily] ? fontFamilies[fontFamily] : `'${fontFamily}'`;

StyleDictionary.registerTransform({
  name: "size/px",
  type: "value",
  matcher: (token) => {
    return (token.unit === "pixel" || token.type === "dimension") && token.value !== 0;
  },
  transformer: (token) => {
    return `${token.value}px`;
  },
});

StyleDictionary.registerTransform({
  name: "size/percent",
  type: "value",
  matcher: (token) => {
    return token.unit === "percent" && token.value !== 0;
  },
  transformer: (token) => {
    return `${token.value}%`;
  },
});

StyleDictionary.registerTransform({
  name: "color/gradients",
  type: "value",
  matcher: function (token) {
    return token.type === "custom-gradient";
  },
  transformer: function ({ value }) {
    const stopsString = value.stops
      .map((stop) => {
        return `${new TinyColor.TinyColor(stop.color).toRgbString()} ${stop.position * 100}%`;
      })
      .join(", ");
    if (value.gradientType === "linear") {
      return `linear-gradient(${value.rotation}deg, ${stopsString})`;
    }
    if (value.gradientType === "radial") {
      return `radial-gradient(${stopsString})`;
    }
  },
});

StyleDictionary.registerTransform({
  name: "font",
  type: "value",

  matcher: function (token) {
    return token.type === "custom-fontStyle";
  },
  transformer: function ({ value: font }, { options }) {
    // font: font-style font-variant font-weight font-size/line-height font-family;
    return `${notDefault(font.fontStretch, "normal")} ${notDefault(font.fontStyle, "normal")} ${
      font.fontWeight
    } rem(${font.fontSize}) unquote("/") rem(${font.lineHeight}) ${fontFamily(font, options)}`.trim();
  },
});

StyleDictionary.registerTransform({
  name: "font",
  type: "value",

  matcher: function (token) {
    return token.type === "custom-fontStyle";
  },
  transformer: function ({ value: font }, { options }) {
    // font: font-style font-variant font-weight font-size/line-height font-family;
    return `${notDefault(font.fontStretch, "normal")} ${notDefault(font.fontStyle, "normal")} ${
      font.fontWeight
    } rem(${font.fontSize}) unquote("/") rem(${font.lineHeight}) ${fontFamily(font, options)}`.trim();
  },
});

//TODO: think about fonts (eg. make a font token for each variant with css variables)
// then change those variables for each size
// make font mixins that combine font,letterspacing, breakpoints
StyleDictionary.registerFormat({
  name: "scss/mixins",
  formatter: function ({ dictionary, platform, options, file }) {
    let mixins = "";

    // sort the breakpoints mobile first (smallest to largest)
    const sortedBreakpointsArray =
      dictionary?.properties?.breakpoints &&
      Object.values(dictionary?.properties?.breakpoints).sort((a, b) => a.original.value - b.original.value);

    // Feed breakpoints to mq as a map
    let breakpoints = "";
    let breakpointsArray = [];
    for (const breakpoint of sortedBreakpointsArray) {
      const breakpointName = breakpoint.attributes.type;
      breakpoints += `  ${breakpointName}: ${breakpoint.value},\n`;
      breakpointsArray.push({ key: breakpointName, value: breakpoint.value });
    }
    if (breakpoints) {
      mixins += `$mq-breakpoints: (\n${breakpoints});\n\n`;
    }

    // sort breakpointsArray by value (smallest to largest) in px

    // create a font token with responsive size
    let fonts = "";
    let fontBreakpointsArray = [];
    for (const [breakpoint, variations] of Object.entries(dictionary?.properties?.font)) {
      // if breakpoint is a breakpoint
      if (dictionary?.properties?.breakpoints[breakpoint]) {
        // loop through font sizes
        for (const [variant, font] of Object.entries(variations)) {
          // create a font token name without breakpoint
          const name = _.kebabCase(`font-${variant}`);
          if (!fontBreakpointsArray[name]) {
            fonts += `$${name}: var(--${name});\n`;
            fontBreakpointsArray[name] = [];
          }
        }
      }
    }

    mixins += fonts;

    return mixins;
  },
});

StyleDictionary.registerFormat({
  name: "scss/cssvars",
  formatter: function ({ dictionary, platform, options, file }) {
    let mixins = "";

    // sort the breakpoints mobile first (smallest to largest)
    const sortedBreakpointsArray = Object.values(dictionary?.properties?.breakpoints).sort(
      (a, b) => a.original.value - b.original.value
    );

    // css vars
    sortedBreakpointsArray.forEach((breakpoint, index) => {
      const breakpointName = breakpoint.attributes.type;
      if (dictionary?.properties?.font[breakpointName]) {
        let fontvars = "";
        for (const [variant, font] of Object.entries(dictionary?.properties?.font[breakpointName])) {
          const name = _.kebabCase(`font-${variant}`);
          fontvars += `   --${name}: #{$${font?.name}};\n`;
        }
        if (index === 0) {
          mixins += fontvars;
        } else {
          mixins += ` @media only screen and (min-width: $breakpoints-${breakpointName}) {\n${fontvars} }\n`;
        }
      }
    });

    mixins = `:root {\n` + mixins + `}\n`;

    return mixins;
  },
});

StyleDictionary.registerTransform({
  name: "effect/box-shadow",
  type: "value",
  matcher: function (token) {
    return token.type === "custom-shadow" && token.value !== 0;
  },
  transformer: function ({ value }) {
    return `${value.shadowType === "innerShadow" ? "inset " : ""}${value.offsetX}px ${value.offsetY}px ${
      value.radius
    }px ${value.spread}px ${new TinyColor.TinyColor(value.color).toRgbString()}`;
  },
});

StyleDictionary.registerTransformGroup({
  name: "custom/css",
  transforms: StyleDictionary.transformGroup["css"].concat(["size/px", "size/percent"]),
});

StyleDictionary.registerTransformGroup({
  name: "custom/scss",
  transforms: StyleDictionary.transformGroup["less"].concat([
    "size/px",
    "size/percent",
    "effect/box-shadow",
    "font",
    "color/gradients",
  ]),
});

StyleDictionary.registerFilter({
  name: "validCategory",
  matcher: function (token) {
    //return token.name === "color" || token === "font" || token === "size" || token === "effect";
    return ["color", "font", "grid", "effect", "breakpoints", "gradient"].includes(token.attributes.category);
  },
});

const baseConfig = {
  source: ["tooling/design/tokens/*.json"],
  platforms: {
    scss: {
      transformGroup: "custom/scss",
      buildPath: "src/styles/tokens/",
      options: {
        // example map font family names
        fontFamilies: {
          Manrope: "var(--manrope)",
          "Scale VF": "var(--scale)",
        },
      },
      files: [
        {
          filter: "validCategory",
          destination: "_generated.scss",
          format: "scss/variables",
        },
        {
          filter: "validCategory",
          destination: "_mixins.scss",
          format: "scss/mixins",
        },
        {
          filter: "validCategory",
          destination: "_cssvars.scss",
          format: "scss/cssvars",
        },
      ],
    },
  },
};
const StyleDictionaryExtended = StyleDictionary.extend(baseConfig);

StyleDictionaryExtended.buildAllPlatforms();
