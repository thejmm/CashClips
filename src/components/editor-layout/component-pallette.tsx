import {
  Check,
  ChevronRight,
  Copy,
  FileText,
  Home,
  MoreVertical,
  Pencil,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import {
  ComponentDefinition,
  getAvailableComponents,
} from "@/lib/editor-lib/component-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type PageType = {
  id: string;
  name: string;
  icon: React.ElementType;
};

type TabType = "pages" | "layers";

const ComponentPalette: React.FC = () => {
  const [pages, setPages] = useState<PageType[]>([
    { id: "home", name: "Home", icon: Home },
  ]);
  const [activePage, setActivePage] = useState<string>("home");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("pages");
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState<string>("");
  const [isAddingLayer, setIsAddingLayer] = useState<boolean>(false);

  const renameInputRef = useRef<HTMLInputElement>(null);

  const availableComponents = getAvailableComponents();

  useEffect(() => {
    if (renamingPageId && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [renamingPageId]);

  const addPage = useCallback(() => {
    const newPageId = `page-${pages.length + 1}`;
    setPages((prevPages) => [
      ...prevPages,
      { id: newPageId, name: `/${newPageId}`, icon: FileText },
    ]);
  }, [pages]);

  const startRenaming = useCallback((pageId: string, currentName: string) => {
    setRenamingPageId(pageId);
    setNewPageName(currentName);
  }, []);

  const cancelRenaming = useCallback(() => {
    setRenamingPageId(null);
    setNewPageName("");
  }, []);

  const saveNewName = useCallback(() => {
    if (renamingPageId) {
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.id === renamingPageId ? { ...page, name: newPageName } : page,
        ),
      );
      setRenamingPageId(null);
      setNewPageName("");
    }
  }, [renamingPageId, newPageName]);

  const handlePageAction = useCallback(
    (action: "rename" | "duplicate" | "delete", pageId: string) => {
      switch (action) {
        case "rename":
          const pageToRename = pages.find((p) => p.id === pageId);
          if (pageToRename) {
            startRenaming(pageId, pageToRename.name);
          }
          break;
        case "duplicate":
          setPages((prevPages) => {
            const pageToDuplicate = prevPages.find((p) => p.id === pageId);
            if (!pageToDuplicate) return prevPages;
            const newPage = {
              ...pageToDuplicate,
              id: `${pageId}-copy`,
              name: `${pageToDuplicate.name} (Copy)`,
            };
            return [...prevPages, newPage];
          });
          break;
        case "delete":
          setPages((prevPages) => prevPages.filter((p) => p.id !== pageId));
          break;
      }
    },
    [pages, startRenaming],
  );

  const renderComponentGrid = useCallback(
    (components: ComponentDefinition[]) => (
      <div className="grid grid-cols-2 gap-2">
        {components.map((component) => (
          <div
            key={component.id}
            className="flex flex-col items-center p-2 border rounded bg-card cursor-pointer hover:bg-accent"
          >
            <img
              src={`/elements/${component.name}.png`}
              alt={component.name}
              className="w-full h-full object-contain center mb-1"
            />
            <span className="text-xs">{component.name}</span>
          </div>
        ))}
      </div>
    ),
    [],
  );

  const renderPageItem = useCallback(
    (page: PageType) => (
      <div
        key={page.id}
        className={`flex items-center justify-between p-2 rounded-md ${
          activePage === page.id ? "bg-accent" : "hover:bg-muted"
        }`}
        onClick={() => setActivePage(page.id)}
      >
        <div className="flex items-center flex-grow">
          <page.icon className="mr-2 h-4 w-4" />
          {renamingPageId === page.id ? (
            <div className="flex items-center">
              <Input
                ref={renameInputRef}
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                className="ring-2 h-6 py-0 px-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveNewName();
                  } else if (e.key === "Escape") {
                    cancelRenaming();
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={saveNewName}
                className="h-6 w-6 ml-1"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelRenaming}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <span>{page.name}</span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            alignOffset={-2}
            sideOffset={2}
          >
            <DropdownMenuItem
              disabled={page.id === "home"}
              onClick={() => handlePageAction("rename", page.id)}
              className={
                page.id === "home" ? "cursor-not-allowed" : "cursor-pointer"
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePageAction("duplicate", page.id)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={page.id === "home"}
              onClick={() => handlePageAction("delete", page.id)}
              className={
                page.id === "home" ? "cursor-not-allowed" : "cursor-pointer"
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    [
      activePage,
      renamingPageId,
      newPageName,
      handlePageAction,
      saveNewName,
      cancelRenaming,
    ],
  );

  return (
    <div className="p-2 w-64 border-r bg-background text-foreground">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabType)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="pages" className="flex-1">
            Pages
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex-1">
            Layers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pages" className="p-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Pages</h2>
            <Button variant="ghost" size="icon" onClick={addPage}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-120px)]">
            {pages.map(renderPageItem)}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="layers" className="p-2">
          <Select value={activePage} onValueChange={setActivePage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Layers</h3>
            <DropdownMenu open={isAddingLayer} onOpenChange={setIsAddingLayer}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Block
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[60svw]"
                side="right"
                align="start"
                alignOffset={-2}
                sideOffset={2}
              >
                <div className="p-2">
                  <Input
                    placeholder="Search blocks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <Tabs defaultValue="components">
                    <TabsList className="w-full mb-2">
                      {Object.keys(availableComponents).map((type) => (
                        <TabsTrigger key={type} value={type} className="flex-1">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(availableComponents).map(
                      ([type, categories]) => (
                        <TabsContent key={type} value={type}>
                          <ScrollArea className="h-[50svh]">
                            {Object.entries(categories).map(
                              ([category, components]) => (
                                <div key={category} className="mb-4">
                                  <h4 className="text-sm font-semibold mb-2">
                                    {category}
                                  </h4>
                                  {renderComponentGrid(
                                    components.filter((component) =>
                                      component.name
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase()),
                                    ),
                                  )}
                                </div>
                              ),
                            )}
                          </ScrollArea>
                        </TabsContent>
                      ),
                    )}
                  </Tabs>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentPalette;
