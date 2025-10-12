/**
 * 滑动拼图生成器
 *
 * 使用纯JavaScript和SVG生成滑动验证码的背景图片和拼图块
 * 避免canvas原生依赖，提高部署兼容性
 */

export class SliderPuzzleGenerator {
  private readonly width: number = 300;
  private readonly height: number = 150;
  private readonly pieceWidth: number = 50;
  private readonly pieceHeight: number = 50;

  /**
   * 生成滑动拼图
   *
   * @returns { backgroundImage: string; puzzlePiece: string; xPosition: number; yPosition: number }
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

    // 生成背景图
    const backgroundImage = this.generateBackgroundImage(xPosition, yPosition);

    // 生成拼图块
    const puzzlePiece = this.generatePuzzlePiece();

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
   * 生成背景图片（SVG）
   *
   * @param xPosition 拼图X位置
   * @param yPosition 拼图Y位置
   * @returns string Base64编码的SVG图片
   * @private
   */
  private generateBackgroundImage(
    xPosition: number,
    yPosition: number,
  ): string {
    const color1 = this.getRandomColor();
    const color2 = this.getRandomColor();
    const color3 = this.getRandomColor();

    // 生成干扰元素
    const interferenceElements = this.generateInterferenceElements();
    const puzzleHole = this.generatePuzzleHole(xPosition, yPosition);

    const svg = `
      <svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
          </linearGradient>
          <filter id="noise">
            <feTurbulence baseFrequency="0.9" numOctaves="4" />
            <feColorMatrix values="0 0 0 0 0
                               0 0 0 0 0
                               0 0 0 0 0
                               0 0 0 0.15 0" />
          </filter>
        </defs>

        <!-- 背景渐变 -->
        <rect width="300" height="150" fill="url(#grad)" />

        <!-- 噪点层 -->
        <rect width="300" height="150" fill="url(#noise)" opacity="0.3" />

        <!-- 干扰元素 -->
        ${interferenceElements}

        <!-- 拼图抠图区域 -->
        ${puzzleHole}
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString('base64')}`;
  }

  /**
   * 生成拼图块（SVG）
   *
   * @param xPosition 拼图X位置
   * @param yPosition 拼图Y位置
   * @returns string Base64编码的SVG拼图块
   * @private
   */
  private generatePuzzlePiece(): string {
    const pattern = this.generatePuzzlePattern();

    // 生成拼图块的阴影效果
    const shadow = `
      <defs>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
    `;

    const svg = `
      <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        ${shadow}

        <!-- 拼图背景 -->
        <rect width="50" height="50" fill="#4ECDC4" filter="url(#shadow)" />

        <!-- 拼图图案 -->
        ${pattern}

        <!-- 边框 -->
        <rect width="50" height="50" fill="none" stroke="white" stroke-width="2" rx="2" />
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString('base64')}`;
  }

  /**
   * 生成干扰元素
   *
   * @returns string SVG干扰元素
   * @private
   */
  private generateInterferenceElements(): string {
    let elements = '';

    // 添加随机线条
    for (let i = 0; i < 5; i++) {
      const x1 = Math.random() * 300;
      const y1 = Math.random() * 150;
      const x2 = Math.random() * 300;
      const y2 = Math.random() * 150;
      const color = this.getRandomColor();

      elements += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.6" />`;
    }

    // 添加随机圆点
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 300;
      const y = Math.random() * 150;
      const r = Math.random() * 3 + 1;
      const color = this.getRandomColor();

      elements += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.7" />`;
    }

