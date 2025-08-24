import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

// Compare two base64 face images
export function compareFace(savedData, newData) {
  try {
    const savedBuffer = Buffer.from(savedData.split(",")[1], "base64");
    const newBuffer = Buffer.from(newData.split(",")[1], "base64");

    const img1 = PNG.sync.read(savedBuffer);
    const img2 = PNG.sync.read(newBuffer);

    // Create diff buffer
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 } // lower threshold = more precise
    );

    const totalPixels = width * height;
    const similarity = ((totalPixels - numDiffPixels) / totalPixels) * 100;

    console.log("Face similarity:", similarity.toFixed(2), "%");

    return similarity > 70; // consider match if similarity > 95%
  } catch (err) {
    console.error("Error comparing faces:", err);
    return false;
  }
}
