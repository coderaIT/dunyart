export type UploadedImage = { imageUrl: string; publicId: string };

export async function uploadFiles(files: File[]): Promise<UploadedImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "فشل رفع الصور");
  }
  const data = (await res.json()) as { files: UploadedImage[] };
  return data.files;
}

export async function deleteUploadedFile(publicId: string): Promise<void> {
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  }).catch(() => {});
}
