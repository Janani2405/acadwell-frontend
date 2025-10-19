// verify-structure.js
// Run this in frontend folder: node verify-structure.js
// This will check if all required files exist

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const requiredFiles = [
  // Root files
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'index.html',
  
  // Source files
  'src/main.jsx',
  'src/App.jsx',
  'src/index.css',
  
  // Config
  'src/config/api.config.js',
  
  // API
  'src/api/axios.instance.js',
  'src/api/admin.api.js',
  
  // Context
  'src/context/AdminContext.jsx',
  
  // Hooks
  'src/hooks/useAdmin.js',
  
  // Routes
  'src/routes/AdminRoute.jsx',
  
  // Admin components
  'src/components/dashboards/admin/AdminLogin.jsx',
  'src/components/dashboards/admin/AdminDashboard.jsx',
  'src/components/dashboards/admin/AdminSidebar.jsx',
  'src/components/dashboards/admin/AdminTopbar.jsx',
  'src/components/dashboards/admin/pages/Overview.jsx',
  'src/components/dashboards/admin/pages/UsersManagement.jsx',
  'src/components/dashboards/admin/components/StatsCard.jsx',
  'src/components/dashboards/admin/components/UserTable.jsx',
  
  // Env
  '.env.development'
];

console.log('🔍 Checking file structure...\n');

let missing = [];
let found = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    found.push(file);
    console.log(`✅ ${file}`);
  } else {
    missing.push(file);
    console.log(`❌ ${file} - MISSING!`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Found: ${found.length} files`);
console.log(`❌ Missing: ${missing.length} files`);

if (missing.length > 0) {
  console.log('\n⚠️  Missing files:');
  missing.forEach(file => console.log(`   - ${file}`));
  console.log('\nPlease create these files before running the app.');
} else {
  console.log('\n🎉 All required files are present!');
}