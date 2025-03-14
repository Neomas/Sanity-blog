import React, { useState } from "react";

// Define types for the props
interface LanguageField {
  name: string;
  title: string;
}

interface LocalizedFieldWithToggleProps {
  value?: Record<string, any>;
  onChange?: (newValue: Record<string, any>) => void;
  languageFields: LanguageField[];
}

const LocalizedFieldWithToggle: React.FC<LocalizedFieldWithToggleProps> = ({
  value,
  onChange,
  languageFields,
}) => {
  const [showAdditionalLanguages, setShowAdditionalLanguages] =
    useState<boolean>(false);

  const toggleLanguages = () => {
    setShowAdditionalLanguages(!showAdditionalLanguages);
  };

  return (
    <div>
      {languageFields.map((field) => (
        <div key={field.name}>
          {/* Show English field by default */}
          <label>{field.title}</label>
          <input
            type="text"
            value={value?.[field.name]?.en || ""}
            onChange={(e) =>
              onChange &&
              onChange({
                ...value,
                [field.name]: { en: e.target.value },
              })
            }
          />
          {showAdditionalLanguages && (
            <>
              {/* Show other languages only if the toggle is active */}
              {languageFields
                .filter((langField) => langField.name !== "en")
                .map((langField) => (
                  <div key={langField.name}>
                    <label>{`Translate to ${langField.title}`}</label>
                    <input
                      type="text"
                      value={value?.[field.name]?.[langField.name] || ""}
                      onChange={(e) =>
                        onChange &&
                        onChange({
                          ...value,
                          [field.name]: {
                            ...value?.[field.name],
                            [langField.name]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                ))}
            </>
          )}
        </div>
      ))}
      <button type="button" onClick={toggleLanguages}>
        {showAdditionalLanguages
          ? "Hide Other Languages"
          : "Show Other Languages"}
      </button>
    </div>
  );
};

export default LocalizedFieldWithToggle;
