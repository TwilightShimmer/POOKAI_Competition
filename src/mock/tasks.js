export const tasks = [
  // === 火星探索 (mars) ===
  {
    id: 't1', themeId: 'mars', title: '火星大气成分', shortDesc: '火星的大气主要由什么组成？',
    type: 'single', difficulty: 'easy', rewardKnowledgeIds: ['c1','c12'], rewardBadge: '大气专家',
    status: 'todo',
    question: '火星大气中含量最高的气体是？',
    options: ['氧气', '二氧化碳', '氮气', '氢气'],
    answer: 1, explanation: '火星大气中约95%是二氧化碳。'
  },
  {
    id: 't2', themeId: 'mars', title: '火星地表颜色', shortDesc: '为什么火星看起来是红色的？',
    type: 'image', difficulty: 'easy', rewardKnowledgeIds: ['c3'], rewardBadge: '地质探索者',
    status: 'todo',
    question: '哪个图片展示了让火星变红的矿物？',
    options: [
      { label: '氧化铁(铁锈)', emoji: '🟤', correct: true },
      { label: '石英(白色)', emoji: '⬜' },
      { label: '铜矿(绿色)', emoji: '🟩' },
      { label: '金矿(金色)', emoji: '🟡' }
    ],
    answer: 0, explanation: '火星表面富含氧化铁，所以呈红色。'
  },
  {
    id: 't3', themeId: 'mars', title: '火星探测器着陆', shortDesc: '将探测器着陆步骤排序',
    type: 'sort', difficulty: 'medium', rewardKnowledgeIds: ['c17','c18'], rewardBadge: '着陆工程师',
    status: 'todo',
    question: '请将火星探测器着陆的步骤排列正确：',
    steps: ['进入火星大气层', '打开降落伞', '启动反推火箭', '释放气囊着陆'],
    correctOrder: [0, 1, 2, 3],
    explanation: '着陆需要按顺序完成：进入大气→降落伞减速→反推火箭→气囊着陆。'
  },
  {
    id: 't4', themeId: 'mars', title: '火星生存判断', shortDesc: '判断在火星上能否做这件事',
    type: 'judge', difficulty: 'medium', rewardKnowledgeIds: ['c34'], rewardBadge: '生存大师',
    status: 'todo',
    question: '在火星上不穿宇航服可以直接呼吸吗？',
    options: ['可以，火星有空气', '不可以，火星大气不适合人类呼吸'],
    answer: 1, explanation: '火星大气稀薄且主要是二氧化碳，人类无法直接呼吸。'
  },
  {
    id: 't5', themeId: 'mars', title: '火星水源探测', shortDesc: '火星上是否存在水？',
    type: 'single', difficulty: 'hard', rewardKnowledgeIds: ['c4','c11'], rewardBadge: '水源猎人',
    status: 'todo',
    question: '科学家在火星哪里发现了水冰的证据？',
    options: ['火山口', '极地冰盖', '赤道地区', '大气层中'],
    answer: 1, explanation: '火星的南北极地冰盖含有大量水冰和干冰。'
  },
  {
    id: 't6', themeId: 'mars', title: '火星基地选址', shortDesc: '如果要在火星建基地，选哪里？',
    type: 'judge', difficulty: 'hard', rewardKnowledgeIds: ['c37'], rewardBadge: '基地规划师',
    status: 'todo',
    question: '建造火星基地时，应该优先考虑的位置是？',
    options: ['靠近极地冰盖（有水源）', '火星最高山峰山顶（视野好）', '随便选一个平坦的地方'],
    answer: 0, explanation: '靠近水源是建造基地最重要的考虑，极地冰盖有丰富水冰。'
  },

  // === 月球基地 (moon) ===
  {
    id: 't7', themeId: 'moon', title: '月球引力', shortDesc: '月球的引力和地球比怎么样？',
    type: 'single', difficulty: 'easy', rewardKnowledgeIds: ['c21','c15'], rewardBadge: '引力学者',
    status: 'todo',
    question: '月球的引力大约是地球的多少？',
    options: ['1/2', '1/6', '1/10', '和地球一样'],
    answer: 1, explanation: '月球引力约为地球的1/6，所以宇航员可以跳得更高。'
  },
  {
    id: 't8', themeId: 'moon', title: '月球土壤', shortDesc: '认识月球表面的特殊物质',
    type: 'image', difficulty: 'easy', rewardKnowledgeIds: ['c5'], rewardBadge: '月壤收集者',
    status: 'todo',
    question: '月球表面覆盖着什么物质？',
    options: [
      { label: '月壤(细小岩石碎屑)', emoji: '🌑', correct: true },
      { label: '沙子(像沙漠)', emoji: '🏜️' },
      { label: '冰层(像南极)', emoji: '🧊' },
      { label: '草地(像地球)', emoji: '🌿' }
    ],
    answer: 0, explanation: '月球表面覆盖着月壤，由陨石撞击形成的细小岩石碎屑。'
  },
  {
    id: 't9', themeId: 'moon', title: '建造月球基地', shortDesc: '排列建造月球基地的步骤',
    type: 'sort', difficulty: 'medium', rewardKnowledgeIds: ['c14','c19'], rewardBadge: '月球建筑师',
    status: 'todo',
    question: '请将建造月球基地的步骤排列正确：',
    steps: ['选择建造地点', '运送建筑材料', '搭建基本结构', '安装生命维持系统'],
    correctOrder: [0, 1, 2, 3],
    explanation: '先选址，再运送材料，搭建结构，最后装生命维持系统。'
  },
  {
    id: 't10', themeId: 'moon', title: '月球昼夜', shortDesc: '月球的一天有多长？',
    type: 'single', difficulty: 'medium', rewardKnowledgeIds: ['c16'], rewardBadge: '时间管理者',
    status: 'todo',
    question: '月球上一个"白天"大约持续多久？',
    options: ['12小时', '24小时', '约14个地球日', '1个地球日'],
    answer: 2, explanation: '月球自转周期约27天，所以白天和黑夜各约14个地球日。'
  },
  {
    id: 't11', themeId: 'moon', title: '月球能源方案', shortDesc: '在月球用什么发电？',
    type: 'judge', difficulty: 'hard', rewardKnowledgeIds: ['c26','c27'], rewardBadge: '能源工程师',
    status: 'todo',
    question: '月球基地最适合使用哪种能源？',
    options: ['太阳能（月球无大气遮挡）', '风能（月球有风）'],
    answer: 0, explanation: '月球没有大气，无法使用风能，但太阳能非常充足。'
  },
  {
    id: 't12', themeId: 'moon', title: '月球通信', shortDesc: '怎样和地球保持联系？',
    type: 'judge', difficulty: 'hard', rewardKnowledgeIds: ['c30'], rewardBadge: '通信专家',
    status: 'todo',
    question: '从月球发信号到地球大约需要多长时间？',
    options: ['几乎瞬间到达', '约1.3秒', '约1小时'],
    answer: 1, explanation: '光速从月球到地球约1.3秒，所以通信有轻微延迟。'
  },

  // === 机器人挑战 (robot) ===
  {
    id: 't13', themeId: 'robot', title: '机器人传感器', shortDesc: '机器人靠什么感知世界？',
    type: 'single', difficulty: 'easy', rewardKnowledgeIds: ['c6','c7'], rewardBadge: '传感达人',
    status: 'todo',
    question: '机器人用什么来"看"东西？',
    options: ['眼睛', '摄像头/传感器', '触觉', '听觉'],
    answer: 1, explanation: '机器人通过摄像头和各种传感器来感知周围环境。'
  },
  {
    id: 't14', themeId: 'robot', title: '机器人类型识别', shortDesc: '认识不同类型的机器人',
    type: 'image', difficulty: 'easy', rewardKnowledgeIds: ['c25'], rewardBadge: '机器人鉴赏家',
    status: 'todo',
    question: '哪种机器人最适合在工厂里组装汽车？',
    options: [
      { label: '机械臂机器人', emoji: '🦾', correct: true },
      { label: '飞行无人机', emoji: '🛸' },
      { label: '扫地机器人', emoji: '🧹' },
      { label: '聊天机器人', emoji: '💬' }
    ],
    answer: 0, explanation: '机械臂机器人精确、有力，最适合工厂组装作业。'
  },
  {
    id: 't15', themeId: 'robot', title: '机器人编程逻辑', shortDesc: '给机器人安排行动顺序',
    type: 'sort', difficulty: 'medium', rewardKnowledgeIds: ['c23','c24'], rewardBadge: '编程新星',
    status: 'todo',
    question: '让机器人从A点走到B点并拿起物品，正确顺序是：',
    steps: ['启动电源', '设定目标位置', '开始移动', '到达后执行抓取'],
    correctOrder: [0, 1, 2, 3],
    explanation: '启动→设定目标→移动→执行任务，这是基本的机器人行动逻辑。'
  },
  {
    id: 't16', themeId: 'robot', title: '机器人避障', shortDesc: '机器人遇到障碍怎么办？',
    type: 'judge', difficulty: 'medium', rewardKnowledgeIds: ['c20'], rewardBadge: '避障高手',
    status: 'todo',
    question: '自动驾驶机器人前方有障碍物，它应该怎么做？',
    options: ['直接撞过去', '停下来检测并绕行', '立刻关机'],
    answer: 1, explanation: '机器人应检测障碍，计算新路线后绕行，这叫避障算法。'
  },
  {
    id: 't17', themeId: 'robot', title: 'AI与机器人', shortDesc: '人工智能让机器人更聪明',
    type: 'single', difficulty: 'hard', rewardKnowledgeIds: ['c28','c33'], rewardBadge: 'AI学者',
    status: 'todo',
    question: 'AI(人工智能)可以帮助机器人做什么？',
    options: ['只能说话', '学习和适应新情况', '只能计算数学', '什么都做不了'],
    answer: 1, explanation: 'AI让机器人能从经验中学习，适应新环境和新任务。'
  },
  {
    id: 't18', themeId: 'robot', title: '未来机器人设计', shortDesc: '设计一个理想的家用机器人',
    type: 'judge', difficulty: 'hard', rewardKnowledgeIds: ['c36','c38'], rewardBadge: '未来设计师',
    status: 'todo',
    question: '一个好的家用机器人最重要的特点是什么？',
    options: ['跑得很快', '安全且易于操作', '体积越大越好'],
    answer: 1, explanation: '家用机器人最重要的是安全性和易用性，尤其是有小孩的家庭。'
  }
]
