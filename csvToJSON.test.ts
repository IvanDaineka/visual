import { describe, it, expect } from 'vitest';
import { csvToJSON } from './csvToJSON';

describe('csvToJSON', () => {
    describe('Успешные сценарии', () => {
        it('должен корректно преобразовывать CSV с разделителем ";"', () => {
            const input: string[] = ['name;age;city', 'John;25;New York', 'Alice;30;London'];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Alice', age: 30, city: 'London' }
            ]);
        });

        it('должен корректно преобразовывать CSV с разделителем ","', () => {
            const input: string[] = ['name,age,city', 'John,25,New York', 'Alice,30,London'];
            const result = csvToJSON(input, ',');
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Alice', age: 30, city: 'London' }
            ]);
        });

        it('должен обрабатывать числа с плавающей точкой', () => {
            const input: string[] = ['product;price;quantity', 'Apple;1.5;10', 'Banana;2.75;5'];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { product: 'Apple', price: 1.5, quantity: 10 },
                { product: 'Banana', price: 2.75, quantity: 5 }
            ]);
        });

        it('должен обрабатывать отрицательные числа', () => {
            const input: string[] = ['city;temperature', 'Moscow;-10', 'SaintPetersburg;-15'];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { city: 'Moscow', temperature: -10 },
                { city: 'SaintPetersburg', temperature: -15 }
            ]);
        });

        it('должен обрабатывать пустые значения как строки', () => {
            const input: string[] = ['name;age;email', 'John;;john@mail.com', 'Alice;25;'];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { name: 'John', age: '', email: 'john@mail.com' },
                { name: 'Alice', age: 25, email: '' }
            ]);
        });

        it('должен игнорировать пустые строки в данных', () => {
            const input: string[] = ['name;age', 'John;25', '', 'Alice;30', ''];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { name: 'John', age: 25 },
                { name: 'Alice', age: 30 }
            ]);
        });

        it('должен обрезать пробелы в заголовках и значениях', () => {
            const input: string[] = [' name ; age ; city ', ' John ; 25 ; New York '];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'New York' }
            ]);
        });

        it('должен возвращать пустой массив, если нет строк с данными', () => {
            const input: string[] = ['name;age;city'];
            const result = csvToJSON(input, ';');
            
            expect(result).toEqual([]);
        });
    });

    describe('Сценарии с ошибками', () => {
        it('должен выбрасывать ошибку при пустом входном массиве', () => {
            const input: string[] = [];
            expect(() => csvToJSON(input, ';')).toThrow('Входной массив не может быть пустым');
        });

        it('должен выбрасывать ошибку при пустом разделителе', () => {
            const input: string[] = ['name;age', 'John;25'];
            expect(() => csvToJSON(input, '')).toThrow('Разделитель не может быть пустым');
        });

        it('должен выбрасывать ошибку при пустых заголовках', () => {
            const input: string[] = [';age', 'John;25'];
            expect(() => csvToJSON(input, ';')).toThrow('Пустой заголовок в позиции 1');
        });

        it('должен выбрасывать ошибку при несоответствии количества столбцов', () => {
            const input: string[] = ['name;age;city', 'John;25', 'Alice;30;London;UK'];
            
            expect(() => csvToJSON(input, ';')).toThrow(
                'Несоответствие количества столбцов в строке 2: ожидалось 3, получено 2'
            );
        });

        it('должен выбрасывать ошибку при дублирующихся заголовках', () => {
            const input: string[] = ['name;age;name', 'John;25;Johnny'];
            
            expect(() => csvToJSON(input, ';')).toThrow('Заголовки столбцов должны быть уникальными');
        });

        it('должен выбрасывать ошибку при строке только с разделителями в заголовках', () => {
            const input: string[] = [';;', '1;2;3'];
            
            expect(() => csvToJSON(input, ';')).toThrow('Пустой заголовок в позиции 1');
        });

        it('должен выбрасывать ошибку при отсутствии заголовков', () => {
            const input: string[] = [];
            
            expect(() => csvToJSON(input, ';')).toThrow('Входной массив не может быть пустым');
        });
    });
});