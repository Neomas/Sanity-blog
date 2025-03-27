import React from "react";
import HeroComponent from "./Hero";
import USPComponent from "./UspComponent";

// Map Sanity content types to React components
const componentMap = {
  heroComponent: HeroComponent,
  uspComponent: USPComponent,
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
          return null;
        }

        return <Component key={index} {...block} locale={locale} />;
      })}
    </>
  );
};

export default ContentBlockMapper;
