import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Stack,
  Text,
  Flex,
  Button,
  Spinner,
  Badge,
} from "@sanity/ui";
import { useClient } from "sanity";
import { set, unset } from "sanity";
import { SearchIcon, DocumentIcon, CloseIcon } from "@sanity/icons";

// This component provides an enhanced UI for selecting document references
const DocumentSelector = (props) => {
  const { value, onChange, schemaType, renderDefault, elementProps } = props;

  // If the schema type doesn't match what we expect, fall back to the default renderer
  if (!schemaType || typeof schemaType !== "object") {
    return renderDefault(props);
  }

  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<
    Array<{
      _id: string;
      title?: { en?: string; fr?: string; nl?: string };
      fileUrl?: string;
      fileType?: string;
      fileName?: string;
    }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<{
    title?: { en?: string; fr?: string; nl?: string };
    fileName?: string;
    _id?: string;
  } | null>(null);
  const client = useClient({ apiVersion: "2023-01-01" });

  // Fetch the currently selected document's details
  useEffect(() => {
    if (value && value._ref) {
      setIsLoading(true);
      client
        .fetch(
          `*[_id == $id][0]{
          _id,
          title,
          "fileUrl": file.asset->url,
          "fileType": file.asset->mimeType,
          "fileName": file.asset->originalFilename
        }`,
          { id: value._ref }
        )
        .then((doc) => {
          setSelectedDocument(doc);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching referenced document:", error);
          setIsLoading(false);
        });
    } else {
      setSelectedDocument(null);
    }
  }, [value, client]);

  // Search for documents
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      const query = `*[_type == "documents" && (
          title.en match $searchTerm || 
          title.fr match $searchTerm || 
          title.nl match $searchTerm
        )][0...10] {
          _id,
          title,
          "fileUrl": file.asset->url,
          "fileType": file.asset->mimeType,
          "fileName": file.asset->originalFilename
        }`;

      const results = await client.fetch(query, {
        searchTerm: `*${searchTerm}*`,
      });
      setDocuments(results);
    } catch (error) {
      console.error("Error searching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a document
  const selectDocument = (doc) => {
    onChange(
      set({
        _type: "reference",
        _ref: doc._id,
      })
    );
    setDocuments([]);
    setSearchTerm("");
  };

  // Handle clearing the selection
  const clearSelection = () => {
    onChange(unset());
    setSelectedDocument(null);
  };

  // Get the document title in the best available language
  const getDocumentTitle = (doc) => {
    if (!doc || !doc.title) return "Untitled Document";
    return doc.title.en || doc.title.fr || doc.title.nl || "Untitled Document";
  };

  return (
    <Card padding={3} radius={2} shadow={1} marginTop={2}>
      <Stack space={4}>
        {selectedDocument ? (
          <Card padding={3} radius={2} tone="positive">
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={3}>
                <DocumentIcon />
                <Stack space={2}>
                  <Text weight="semibold">
                    {getDocumentTitle(selectedDocument)}
                  </Text>
                  {selectedDocument.fileName && (
                    <Text size={1} muted>
                      {selectedDocument.fileName}
                    </Text>
                  )}
                </Stack>
              </Flex>
              <Button
                mode="ghost"
                tone="critical"
                icon={CloseIcon}
                onClick={clearSelection}
              />
            </Flex>
          </Card>
        ) : (
          <>
            <Flex gap={2}>
              <Box flex={1}>
                <input
                  type="text"
                  placeholder="Search for documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  style={{ width: "100%", padding: "0.5em" }}
                  {...elementProps}
                />
              </Box>
              <Button
                icon={SearchIcon}
                mode="ghost"
                tone="primary"
                onClick={handleSearch}
                disabled={isLoading || !searchTerm.trim()}
              />
            </Flex>

            {isLoading && (
              <Flex justify="center" padding={4}>
                <Spinner />
              </Flex>
            )}

            {!isLoading && documents.length > 0 && (
              <Stack space={2}>
                {documents.map((doc) => (
                  <Card
                    key={doc._id}
                    padding={3}
                    radius={2}
                    shadow={1}
                    onClick={() => selectDocument(doc)}
                    style={{ cursor: "pointer" }}
                  >
                    <Flex align="center" gap={2}>
                      <DocumentIcon />
                      <Text>{getDocumentTitle(doc)}</Text>
                      {doc.fileType && (
                        <Badge mode="outline">
                          {doc.fileType.split("/")[1]?.toUpperCase() ||
                            doc.fileType}
                        </Badge>
                      )}
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}

            {!isLoading && searchTerm && documents.length === 0 && (
              <Text align="center" muted>
                No documents found matching "{searchTerm}"
              </Text>
            )}
          </>
        )}
      </Stack>
    </Card>
  );
};

export default DocumentSelector;
