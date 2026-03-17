export function csvToJSON(input: string[], delimiter: string): Record<string, string | number>[] {
    if (!input || input.length === 0) {
        throw new Error('Входной массив не может быть пустым');
    }

    if (!delimiter || delimiter.length === 0) {
        throw new Error('Разделитель не может быть пустым');
    }

    const headers = input[0].split(delimiter).map(header => header.trim());
    
    if (headers.length === 0) {
        throw new Error('Отсутствуют заголовки столбцов');
    }
    
    headers.forEach((header, index) => {
        if (header === '') {
            throw new Error(`Пустой заголовок в позиции ${index + 1}`);
        }
    });

    const uniqueHeaders = new Set(headers);
    if (uniqueHeaders.size !== headers.length) {
        throw new Error('Заголовки столбцов должны быть уникальными');
    }

    const result: Record<string, string | number>[] = [];

    for (let i = 1; i < input.length; i++) {
        const line = input[i].trim();
        
        if (line === '') {
            continue;
        }
        
        const values = line.split(delimiter).map(value => value.trim());
        
        if (values.length !== headers.length) {
            throw new Error(`Несоответствие количества столбцов в строке ${i + 1}: ожидалось ${headers.length}, получено ${values.length}`);
        }

        const obj: Record<string, string | number> = {};
        
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            let value: string | number = values[j];
            
            if (value !== '' && !isNaN(Number(value))) {
                if (Number.isInteger(Number(value)) && value.indexOf('.') === -1) {
                    value = parseInt(value, 10);
                } else {
                    value = parseFloat(value);
                }
            }
            
            obj[header] = value;
        }
        
        result.push(obj);
    }

    return result;
}