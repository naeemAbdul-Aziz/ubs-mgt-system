const fs = require('fs');
const path = require('path');

const filesToFix = [
  'academics/components/StudentSubjectsView.tsx',
  'communication/components/AnnouncementInbox.tsx',
  'dashboard/components/GuardianDashboardPanel.tsx',
  'dashboard/components/StudentDashboardPanel.tsx',
  'dashboard/page.tsx',
  'fees/components/StudentFeesView.tsx'
];

const basePath = path.join('c:', 'Users', 'naeemaziz', 'Desktop', 'draka labs', 'school management system', 'frontend', 'apps', 'portal', 'app', '(portal)');

filesToFix.forEach(relPath => {
  const fullPath = path.join(basePath, relPath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace import Grid2
  content = content.replace(/import Grid from '@mui\/material\/Grid2';/g, "import { Grid } from '@mui/material';");

  // Replace <Stack ...> with style props
  // We need to look for Stack with alignItems, justifyContent, mb, mt
  content = content.replace(/<Stack\s+([^>]+)>/g, (match, propsStr) => {
    // extract direction, spacing, etc
    let newProps = [];
    let sxProps = [];
    
    // Parse attributes naively
    const attrRegex = /(\w+)=(?:{([^}]+)}|"([^"]+)")|(\w+)/g;
    let m;
    let hasExistingSx = false;
    let existingSxContent = '';

    while ((m = attrRegex.exec(propsStr)) !== null) {
      const key = m[1] || m[4];
      const val = m[2] || m[3];
      
      if (!key) continue;

      if (['alignItems', 'justifyContent', 'mb', 'mt', 'ml', 'mr', 'pb', 'pt', 'pl', 'pr', 'flex', 'flexWrap'].includes(key)) {
        sxProps.push(`${key}: ${m[2] ? m[2] : `'${m[3]}'`}`);
      } else if (key === 'sx') {
        hasExistingSx = true;
        existingSxContent = m[2];
      } else {
        if (m[2] !== undefined) {
          newProps.push(`${key}={${m[2]}}`);
        } else if (m[3] !== undefined) {
          newProps.push(`${key}="${m[3]}"`);
        } else {
          newProps.push(key);
        }
      }
    }
    
    if (sxProps.length > 0) {
      if (hasExistingSx) {
        // Assume existing sx is an object literal without outer braces, e.g. { mt: 1 } -> mt: 1
        const cleanedExisting = existingSxContent.replace(/^{\s*(.*)\s*}$/, '$1');
        newProps.push(`sx={{ ${cleanedExisting}, ${sxProps.join(', ')} }}`);
      } else {
        newProps.push(`sx={{ ${sxProps.join(', ')} }}`);
      }
      return `<Stack ${newProps.join(' ')}>`;
    }
    return match;
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Fixed', relPath);
});
