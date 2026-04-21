

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, rmSync } from 'fs';
import { join } from 'path';
import { platform } from 'os';

console.log('\x1b[36m=== Building Python Sidecar ===\x1b[0m');

const isWindows = platform() === 'win32';
const venvPath = isWindows ? '.venv\\Scripts\\activate' : '.venv/bin/activate';
const pythonCmd = isWindows ? 'python' : 'python3';
const pythonFile = 'main.py';
const outputName = 'backend-x86_64-pc-windows-msvc';
const exeExt = isWindows ? '.exe' : '';

try {
    // Проверяем наличие виртуального окружения
    if (!existsSync('.venv')) {
        console.error('\x1b[31mERROR: Virtual environment not found!\x1b[0m');
        process.exit(1);
    }

    // Проверяем наличие Python файла
    if (!existsSync(pythonFile)) {
        console.error(`\x1b[31mERROR: ${pythonFile} not found!\x1b[0m`);
        process.exit(1);
    }

    console.log('\x1b[32mBuilding with PyInstaller...\x1b[0m');

    // Команда для сборки (используем виртуальное окружение напрямую)
    const venvPython = isWindows ? '.venv\\Scripts\\python.exe' : '.venv/bin/python';
    const pyinstallerCmd = `"${venvPython}" -m PyInstaller --onefile --name ${outputName} --clean --noconsole ${pythonFile}`;

    execSync(pyinstallerCmd, { stdio: 'inherit' });

    const exePath = join('dist', `${outputName}${exeExt}`);

    if (existsSync(exePath)) {
        console.log('\x1b[32mBuild successful!\x1b[0m');

        // Создаем папку binaries
        const binariesPath = join('src-tauri', 'binaries');
        if (!existsSync(binariesPath)) {
            mkdirSync(binariesPath, { recursive: true });
        }

        // Копируем файл
        const destPath = join(binariesPath, `${outputName}${exeExt}`);
        copyFileSync(exePath, destPath);
        console.log(`\x1b[32mCopied to ${destPath}\x1b[0m`);

        // Очищаем
        console.log('\x1b[33mCleaning up...\x1b[0m');
        rmSync('build', { recursive: true, force: true });
        rmSync('dist', { recursive: true, force: true });
        rmSync(`${outputName}.spec`, { force: true });

        console.log('\x1b[36m=== Sidecar build complete! ===\x1b[0m');
    } else {
        throw new Error(`Build failed - ${outputName}${exeExt} not found`);
    }

} catch (error) {
    console.error('\x1b[31mERROR:', error.message, '\x1b[0m');
    process.exit(1);
}