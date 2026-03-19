const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Monorepo workspace root
const workspaceRoot = path.resolve(__dirname, "../..");

const config = getDefaultConfig(__dirname);

// Watch the entire monorepo so metro can resolve workspace packages
config.watchFolders = [workspaceRoot];

// Ensure metro resolves from both the package and root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Exclude temp directories created by canvas/mockup tools to prevent ENOENT crashes
config.resolver.blockList = [
  /\.local[/\\]skills[/\\]\.tmp-.*/,
  /\.local[/\\]skills[/\\]\.tmp-mockup-sandbox-.*/,
];

module.exports = config;
