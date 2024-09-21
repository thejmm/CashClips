// src/components/landing/user/dash/api-key-manager.tsx

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardCopyIcon,
  KeyIcon,
  Loader,
  PlusIcon,
  Trash2Icon,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface APIKey {
  id: string;
  api_key: string;
  description: string;
  created_at: string;
  last_used_at: string;
  expires_at: string;
  status: "active" | "revoked";
}

const MAX_KEYS = 3;

const APIKeyManager: React.FC<{ user: any }> = ({ user }) => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<APIKey | null>(null);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showRevokedKeys, setShowRevokedKeys] = useState(false);
  const [isViewingKey, setIsViewingKey] = useState(false);
  const [keyToView, setKeyToView] = useState<APIKey | null>(null);
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch API keys from the server
  const fetchAPIKeys = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/auth/api-keys?user_id=${user.id}`);
    const keys = await response.json();
    setApiKeys(keys);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAPIKeys();
  }, [user]);

  const resetViewState = () => {
    setIsViewingKey(false);
    setKeyToView(null);
    setAuthPassword("");
  };

  // Generate a new API key
  const generateAPIKey = async () => {
    if (!newKeyDescription) {
      toast.error("Description is required for new API key");
      return;
    }

    if (apiKeys.filter((key) => key.status === "active").length >= MAX_KEYS) {
      toast.error(
        `You can only have a maximum of ${MAX_KEYS} active API keys.`,
      );
      return;
    }

    setIsGeneratingKey(true);
    const response = await fetch("/api/auth/api-keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "generate",
        user_id: user.id,
        description: newKeyDescription,
      }),
    });

    const { apiKey } = await response.json();
    setGeneratedKey(apiKey);
    setNewKeyDescription("");
    fetchAPIKeys();
    toast.success("API key generated successfully");
    setIsGeneratingKey(false);
  };

  // Revoke an API key
  const revokeAPIKey = async (api_key_id: string) => {
    setIsDeleting(true);
    await fetch("/api/auth/api-keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "revoke",
        api_key_id,
      }),
    });

    toast.success("API key revoked successfully");
    setApiKeyToDelete(null);
    fetchAPIKeys();
    setIsDeleting(false);
  };

  // Authenticate and view API key
  const authenticateAndViewKey = async () => {
    if (!keyToView) return;

    setIsAuthenticating(true);
    try {
      const response = await fetch("/api/auth/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "authenticate",
          email: user.email,
          password: authPassword,
          api_key_id: keyToView.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const { apiKey } = await response.json();
      setKeyToView((prevKey) => ({ ...prevKey!, api_key: apiKey }));
      setIsViewingKey(true);
      setAuthPassword("");
    } catch (error) {
      toast.error(
        "Authentication failed. Please check your password and try again.",
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API Key copied to clipboard");
  };

  // Filter the keys based on status
  const filteredKeys = showRevokedKeys
    ? apiKeys.filter((key) => key.status === "revoked")
    : apiKeys.filter((key) => key.status === "active");

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-2">
          <CardTitle>API Keys Management</CardTitle>
          <CardDescription>
            Generate, view, and revoke your API keys.
          </CardDescription>
        </div>
        {/* API Key Generation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={
                isGeneratingKey ||
                apiKeys.filter((key) => key.status === "active").length >=
                  MAX_KEYS
              }
            >
              Generate API Key
              <PlusIcon className="ml-2 w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="relative">
              <AlertDialogCancel
                className="absolute top-0 right-0"
                onClick={() => setIsViewDialogOpen(false)}
              >
                <X className="w-4 h-4" />
              </AlertDialogCancel>
              <AlertDialogTitle>Generate API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Enter a name for the new API key.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              placeholder="ProjectName..."
              value={newKeyDescription}
              onChange={(e) => setNewKeyDescription(e.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogAction onClick={generateAPIKey}>
                {isGeneratingKey ? "Generating..." : "Generate Key"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing API Keys */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">API Keys</h3>
        </div>

        {/* Key limit warning */}
        {apiKeys.filter((key) => key.status === "active").length >=
          MAX_KEYS && (
          <p className="text-sm text-muted-foreground">
            You have reached the maximum number of {MAX_KEYS} API keys. Revoke
            an existing key to create a new one.
          </p>
        )}

        {/* Display API keys */}
        {isLoading ? (
          <Skeleton className="bg-accent/20 border animate-pulse h-28 w-full space-y-4" />
        ) : (
          <ul className="space-y-4">
            {filteredKeys.length === 0 ? (
              <p>No API keys available.</p>
            ) : (
              filteredKeys.map((key) => (
                <li
                  key={key.id}
                  className={`p-4 border rounded-lg ${
                    key.status === "revoked" ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{key.description}</p>
                      <p className="text-sm">
                        Created: {new Date(key.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        Last used: {key.last_used_at || "Never"}
                      </p>
                      <p className="text-sm">Status: {key.status}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {key.status === "active" && (
                        <Button
                          variant="destructive"
                          onClick={() => setApiKeyToDelete(key)}
                        >
                          Revoke
                          <Trash2Icon className="ml-2 w-5 h-5" />
                        </Button>
                      )}
                      {key.status === "active" && (
                        <Button
                          onClick={() => {
                            setIsViewDialogOpen(true);
                            setKeyToView(key);
                          }}
                        >
                          View Key
                          <KeyIcon className="ml-2 w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </CardContent>

      {/* Revoke confirmation dialog */}
      {apiKeyToDelete && (
        <AlertDialog
          open={!!apiKeyToDelete}
          onOpenChange={() => setApiKeyToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader className="relative">
              <AlertDialogCancel
                className="absolute top-0 right-0"
                onClick={() => setIsViewDialogOpen(false)}
              >
                <X className="w-4 h-4" />
              </AlertDialogCancel>
              <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke this API key? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                onClick={() => (
                  revokeAPIKey(apiKeyToDelete!.id), setIsViewDialogOpen(false)
                )}
                disabled={isDeleting}
                variant="destructive"
              >
                {isDeleting ? "Revoking..." : "Revoke"}
                <Trash2Icon className="ml-2 w-5 h-5" />
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* View API Key dialog */}
      {keyToView && (
        <AlertDialog
          open={isViewDialogOpen}
          onOpenChange={(open) => {
            setIsViewDialogOpen(open);
            if (!open) {
              resetViewState();
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader className="relative">
              <AlertDialogCancel
                className="absolute top-0 right-0"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  resetViewState();
                }}
              >
                <X className="w-4 h-4" />
              </AlertDialogCancel>
              <AlertDialogTitle>
                <strong>{keyToView?.description}</strong> - API Key
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div>
              <p className="font-semibold">{keyToView?.description}</p>
              <p className="text-sm">
                Created: {new Date(keyToView?.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Last used: {keyToView?.last_used_at || "Never"}
              </p>
              <p className="text-sm">Status: {keyToView?.status}</p>
            </div>
            {isViewingKey && keyToView ? (
              <>
                <p className="text-sm mt-4">Your API key:</p>
                <div className="bg-accent flex justify-between items-center p-2 rounded-lg">
                  <pre>
                    <code>{keyToView.api_key}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(keyToView.api_key)}
                  >
                    <ClipboardCopyIcon className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm mt-4">
                  Enter your password to view the key:
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                  <Button
                    onClick={authenticateAndViewKey}
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? "Authenticating..." : "View Key"}
                  </Button>
                </div>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default APIKeyManager;
