/* eslint-disable @typescript-eslint/no-explicit-any */
export type Artifact = {
  createdBy: any;
  updatedAt: any;
  createdAt: any;
  _id: string;
  code: string;
  name: string;
  description?: string;
  location?: string;
  quantityCurrent: number;
  status?: string;
  images?: {
    url: string;
    publicId: string;
  }[];
  category?: { _id?: string; name?: string; description?: string } | null;
};

export type GoogleResult = {
  title: string;
  imageUrl: string;
  contextLink?: string;
  snippet?: string;
};

export type ArtifactTransaction = {
  _id: string;
  type: "IMPORT" | "EXPORT" | "ADJUST";
  quantityChange: number;
  reason?: string;
  createdAt: string;
  createdBy?: { fullName?: string; email?: string };
};
