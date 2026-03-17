import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatCSVFileToJSONFile } from './formatCSVFileToJSONFile';
import { readFile, writeFile } from 'node:fs/promises';
import { csvToJSON } from './csvToJSON';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
    writeFile: vi.fn()
}));

vi.mock('./csvToJSON', () => ({
    csvToJSON: vi.fn()
}));

describe('formatCSVFileToJSONFile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(writeFile).mockResolvedValue(undefined);
    });

    describe('Успешные сценарии', () => {
        it('должен читать CSV файл, преобразовывать и записывать JSON', async () => {
            const mockCSV = 'name;age;city\nJohn;25;New York\nAlice;30;London';
            const mockJSONData = [
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Alice', age: 30, city: 'London' }
            ];
            
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockReturnValue(mockJSONData);
            
            await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
            
            expect(readFile).toHaveBeenCalledTimes(1);
            expect(readFile).toHaveBeenCalledWith('input.csv', 'utf-8');
            
            expect(csvToJSON).toHaveBeenCalledTimes(1);
            expect(csvToJSON).toHaveBeenCalledWith(
                ['name;age;city', 'John;25;New York', 'Alice;30;London'],
                ';'
            );
            
            expect(writeFile).toHaveBeenCalledTimes(1);
            expect(writeFile).toHaveBeenCalledWith(
                'output.json',
                JSON.stringify(mockJSONData, null, 2),
                'utf-8'
            );
        });

        it('должен работать с разделителем ","', async () => {
            const mockCSV = 'name,age,city\nJohn,25,New York\nAlice,30,London';
            const mockJSONData = [
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Alice', age: 30, city: 'London' }
            ];
            
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockReturnValue(mockJSONData);
            
            await formatCSVFileToJSONFile('input.csv', 'output.json', ',');
            
            expect(csvToJSON).toHaveBeenCalledWith(
                ['name,age,city', 'John,25,New York', 'Alice,30,London'],
                ','
            );
            
            expect(writeFile).toHaveBeenCalledWith(
                'output.json',
                JSON.stringify(mockJSONData, null, 2),
                'utf-8'
            );
        });

        it('должен корректно обрабатывать файл с пустыми строками', async () => {
            const mockCSV = 'name;age;city\n\nJohn;25;New York\n\nAlice;30;London\n';
            const mockJSONData = [
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Alice', age: 30, city: 'London' }
            ];
            
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockReturnValue(mockJSONData);
            
            await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
            
            expect(csvToJSON).toHaveBeenCalledWith(
                ['name;age;city', '', 'John;25;New York', '', 'Alice;30;London', ''],
                ';'
            );
            
            expect(writeFile).toHaveBeenCalledWith(
                'output.json',
                JSON.stringify(mockJSONData, null, 2),
                'utf-8'
            );
        });
    });

    describe('Сценарии с ошибками', () => {
        it('должен выбрасывать ошибку при пустом входном файле', async () => {
            vi.mocked(readFile).mockResolvedValue('');
            
            await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
                .rejects.toThrow('Ошибка при обработке файла: Входной файл пуст');
            
            expect(csvToJSON).not.toHaveBeenCalled();
            expect(writeFile).not.toHaveBeenCalled();
        });

        it('должен выбрасывать ошибку при ошибке чтения файла', async () => {
            vi.mocked(readFile).mockRejectedValue(new Error('ENOENT'));
            
            await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
                .rejects.toThrow('Ошибка при обработке файла: Не удалось прочитать файл: input.csv');
            
            expect(csvToJSON).not.toHaveBeenCalled();
            expect(writeFile).not.toHaveBeenCalled();
        });

        it('должен пробрасывать ошибки от csvToJSON', async () => {
            const mockCSV = 'name;age;city\nJohn;25\nAlice;30;London;UK';
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockImplementation(() => {
                throw new Error('Несоответствие количества столбцов в строке 2: ожидалось 3, получено 2');
            });
            
            await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
                .rejects.toThrow('Ошибка при обработке файла: Несоответствие количества столбцов в строке 2: ожидалось 3, получено 2');
            
            expect(writeFile).not.toHaveBeenCalled();
        });

        it('должен выбрасывать ошибку при ошибке записи файла', async () => {
            const mockCSV = 'name;age\nJohn;25';
            const mockJSONData = [{ name: 'John', age: 25 }];
            
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockReturnValue(mockJSONData);
            vi.mocked(writeFile).mockRejectedValue(new Error('Permission denied'));
            
            await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ';'))
                .rejects.toThrow('Ошибка при обработке файла: Не удалось записать файл: output.json');
        });

        it('должен выбрасывать ошибку при отсутствии обязательных параметров', async () => {
            await expect(formatCSVFileToJSONFile('', 'output.json', ';'))
                .rejects.toThrow('Ошибка при обработке файла: Все параметры должны быть указаны');
            
            await expect(formatCSVFileToJSONFile('input.csv', '', ';'))
                .rejects.toThrow('Ошибка при обработке файла: Все параметры должны быть указаны');
            
            await expect(formatCSVFileToJSONFile('input.csv', 'output.json', ''))
                .rejects.toThrow('Ошибка при обработке файла: Все параметры должны быть указаны');
        });
    });

    describe('Проверка вызова функций с заглушками', () => {
        it('должен вызывать readFile с правильными параметрами', async () => {
            const mockCSV = 'name;age\nJohn;25';
            const mockJSONData = [{ name: 'John', age: 25 }];
            
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockReturnValue(mockJSONData);
            vi.mocked(writeFile).mockResolvedValue(undefined);
            
            await formatCSVFileToJSONFile('data.csv', 'result.json', ';');
            
            expect(readFile).toHaveBeenCalledWith('data.csv', 'utf-8');
        });

        it('должен вызывать writeFile с правильными параметрами', async () => {
            const mockCSV = 'name;age\nJohn;25';
            const mockJSONData = [{ name: 'John', age: 25 }];
            
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockReturnValue(mockJSONData);
            vi.mocked(writeFile).mockResolvedValue(undefined);
            
            await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
            
            expect(writeFile).toHaveBeenCalledWith(
                'output.json',
                JSON.stringify(mockJSONData, null, 2),
                'utf-8'
            );
        });

        it('не должен вызывать writeFile при ошибке в readFile', async () => {
            vi.mocked(readFile).mockRejectedValue(new Error('Read error'));
            
            try {
                await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
            } catch {
            }
            
            expect(csvToJSON).not.toHaveBeenCalled();
            expect(writeFile).not.toHaveBeenCalled();
        });

        it('не должен вызывать writeFile при ошибке в csvToJSON', async () => {
            const mockCSV = 'name;age\nJohn;25';
            
            vi.mocked(readFile).mockResolvedValue(mockCSV);
            vi.mocked(csvToJSON).mockImplementation(() => {
                throw new Error('CSV Error');
            });
            
            try {
                await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
            } catch {
            }
            
            expect(writeFile).not.toHaveBeenCalled();
        });
    });
});