"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_cache_1 = __importDefault(require("node-cache"));
const parseData_1 = require("../helpers/parseData");
const cache = new node_cache_1.default({ stdTTL: 300 });
const EXTERNAL_API_URL = "https://rest-test-eight.vercel.app/api/test";
const testUrls = [
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
function fetchFiles(res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cachedData = cache.get("apiData");
            if (cachedData) {
                console.log("Serving from cache");
                return res.json(cachedData);
            }
            const response = yield axios_1.default.get(EXTERNAL_API_URL);
            const structure = {};
            const urls = (0, parseData_1.transformResponse)(response.data.items);
            yield Promise.all(urls.map((url) => __awaiter(this, void 0, void 0, function* () {
                const urlObj = new URL(url);
                const host = urlObj.hostname;
                const pathParts = urlObj.pathname.split("/").filter((part) => part);
                if (!structure[host]) {
                    structure[host] = [];
                }
                (0, parseData_1.addToStructure)(structure[host], pathParts);
            })));
            cache.set("apiData", structure);
            res.json(structure);
        }
        catch (error) {
            console.error("Error fetching data from external API:", error);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    });
}
exports.default = { fetchFiles };
