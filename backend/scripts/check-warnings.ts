#!/usr/bin/env ts-node

/**
 * TypeScript警告检查脚本
 *
 * 此脚本专门用于检查和显示TypeScript编译警告，
 * 确保所有潜在问题都能在命令行中清晰显示
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface CheckResult {
  success: boolean;
  warnings: string[];
  errors: string[];
  output: string;
}

class WarningChecker {
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  /**
   * 执行TypeScript编译检查
   */
  private checkTypeScriptWarnings(): CheckResult {
    console.log('🔍 检查 TypeScript 编译警告...\n');

    try {
      // 使用 tsc --noEmit 进行类型检查，不生成文件
      const output = execSync('npx tsc --noEmit --pretty false', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      return {
        success: true,
        warnings: [],
        errors: [],
        output: output
      };
    } catch (error: any) {
      const output = error.stdout || error.message || '';
      const lines = output.split('\n').filter(line => line.trim());

      const warnings: string[] = [];
      const errors: string[] = [];

      lines.forEach(line => {
        if (line.includes('warning ')) {
          warnings.push(line);
        } else if (line.includes('error ')) {
          errors.push(line);
        }
      });

      return {
        success: errors.length === 0,
        warnings,
        errors,
        output
      };
    }
  }

  /**
   * 执行Jest测试并捕获警告
   */
  private checkJestWarnings(): CheckResult {
    console.log('🧪 检查 Jest 测试警告...\n');

    try {
      const output = execSync('npm run test:warnings', {
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      return {
        success: true,
        warnings: [],
        errors: [],
        output
      };
    } catch (error: any) {
      const output = error.stdout || error.message || '';

      return {
        success: false,
        warnings: this.extractWarnings(output),
        errors: this.extractErrors(output),
        output
      };
    }
  }

  /**
   * 从输出中提取警告信息
   */
  private extractWarnings(output: string): string[] {
    const warnings: string[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('warning') || line.includes('Warning') || line.includes('⚠️')) {
        warnings.push(line.trim());
      }
    }

    return warnings;
  }

  /**
   * 从输出中提取错误信息
   */
  private extractErrors(output: string): string[] {
    const errors: string[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('error') || line.includes('Error') || line.includes('❌') || line.includes('FAIL')) {
        errors.push(line.trim());
      }
    }

    return errors;
  }

  /**
   * 显示检查结果
   */
  private displayResult(title: string, result: CheckResult): void {
    console.log(`\n${title}`);
    console.log('='.repeat(50));

    if (result.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      result.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    if (result.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (result.warnings.length === 0 && result.errors.length === 0) {
      console.log('\n✅ 没有发现问题！');
    }

    console.log('\n' + '='.repeat(50));
  }

  /**
   * 运行完整的警告检查
   */
  public async runFullCheck(): Promise<void> {
    console.log('🚀 开始全面代码质量检查...\n');

    // 1. TypeScript警告检查
    const tsResult = this.checkTypeScriptWarnings();
    this.displayResult('TypeScript 检查结果', tsResult);

    // 2. Jest测试警告检查
    const jestResult = this.checkJestWarnings();
    this.displayResult('Jest 测试结果', jestResult);

    // 3. 总结
    const totalWarnings = tsResult.warnings.length + jestResult.warnings.length;
    const totalErrors = tsResult.errors.length + jestResult.errors.length;

    console.log('\n📊 检查总结:');
    console.log(`  警告数量: ${totalWarnings}`);
    console.log(`  错误数量: ${totalErrors}`);

    if (totalErrors > 0) {
      console.log('\n❌ 检查失败！存在错误需要修复。');
      process.exit(1);
    } else if (totalWarnings > 0) {
      console.log('\n⚠️  检查完成，但存在警告需要关注。');
      process.exit(0);
    } else {
      console.log('\n✅ 检查通过！代码质量良好。');
      process.exit(0);
    }
  }
}

// 执行检查
if (require.main === module) {
  const checker = new WarningChecker();
  checker.runFullCheck().catch(error => {
    console.error('检查过程中发生错误:', error);
    process.exit(1);
  });
}

export { WarningChecker };