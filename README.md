# Tabby

Utility-focused new tab for Google Chrome.

## ⚙️ Configuration

The content and layout can be controlled by modifying the `tabby.json` file located in the `src` directory.

The configuration must align with the following type:

```typescript
type TabbyConfiguration = {
    
    // Control the layout of the new tab.
    layout: Partial<{
        background: string
        columns: number
        rows: number
    }>

    // The quick links to show.
    options: Array<{
        url: string
        icon: string
    }>

    // Allows you to open a variety of URLs from a new tab by pressing `key` twice.
    quicklinks: {
        key: string // e.g "Tab"
        links: string[]
    }
}
```

After a configuration change, Tabby must be rebuilt as the configuration is baked into the source to maximise performance and minimise flashes of missing content at load. Just run `yarn build` to recompile changes.

### 💾 Installation
The compiled chrome extension will be located in the `build` directory, which can be loaded as an unpackaged extension directly into the `chrome://extensions` section of Google Chrome.


## 🚀 Custom Utilities

Tabby supports custom utilities that can execute your code anywhere you like!

Simply add a new object in the `CONFIGURATION` array in the `src/background.ts` file that the conforms to the type provided.

### Example:
*e.g* creating an automatic login script when visiting a certain page.
```typescript
// File: src/background.ts

const CONFIGURATION: UtilityConfiguration[] = [
  // ... Other configurations
  {
    matches: ['https://example.com/login'],
    data: { username: 'foo', password: "bar" },
    callback: (data) => {
      const {username, password} = data;

        // Set the form values.
        const user = document.getElementById("username-input");
        const pass = document.getElementById("password-input");

        user.value = username;
        pass.value = password;

        // Submit.
        setTimeout(() => {
            document.getElementById("submit-button").click();
        }, 250)
    }
  }
]
```

If your utility has more complex behaviour requirements, you made need to adjust the `permissions` array in the `manifest.json` file with the necessary permissions [as detailed here](https://developer.chrome.com/docs/extensions/mv3/declare_permissions).