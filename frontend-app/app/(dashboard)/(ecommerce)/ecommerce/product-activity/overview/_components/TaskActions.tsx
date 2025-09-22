'use client';

import React from 'react';

interface TaskActionsProps {
  taskId: string;
  taskName?: string;
}

const TaskActions: React.FC<TaskActionsProps> = ({ taskId, taskName }) => {
  const handleEdit = () => {
    // TODO: 导航到编辑页面
    console.log('编辑任务:', taskId);
  };

  const handleView = () => {
    // TODO: 打开任务详情
    console.log('查看任务详情:', taskId);
  };

  const handleCopy = () => {
    // TODO: 复制任务
    console.log('复制任务:', taskId);
  };

  const handleDelete = () => {
    // TODO: 删除任务确认
    if (window.confirm(`确定要删除任务"${taskName || taskId}"吗？`)) {
      console.log('删除任务:', taskId);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-3">
      <button
        onClick={handleEdit}
        className="font-medium text-[var(--primary-color)] hover:underline"
      >
        编辑
      </button>
      <button
        onClick={handleView}
        className="font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        详情
      </button>
      <button
        onClick={handleCopy}
        className="font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        复制
      </button>
      <button
        onClick={handleDelete}
        className="font-medium text-[var(--color-danger-600)] hover:underline"
      >
        删除
      </button>
    </div>
  );
};

export default TaskActions;