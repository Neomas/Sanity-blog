import React, { useState } from "react";
import styles from "./LocalizedFieldWithToggle.module.scss";
import {
  PortableTextEditable,
  EditorProvider,
  defineSchema,
  RenderStyleFunction,
  useEditor,
  RenderDecoratorFunction,
} from "@portabletext/editor"; // Adjust the import path if necessary

import { EventListenerPlugin } from "@portabletext/editor/plugins";
// Define types for the props

interface LanguageField {
  name: string; // This is the language code (en, fr, etc.)
  title: string; // This is the display name (English, French, etc.)
}

export interface LocalizedFieldWithToggleProps {
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

  // Find the English language field (default language)
  const defaultLanguage =
    languageFields?.find((lang) => lang.name === "en") || languageFields[0];
  // Get non-default languages
  const additionalLanguages = languageFields?.filter(
    (lang) => lang.name !== defaultLanguage.name
  );

  return (
    <div>
      {/* Default language (English) always shown */}
      <div className={styles.formWrapper}>
        <label>{defaultLanguage.title}</label>
        <input
          type="text"
          className={styles.input}
          value={value?.[defaultLanguage.name] || ""}
          onChange={(e) => {
            if (onChange) {
              onChange({
                ...value,
                [defaultLanguage.name]: e.target.value, // Ensure defaultLanguage is defined
              });
            }
          }}
        />
      </div>

      {/* Additional languages shown only when toggle is on */}
      {showAdditionalLanguages && (
        <>
          {additionalLanguages?.map((lang) => (
            <div key={lang.name} className={styles.formWrapper}>
              <label>{`Translate to ${lang.title}`}</label>
              <input
                type="text"
                className={styles.input}
                value={value?.[lang.name] || ""}
                onChange={(e) => {
                  onChange &&
                    onChange({
                      ...value,
                      [lang.name]: e.target.value,
                    });
                }}
              />
            </div>
          ))}
        </>
      )}

      <button
        className={styles.languageToggle}
        type="button"
        onClick={toggleLanguages}
      >
        {showAdditionalLanguages
          ? "Hide Other Languages"
          : "Show Other Languages"}
      </button>
    </div>
  );
};

export const LocalizedFieldWithToggleTextArea: React.FC<
  LocalizedFieldWithToggleProps
> = ({ value, onChange, languageFields }) => {
  const [showAdditionalLanguages, setShowAdditionalLanguages] =
    useState<boolean>(false);

  const toggleLanguages = () => {
    setShowAdditionalLanguages(!showAdditionalLanguages);
  };

  // Find the English language field (default language)
  const defaultLanguage =
    languageFields.find((lang) => lang.name === "en") || languageFields[0];
  // Get non-default languages
  const additionalLanguages = languageFields.filter(
    (lang) => lang.name !== defaultLanguage.name
  );

  return (
    <div>
      {/* Default language (English) always shown */}
      <div className={styles.formWrapper}>
        <label>{defaultLanguage.title}</label>
        <textarea
          className={styles.input}
          value={value?.[defaultLanguage.name] || ""}
          onChange={(e) => {
            onChange &&
              onChange({
                ...value,
                [defaultLanguage.name]: e.target.value,
              });
          }}
        />
      </div>

      {/* Additional languages shown only when toggle is on */}
      {showAdditionalLanguages && (
        <>
          {additionalLanguages.map((lang) => (
            <div key={lang.name} className={styles.formWrapper}>
              <label>{`Translate to ${lang.title}`}</label>
              <textarea
                className={styles.input}
                value={value?.[lang.name] || ""}
                onChange={(e) => {
                  // console.log({ value });
                  // console.log({ e });
                  onChange &&
                    onChange({
                      ...value,
                      [lang.name]: e.target.value,
                    });
                }}
              />
            </div>
          ))}
        </>
      )}

      <button
        className={styles.languageToggle}
        type="button"
        onClick={toggleLanguages}
      >
        {showAdditionalLanguages
          ? "Hide Other Languages"
          : "Show Other Languages"}
      </button>
    </div>
  );
};

export const LocalizedFieldWithToggleWysiwyg: React.FC<
  LocalizedFieldWithToggleProps
