# Docker 数据卷目录

本目录用于存放 Docker 容器的持久化数据。

## 目录结构

```
volumes/
├── logs/          # 应用日志文件
└── temp/          # 临时文件存储
```

## 说明

- **logs/**: 存放应用程序的日志文件
- **temp/**: 存放临时文件和缓存

这些目录会被 docker-compose.prod.yml 挂载到容器内部，用于数据持久化。