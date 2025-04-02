import React, { useState } from "react";
import { Box, Card, Flex, Tab, TabList, TabPanel } from "@sanity/ui";
import { set, unset } from "sanity";
import { supportedLanguages } from "@lib/utils";

// This component handles localized text/string fields in Sanity
const LocalizedInput = (props) => {
  const {
    value,
    onChange,
    schemaType,
    renderDefault,
    elementProps,
    focusRef,
    presence,
    compareValue,
    validation,
    markers,
  } = props;

  const [selectedTab, setSelectedTab] = useState(0);

  // If the schema type doesn't match what we expect, fall back to the default renderer
  if (!schemaType || typeof schemaType !== "object") {
    return renderDefault(props);
  }

  // Function to handle changing the value for a specific language
  const handleValueChange = (event, lang) => {
    const fieldValue = event.currentTarget.value;
    const patch = fieldValue ? set({ [lang]: fieldValue }) : unset([lang]);

    onChange(patch);
  };

  // Determine if this is a string or text field
  const isStringField =
    schemaType.type === "string" || schemaType.name === "localeString";

  return (
    <Card padding={0} radius={2} shadow={1} marginTop={2}>
      <Flex direction="column">
        <TabList space={2}>
          {supportedLanguages.map((lang, index) => (
            <Tab
              key={lang.id}
              aria-controls={`panel-${lang.id}`}
              id={`tab-${lang.id}`}
              label={lang.title}
              onClick={() => setSelectedTab(index)}
              selected={index === selectedTab}
            />
          ))}
        </TabList>

        {supportedLanguages.map((lang, index) => (
          <TabPanel
            key={lang.id}
            aria-labelledby={`tab-${lang.id}`}
            hidden={index !== selectedTab}
            id={`panel-${lang.id}`}
          >
            <Box padding={4}>
              {isStringField ? (
                <input
                  type="text"
                  id={`field-${lang.id}`}
                  value={(value && value[lang.id]) || ""}
                  onChange={(e) => handleValueChange(e, lang.id)}
                  ref={index === 0 ? focusRef : undefined}
                  style={{ width: "100%", padding: "0.5em" }}
                  {...elementProps}
                />
              ) : (
                <textarea
                  id={`field-${lang.id}`}
                  value={(value && value[lang.id]) || ""}
                  onChange={(e) => handleValueChange(e, lang.id)}
                  ref={index === 0 ? focusRef : undefined}
                  rows={5}
                  style={{ width: "100%", padding: "0.5em" }}
                  {...elementProps}
                />
              )}
            </Box>
          </TabPanel>
        ))}
      </Flex>
    </Card>
  );
};

export default LocalizedInput;
