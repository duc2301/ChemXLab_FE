// Script để tự động cập nhật đường dẫn file từ USDZ sang GLB
// Chạy script này sau khi đã convert file USDZ sang GLB

const fs = require('fs');
const path = require('path');

const INDEX_JS_PATH = './index.js';
const ASSETS_DIR = './assets';

// Mapping từ USDZ sang GLB
const fileMapping = {
    'element_019_potassium.usdz': 'element_019_potassium.glb',
    'element_001_hydrogen.usdz': 'element_001_hydrogen.glb', 
    'element_008_oxygen.usdz': 'element_008_oxygen.glb'
};

function updateFilePaths() {
    try {
        // Đọc file index.js
        let content = fs.readFileSync(INDEX_JS_PATH, 'utf8');
        
        // Thay thế các đường dẫn USDZ bằng GLB
        Object.entries(fileMapping).forEach(([usdzFile, glbFile]) => {
            const usdzPath = `assets/${usdzFile}`;
            const glbPath = `assets/${glbFile}`;
            
            // Kiểm tra xem file GLB có tồn tại không
            if (fs.existsSync(path.join(ASSETS_DIR, glbFile))) {
                content = content.replace(usdzPath, glbPath);
                console.log(`✅ Đã cập nhật: ${usdzFile} → ${glbFile}`);
            } else {
                console.log(`⚠️  File không tồn tại: ${glbFile}`);
            }
        });
        
        // Ghi lại file
        fs.writeFileSync(INDEX_JS_PATH, content, 'utf8');
        console.log('🎉 Đã cập nhật thành công file index.js!');
        
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    }
}

function checkFiles() {
    console.log('📁 Kiểm tra file trong thư mục assets:');
    
    if (!fs.existsSync(ASSETS_DIR)) {
        console.log('❌ Thư mục assets không tồn tại!');
        return;
    }
    
    const files = fs.readdirSync(ASSETS_DIR);
    
    Object.entries(fileMapping).forEach(([usdzFile, glbFile]) => {
        const hasUsdz = files.includes(usdzFile);
        const hasGlb = files.includes(glbFile);
        
        console.log(`${usdzFile}: ${hasUsdz ? '✅' : '❌'}`);
        console.log(`${glbFile}: ${hasGlb ? '✅' : '❌'}`);
        console.log('---');
    });
}

// Chạy script
console.log('🔄 USDZ to GLB Path Updater\n');
checkFiles();
console.log('\n🔧 Cập nhật đường dẫn...');
updateFilePaths();
