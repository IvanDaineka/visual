import { describe, it, expect } from 'vitest';
import { 
  createUser, 
  createBook, 
  calculateArea, 
  getStatusColor,
  capitalizeFirst,
  trimAndTransform,
  getFirstElement,
  findById
} from './1lab';

describe('createUser', () => {
  it('должен создавать пользователя с обязательными полями', () => {
    const user = createUser(1, 'Егор Максименко');
    
    expect(user).toEqual({
      id: 1,
      name: 'Егор Максименко',
      isActive: true
    });
    expect(user.email).toBeUndefined();
  });

  it('должен создавать пользователя с email', () => {
    const user = createUser(2, 'Егор', 'egor@mail.com');
    
    expect(user).toEqual({
      id: 2,
      name: 'Егор',
      email: 'egor@mail.com',
      isActive: true
    });
  });

  it('должен создавать неактивного пользователя', () => {
    const user = createUser(3, 'Егор', undefined, false);
    
    expect(user).toEqual({
      id: 3,
      name: 'Егор',
      isActive: false
    });
  });
});

describe('createBook', () => {
  it('должен создавать книгу с годом', () => {
    const book = createBook({
      title: 'Мастер и Маргарита',
      author: 'Михаил Булгаков',
      year: 1967,
      genre: 'fiction'
    });
    
    expect(book).toEqual({
      title: 'Мастер и Маргарита',
      author: 'Михаил Булгаков',
      year: 1967,
      genre: 'fiction'
    });
  });

  it('должен создавать книгу без года', () => {
    const book = createBook({
      title: 'Краткая история времени',
      author: 'Стивен Хокинг',
      genre: 'non-fiction'
    });
    
    expect(book).toEqual({
      title: 'Краткая история времени',
      author: 'Стивен Хокинг',
      genre: 'non-fiction'
    });
    expect(book.year).toBeUndefined();
  });
});

describe('calculateArea', () => {
  it('должен вычислять площадь круга', () => {
    expect(calculateArea('circle', 7)).toBeCloseTo(153.938, 2);
    expect(calculateArea('circle', 0)).toBe(0);
    expect(calculateArea('circle', 2.5)).toBeCloseTo(19.635, 2);
  });

  it('должен вычислять площадь квадрата', () => {
    expect(calculateArea('square', 9)).toBe(81);
    expect(calculateArea('square', 0)).toBe(0);
    expect(calculateArea('square', 2.5)).toBe(6.25);
  });
});

describe('getStatusColor', () => {
  it('должен возвращать правильные цвета для статусов', () => {
    expect(getStatusColor('active')).toBe('green');
    expect(getStatusColor('inactive')).toBe('red');
    expect(getStatusColor('new')).toBe('blue');
  });
});

describe('StringFormatter functions', () => {
  describe('capitalizeFirst', () => {
    it('должен делать первую букву заглавной, остальные строчными', () => {
      expect(capitalizeFirst('программирование на typescript')).toBe('Программирование на typescript');
      expect(capitalizeFirst('HELLO WORLD')).toBe('Hello world');
      expect(capitalizeFirst('tYPESCRIPT КОД')).toBe('Typescript код');
    });

    it('должен обрабатывать пустую строку', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    it('должен игнорировать параметр uppercase', () => {
      expect(capitalizeFirst('hello', true)).toBe('Hello');
      expect(capitalizeFirst('hello', false)).toBe('Hello');
    });
  });

  describe('trimAndTransform', () => {
    it('должен удалять пробелы по краям', () => {
      expect(trimAndTransform('  hello  ')).toBe('hello');
      expect(trimAndTransform('\tworld\n')).toBe('world');
    });

    it('должен преобразовывать в верхний регистр при uppercase=true', () => {
      expect(trimAndTransform('  typescript код  ', true)).toBe('TYPESCRIPT КОД');
      expect(trimAndTransform('  hello  ', true)).toBe('HELLO');
    });

    it('не должен изменять регистр при uppercase=false', () => {
      expect(trimAndTransform('  Hello  ')).toBe('Hello');
      expect(trimAndTransform('  WoRlD  ')).toBe('WoRlD');
    });
  });
});

describe('getFirstElement', () => {
  it('должен возвращать первый элемент массива', () => {
    expect(getFirstElement([10, 20, 30])).toBe(10);
    expect(getFirstElement(['typescript', 'javascript'])).toBe('typescript');
    expect(getFirstElement([true, false])).toBe(true);
  });

  it('должен возвращать undefined для пустого массива', () => {
    expect(getFirstElement([])).toBeUndefined();
  });

  it('должен работать с массивами объектов', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    expect(getFirstElement([obj1, obj2])).toBe(obj1);
  });
});

describe('findById', () => {
  it('должен находить элемент по id', () => {
    const users = [
      { id: 101, name: 'Екатерина' },
      { id: 102, name: 'Дмитрий' },
      { id: 103, name: 'Ольга' }
    ];
    
    expect(findById(users, 102)).toEqual({ id: 102, name: 'Дмитрий' });
    expect(findById(users, 101)).toEqual({ id: 101, name: 'Екатерина' });
  });

  it('должен возвращать undefined для несуществующего id', () => {
    const users = [
      { id: 101, name: 'Екатерина' },
      { id: 102, name: 'Дмитрий' }
    ];
    
    expect(findById(users, 999)).toBeUndefined();
  });

  it('должен работать с разными типами объектов', () => {
    const items = [
      { id: 10, value: 'test' },
      { id: 20, value: 'example' }
    ];
    
    expect(findById(items, 20)).toEqual({ id: 20, value: 'example' });
  });

  it('должен возвращать undefined для пустого массива', () => {
    expect(findById([], 1)).toBeUndefined();
  });
});