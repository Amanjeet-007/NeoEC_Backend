import ImageKit from "@imagekit/nodejs";
import env from "dotenv";

env.config();

// console.log("IK CONFIG", {
//   publicKey: process.env.IK_PUBLIC_KEY ? "OK" : "MISSING",
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? "OK" : "MISSING",
//   urlEndpoint: process.env.IK_URL_ENDPOINT ? "OK" : "MISSING",
// }); //to check the env is availible

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IK_PUBLIC_KEY,
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  webhookSecret: process.env.IK_WEBHOOK_SECRET,
});

export const uploadFile = async (file) => {
  try {
    const base64 = file.buffer.toString("base64");

    const result = await client.files.upload({
      file: `data:${file.mimetype};base64,${base64}`,
      fileName: file.originalname,
      folder: "/products",
    });

    return result;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    await client.files.delete(fileId)
    // await client.delete(fileId)
    // await client.deleteFile(fileId);
  } catch (error) {
    console.error("Delete Error:", error);
  }
};
