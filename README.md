# 智能起名助手

这是一个智能的中英文名字转换工具，可以帮助用户：
1. 将中文名智能转换为匹配的英文名
2. 将英文名智能转换为匹配的中文名

## 在线访问

访问我们的网站：[智能起名助手](https://prod2zzr.github.io/naming-app/)

## 功能特点

- 双向翻译：支持中文→英文、英文→中文的智能转换
- 智能识别：自动识别输入的语言类型
- 发音匹配：确保转换后的名字发音相近
- 含义对应：保持名字文化内涵的一致性
- 实时响应：即时生成名字建议
- 响应式设计：完美支持手机和电脑访问

## 使用方法

1. 访问网站
2. 在输入框中输入您的名字（中文或英文）
3. 系统会自动识别语言并生成对应的名字建议
4. 每个建议都包含：
   - 完整的译名
   - 发音指导
   - 含义解释
   - 匹配原因

## 技术实现

### 核心功能模块

1. **名字生成器** (nameGenerator.js)
   - 处理名字转换的主要逻辑
   - 整合各个工具模块的功能

2. **语言检测器** (languageDetector.js)
   - 自动识别输入语言类型
   - 确定转换方向

3. **名字分析器** (nameAnalyzer.js)
   - 分析名字的结构和特征
   - 提取关键信息用于匹配

4. **名字匹配器** (nameMatcher.js)
   - 基于发音和含义进行智能匹配
   - 生成最佳名字建议

### 项目结构

```
起名app/
├── README.md          # 项目说明文档
├── index.html         # 主页面
├── styles.css         # 样式表
├── js/               # JavaScript 源代码
│   ├── config.js     # 配置文件
│   ├── main.js       # 主程序逻辑
│   ├── nameGenerator.js # 名字生成器
│   └── utils/        # 工具函数
│       ├── languageDetector.js # 语言检测
│       ├── nameAnalyzer.js    # 名字分析
│       └── nameMatcher.js     # 名字匹配
└── data/             # 数据文件

```

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/prod2zzr/naming-app.git
cd naming-app
```

2. 使用任意 Web 服务器运行项目，例如：
   - 使用 Python：`python -m http.server`
   - 使用 Node.js：`npx serve`
   - 或直接打开 index.html 文件

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT License - 请查看 LICENSE 文件了解详情。
