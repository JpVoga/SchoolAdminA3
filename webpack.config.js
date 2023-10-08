import "process";


export default {
    mode: "development",

    devtool: "source-map",

    entry: {
        index: "./src/index.tsx"
    },

    output: {
        path: (process.cwd() + "/dist/scripts")
    },

    module: {
        rules: [
            // JS Source map rule (prevent source map load fail warnings)
            {
                test: /\.map.js$/,
                enforce: "pre",
                use: ["source-map-loader"]
            },

            // style rule
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },

            // style rule
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },

            // Typescript React rule
            {
                test: /\.(tsx|ts)$/,
                use: ["ts-loader"]
            }
        ]
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".scss", ".css"] // All file types that I intend to import
    }
};