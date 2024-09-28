import NestedTraversal  from "../../src/NestedTraversal";

describe('NestedTraversal', () => {
  let nt;

  beforeEach(() => {
    nt = new NestedTraversal({
      flushConfig: {
        batchSize: 20,
        flushInterval: 10000
      },
      debugMode: false,
      nestedConfig: {
        level1: {
          level2: {
            value: 'test'
          }
        }
      },
      arrayConfig: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ],
      platforms: [
        { type: 'test', id: 'test-platform' },
        { type: 'custom', id: 'custom-platform', setup: jest.fn(), transform: jest.fn(), forward: jest.fn() }
      ]
    });
  });

  describe('Merge()', () => {
   
    test.only('should merge configurations correctly', () => {
      const defaultConfig = { a: 1, b: { c: 2 } };
      const userConfig = { b: { d: 3 }, e: 4 };
      const nt = new NestedTraversal(defaultConfig);
      nt.merge(userConfig);
      
      console.log(nt);

      expect(nt.toJSON()).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });
  })

  describe('Basic functionality', () => {
    test('should return default values for unset properties', () => {
      expect(nt.get('nonexistentProperty')).toBeUndefined();
    });
  });

  describe('Nested data access', () => {
    test('should access nested properties using dot notation', () => {
      expect(nt.get('nestedConfig.level1.level2.value')).toBe('test');
    });

    test('should return NestedTraversal for nested objects', () => {
      const nestedConfig = nt.get('nestedConfig');
      expect(nestedConfig).toBeInstanceOf(NestedTraversal);
      expect(nestedConfig.get('level1.level2.value')).toBe('test');
    });

    test('should allow chained access to nested properties', () => {
      expect(nt.get('nestedConfig').get('level1').get('level2.value')).toBe('test');
    });

    test('should access nested properties', () => {
      expect(nt.get('nestedConfig.level1.level2.value')).toBe('test');
    });

    test('should access array elements', () => {
      expect(nt.get('arrayConfig.0.id')).toBe(1);
      expect(nt.get('arrayConfig.1.name')).toBe('Item 2');
    });

    test('should get and set values', () => {
      const node = new NestedTraversal({ test: { nested: 'value' } });
      expect(node.get('test.nested')).toBe('value');
      node.set('test.new', 'newValue');
      expect(node.get('test.new')).toBe('newValue');
    });

    test('should handle array access', () => {
      const node = new NestedTraversal({ arr: [1, 2, 3] });
      expect(node.get('arr.1')).toBe(2);

      node.set('arr.3', 4);
      expect(node.get('arr.3')).toBe(4);      
      expect(node.get('arr').toJSON()).toEqual([1, 2, 3, 4]);
    });

    test('should return NestedTraversal for nested objects', () => {
      const node = new NestedTraversal({ nested: { value: 'test' } });
      const nestedNode = node.get('nested');
      expect(nestedNode).toBeInstanceOf(NestedTraversal);
      expect(nestedNode.get('value')).toBe('test');
    });
  });

  describe('Data modification', () => {
    test('should set values for existing properties', () => {
      nt.set('flushConfig.batchSize', 30);
      expect(nt.get('flushConfig.batchSize')).toBe(30);
    });

    test('should create new nested properties when setting', () => {
      nt.set('newNestedProperty.subProperty', 'newValue');
      expect(nt.get('newNestedProperty.subProperty')).toBe('newValue');
    });

    test('should allow chained sets on nested properties', () => {
      nt.get('nestedConfig').set('level1.newValue', 'chainedSet');
      expect(nt.get('nestedConfig.level1.newValue')).toBe('chainedSet');
    });
  });

  

});