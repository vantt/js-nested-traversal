# nested-traversal
A powerful and flexible library designed to simplify the handling of deeply nested data structures in JavaScript

## Introduction
  **NestedTraversal** is a powerful and flexible library designed to simplify the handling of deeply nested data structures in JavaScript. Whether you're working with complex configuration objects, intricate JSON data, or any deeply nested structures, NestedTraversal provides an intuitive API to traverse, retrieve, and modify data with ease.

## Features

- **Easy Access**: Use dot notation to easily access deeply nested properties.
- **Safe Operations**: Avoid "cannot read property of undefined" errors with safe traversal.
- **Flexible Modification**: Modify nested structures without manually creating intermediate objects.
- **Merge Capability**: Deeply merge multiple nested objects.
- **Array Handling**: Seamlessly work with arrays in nested structures.

## Installation

```bash
npm install nested-traversal
```

## Basic Usage

```javascript
import NestedTraversal from 'nested-traversal';

const data = {
  user: {
    profile: {
      name: 'John Doe',
      address: {
        city: 'New York'
      }
    },
    hobbies: ['reading', 'cycling', 'photography']
  }
};

const nt = new NestedTraversal(data);

// Get a deeply nested value
const city = nt.get('user.profile.address.city');
console.log(city); // Output: 'New York'

// Set a deeply nested value
nt.set('user.profile.address.zipCode', '10001');

// Access array element
const secondHobby = nt.get('user.hobbies.1');
console.log(secondHobby); // Output: 'cycling'

// Add to array
nt.set('user.hobbies.3', 'painting');

// Merge objects
nt.merge({
  user: {
    profile: {
      age: 30
    },
    hobbies: ['cooking']
  }
});

console.log(nt.get('user.profile.age')); // Output: 30
console.log(nt.get('user.hobbies').toJSON()); // Output: ['reading', 'cycling', 'photography', 'painting', 'cooking']
```

## Advanced Usage: Array Operations

NestedTraversal seamlessly integrates with JavaScript's array methods for powerful data manipulation:

```javascript
const nt = new NestedTraversal({
  company: {
    name: 'Tech Innovators',
    departments: [
        { id: 1, name: 'Engineering', employees: [
          { id: 101, name: 'Alice', role: 'Software Engineer' },
          { id: 102, name: 'Bob', role: 'DevOps Specialist' }
        ]},

        { id: 2, name: 'Marketing', employees: [
          { id: 201, name: 'Charlie', role: 'Marketing Manager' },
          { id: 202, name: 'Diana', role: 'Content Strategist' }
        ]}
    ]
  }
});

// Looping through departments
nt.get('company.departments').forEach((dept, index) => {
  console.log(`Department ${index + 1}: ${dept.get('name')}`);
});

// Nested loop: departments and employees
nt.get('company.departments').forEach(dept => {
  console.log(`\nEmployees in ${dept.get('name')}:`);
  dept.get('employees').forEach(emp => {
    console.log(`- ${emp.get('name')}: ${emp.get('role')}`);
  });
});

```

## Real-World Applications

### 1. Configuration Management

NestedTraversal excels in managing complex application configurations:

```javascript
const config = new NestedTraversal({
  app: {
    server: {
      port: 3000,
      host: 'localhost'
    },
    database: {
      url: 'mongodb://localhost:27017',
      name: 'myapp'
    },
    features: {
      auth: {
        enabled: true,
        provider: 'oauth'
      }
    }
  }
});

// Easily access configuration values
const serverPort = config.get('app.server.port');

// Modify configurations on the fly
config.set('app.features.auth.provider', 'jwt');

// Merge new configurations
config.merge({
  app: {
    features: {
      newFeature: {
        enabled: true
      }
    }
  }
});

console.log(config.get('app.features.newFeature.enabled')); // Output: true
```

### 2. State Management in Complex UIs

NestedTraversal can significantly simplify state management in complex user interfaces, such as dashboards or content management systems:

```javascript
const uiState = new NestedTraversal({
  dashboard: {
    widgets: {
      weather: {
        visible: true,
        data: {
          temperature: 72,
          condition: 'Sunny'
        }
      },
      stocks: {
        visible: false,
        data: {
          indices: []
        }
      }
    },
    userPreferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: false
      }
    }
  }
});

// Easily access and update UI state
const isWeatherWidgetVisible = uiState.get('dashboard.widgets.weather.visible');

// Update nested state without worrying about undefined properties
uiState.set('dashboard.widgets.stocks.data.indices', ['NASDAQ', 'DOW']);

// Update user preferences
uiState.merge({
  dashboard: {
    userPreferences: {
      notifications: {
        push: true
      }
    }
  }
});

console.log(uiState.get('dashboard.userPreferences.notifications.push')); // Output: true
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.