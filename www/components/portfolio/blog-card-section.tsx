"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BlogCard from './blog-card'
import { blogs, products, projects } from '@/content/article'
import { Separator } from '@/components/ui//separator'
import { lt, preloadCurrentLocale } from '@/lib/utils'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

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
}

export function SocialMedias() {
  const [loaded, setLoaded] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Fetch blogs from Firestore
  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogData: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        blogData.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      setBlogs(blogData);
      setPermissionError(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (error instanceof Error && error.message.includes("permission")) {
        setPermissionError(true);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!link || !imageFile) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload image to ImgBB
      const imageUrl = await uploadImageToImgBB(imageFile);
      
      // Save to Firestore
      await addDoc(collection(db, "blogs"), {
        name,
        description,
        image: imageUrl,
        link,
        createdAt: new Date()
      });
      
      // Reset form
      setName("");
      setDescription("");
      setLink("");
      setImageFile(null);
      setIsOpen(false);
      
      // Refresh blogs
      fetchBlogs();
      
      toast({
        title: "Success!",
        description: "Blog post created successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message.includes("permission")
        ? "Firebase permission error. Please check your Firestore rules."
        : "Failed to create blog post. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error creating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a blog post
  const deleteBlog = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      fetchBlogs();
      toast({
        title: "Success!",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error && error.message.includes("permission")
        ? "Firebase permission error. Please check your Firestore rules."
        : "Failed to delete blog post";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    preloadCurrentLocale().then(() => {
      setLoaded(true);
    });
    fetchBlogs();
  }, []);
  
  return (
    <div className='w-full'>
      <div className='mb-4 flex w-full flex-col items-start justify-center gap-2'>
        <div className="flex w-full justify-between items-center">
          <h1 className='text-xl font-medium tracking-tight'>
            {loaded ? lt("highlights") : "Highlights of My Work"}
          </h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add New Content</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Title field commented out for now
                <div className="space-y-2">
                  <label htmlFor="title">Title</label>
                  <Input 
                    id="title" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter title" 
                  />
                </div>
                */}
                
                {/* Description field commented out for now
                <div className="space-y-2">
                  <label htmlFor="description">Description</label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description" 
                  />
                </div>
                */}
                
                <div className="space-y-2">
                  <label htmlFor="link">Link</label>
                  <Input 
                    id="link" 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter link URL" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="image">Image</label>
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Save"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Separator />
      </div>
      
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className="relative group">
                <Link href={blog.link}>
                  <BlogCard title={blog.name} description={blog.description} image={blog.image} />
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteBlog(blog.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              No blog posts found. Add your first blog post!
            </div>
          )}
        </div>
      
      <Link className='my-4 flex w-full items-center justify-center rounded-md border py-2' href="/thoughts">
        {loaded ? lt("see-all-contents") : "See all contents"}
      </Link>
    </div>
  );
}

export function BigProjects() {
  return (
    <div className='w-full'>
      <div className='mb-4 flex w-full flex-col items-start justify-center gap-2'>
        <h1 className='text-xl font-medium tracking-tight'>Projects</h1>
        <Separator />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {projects?.map((projects) => (
          <Link href={projects?.link} key={projects?.id}>
            <BlogCard title={projects?.title} description={projects?.description} image={projects?.image} />
          </Link>
        ))}
      </div>
      <Link className='my-4 flex w-full items-center justify-center rounded-md border py-2' href="/thoughts">
        See all projects
      </Link>
    </div>
  )
}


export function ProductionGradeProjects() {
  return (
    <div className='w-full'>
      <div className='mb-4 flex w-full flex-col items-start justify-center gap-2'>
        <h1 className='text-xl font-medium tracking-tight'>Products</h1>
        <Separator />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {products?.map((products) => (
          <Link href={products?.link} key={products?.id}>
            <BlogCard title={products?.title} description={products?.description} image={products?.image} />
          </Link>
        ))}
      </div>
      <Link className='my-4 flex w-full items-center justify-center rounded-md border py-2' href="/thoughts">
        See all products
      </Link>
    </div>
  )
}


