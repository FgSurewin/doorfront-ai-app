import {
  UploadTaskSnapshot,
  StorageError,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from ".";

/* ---------- Using environment variable to determine the root path --------- */
const devPath = "Development_v1"; // 2022/2/14 - v1 for beta-test-2
const rootPath =
  process.env.NODE_ENV === "development" ? devPath : "Production";

/**
 * Upload Blob File
 * Reference: https://firebase.google.com/docs/storage/web/upload-files
 */

export function uploadImage(
  imgBlob: any,
  imageId: string,
  pov: { heading: number; pitch: number; zoom: number },
  pano: string,
  optionFuncs: {
    onSuccess: (imageId: string, imgSrc: string, fileName: string) => void;
    onUpload?: (currentProgress: number) => void;
    onError?: (errorMsg: string) => void;
  }
) {
  // Upload file and metadata to the object 'images/mountains.jpg'
  const currentFileName = `${rootPath}/${pano}/${imageId}`;
  const storageRef = ref(storage, currentFileName);
  const uploadTask = uploadBytesResumable(storageRef, imgBlob);
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed", // or 'firebase.storage.TaskEvent.STATE_CHANGED' | "state_changed"
    (snapshot: UploadTaskSnapshot) => {
      const currentProgress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      optionFuncs.onUpload && optionFuncs.onUpload(currentProgress);
    },
    (error: StorageError) => {
      optionFuncs.onError && optionFuncs.onError(error.message);
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        optionFuncs.onSuccess(imageId, downloadURL, currentFileName);
      });
    }
  );
}

/**
 * Delete Blob File
 * Reference: https://firebase.google.com/docs/storage/web/delete-files
 */
export async function deleteImage(fileName: string) {
  try {
    // Create a reference to the file to delete
    const desertRef = ref(storage, fileName);

    // Delete the file
    await deleteObject(desertRef);
  } catch (error) {
    console.error(error);
  }
}
