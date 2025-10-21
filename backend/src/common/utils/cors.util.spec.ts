import { isOriginAllowed, parseCorsOrigins } from './cors.util';

describe('CORS Utils', () => {
  describe('isOriginAllowed', () => {
    it('应该支持精确匹配', () => {
      const allowed = ['https://app.xds.sxx0.com'];
      expect(isOriginAllowed('https://app.xds.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://evil.com', allowed)).toBe(false);
    });

    it('应该支持通配符匹配', () => {
      const allowed = ['https://*.sxx0.com'];
      expect(isOriginAllowed('https://app.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://admin.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://evil.com', allowed)).toBe(false);
    });

    it('应该支持多级子域名通配符', () => {
      const allowed = ['*.sxx0.com'];
      expect(isOriginAllowed('https://api.v1.sxx0.com', allowed)).toBe(true);
    });

    it('应该支持带协议的通配符', () => {
      const allowed = ['https://*.sxx0.com'];
      expect(isOriginAllowed('https://app.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('http://app.sxx0.com', allowed)).toBe(false);
    });

    it('应该支持正则表达式匹配', () => {
      const allowed = ['/^https:\\/\\/(app|admin)\\.sxx0\\.com$/'];
      expect(isOriginAllowed('https://app.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://admin.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://evil.sxx0.com', allowed)).toBe(false);
    });

    it('开发环境应该允许 localhost', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const allowed = ['https://app.xds.sxx0.com'];
      expect(isOriginAllowed('http://localhost:3000', allowed)).toBe(true);
      expect(isOriginAllowed('http://127.0.0.1:3001', allowed)).toBe(true);
      expect(isOriginAllowed('https://evil.com', allowed)).toBe(false);

      // 恢复环境变量
      process.env.NODE_ENV = originalEnv;
    });

    it('生产环境不应该自动允许 localhost', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const allowed = ['https://app.xds.sxx0.com'];
      expect(isOriginAllowed('http://localhost:3000', allowed)).toBe(false);
      expect(isOriginAllowed('http://127.0.0.1:3001', allowed)).toBe(false);

      // 恢复环境变量
      process.env.NODE_ENV = originalEnv;
    });

    it('应该正确处理空字符串和无效输入', () => {
      const allowed = ['https://app.sxx0.com'];
      expect(isOriginAllowed('', allowed)).toBe(false);
      expect(isOriginAllowed('invalid-url', allowed)).toBe(false);
    });

    it('应该支持多个允许的域名', () => {
      const allowed = [
        'https://app.sxx0.com',
        'https://admin.sxx0.com',
        '*.test.com',
      ];
      expect(isOriginAllowed('https://app.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://admin.sxx0.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://api.test.com', allowed)).toBe(true);
      expect(isOriginAllowed('https://evil.com', allowed)).toBe(false);
    });
  });

  describe('parseCorsOrigins', () => {
    it('应该正确解析逗号分隔的域名', () => {
      const result = parseCorsOrigins('https://a.com,https://b.com');
      expect(result).toEqual(['https://a.com', 'https://b.com']);
    });

    it('应该去除空格', () => {
      const result = parseCorsOrigins('https://a.com , https://b.com');
      expect(result).toEqual(['https://a.com', 'https://b.com']);
    });

    it('应该过滤空字符串', () => {
      const result = parseCorsOrigins('https://a.com,,https://b.com,');
      expect(result).toEqual(['https://a.com', 'https://b.com']);
    });

    it('应该处理空输入', () => {
      const result = parseCorsOrigins('');
      expect(result).toEqual([]);
    });

    it('应该处理只有空格的输入', () => {
      const result = parseCorsOrigins('  ,  ,  ');
      expect(result).toEqual([]);
    });

    it('应该支持通配符和正则表达式', () => {
      const result = parseCorsOrigins(
        'https://*.sxx0.com,/^https:\\/\\/.*\\.test\\.com$/',
      );
      expect(result).toEqual([
        'https://*.sxx0.com',
        '/^https:\\/\\/.*\\.test\\.com$/',
      ]);
    });
  });
});
