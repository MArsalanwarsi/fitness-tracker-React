import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin, UploadIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useDispatch } from "react-redux";
import { getProfile, updateProfileImage } from "@/redux/slice/authSlice";
import { useState, useRef, useEffect } from "react";

export default function ProfileHeader(props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (uploadProgress === 100) {
      dispatch(getProfile());
    }
  }, [uploadProgress, dispatch]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('profile_pic', file);

    try {
      setUploadProgress(10);
      const result =await dispatch(updateProfileImage(formData)).unwrap();
      if(updateProfileImage.fulfilled.match(result)){
        alert('Profile picture updated successfully');
        setUploadProgress(100);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={props.data.user.profile_pic} alt="Profile" />
              <AvatarFallback className="text-2xl">{props.data.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="outline" className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
                  <Camera />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-sky-600/10 dark:bg-sky-400/10">
                    <UploadIcon className="size-4.5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <AlertDialogTitle>Upload Profile Picture</AlertDialogTitle>
                </AlertDialogHeader>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    isDragging ? 'border-sky-600 bg-sky-50 dark:bg-sky-950' : 'border-muted-foreground/25'
                    }`}>
                  <form action="" encType="multipart/form-data">
                    <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden" />
                  </form>

                  <Button
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2 h-auto flex-col gap-2 p-0">
                    <UploadIcon className="size-8 text-sky-600 dark:text-sky-400" />
                    <span className="text-sm font-medium">Drag and drop your image here</span>
                    <span className="text-xs text-muted-foreground">or click to browse</span>
                  </Button>
                </div>
                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-sky-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">{uploadProgress}%</p>
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{props.data.user.name}</h1>
              <Badge variant="secondary">Pro Member</Badge>
            </div>
            <p className="text-muted-foreground">{props.data.user.role.charAt(0).toUpperCase() + props.data.user.role.slice(1)}</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {props.data.user.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined {new Date(props.data.user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
          {/* <Button variant="default">Edit Profile</Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
