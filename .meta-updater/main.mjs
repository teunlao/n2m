import fs from 'fs';
import path from 'path';

/**
 * Рекурсивно ищет директорию целевого пакета, начиная с корня рабочего пространства, игнорируя определенные папки.
 * @param {string} root - Абсолютный путь корня рабочего пространства
 * @param {string} packageName - Имя целевого пакета (без @n2m/)
 * @param {Set<string>} ignoredDirs - Набор имен игнорируемых директорий
 * @returns {string|null} Абсолютный путь к целевому пакету или null, если пакет не найден
 */
function findPackageDir(root, packageName, ignoredDirs = new Set(['node_modules', '.git', '.nx', 'dist'])) {
  const directories = fs.readdirSync(root, { withFileTypes: true });
  for (const directory of directories) {
    const fullPath = path.join(root, directory.name);
    if (directory.isDirectory() && !ignoredDirs.has(directory.name)) {
      if (directory.name === packageName) {
        return fullPath;
      }
      const nestedPath = findPackageDir(fullPath, packageName, ignoredDirs);
      if (nestedPath) {
        return nestedPath;
      }
    }
  }
  return null;
}

/**
 * Вычисляет относительный путь к tsconfig.json целевого пакета
 * @param {string} currentPackagePath - Абсолютный путь текущего пакета
 * @param {string} workspaceRoot - Абсолютный путь корня рабочего пространства
 * @param {string} targetPackageName - Имя целевого пакета (без @n2m/)
 * @returns {string} Относительный путь к tsconfig.json целевого пакета
 */
function calculateRelativePath(currentPackagePath, workspaceRoot, targetPackageName) {
  const targetPackagePath = findPackageDir(workspaceRoot, targetPackageName);
  if (!targetPackagePath) {
    throw new Error(`Package ${targetPackageName} not found in workspace`);
  }
  const relativePath = path.relative(currentPackagePath, targetPackagePath);
  return path.join(relativePath, 'tsconfig.json');
}

/**
 * Проверяет, разрешена ли зависимость
 * @param {string} dependency - Имя зависимости
 * @param {string|string[]} allowedDependencies - Разрешенные зависимости
 * @returns {boolean}
 */
function isDependencyAllowed(dependency, allowedDependencies) {
  if (allowedDependencies === '*') return true;
  if (typeof allowedDependencies === 'string') return dependency === allowedDependencies;
  if (Array.isArray(allowedDependencies)) return allowedDependencies.includes(dependency);
  return false;
}

/**
 * Проверяет, нужно ли обрабатывать пакет
 * @param {string} packageName - Имя пакета
 * @param {string|string[]} targetPackages - Целевые пакеты
 * @returns {boolean}
 */
function shouldProcessPackage(packageName, targetPackages) {
  if (targetPackages === '*') return true;
  if (typeof targetPackages === 'string') return packageName === targetPackages;
  if (Array.isArray(targetPackages)) return targetPackages.includes(packageName);
  return false;
}

/**
 * Проверяет, игнорируется ли зависимость
 * @param {string} dependency - Имя зависимости
 * @param {string|string[]} ignoredDependencies - Игнорируемые зависимости
 * @returns {boolean}
 */
function isDependencyIgnored(dependency, ignoredDependencies) {
  if (ignoredDependencies === '*') return true;
  if (typeof ignoredDependencies === 'string') return dependency === ignoredDependencies;
  if (Array.isArray(ignoredDependencies)) return ignoredDependencies.includes(dependency);
  return false;
}

/**
 * Проверяет, игнорируется ли пакет
 * @param {string} packageName - Имя пакета
 * @param {string|string[]} ignoredPackages - Игнорируемые пакеты
 * @returns {boolean}
 */
function isPackageIgnored(packageName, ignoredPackages) {
  if (ignoredPackages === '*') return true;
  if (typeof ignoredPackages === 'string') return packageName === ignoredPackages;
  if (Array.isArray(ignoredPackages)) return ignoredPackages.includes(packageName);
  return false;
}

export default (workspaceDir) => {
  console.log('meta-updater start at: ', workspaceDir)
  const DOMAIN = '@n2m';
  const allowedDependencies ='*'
  // const allowedDependencies = [
  //   '@n2m/cookies',
  //   '@n2m/core-config',
  //   '@n2m/core-di',
  //   '@n2m/router',
  //   '@n2m/config-eslint',
  //   '@n2m/config-prettier',
  //   '@n2m/adapter-effector',
  //   '@n2m/forms',
  //   '@n2m/core-modules'
  // ];
  // или ['@n2m/adapter-effector'] или '@n2m/core-ui'

  const targetPackages = '*';

  const ignoredDependencies = [
    // '@n2m/config-eslint',
    // '@n2m/config-husky',
    // '@n2m/config-prettier',
    // '@n2m/config-prettier',
    // '@n2m/config-eslint',
  ]
  const ignoredPackages = [
    // packages
    // 'config-eslint',
    // 'config-prettier',
  ];

  return {
    'tsconfig.json': (tsConfig, dir) => {
      const packageName = path.basename(dir.dir);

      if (!shouldProcessPackage(packageName, targetPackages) || isPackageIgnored(packageName, ignoredPackages)) {
        return {
          ...tsConfig,
          references: [],
        };
      }

      const allDependencies = {
        ...dir.manifest.dependencies,
        ...dir.manifest.devDependencies
      };

      const currentPackagePath = dir.dir;
      const workspaceRoot = workspaceDir;

      const references = Object.keys(allDependencies)
        .filter(dep => dep.startsWith(`${DOMAIN}/`))
        .filter(dep => isDependencyAllowed(dep, allowedDependencies))
        .filter(dep => !isDependencyIgnored(dep, ignoredDependencies))
        .map(dep => {
          const packageName = dep.replace(`${DOMAIN}/`, '');
          const relativePath = calculateRelativePath(currentPackagePath, workspaceRoot, packageName);
          return { path: relativePath };
        });

      // Проверяем, находится ли текущий пакет в директории packages
      const isInPackagesDir = currentPackagePath.includes(path.join(workspaceRoot, 'packages'));

      const { noEmit, composite, emitDeclarationOnly, ...restCompilerOptions} = tsConfig.compilerOptions

      return {
        ...tsConfig,
        include: [
          "src/**/*.ts",
          "src/**/*.tsx",
          "src/**/*.d.ts",
          "src/**/*.vue"
        ],
        compilerOptions: {
          ...restCompilerOptions,
          outDir: 'dist',
          rootDir: "src"
        },
        references: references,
        "exclude": [
          "**/node_modules",
          "lib/**/*",
          "dist/**/*"
        ]
      }
    },
  }
}