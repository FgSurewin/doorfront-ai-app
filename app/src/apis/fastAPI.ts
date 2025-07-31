// fastAPI.ts

export interface ImageRequest {
  _id: string;
}

export interface UpdateResponse {
  image_id: string;
  message: string;
}


const BASE_URL = process.env.FAST_API_URL || "http://localhost:8000";

export async function updateLabelCoordinates(imageId: string): Promise<UpdateResponse> {
  const response = await fetch(`${BASE_URL}/add-exactCoordinates-and-address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_id: imageId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update label coordinates');
  }

  return response.json();
}

