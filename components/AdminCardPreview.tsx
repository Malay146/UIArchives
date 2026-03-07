import React from "react";
import UiCard from "@/components/ui-card";
import type { UiCardData } from "@/components/ui-card";

export default function AdminCardPreview({
  title,
  description,
  tag,
  image,
  links,
}: UiCardData) {
  return (
    <div className="w-full max-w-sm pointer-events-none hover:pointer-events-auto">
      <UiCard
        title={title || "Untitled Resource"}
        description={description || "No description provided."}
        tag={tag && (!Array.isArray(tag) || tag.length > 0) ? tag : ["Tag"]}
        image={image || "/graphic.jpg"}
        links={links}
      />
    </div>
  );
}
