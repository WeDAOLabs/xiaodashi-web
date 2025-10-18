/**
 * CORS Origin 验证工具
 * 支持：
 * - 精确匹配：https://app.xds.sxx0.com
 * - 通配符匹配：*.sxx0.com, https://*.sxx0.com
 * - 正则表达式：/^https:\/\/.*\.sxx0\.com$/
 */

/**
 * 检查 origin 是否匹配允许的模式
 */
export function isOriginAllowed(
    origin: string,
    allowedOrigins: string[],
): boolean {
    // 开发环境：允许 localhost
    if (process.env.NODE_ENV === 'development') {
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return true;
        }
    }

    return allowedOrigins.some((pattern) => {
        // 1. 精确匹配
        if (pattern === origin) {
            return true;
        }

        // 2. 通配符匹配（*.example.com）
        if (pattern.includes('*')) {
            const regex = wildcardToRegex(pattern);
            return regex.test(origin);
        }

        // 3. 正则表达式匹配（以 / 开头和结尾）
        if (pattern.startsWith('/') && pattern.endsWith('/')) {
            const regex = new RegExp(pattern.slice(1, -1));
            return regex.test(origin);
        }

        return false;
    });
}

/**
 * 将通配符模式转换为正则表达式
 */
function wildcardToRegex(pattern: string): RegExp {
    // 转义特殊字符，但保留 *
    const escaped = pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');

    return new RegExp(`^${escaped}$`);
}

/**
 * 解析环境变量中的 CORS Origins
 */
export function parseCorsOrigins(originsString: string): string[] {
    return originsString
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);
}
