export type OperationType = 'where' | 'groupBy' | 'having' | 'sort';

export type AllowedNextOperations<LastOp extends OperationType | null> = 
  LastOp extends null ? ['where', 'groupBy']
  : LastOp extends 'where' ? ['where', 'groupBy', 'having', 'sort']
  : LastOp extends 'groupBy' ? ['groupBy', 'having', 'sort']
  : LastOp extends 'having' ? ['having', 'sort']
  : LastOp extends 'sort' ? ['sort']
  : never;

export type ValidateOperationSequence<Ops extends readonly any[], LastOp extends OperationType | null = null> = 
  Ops extends readonly []
    ? true
    : Ops extends readonly [infer First, ...infer Rest]
      ? First extends { type: infer T }
        ? T extends OperationType
          ? T extends AllowedNextOperations<LastOp>[number]
            ? ValidateOperationSequence<Rest, T>
            : false
          : false
        : false
      : false;

export interface WhereOperation<T> {
  type: 'where';
  key: keyof T;
  value: T[keyof T];
}

export interface GroupByOperation<T> {
  type: 'groupBy';
  key: keyof T;
}

export interface HavingOperation<T> {
  type: 'having';
  predicate: (group: GroupResult<T>) => boolean;
}

export interface SortOperation<T> {
  type: 'sort';
  key: keyof T;
  direction?: 'asc' | 'desc';
}

export interface GroupResult<T> {
  key: string;
  items: T[];
}

export type Transform<T> = (data: T[]) => T[] | GroupResult<T>[];

export type QueryFunction = {
  <T, Ops extends readonly any[]>(
    ...ops: Ops & (ValidateOperationSequence<Ops> extends true ? Ops : never)
  ): Transform<T>;
};

export const query: QueryFunction = <T>(...steps: any[]): Transform<T> => {
  return (data: T[]): T[] => {
    let result: any = data;
    
    validateOperationOrder(steps);
    
    for (const step of steps) {
      result = step(result);
    }
    
    return result as T[];
  };
};

function validateOperationOrder(steps: any[]): void {
  let lastType: string | null = null;
  
  for (const step of steps) {
    const currentType = step.type;
    
    if (!currentType) continue;
    
    if (lastType === 'sort' && currentType !== 'sort') {
      throw new Error('Sort operations must be at the end');
    }
    
    if (lastType === 'having' && !['having', 'sort'].includes(currentType)) {
      throw new Error('Having must be followed only by having or sort');
    }
    
    if (lastType === 'groupBy' && !['groupBy', 'having', 'sort'].includes(currentType)) {
      throw new Error('GroupBy must be followed by groupBy, having, or sort');
    }
    
    if (lastType === 'where' && !['where', 'groupBy', 'having', 'sort'].includes(currentType)) {
      throw new Error('Where must be followed by where, groupBy, having, or sort');
    }
    
    lastType = currentType;
  }
}

export function where<T, K extends keyof T>(key: K, value: T[K]): WhereOperation<T> & Transform<T> {
  const operation: WhereOperation<T> = { type: 'where', key, value };
  
  const transform: Transform<T> = (data: T[]) => {
    return data.filter((item: T) => item[key] === value);
  };
  
  return Object.assign(transform, operation);
}

export function sort<T, K extends keyof T>(
  key: K, 
  direction: 'asc' | 'desc' = 'asc'
): SortOperation<T> & Transform<T> {
  const operation: SortOperation<T> = { type: 'sort', key, direction };
  
  const transform: Transform<T> = (data: T[]) => {
    return [...data].sort((a: T, b: T) => {
      const av = a[key];
      const bv = b[key];
      
      if (av < bv) return direction === 'asc' ? -1 : 1;
      if (av > bv) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };
  
  return Object.assign(transform, operation);
}

export function groupBy<T, K extends keyof T>(key: K): GroupByOperation<T> & Transform<T> {
  const operation: GroupByOperation<T> = { type: 'groupBy', key };
  
  const transform: Transform<T> = (data: T[]): GroupResult<T>[] => {
    const groupsMap = new Map<string, GroupResult<T>>();
    
    data.forEach((item: T) => {
      const groupKey = String(item[key]);
      
      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, { key: groupKey, items: [] });
      }
      
      const group = groupsMap.get(groupKey);
      if (group) {
        group.items.push(item);
      }
    });
    
    return Array.from(groupsMap.values());
  };
  
  return Object.assign(transform, operation);
}

export function having<T>(
  predicate: (group: GroupResult<T>) => boolean
): HavingOperation<T> & Transform<GroupResult<T>> {
  const operation: HavingOperation<T> = { type: 'having', predicate };
  
  const transform: Transform<GroupResult<T>> = (groups: GroupResult<T>[]) => {
    return groups.filter(predicate);
  };
  
  return Object.assign(transform, operation);
}