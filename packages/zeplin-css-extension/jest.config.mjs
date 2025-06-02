import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    rootDir: path.resolve(__dirname, "."),
    transform: {
        "^.+\\.(js|ts)$": [
            "babel-jest",
            {
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: {
                                node: "current"
                            }
                        }
                    ]
                ]
            }
        ]
    }
};