import NestedTraversal  from '../../src/NestedTraversal';

describe('NestedTraversal forEach Tests', () => {
  let nt;

  beforeEach(() => {
    nt = new NestedTraversal({
      simpleArray: [1,2,3],
      simpleObject: {fn: 'Van', ln: 'Tran'},

      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' }
      ],
      settings: {
        theme: 'dark',
        notifications: 'on',
        advanced: {
          debug: true,
          experimental: false
        }
      },
      emptyArray: [],
      emptyObject: {},
      nullValue: null,
      undefinedValue: undefined
    });
  });

  test('forEach should iterate over simple array elements', () => {
    const result = [];
    
    nt.traverse('simpleArray').forEach((item) => {      
      result.push(item.toJSON());
    });
    expect(result).toEqual([1,2,3]);
  });

  test('forEach should iterate over array elements', () => {
    const result = [];
    
    nt.traverse('users').forEach((user) => {      
      result.push(user.get('name'));
    });
    expect(result).toEqual(['Alice', 'Bob']);
  });

  test('forEach should provide correct index for arrays', () => {
    const result = [];
    nt.traverse('users').forEach((user, index) => {
      result.push(`${index}:${user.get('name')}`);
    });
    expect(result).toEqual(['0:Alice', '1:Bob']);
  });

  test('forEach should iterate over object properties', () => {
    const result = {};
    
    nt.traverse('settings').forEach((value, key) => {
      result[key] = value.toJSON();
    });

    expect(result).toEqual({
      theme: 'dark',
      notifications: 'on',
      advanced: { debug: true, experimental: false }
    });
  });

  test('forEach should handle nested objects', () => {
    const result = [];
    nt.traverse('settings.advanced').forEach((value, key) => {
      result.push(`${key}:${value.toJSON()}`);
    });
    expect(result).toEqual(['debug:true', 'experimental:false']);
  });

  test('forEach should handle empty arrays', () => {
    const mockCallback = jest.fn();
    nt.traverse('emptyArray').forEach(mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('forEach should handle empty objects', () => {
    const mockCallback = jest.fn();
    nt.traverse('emptyObject').forEach(mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });  

  test('forEach should provide NestedTraversal instances to callback', () => {
    nt.traverse('users').forEach((user) => {
      expect(user).toBeInstanceOf(NestedTraversal);
      expect(typeof user.get).toBe('function');
      expect(typeof user.set).toBe('function');
    });
  });

  test('forEach should allow nested forEach calls', () => {
    const result = [];
    nt.traverse('users').forEach((user) => {
      user.forEach((value, key) => {
        result.push(`${key}:${value.toJSON()}`);
      });
    });
    expect(result).toEqual([
      'id:1', 'name:Alice', 'role:admin',
      'id:2', 'name:Bob', 'role:user'
    ]);
  });

  // test.skip('forEach should not iterate over primitive values', () => {
  //   const mockCallback = jest.fn();
  //   nt.get('settings.theme').forEach(mockCallback);
  //   expect(mockCallback).not.toHaveBeenCalled();
  // });

  // test.skip('forEach should handle null values', () => {
  //   const mockCallback = jest.fn();
  //   nt.get('nullValue').forEach(mockCallback);
  //   expect(mockCallback).not.toHaveBeenCalled();
  // });

  // test.skip('forEach should handle undefined values', () => {
  //   const mockCallback = jest.fn();
  //   nt.get('undefinedValue').forEach(mockCallback);
  //   expect(mockCallback).not.toHaveBeenCalled();
  // });
});

describe('NestedTraversal Iteration Methods', () => {
  let nt;

  beforeEach(() => {
    nt = new NestedTraversal({
      simpleObject: { a: 1, b: 'two', c: true },
      simpleArray: [1, 'two', true],
      nestedObject: {
        x: { y: { z: 'nested' } },
        arr: [{ id: 1 }, { id: 2 }]
      },
      emptyObject: {},
      emptyArray: [],
      nullValue: null,
      undefinedValue: undefined
    });
  });

  describe('keys()', () => {
    test('should return keys of a simple object', () => {
      expect(nt.traverse('simpleObject').keys()).toEqual(['a', 'b', 'c']);
    });

    test('should return indices of a simple array', () => {
      expect(nt.traverse('simpleArray').keys()).toEqual([0, 1, 2]);
    });

    test('should return keys of a nested object', () => {
      expect(nt.traverse('nestedObject').keys()).toEqual(['x', 'arr']);
    });

    test('should return an empty array for an empty object', () => {
      expect(nt.traverse('emptyObject').keys()).toEqual([]);
    });

    test('should return an empty array for an empty array', () => {
      expect(nt.traverse('emptyArray').keys()).toEqual([]);
    });

    test('should return an empty array for null', () => {
      expect(nt.traverse('nullValue').keys()).toEqual([]);
    });

    test('should return an empty array for undefined', () => {
      expect(nt.traverse('undefinedValue').keys()).toEqual([]);
    });
  });

  describe('values()', () => {
    test('should return values of a simple object', () => {
      expect(nt.traverse('simpleObject').values()).toEqual([1, 'two', true]);
    });

    test('should return values of a simple array', () => {
      expect(nt.traverse('simpleArray').values()).toEqual([1, 'two', true]);
    });

    test('should return values of a nested object', () => {
      const values = nt.traverse('nestedObject').values();
      expect(values[0]).toBeInstanceOf(Object); // x
      expect(values[1]).toBeInstanceOf(Object); // arr
    });

    test('should return an empty array for an empty object', () => {
      expect(nt.traverse('emptyObject').values()).toEqual([]);
    });

    test('should return an empty array for an empty array', () => {
      expect(nt.traverse('emptyArray').values()).toEqual([]);
    });

    test('should return an empty array for null', () => {
      expect(nt.traverse('nullValue').values()).toEqual([]);
    });

    test('should return an empty array for undefined', () => {
      expect(nt.traverse('undefinedValue').values()).toEqual([]);
    });
  });

  describe('entries()', () => {
    test('should return entries of a simple object', () => {
      expect(nt.traverse('simpleObject').entries()).toEqual([
        ['a', 1],
        ['b', 'two'],
        ['c', true]
      ]);
    });

    test('should return entries of a simple array', () => {
      expect(nt.traverse('simpleArray').entries()).toEqual([
        ['0', 1],
        ['1', 'two'],
        ['2', true]
      ]);
    });

    test('should return entries of a nested object', () => {
      const entries = nt.traverse('nestedObject').entries();
      expect(entries.length).toBe(2);
      expect(entries[0][0]).toBe('x');
      expect(entries[0][1]).toBeInstanceOf(Object);
      expect(entries[1][0]).toBe('arr');
      expect(entries[1][1]).toBeInstanceOf(Object);
    });

    test('should return an empty array for an empty object', () => {
      expect(nt.traverse('emptyObject').entries()).toEqual([]);
    });

    test('should return an empty array for an empty array', () => {
      expect(nt.traverse('emptyArray').entries()).toEqual([]);
    });

    test('should return an empty array for null', () => {
      expect(nt.traverse('nullValue').entries()).toEqual([]);
    });

    test('should return an empty array for undefined', () => {
      expect(nt.traverse('undefinedValue').entries()).toEqual([]);
    });
  });
});
