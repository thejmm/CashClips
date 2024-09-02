import React, { useEffect, useState } from "react";

import { toast } from "sonner";

interface GoogleDriveItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

const FOLDER_ID = "1bKRhB3KLovpE7YkWHiy-wzvqD90bN_Un"; // Main folder ID

const GoogleDriveDebug: React.FC = () => {
  const [items, setItems] = useState<GoogleDriveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoogleDriveContents = async (folderId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching contents for folder: ${folderId}`);
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status}: ${data.error?.message || "Unknown error"}`,
        );
      }

      setItems(data.files || []);

      if (data.files && data.files.length === 0) {
        console.log("No items found in this folder");
      } else {
        console.log(`Found ${data.files.length} items in the folder`);
      }
    } catch (err) {
      console.error("Error fetching Google Drive contents:", err);
      setError((err as Error).message);
      toast.error("Failed to load contents from Google Drive");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoogleDriveContents(FOLDER_ID);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Google Drive Contents</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Items in folder:</h2>
          {items.length === 0 ? (
            <p>No items found in this folder.</p>
          ) : (
            <ul className="list-disc pl-5">
              {items.map((item) => (
                <li key={item.id} className="mb-2">
                  {item.name} ({item.mimeType})
                  {item.mimeType.includes("folder") && (
                    <button
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => fetchGoogleDriveContents(item.id)}
                    >
                      Open Folder
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => fetchGoogleDriveContents(FOLDER_ID)}
      >
        Refresh
      </button>
    </div>
  );
};

export default GoogleDriveDebug;
