interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return { id, name, email, isActive };
}

interface Book {
    title: string;
    author: string;
    year?: number;
    genre: 'fiction' | 'non-fiction';
}

function createBook(book: Book): Book {
    return book;
}

function calculateArea(shape: 'circle', radius: number): number;
function calculateArea(shape: 'square', side: number): number;
function calculateArea(shape: 'circle' | 'square', param: number): number {
    if (shape === 'circle') return Math.PI * param * param;
    return param * param;
}

type Status = 'active' | 'inactive' | 'new';

function getStatusColor(status: Status): string {
    if (status === 'active') return 'green';
    if (status === 'inactive') return 'red';
    return 'blue';
}

type StringFormatter = (input: string, uppercase?: boolean) => string;

const capitalizeFirst: StringFormatter = (input, uppercase = false) => {
    if (input.length === 0) return input;
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

const trimAndTransform: StringFormatter = (input, uppercase = false) => {
    const trimmed = input.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

interface HasId {
    id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return undefined;
}

console.log('=== Задание 1 ===');
const user = createUser(1, 'Егор Максименко', 'egor_max@mail.ru', true);
console.log(user);

console.log('=== Задание 2 ===');
const book1 = createBook({ title: 'Мастер и Маргарита', author: 'Михаил Булгаков', year: 1967, genre: 'fiction' });
const book2 = createBook({ title: 'Краткая история времени', author: 'Стивен Хокинг', genre: 'non-fiction' });
console.log(book1, book2);

console.log('=== Задание 3 ===');
console.log('Площадь круга (радиус 7):', calculateArea('circle', 7));
console.log('Площадь квадрата (сторона 9):', calculateArea('square', 9));

console.log('=== Задание 4 ===');
console.log('active ->', getStatusColor('active'));
console.log('inactive ->', getStatusColor('inactive'));
console.log('new ->', getStatusColor('new'));

console.log('=== Задание 5 ===');
console.log(capitalizeFirst('программирование на typescript'));
console.log(trimAndTransform('  typescript код  ', true));

console.log('=== Задание 6 ===');
console.log('Первый элемент [10, 20, 30]:', getFirstElement([10, 20, 30]));
console.log('Первый элемент ["typescript", "javascript"]:', getFirstElement(['typescript', 'javascript']));
console.log('Первый элемент []:', getFirstElement([]));

console.log('=== Задание 7 ===');
const users = [
    { id: 101, name: 'Екатерина' },
    { id: 102, name: 'Дмитрий' },
    { id: 103, name: 'Ольга' }
];
console.log('Поиск id=102:', findById(users, 102));