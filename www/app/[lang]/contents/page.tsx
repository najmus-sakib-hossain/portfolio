"use client"

import * as React from "react";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, limit, orderBy, startAfter } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAD3CP5FLboPrDaVig-R0ZyswKH_KT8wdM",
  authDomain: "portfolio-105c5.firebaseapp.com",
  projectId: "portfolio-105c5",
  storageBucket: "portfolio-105c5.firebasestorage.app",
  messagingSenderId: "1090961552205",
  appId: "1:1090961552205:web:48236ad49bf7326aebfd04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Image upload function
async function uploadImageToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const apiKey = "e9230df1a8b462e236782426e1430227";

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data.data.url;
}

interface BlogPost {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  createdAt: any;
}

export default function Contents() {
  // State for blogs data
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");

  // Form state for add/edit
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  
  // Confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Check admin status on component mount
  useEffect(() => {
    const savedAdminStatus = localStorage.getItem("isAdmin");
    if (savedAdminStatus === "true") {
      setIsAdmin(true);
    }
    
    // Initial fetch
    fetchInitialBlogs();
  }, []);

  // Fetch initial set of blogs
  const fetchInitialBlogs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc"),
        limit(12)
      );
      
      const querySnapshot = await getDocs(q);
      const blogData: BlogPost[] = [];
      
      querySnapshot.forEach((doc) => {
        blogData.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      
      setBlogs(blogData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 12);
      
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load more blogs
  const loadMoreBlogs = async () => {
    if (!lastVisible) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(12)
      );
      
      const querySnapshot = await getDocs(q);
      const blogData: BlogPost[] = [];
      
      querySnapshot.forEach((doc) => {
        blogData.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      
      setBlogs([...blogs, ...blogData]);
      
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }
      
      setHasMore(querySnapshot.docs.length === 12);
      
    } catch (error) {
      console.error("Error loading more blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load more content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify admin password
  const verifyPassword = () => {
    if (password === "Tanvir123@!") {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      setShowPasswordDialog(false);
      toast({
        title: "Success",
        description: "Admin access granted",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  // Handle add/edit blog form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !link || (!imageFile && !imagePreview)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = imagePreview;
      
      // Upload new image if provided
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }
      
      if (isEditMode) {
        // Update existing blog
        await updateDoc(doc(db, "blogs", currentBlogId), {
          name,
          description,
          image: imageUrl,
          link,
          updatedAt: new Date()
        });
        
        toast({
          title: "Success!",
          description: "Content updated successfully",
        });
      } else {
        // Add new blog
        await addDoc(collection(db, "blogs"), {
          name,
          description,
          image: imageUrl,
          link,
          createdAt: new Date()
        });
        
        toast({
          title: "Success!",
          description: "New content added successfully",
        });
      }
      
      // Reset form
      resetForm();
      // Refresh blogs
      fetchInitialBlogs();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving blog:", error);
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setDescription("");
    setLink("");
    setImageFile(null);
    setImagePreview("");
    setIsEditMode(false);
    setCurrentBlogId("");
  };

  // Open edit dialog with blog data
  const handleEdit = (blog: BlogPost) => {
    setCurrentBlogId(blog.id);
    setName(blog.name);
    setDescription(blog.description);
    setLink(blog.link);
    setImagePreview(blog.image);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Confirm and delete blog
  const confirmDelete = async () => {
    if (!blogToDelete) return;
    
    try {
      await deleteDoc(doc(db, "blogs", blogToDelete));
      
      // Update the blogs state by filtering out the deleted item
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete));
      
      toast({
        title: "Success!",
        description: "Content deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  // Prompt for delete confirmation
  const handleDelete = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Open dialog for adding new content
  const handleAddNew = () => {
    if (isAdmin) {
      resetForm();
      setIsDialogOpen(true);
    } else {
      setShowPasswordDialog(true);
    }
  };

  return (
    <div className="container py-8 relative min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">All Contents</h1>
        <Button onClick={handleAddNew} className="bg-primary">
          Add New Content
        </Button>
      </div>
      
      <Separator className="mb-8" />
      
      {/* Content Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={blog.image}
                alt={blog.name}
                fill
                className="object-cover"
              />
              
              {isAdmin && (
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(blog);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="bg-red-500/80 hover:bg-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(blog.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{blog.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {blog.description}
              </p>
              <Link href={blog.link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full">
                  View Content
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {blogs.length === 0 && !loading && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-medium mb-2">No content found</h3>
          <p className="text-muted-foreground">
            {isAdmin ? "Click 'Add New Content' to get started" : "Content will be added soon!"}
          </p>
        </div>
      )}
      
      {/* Load More Button */}
      {hasMore && blogs.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={loadMoreBlogs} 
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
      
      {/* Add/Edit Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Content" : "Add New Content"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter title" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium">Link</label>
              <Input 
                id="link" 
                value={link} 
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter link URL" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image</label>
              {imagePreview && (
                <div className="relative w-full h-40 mb-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <Input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Admin Authentication Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please enter the admin password to continue.
            </p>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" 
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={verifyPassword}>
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}