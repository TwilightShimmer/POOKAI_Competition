// 等级考试体系 - L1-L6, 3个阶段
export const examStages = [
  {
    id: 'stage1', name: '第一阶段', description: '基础启蒙', unlockCondition: null,
    levels: [
      { id: 'L1', name: 'L1 感知入门', age: '5-6岁', questionRange: [1, 20], canSkip: true, description: '基础感知与物理常识' },
      { id: 'L2', name: 'L2 思维启蒙', age: '5-7岁', questionRange: [21, 40], canSkip: true, description: '逻辑推理与AI认知' },
      { id: 'L3', name: 'L3 综合应用', age: '6-8岁', questionRange: [41, 60], canSkip: false, description: '跨学科综合能力，通过后解锁第二阶段' }
    ]
  },
  {
    id: 'stage2', name: '第二阶段', description: '进阶探索', unlockCondition: 'L3',
    levels: [
      { id: 'L4', name: 'L4 深度探究', age: '7-9岁', questionRange: [61, 75], canSkip: false, description: '深入科学原理与工程设计' },
      { id: 'L5', name: 'L5 创新融合', age: '8-10岁', questionRange: [76, 90], canSkip: false, description: '创新思维与伦理判断' },
      { id: 'L6', name: 'L6 领航大师', age: '9-12岁', questionRange: [91, 100], canSkip: false, description: '综合素养与未来愿景' }
    ]
  }
]

// 每个等级考试从题池中随机抽5题
export const EXAM_QUESTION_COUNT = 5
