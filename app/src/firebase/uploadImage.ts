import {
  UploadTaskSnapshot,
  StorageError,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getFirebaseStorage } from ".";

/* ---------- Use environment to set root path ---------- */
const devPath = "Development_v1"; // for dev builds
const rootPath = process.env.NODE_ENV === "development" ? devPath : "Production";

/**
 * Upload Blob File
 * Reference: https://firebase.google.com/docs/storage/web/upload-files
 */
export function uploadImage(
  imgBlob: Blob,
  imageId: string,
  pov: { heading: number; pitch: number; zoom: number },
  pano: string,
  optionFuncs: {
    onSuccess: (imageId: string, imgSrc: string, fileName: string) => void;
    onUpload?: (currentProgress: number) => void;
    onError?: (errorMsg: string) => void;
  }
) {
  try {
    const storage = getFirebaseStorage(); // ✅ Get initialized storage

    const currentFileName = `${rootPath}/${pano}/${imageId}`;
    const storageRef = ref(storage, currentFileName);
    const uploadTask = uploadBytesResumable(storageRef, imgBlob);

    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const currentProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        optionFuncs.onUpload?.(currentProgress);
      },
      (error: StorageError) => {
        optionFuncs.onError?.(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          optionFuncs.onSuccess(imageId, downloadURL, currentFileName);
        });
      }
    );
  } catch (err: any) {
    optionFuncs.onError?.(err.message || "Upload failed");
  }
}

/**
 * Delete Blob File
 * Reference: https://firebase.google.com/docs/storage/web/delete-files
 */
export async function deleteImage(fileName: string) {
  try {
    const storage = getFirebaseStorage(); // ✅ Get initialized storage

    const fileRef = ref(storage, fileName);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Failed to delete image:", error);
  }
}
