"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unplugin_swc_1 = __importDefault(require("unplugin-swc"));
const config_1 = require("vitest/config");
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        root: './'
    },
    plugins: [
        (0, vite_tsconfig_paths_1.default)(),
        unplugin_swc_1.default.vite({
            module: { type: 'es6' }
        })
    ]
});
//# sourceMappingURL=vitest.config.js.map