> = ({ value, onChange, languageFields }) => {
  const [showAdditionalLanguages, setShowAdditionalLanguages] =
    useState<boolean>(false);

  const toggleLanguages = () => {
    setShowAdditionalLanguages(!showAdditionalLanguages);
  };

  // Find the English language field (default language)
  const defaultLanguage =
    languageFields.find((lang) => lang.name === "en") || languageFields[0];
  // Get non-default languages
  const additionalLanguages = languageFields.filter(
    (lang) => lang.name !== defaultLanguage.name
  );

  const schemaDefinition = defineSchema({
    // Decorators are simple marks that don't hold any data
    decorators: [{ name: "strong" }, { name: "em" }, { name: "underline" }],
    // Styles apply to entire text blocks
    // There's always a 'normal' style that can be considered the paragraph style
    styles: [
      { name: "normal" },
      { name: "h1" },
      { name: "h2" },
      { name: "h3" },
      { name: "h4" },
      { name: "h5" },
      { name: "blockquote" },
    ],

    // The types below are left empty for this example.
    // See the rendering guide to learn more about each type.

    // Annotations are more complex marks that can hold data (for example, hyperlinks).
    annotations: [],
    // Lists apply to entire text blocks as well (for example, bullet, numbered).
    lists: [],
    // Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
    inlineObjects: [],
    // Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
    blockObjects: [],
  });

  const renderDecorator: RenderDecoratorFunction = (props) => {
    if (props.value === "strong") {
      return <strong>{props.children}</strong>;
    }
    if (props.value === "em") {
      return <em>{props.children}</em>;
    }
    if (props.value === "underline") {
      return <u>{props.children}</u>;
    }
    return <>{props.children}</>;
  };
  const renderStyle: RenderStyleFunction = (props) => {
    if (props.schemaType.value === "h1") {
      return <h1>{props.children}</h1>;
    }
    if (props.schemaType.value === "h2") {
      return <h2>{props.children}</h2>;
    }
    if (props.schemaType.value === "h3") {
      return <h3>{props.children}</h3>;
    }
    if (props.schemaType.value === "blockquote") {
      return <blockquote>{props.children}</blockquote>;
    }
    return <>{props.children}</>;
  };

  function Toolbar() {
    // useEditor provides access to the PTE
    const editor = useEditor();

    // Iterate over the schema (defined earlier), or manually create buttons.
    const styleButtons = schemaDefinition.styles.map((style) => (
      <button
        key={style.name}
        style={{
          backgroundColor: "lightgrey",
          padding: "4px 8px",
          borderRadius: "4px",
          // border: "1px solid grey",
          margin: "0 4px 0 0",
        }}
        onClick={() => {
          // console.log("style", style);
          // Send style toggle event
          editor.send({
            type: "style.toggle",
            style: style.name,
          });
          editor.send({
            type: "focus",
          });
        }}
      >
        {style.name}
      </button>
    ));

    const decoratorButtons = schemaDefinition.decorators.map((decorator) => (
      <button
        key={decorator.name}
        // data-button={`decorator: ${decorator.name}`}
        style={{
          backgroundColor: "lightsteelblue",
          padding: "4px 8px",
          borderRadius: "4px",
          // border: "1px solid grey",
          margin: "0 4px 0 0",
        }}
        onClick={() => {
          // console.log("decorator", decorator);
          // Send decorator toggle event
          editor.send({
            type: "decorator.toggle",
            decorator: decorator.name,
          });
          editor.send({
            type: "focus",
          });
        }}
      >
        {decorator.name}
      </button>
    ));
    return (
      <div className={styles.toolbar}>
        {styleButtons}
        {decoratorButtons}
      </div>
    );
  }

  // const renderBlock: RenderStyleFunction = (props) => {
  //   if (props?.schemaType?.name === "customComponent") {
  //     return (
  //       <div
  //         style={{
  //           padding: "10px",
  //           backgroundColor: "#f0f0f0",
  //           border: "1px solid #ccc",
  //         }}
  //       >
  //         <h4>Custom Component</h4>
  //         <button onClick={() => alert("Clicked!")}>Click Me</button>
  //       </div>
  //     );
  //   }

  //   return <div>{props.children ?? null}</div>;
  // };

  return (
    <div>
      {/* Default language (English) always shown */}
      <EditorProvider
        initialConfig={{
          schemaDefinition,
          initialValue: value?.[defaultLanguage.name] || [],
        }}
      >
        <div className={styles.formWrapper}>
          <label>{defaultLanguage.title}</label>
          <EventListenerPlugin
            on={(event: any) => {
              if (event.type === "mutation") {
                onChange &&
                  onChange({
                    ...value,
                    [defaultLanguage.name]: event.value,
                  });
              }
            }}
          />
          <Toolbar />
          <PortableTextEditable
            className={`${styles.input} ${styles.editable}`}
            value={value?.[defaultLanguage.name] || []}
            renderStyle={renderStyle}
            renderDecorator={renderDecorator}
            renderBlock={(props) => <>{props.children}</>}
            renderListItem={(props) => <>{props.children}</>}
          />
        </div>

        {/* Additional languages shown only when toggle is on */}
        {showAdditionalLanguages &&
          additionalLanguages?.map((lang) => (
            <EditorProvider
              key={lang.name}
              initialConfig={{
                schemaDefinition,
                initialValue: value?.[lang.name] || [],
              }}
            >
              <div className={styles.formWrapper}>
                <Toolbar />
                <label>{`Translate to ${lang.title}`}</label>
                <EventListenerPlugin
                  on={(event: any) => {
                    if (event.type === "mutation") {
                      onChange &&
                        onChange({
                          ...value,
                          [lang.name]: event.value,
                        });
                    }
                  }}
                />
                <PortableTextEditable
                  className={`${styles.input} ${styles.editable}`}
                  value={value?.[lang.name] || []}
                  onChange={(newValue) => {
                    onChange &&
                      onChange({
                        ...value,
                        [lang.name]: newValue,
                      });
                  }}
                  renderStyle={renderStyle}
                  renderDecorator={renderDecorator}
                  renderBlock={(props) => <div>{props.children}</div>}
                  renderListItem={(props) => <>{props.children}</>}
                ></PortableTextEditable>
              </div>
            </EditorProvider>
          ))}
      </EditorProvider>

      <button
        className={styles.languageToggle}
        type="button"
        onClick={toggleLanguages}
      >
        {showAdditionalLanguages
          ? "Hide Other Languages"
          : "Show Other Languages"}
      </button>
    </div>
  );
};

export default LocalizedFieldWithToggle;
