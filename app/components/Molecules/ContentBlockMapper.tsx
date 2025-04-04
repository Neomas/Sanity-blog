import React from "react";
import HeroComponent from "./Hero";
import USPComponent from "./UspComponent";
import BlogGrid from "./BlogGrid";
import DocumentsBlock from "./DocumentsBlock";
import Placeholder from "./Placeholder";

// Map Sanity content types to React components
const componentMap = {
  heroComponent: HeroComponent,
  uspComponent: USPComponent,
  blogGridComponent: BlogGrid,
  documentsBlockComponent: DocumentsBlock,
  hero: Placeholder,
  contentBlock: Placeholder,
  contentTimer: Placeholder,
  newsBlock: Placeholder,
  investmentBlock: Placeholder,
  global: Placeholder,
  mapBlock: Placeholder,
  contactBlock: Placeholder,
  // Add more component mappings here as you create them
};

interface ContentBlockMapperProps {
  blocks?: any[]; // Replace 'any' with a more specific type if possible
  locale?: string;
}

const ContentBlockMapper: React.FC<ContentBlockMapperProps> = ({
  blocks,
  locale,
}) => {
  return (
    <>
      {blocks?.map((block, index) => {
        const Component =
          componentMap[block._type as keyof typeof componentMap];

        if (!Component) {
          console.warn(`No component found for block type: ${block._type}`);
          return <div>{block._type}</div>;
        }

        return <Component key={index} {...block} locale={locale} />;
      })}
    </>
  );
};

export default ContentBlockMapper;
