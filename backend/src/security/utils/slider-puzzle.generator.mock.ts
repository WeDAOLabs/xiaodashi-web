/**
 * Slider Puzzle Generator Mock
 *
 * 用于测试环境的滑动拼图生成器模拟实现
 * 避免在测试中使用需要原生依赖的canvas库
 */

export class SliderPuzzleGenerator {
  private readonly width: number = 300;
  private readonly height: number = 150;
  private readonly pieceWidth: number = 50;
  private readonly pieceHeight: number = 50;

  /**
   * 生成滑动拼图（测试版本）
   *
   * @returns Promise<{ backgroundImage: string; puzzlePiece: string; xPosition: number; yPosition: number }>
   */
  generateSliderPuzzle(): {
    backgroundImage: string;
    puzzlePiece: string;
    xPosition: number;
    yPosition: number;
  } {
    // 随机生成拼图位置（避免太靠边）
    const xPosition =
      Math.floor(Math.random() * (this.width - this.pieceWidth - 40)) + 20;
    const yPosition =
      Math.floor(Math.random() * (this.height - this.pieceHeight - 40)) + 20;

    // 生成模拟的Base64图片数据（简单的SVG）
    const backgroundImage = this.generateMockBackgroundImage(
      xPosition,
      yPosition,
    );
    const puzzlePiece = this.generateMockPuzzlePiece();

    return {
      backgroundImage,
      puzzlePiece,
      xPosition,
      yPosition,
    };
  }

  /**
   * 验证滑动位置
   *
   * @param targetX 目标X位置
   * @param userX 用户提交的X位置
   * @param tolerance 容差范围
   * @returns boolean 是否验证成功
   */
  verifySliderPosition(
    targetX: number,
    userX: number,
    tolerance: number = 5,
  ): boolean {
    return Math.abs(targetX - userX) <= tolerance;
  }

  /**
   * 生成模拟背景图片
   *
   * @param xPosition 拼图X位置
   * @param yPosition 拼图Y位置
   * @returns string Base64编码的SVG图片
   * @private
   */
  private generateMockBackgroundImage(
    xPosition: number,
    yPosition: number,
  ): string {
    const svg = `
      <svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#4ECDC4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#45B7D1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="150" fill="url(#grad1)" />
        <rect x="${xPosition}" y="${yPosition}" width="50" height="50" fill="white" opacity="0.8" rx="5" />
        <text x="150" y="75" font-family="Arial" font-size="12" fill="white" text-anchor="middle">测试背景图</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString('base64')}`;
  }

  /**
   * 生成模拟拼图块
   *
   * @returns string Base64编码的SVG拼图块
   * @private
   */
  private generateMockPuzzlePiece(): string {
    const svg = `
      <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="50" fill="#4ECDC4" rx="5" />
        <rect width="50" height="50" fill="none" stroke="white" stroke-width="2" rx="5" />
        <text x="25" y="30" font-family="Arial" font-size="10" fill="white" text-anchor="middle">拼图</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString('base64')}`;
  }
}
