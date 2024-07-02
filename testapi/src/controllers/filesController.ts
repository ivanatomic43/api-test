import { Response, Request } from "express";
import axios from "axios";
import NodeCache from "node-cache";

import { addToStructure, transformResponse } from "../helpers/parseData";
import type { StructureElement } from "../types/types";

const cache = new NodeCache({ stdTTL: 300 });

const EXTERNAL_API_URL: string = "https://rest-test-eight.vercel.app/api/test";

const testUrls: Array<string> = [
  "http://34.8.32.234:48183/SvnRep/ADV-H5-New/README.txt",
  "http://34.8.32.234:48183/SvnRep/ADV-H5-New/VisualSVN.lck",
  "http://34.8.32.234:48183/SvnRep/ADV-H5-New/hooks-env.tmpl",
  "http://34.8.32.234:48183/SvnRep/AT-APP/README.txt",
  "http://34.8.32.234:48183/SvnRep/AT-APP/VisualSVN.lck",
  "http://34.8.32.234:48183/SvnRep/AT-APP/hooks-env.tmpl",
  "http://34.8.32.234:48183/SvnRep/README.txt",
  "http://34.8.32.234:48183/SvnRep/VisualSVN.lck",
  "http://34.8.32.234:48183/SvnRep/hooks-env.tmpl",
  "http://34.8.32.234:48183/www/README.txt",
  "http://34.8.32.234:48183/www/VisualSVN.lck",
  "http://34.8.32.234:48183/www/hooks-env.tmpl",
];

async function fetchFiles(req: Request, res: Response) {
  try {
    const cachedData = cache.get("apiData");
    if (cachedData) {
      console.log("Serving from cache");
      return res.json(cachedData);
    }

    const response = await axios.get(EXTERNAL_API_URL);

    const structure: StructureElement | string = {};
    const urls = transformResponse(response.data.items);

    await Promise.all(
      urls.map(async (url) => {
        const urlObj = new URL(url);
        const host = urlObj.hostname;
        const pathParts = urlObj.pathname.split("/").filter((part) => part);

        if (!structure[host]) {
          structure[host] = [];
        }

        addToStructure(
          structure[host] as (StructureElement | string)[],
          pathParts
        );
      })
    );

    cache.set("apiData", structure);

    res.json(structure);
  } catch (error) {
    console.error("Error fetching data from external API:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

export default { fetchFiles };
