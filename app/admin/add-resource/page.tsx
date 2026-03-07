"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminCardPreview from "@/components/AdminCardPreview";
import { Input } from "@/components/ui-components/Input";
import Button1 from "@/components/ui-components/Button1";
import Navbar from "@/components/navbar";
import Background from "@/components/background";

export default function AdminResourceGenerator() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    image: "",
    links: {
      website: "",
      twitter: "",
      github: "",
      youtube: "",
    },
  });

  const handleGenerate = async () => {
    if (!url) {
      setError("Please enter a website URL.");
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("url", url);
    if (file) {
      form.append("image", file);
    }

    try {
      const res = await fetch("/api/generate-resource", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate resource");
      }

      setFormData({
        title: data.title || "",
        description: data.description || "",
        tag: data.tag && data.tag.length ? data.tag.join(", ") : "",
        image: data.image || "",
        links: {
          website: data.links?.website || url,
          twitter: data.links?.twitter || "",
          github: data.links?.github || "",
          youtube: data.links?.youtube || "",
        },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const finalTags = formData.tag
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const finalJson = {
    title: formData.title,
    description: formData.description,
    tag: finalTags,
    image: formData.image,
    links: formData.links,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(finalJson, null, 2));
    alert("Copied JSON to clipboard!");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="w-full relative min-h-screen bg-black text-white selection:bg-zinc-800">
      <Background />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 z-10">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-center sm:items-start border-b border-zinc-800/50 pb-6">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-4">
              Resource Generator
            </h1>
            <p className="text-zinc-400 max-w-2xl text-lg">
              Automate generating JSON for UI Archives resources. Paste a URL,
              adjust details, and copy the final JSON.
            </p>
          </div>
          <Button1
            onClick={handleLogout}
            className="px-5 py-2 whitespace-nowrap"
          >
            Logout
          </Button1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Generate Section */}
            <div className="bg-[#121212] rounded-2xl p-6 border border-zinc-800/50 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-zinc-200">
                1. Generate
              </h2>
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Website URL (e.g. https://uiarchives.com/)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  type="url"
                />

                <div className="flex flex-col">
                  <label className="text-sm text-zinc-400 mb-2">
                    Card Image (Required if no image URL is provided)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 transition"
                  />
                </div>

                <Button1
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full justify-center py-3 mt-2"
                >
                  {loading ? "Generating..." : "Generate Resource"}
                </Button1>

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>
            </div>

            {/* Editable Fields Section */}
            <div
              className={`bg-[#121212] rounded-2xl p-6 border border-zinc-800/50 shadow-xl transition-opacity duration-300 ${formData.title || loading ? "opacity-100" : "opacity-50 pointer-events-none"}`}
            >
              <h2 className="text-xl font-semibold mb-4 text-zinc-200">
                2. Edit Details
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <Input
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 outline-none min-h-[100px] text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 transition resize-none text-sm"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Tags (Comma Separated)
                  </label>
                  <Input
                    placeholder="Tags"
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData({ ...formData, tag: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Image URL
                  </label>
                  <Input
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Website
                    </label>
                    <Input
                      placeholder="Website"
                      value={formData.links.website}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, website: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      GitHub
                    </label>
                    <Input
                      placeholder="GitHub"
                      value={formData.links.github}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, github: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      Twitter/X
                    </label>
                    <Input
                      placeholder="Twitter"
                      value={formData.links.twitter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, twitter: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      YouTube
                    </label>
                    <Input
                      placeholder="YouTube"
                      value={formData.links.youtube}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, youtube: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Previews and Output */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Live Preview Card */}
            <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800/30">
              <h2 className="text-xl font-semibold mb-6 text-zinc-200">
                Live Preview
              </h2>
              <div className="flex justify-center items-center w-full min-h-[300px] border border-dashed border-zinc-700 rounded-xl p-4 sm:p-8 relative">
                {!formData.title && !loading ? (
                  <div className="text-zinc-500">
                    Preview will appear here...
                  </div>
                ) : loading ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-zinc-600 border-t-white rounded-full animate-spin mb-4" />
                    <div className="text-zinc-400">
                      Patience, scanning meta tags & uploading image...
                    </div>
                  </div>
                ) : (
                  <AdminCardPreview
                    title={formData.title}
                    description={formData.description}
                    tag={finalTags}
                    image={formData.image}
                    links={formData.links}
                  />
                )}
              </div>
            </div>

            {/* Generated JSON Output */}
            <div className="bg-[#121212] rounded-2xl p-6 border border-zinc-800/50 shadow-xl overflow-hidden flex flex-col flex-1">
              <div className="flex justify-between items-center w-full mb-4">
                <h2 className="text-xl font-semibold text-zinc-200">
                  Generated JSON
                </h2>
                <Button1 onClick={handleCopy} className="px-5 py-2 text-sm">
                  Copy JSON
                </Button1>
              </div>
              <div className="bg-black border border-zinc-800 rounded-xl p-4 overflow-x-auto flex-1">
                <pre className="text-sm font-mono text-zinc-300">
                  {JSON.stringify(finalJson, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
