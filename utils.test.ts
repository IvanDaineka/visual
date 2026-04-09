import { describe, it, expectTypeOf } from 'vitest';
import type { DeepReadonly, PickedByType, EventHandlers } from './utils';

describe('lab6: Утилитарные типы TypeScript', () => {
  
  describe('1. DeepReadonly<T>', () => {
    it('должен делать все свойства readonly рекурсивно', () => {
      type Nested = {
        a: number;
        b: {
          c: string;
          d: {
            e: boolean;
          };
        };
      };

      type Result = DeepReadonly<Nested>;
      
      // Проверка типов
      expectTypeOf<Result>().toMatchTypeOf<{
        readonly a: number;
        readonly b: {
          readonly c: string;
          readonly d: {
            readonly e: boolean;
          };
        };
      }>();
    });
  });

  describe('2. PickedByType<T, U>', () => {
    it('должен выбирать свойства указанного типа', () => {
      type Example = {
        name: string;
        age: number;
        isActive: boolean;
        email: string;
        score: number;
      };

      type StringProps = PickedByType<Example, string>;
      type NumberProps = PickedByType<Example, number>;
      type BooleanProps = PickedByType<Example, boolean>;

      expectTypeOf<StringProps>().toEqualTypeOf<{
        name: string;
        email: string;
      }>();

      expectTypeOf<NumberProps>().toEqualTypeOf<{
        age: number;
        score: number;
      }>();

      expectTypeOf<BooleanProps>().toEqualTypeOf<{
        isActive: boolean;
      }>();
    });
  });

  describe('3. EventHandlers<T>', () => {
    it('должен генерировать обработчики с префиксом on', () => {
      type Events = {
        click: { x: number; y: number };
        submit: { formData: FormData };
        change: string;
        focus: void;
      };

      type Result = EventHandlers<Events>;

      expectTypeOf<Result>().toEqualTypeOf<{
        onClick: (payload: { x: number; y: number }) => void;
        onSubmit: (payload: { formData: FormData }) => void;
        onChange: (payload: string) => void;
        onFocus: (payload: void) => void;
      }>();
    });
  });
});