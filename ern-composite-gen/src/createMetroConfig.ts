import fs from 'fs-extra'
import path from 'path'
import beautify from 'js-beautify'
import os from 'os'

export async function createMetroConfig({
  cwd,
  projectRoot,
  blacklistRe,
  extraNodeModules,
  watchFolders,
}: {
  cwd?: string
  projectRoot?: string
  blacklistRe?: RegExp[]
  extraNodeModules?: { [pkg: string]: string }
  watchFolders?: string[]
}) {
  return fs.writeFile(
    path.join(cwd ?? path.resolve(), 'metro.config.js'),
    beautify.js(`const blacklist = require('metro-config/src/defaults/blacklist');
module.exports = {
  ${projectRoot ? `projectRoot: "${projectRoot}",` : ''}
  ${
    watchFolders
      ? `watchFolders: [ 
        ${watchFolders.map(x => `"${x}"`).join(`,${os.EOL}`)} 
      ],`
      : ''
  }
  resolver: {
    blacklistRE: blacklist([
      // Ignore IntelliJ directories
      /.*\\.idea\\/.*/,
      // ignore git directories
      /.*\\.git\\/.*/,
      // Ignore android directories
      /.*\\/app\\/build\\/.*/,
      ${blacklistRe ? blacklistRe.join(`,${os.EOL}`) : ''}
    ]),
    ${
      extraNodeModules
        ? `extraNodeModules: ${JSON.stringify(extraNodeModules, null, 2)},`
        : ''
    }
    assetExts: [
      // Image formats
      "bmp",
      "gif",
      "jpg",
      "jpeg",
      "png",
      "psd",
      "svg",
      "webp", 
      // Video formats
      "m4v",
      "mov",
      "mp4",
      "mpeg",
      "mpg",
      "webm", 
      // Audio formats
      "aac",
      "aiff",
      "caf",
      "m4a",
      "mp3",
      "wav", 
      // Document formats
      "html",
      "pdf",
      // Font formats
      "otf",
      "ttf", 
      // Archives (virtual files)
      "zip"
    ]
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    assetPlugins: ['ern-bundle-store-metro-asset-plugin'],
  },
};
`)
  )
}