    return elements;
  }

  /**
   * 生成拼图抠图区域
   *
   * @param x X坐标
   * @param y Y坐标
   * @returns string SVG拼图形状
   * @private
   */
  private generatePuzzleHole(x: number, y: number): string {
    const radius = 8;
    const puzzleSize = 12;

    return `
      <g transform="translate(${x}, ${y})">
        <!-- 拼图形状（挖空区域） -->
        <path d="
          M ${radius},0
          L ${this.pieceWidth - radius},0
          Q ${this.pieceWidth},0 ${this.pieceWidth},${radius}
          L ${this.pieceWidth},${this.pieceHeight - radius - puzzleSize}
          Q ${this.pieceWidth},${this.pieceHeight - puzzleSize} ${this.pieceWidth - radius},${this.pieceHeight - puzzleSize}
          Q ${this.pieceWidth - puzzleSize / 2},${this.pieceHeight - puzzleSize / 2} ${this.pieceWidth - puzzleSize},${this.pieceHeight - puzzleSize / 2}
          Q ${this.pieceWidth - puzzleSize},${this.pieceHeight - puzzleSize} ${this.pieceWidth - puzzleSize},${this.pieceHeight - radius - puzzleSize}
          L ${this.pieceWidth},${this.pieceHeight - radius - puzzleSize}
          L ${this.pieceWidth},${this.pieceHeight - radius}
          Q ${this.pieceWidth},${this.pieceHeight} ${this.pieceWidth - radius},${this.pieceHeight}
          L ${radius + puzzleSize},${this.pieceHeight}
          Q ${radius + puzzleSize},${this.pieceHeight} ${radius + puzzleSize},${this.pieceHeight - radius}
          L ${radius + puzzleSize},${this.pieceHeight - radius}
          Q ${radius + puzzleSize},${this.pieceHeight - puzzleSize / 2} ${puzzleSize / 2},${this.pieceHeight - puzzleSize / 2}
          Q ${puzzleSize},${this.pieceHeight - puzzleSize} ${puzzleSize},${this.pieceHeight - puzzleSize / 2}
          Q ${puzzleSize},${this.pieceHeight - puzzleSize} ${puzzleSize},${this.pieceHeight - radius}
          L ${puzzleSize},${this.pieceHeight - radius}
          Q ${puzzleSize},${this.pieceHeight} ${radius},${this.pieceHeight}
          L 0,${this.pieceHeight - radius}
          Q 0,${this.pieceHeight} 0,${this.pieceHeight - radius}
          Q 0,${this.pieceHeight} ${radius},${this.pieceHeight}
          Q 0,${this.pieceHeight} 0,${this.pieceHeight - radius}
          L 0,${radius}
          Q 0,0 ${radius},0
          Z
        " fill="white" stroke="rgba(0,0,0,0.5)" stroke-width="2" />
      </g>
    `;
  }

  /**
   * 生成拼图图案
   *
   * @returns string SVG拼图图案
   * @private
   */
  private generatePuzzlePattern(): string {
    const patterns = [
      // 简单的点状图案
      `<circle cx="10" cy="10" r="2" fill="white" opacity="0.8" />
       <circle cx="25" cy="10" r="2" fill="white" opacity="0.8" />
       <circle cx="40" cy="10" r="2" fill="white" opacity="0.8" />
       <circle cx="10" cy="25" r="2" fill="white" opacity="0.8" />
       <circle cx="25" cy="25" r="2" fill="white" opacity="0.8" />
       <circle cx="40" cy="25" r="2" fill="white" opacity="0.8" />
       <circle cx="10" cy="40" r="2" fill="white" opacity="0.8" />
       <circle cx="25" cy="40" r="2" fill="white" opacity="0.8" />
       <circle cx="40" cy="40" r="2" fill="white" opacity="0.8" />`,

      // 线条图案
      `<line x1="5" y1="5" x2="45" y2="45" stroke="white" stroke-width="1" opacity="0.6" />
       <line x1="45" y1="5" x2="5" y2="45" stroke="white" stroke-width="1" opacity="0.6" />
       <line x1="5" y1="25" x2="45" y2="25" stroke="white" stroke-width="1" opacity="0.6" />
       <line x1="25" y1="5" x2="25" y2="45" stroke="white" stroke-width="1" opacity="0.6" />`,

      // 几何图案
      `<rect x="10" y="10" width="8" height="8" fill="white" opacity="0.7" />
       <rect x="32" y="10" width="8" height="8" fill="white" opacity="0.7" />
       <rect x="10" y="32" width="8" height="8" fill="white" opacity="0.7" />
       <rect x="32" y="32" width="8" height="8" fill="white" opacity="0.7" />
       <rect x="21" y="21" width="8" height="8" fill="white" opacity="0.7" />`,
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  /**
   * 生成随机颜色
   *
   * @returns string 十六进制颜色值
   * @private
   */
  private getRandomColor(): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E9',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
