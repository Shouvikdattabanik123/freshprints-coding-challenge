import fs from "fs";
import path from "path";
import { Apparel } from "../types/Apparel";

export const readData = async () => {
  try {
    const data = await fs.promises.readFile(
      path.resolve(__dirname, "../datafile/apparels.json")
    );
    return JSON.parse(data.toString());
  } catch (err) {
    console.error(err);
  }
};

export const writeData = async (updatedApparels: Apparel[]) => {
  try {
    await fs.promises.writeFile(
      path.resolve(__dirname, "../datafile/apparels.json"),
      JSON.stringify(updatedApparels)
    );
  } catch (err) {
    console.error(err);
  }
};
