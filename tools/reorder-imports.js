/*
  This jscodeshift transform script reorders import statements in TSX files to match the following group ordering:

  Group 0: External core libraries (react, react-router-dom) – (no comment)
  Group 1: Redux related imports (e.g. imports from '@/redux') – (no comment)
  Group 2: My components (imports from '@/components' except '@/components/ui') – prepended with '// My components'
  Group 3: Hooks (imports from '@/hooks') – prepended with '// Hooks'
  Group 4: Env vars (imports from '@/helpers') – prepended with '// Env vars'
  Group 5: Types (imports from '@polylink/shared') – prepended with '// Types'
  Group 6: UI Components (imports from '@/components/ui' or from 'lucide-react') – prepended with '// UI Components'

  To run this transform, use jscodeshift on your TSX files directory. For example:
  npx jscodeshift -t tools/reorder-imports.js Client/src --extensions=tsx,ts
*/

module.exports = function (file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Function to determine group number based on the import source
  function getGroup(node) {
    const source = node.source.value;
    if (source === "react" || source === "react-router-dom") {
      return 0;
    } else if (source.startsWith("@/redux")) {
      return 1;
    } else if (
      source.startsWith("@/components/ui") ||
      source === "lucide-react"
    ) {
      return 6;
    } else if (source.startsWith("@/components")) {
      return 2;
    } else if (source.startsWith("@/hooks")) {
      return 3;
    } else if (source.startsWith("@/helpers")) {
      return 4;
    } else if (source.startsWith("@polylink/shared")) {
      return 5;
    } else {
      // For any other external import, default to group 0
      return 0;
    }
  }

  // Mapping of group numbers to comment labels (for groups that should have a comment)
  const groupComments = {
    2: "My components",
    3: "Hooks",
    4: "Env vars",
    5: "Types",
    6: "UI Components",
  };

  // Find all import declarations
  const importNodes = root.find(j.ImportDeclaration).nodes();
  if (importNodes.length === 0) return file.source;

  // Remove existing imports from the AST
  root.find(j.ImportDeclaration).remove();

  // Sort the imports by group and then alphabetically by source
  const sortedImports = importNodes.sort((a, b) => {
    const groupA = getGroup(a);
    const groupB = getGroup(b);
    if (groupA !== groupB) {
      return groupA - groupB;
    }
    // Same group: alphabetize by source
    if (a.source.value < b.source.value) return -1;
    if (a.source.value > b.source.value) return 1;
    return 0;
  });

  // Prepare new list with group comments added when group changes
  let newImportNodes = [];
  let currentGroup = null;
  sortedImports.forEach((importDecl) => {
    const grp = getGroup(importDecl);
    if (grp !== currentGroup) {
      // If this group should have a comment, add it as a leading comment on this import
      if (groupComments.hasOwnProperty(grp)) {
        importDecl.comments = [
          {
            type: "Line",
            value: " " + groupComments[grp],
          },
        ];
      }
      currentGroup = grp;
    }
    newImportNodes.push(importDecl);
  });

  // Insert the new import declarations at the top of the file
  const body = root.get().node.program.body;
  body.unshift(...newImportNodes);

  return root.toSource({ quote: "single" });
};
