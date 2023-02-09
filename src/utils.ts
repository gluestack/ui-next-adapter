const fs = require('fs-extra');
const path = require('path');

const getDependenciesFromNodeModules = (
  dir: any,
  nodeModulePackages: any = []
) => {
  const myDependencies = new Map();

  const traverse = (directory: any) => {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverse(filePath);
      } else if (stat.isFile() && file === 'package.json') {
        const packageJson = require(filePath);
        myDependencies.set(packageJson.name, packageJson.dependencies || {});
      }
    }
  };

  nodeModulePackages.map((nodeModulePackage: any) => {
    const nodeModulesDirectory = path.join(
      dir,
      'node_modules',
      nodeModulePackage
    );

    if (fs.existsSync(nodeModulesDirectory)) {
      traverse(nodeModulesDirectory);
    }
  });

  const dependencyList: any = [];

  myDependencies.forEach((packageDependencies, packageName) => {
    dependencyList.push(packageName);
    Object.entries(packageDependencies).forEach(([dependencyName]) => {
      dependencyList.push(dependencyName);
    });
  });

  return dependencyList;
};

const checkIfWorkspace = (currDir: any) => {
  const parentFiles = fs.readdirSync(path.resolve(currDir, '..'));
  const metadata: any = {};

  if (parentFiles.includes('package.json')) {
    const parentPackageJson = require(path.resolve(
      currDir,
      '..',
      'package.json'
    ));

    const workspaces = parentPackageJson.workspaces;
    if (workspaces) {
      metadata['isWorkspace'] = true;
      metadata['workspaces'] = workspaces;
    }
  }
  return metadata;
};

export { getDependenciesFromNodeModules, checkIfWorkspace };
