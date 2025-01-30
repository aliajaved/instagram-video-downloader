"use client";

import { useState } from "react";
import { Download, Instagram, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url) {
      toast.error("Please enter an Instagram URL");
      return;
    }

    if (!url.includes("instagram.com")) {
      toast.error("Please enter a valid Instagram URL");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download video');
      }

      const data = await response.json();
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = data.videoUrl;
      a.download = 'instagram-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Video download started!');
    } catch (error) {
      toast.error(error.message || "Failed to download video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Instagram className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Instagram Video Downloader
            </h1>
            <p className="text-muted-foreground text-lg">
              Download your favorite Instagram videos easily and quickly
            </p>
          </div>

          {/* Download Form */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Paste Instagram video URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleDownload}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">How to Download</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-card">
                <div className="text-center space-y-2">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Copy URL</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy the video URL from Instagram
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="text-center space-y-2">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Paste Link</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste the URL in the input field above
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="text-center space-y-2">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Download</h3>
                  <p className="text-sm text-muted-foreground">
                    Click download and save your video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}