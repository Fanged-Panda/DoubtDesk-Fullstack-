import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('f:/Downloads/DDFulstack_sajad/DDFulstack/ddfrontend/my-project/src/components', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/min-h-screen\s+bg-(gray|yellow|blue|red|green|purple)-\d+/g, 'min-h-screen bg-transparent');
    newContent = newContent.replace(/min-h-screen\s+bg-\$\{formColor\}-100/g, 'min-h-screen bg-transparent');
    
    // Also remove any min-h-screen without background, if it conflicts? No, keep min-h-screen.
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated: ${filePath}`);
    }
  }
});
