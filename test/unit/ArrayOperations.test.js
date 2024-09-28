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
    
    nt.get('simpleArray').forEach((item) => {      
      result.push(item.toJSON());
    });
    expect(result).toEqual([1,2,3]);
  });

  test('forEach should iterate over array elements', () => {
    const result = [];
    
    nt.get('users').forEach((user) => {      
      result.push(user.get('name'));
    });
    expect(result).toEqual(['Alice', 'Bob']);
  });

  test('forEach should provide correct index for arrays', () => {
    const result = [];
    nt.get('users').forEach((user, index) => {
      result.push(`${index}:${user.get('name')}`);
    });
    expect(result).toEqual(['0:Alice', '1:Bob']);
  });

  test('forEach should iterate over object properties', () => {
    const result = {};
    
    nt.get('settings').forEach((value, key) => {
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
    nt.get('settings.advanced').forEach((value, key) => {
      result.push(`${key}:${value.toJSON()}`);
    });
    expect(result).toEqual(['debug:true', 'experimental:false']);
  });

  test('forEach should handle empty arrays', () => {
    const mockCallback = jest.fn();
    nt.get('emptyArray').forEach(mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('forEach should handle empty objects', () => {
    const mockCallback = jest.fn();
    nt.get('emptyObject').forEach(mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });  

  test('forEach should provide NestedTraversal instances to callback', () => {
    nt.get('users').forEach((user) => {
      expect(user).toBeInstanceOf(NestedTraversal);
      expect(typeof user.get).toBe('function');
      expect(typeof user.set).toBe('function');
    });
  });

  test('forEach should allow nested forEach calls', () => {
    const result = [];
    nt.get('users').forEach((user) => {
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