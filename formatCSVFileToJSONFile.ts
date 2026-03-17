import { readFile, writeFile } from 'node:fs/promises';
import { csvToJSON } from './csvToJSON';

export async function formatCSVFileToJSONFile(
    inputFilePath: string, 
    outputFilePath: string, 
    delimiter: string
): Promise<void> {
    try {
        if (!inputFilePath || !outputFilePath || !delimiter) {
            throw new Error('Все параметры должны быть указаны');
        }

        let fileContent: string;
        try {
            fileContent = await readFile(inputFilePath, 'utf-8');
        } catch (error) {
            throw new Error(`Не удалось прочитать файл: ${inputFilePath}`);
        }

        if (!fileContent || fileContent.trim() === '') {
            throw new Error('Входной файл пуст');
        }

        const lines = fileContent.split(/\r?\n/);
        
        const jsonData = csvToJSON(lines, delimiter);
        
        try {
            await writeFile(
                outputFilePath, 
                JSON.stringify(jsonData, null, 2), 
                'utf-8'
            );
        } catch (error) {
            throw new Error(`Не удалось записать файл: ${outputFilePath}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Ошибка при обработке файла: ${error.message}`);
        }
        throw new Error(`Неизвестная ошибка при обработке файла`);
    }
}