'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { FileText, Trash, Folder, Home, Download } from 'lucide-react';

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
}

interface BreadcrumbPath {
  id: string;
  name: string;
}

interface FileContent {
  content?: string;
  url?: string;
  mimeType: string;
  isText: boolean;
}

export default function HomePage() {
  const [items, setItems] = useState<DriveItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbPath[]>([{ id: 'root', name: 'Root' }]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  useEffect(() => {
    fetchItems(currentFolderId);
  }, [currentFolderId]);

  const fetchItems = async (folderId: string | null) => {
    try {
      const url = folderId ? `/api/drive?folderId=${folderId}` : '/api/drive';
      const response = await fetch(url);
      const data = await response.json();
      if (data.items) {
        setItems(data.items);
      } else {
        setError('Failed to fetch items');
      }
    } catch (err) {
      setError('Error fetching items');
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (currentFolderId) {
        formData.append('folderId', currentFolderId);
      }

      const response = await fetch('/api/drive', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setItems([...items, data.file]);
        setSelectedFile(null);
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      } else {
        setError('Failed to upload file');
      }
    } catch (err) {
      setError('Error uploading file');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName) {
      setError('Please provide a folder name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('folderName', folderName);
      if (currentFolderId) {
        formData.append('folderId', currentFolderId);
      }

      const response = await fetch('/api/drive', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setItems([...items, data.file]);
        setFolderName('');
      } else {
        setError('Failed to create folder');
      }
    } catch (err) {
      setError('Error creating folder');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadItem = async (item: DriveItem) => {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      setError('Cannot read folder content');
      return;
    }
    try {
      setIsMediaLoading(true);
      const response = await fetch('/api/drive/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: item.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setFileContent(data);
      } else {
        setError('Failed to read file');
      }
    } catch (err) {
      setError('Error reading file');
      console.error(err);
    } finally {
      setIsMediaLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/drive', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: itemId }),
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== itemId));
        setDeleteItemId(null);
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('Error deleting item');
      console.error(err);
    }
  };

  const handleFolderClick = (item: DriveItem) => {
    if (item.mimeType !== 'application/vnd.google-apps.folder') return;
    setCurrentFolderId(item.id);
    setBreadcrumbPath([...breadcrumbPath, { id: item.id, name: item.name }]);
    setError(null);
    setFileContent(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = breadcrumbPath.slice(0, index + 1);
    setBreadcrumbPath(newPath);
    setCurrentFolderId(index === 0 ? null : newPath[index].id);
    setError(null);
    setFileContent(null);
  };

  const renderFileContent = (content: FileContent) => {
    if (content.isText) {
      return <pre className="text-sm overflow-auto">{content.content}</pre>;
    }

    if (content.mimeType.startsWith('image/')) {
      return (
        <div>
          {isMediaLoading ? (
            <p>Loading image...</p>
          ) : (
            <>
              <img
                src={content.url}
                alt="File preview"
                className="max-w-full h-auto"
                onError={(e:any) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }}>
                <p className="text-red-500">Failed to load image.</p>
                <a href={content.url} download className="text-blue-500 hover:underline">
                  <Download className="h-4 w-4 inline mr-1" />
                  Download image
                </a>
              </div>
            </>
          )}
        </div>
      );
    }

    if (content.mimeType.startsWith('video/')) {
      return (
        <div>
          {isMediaLoading ? (
            <p>Loading video...</p>
          ) : (
            <video controls className="max-w-full h-auto">
              <source src={content.url} type={content.mimeType} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <p>Unsupported file type: {content.mimeType}</p>
        <a href={content.url} download className="text-blue-500 hover:underline">
          <Download className="h-4 w-4 inline mr-1" />
          Download file
        </a>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Google Drive File Manager</h1>

      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          {breadcrumbPath.map((path, index) => (
            <div key={path.id} className="flex items-center">
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {index === 0 ? <Home className="h-4 w-4 inline mr-1" /> : <Folder className="h-4 w-4 inline mr-1" />}
                  {path.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* File Upload Form */}
      <form onSubmit={handleFileSubmit} className="mb-4 space-y-4">
        <div>
          <Input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isLoading || !selectedFile}>
          {isLoading ? 'Uploading...' : 'Upload File'}
        </Button>
      </form>

      {/* Folder Creation Form */}
      <form onSubmit={handleFolderSubmit} className="mb-8 space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isLoading || !folderName}>
          {isLoading ? 'Creating...' : 'Create Folder'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {/* File Content Display */}
      {fileContent && (
        <div className="mb-8 p-4 border rounded">
          <h2 className="text-lg font-semibold">File Content</h2>
          {renderFileContent(fileContent)}
          <Button onClick={() => setFileContent(null)} className="mt-2">
            Close
          </Button>
        </div>
      )}

      {/* Items List Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.mimeType === 'application/vnd.google-apps.folder' ? (
                    <Folder className="h-4 w-4 inline mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 inline mr-2" />
                  )}
                  {item.mimeType === 'application/vnd.google-apps.folder' ? 'Folder' : 'File'}
                </TableCell>
                <TableCell>
                  {item.mimeType === 'application/vnd.google-apps.folder' ? (
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleFolderClick(item)}
                    >
                      {item.name}
                    </button>
                  ) : (
                    item.name
                  )}
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReadItem(item)}
                    title="Read Item"
                    disabled={item.mimeType === 'application/vnd.google-apps.folder'}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteItemId(item.id)}
                    title="Delete Item"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No items found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}