import NestedTraversal from "../../src/NestedTraversal";

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

  
  describe('Nested data access', () => {
    test('should return undefined values for unset properties', () => {
      expect(nt.get('nonexistentProperty')).toBeUndefined();
    });

    test('should allow chained access to nested properties', () => {
      expect(nt.traverse('nestedConfig').traverse('level1').get('level2.value')).toBe('test');
    });

    test('should return NestedTraversal for nested objects', () => {
      const nestedConfig = nt.traverse('nestedConfig');
      expect(nestedConfig).toBeInstanceOf(NestedTraversal);
      expect(nestedConfig.get('level1.level2.value')).toBe('test');
    });

    test('should return NestedTraversal for nested objects', () => {
      const node = new NestedTraversal({ nested: { value: 'test' } });
      const nestedNode = node.traverse('nested');
      expect(nestedNode).toBeInstanceOf(NestedTraversal);
      expect(nestedNode.get('value')).toBe('test');
    });

    test('should access nested properties using dot notation', () => {
      expect(nt.get('nestedConfig.level1.level2.value')).toBe('test');
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
      expect(node.get('arr')).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Data modification', () => {
    test('should set() values for existing properties', () => {
      nt.set('flushConfig.batchSize', 30);
      expect(nt.get('flushConfig.batchSize')).toBe(30);
    });

    test('should create new nested Object properties when setting', () => {
      nt = new NestedTraversal();
      nt.set('newNestedProperty.subProperty', 'newValue');
      expect(nt.get('newNestedProperty.subProperty')).toBe('newValue');
      expect(nt.get('newNestedProperty').subProperty).toBe('newValue');
    });

    test('should correctly set nested array values', () => {
      const nt = new NestedTraversal({});
      nt.set('platforms.0.forward', jest.fn());
      nt.set('platforms.1.type', 'custom');
      
      expect(Array.isArray(nt.get('platforms'))).toBe(true);
      expect(typeof nt.get('platforms.0.forward')).toBe('function');
      expect(nt.get('platforms.1.type')).toBe('custom');
    });

    test('should allow chained sets on nested properties', () => {
      nt.traverse('nestedConfig').set('level1.newValue', 'chainedSet');
      expect(nt.get('nestedConfig.level1.newValue')).toBe('chainedSet');
    });

    test('should merge() data correctly', () => {
      const defaultConfig = { a: 1, b: { c: 2 } };
      const userConfig = { b: { d: 3 }, e: 4 };

      const nt = new NestedTraversal(defaultConfig);
      nt.merge(userConfig);

      expect(nt.toJSON()).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    test('set() method preserves mock functions', () => {
      nt = new NestedTraversal();
      const mockForward = jest.fn();
      nt.set('platforms.0.forward', mockForward);

      const platform = nt.get('platforms')[0];
      expect(platform.forward).toBe(mockForward);

      // Verify that the mock function is still callable
      platform.forward([]);
      expect(mockForward).toHaveBeenCalled();
    });

    test('merge() preserves mock functions', () => {
      const mockSetup = jest.fn();
      const mockTransform = jest.fn();
      const mockForward = jest.fn();

      const userConfig = {
        platforms: [{
          id: 'test1',
          type: 'test',
          setup: mockSetup,
          transform: mockTransform,
          forward: mockForward
        }]
      };

      const nt = new NestedTraversal(userConfig);

      const platform = nt.get('platforms')[0];
      expect(platform.setup).toBe(mockSetup);
      expect(platform.transform).toBe(mockTransform);
      expect(platform.forward).toBe(mockForward);

      // Verify that the mock functions are still callable
      platform.setup();
      platform.transform({});
      platform.forward([]);

      expect(mockSetup).toHaveBeenCalled();
      expect(mockTransform).toHaveBeenCalled();
      expect(mockForward).toHaveBeenCalled();
    });
  });
});