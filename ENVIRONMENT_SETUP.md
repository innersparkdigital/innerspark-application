# Environment Setup

## Environment Variables

This project uses environment variables to manage configuration settings like API URLs and authentication tokens.

### Setup Instructions

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file with your actual values:**
   ```
   API_BASE_URL=https://server.innersparkafrica.us/api/
   API_VERSION=
   AUTH_TOKEN=your_actual_jwt_token_here
   ```

3. **Never commit the `.env` file:**
   The `.env` file is already added to `.gitignore` to prevent accidentally committing sensitive information.

### Configuration Files

- **`.env`** - Your local environment variables (not committed)
- **`.env.example`** - Template file showing required variables (committed)
- **`src/config/environment.js`** - Environment configuration module

### Usage in Code

```javascript
import { API_BASE_URL, AUTH_TOKEN, getApiUrl } from '../config/environment';

// Use the environment variables
const apiUrl = getApiUrl();
const token = AUTH_TOKEN;
```

### Security Notes

- **Never hardcode sensitive tokens** in your source code
- **Use secure storage** for production apps (react-native-keychain)
- **Rotate tokens regularly** and update environment variables
- **Use different tokens** for development, staging, and production environments

### Production Deployment

For production builds, ensure that:
1. Environment variables are properly set in your build system
2. Sensitive tokens are loaded from secure storage or environment variables
3. Different configurations are used for different environments (dev/staging/prod)
