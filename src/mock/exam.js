export const examQuestions = [
  {
    id: 'e1', type: 'single',
    question: '太阳系中离太阳最近的行星是哪一颗？',
    options: ['金星', '水星', '地球', '火星'],
    answer: 1,
    relatedKnowledge: '天体运动'
  },
  {
    id: 'e2', type: 'image',
    question: '以下哪个是月球车的样子？',
    options: [
      { label: '六轮探测车', emoji: '🛞' },
      { label: '飞碟', emoji: '🛸' },
      { label: '潜水艇', emoji: '🚢' },
      { label: '自行车', emoji: '🚲' }
    ],
    answer: 0,
    relatedKnowledge: '工程设计'
  },
  {
    id: 'e3', type: 'single',
    question: '机器人的"大脑"通常指的是什么？',
    options: ['电池', '电线', '处理器/芯片', '外壳'],
    answer: 2,
    relatedKnowledge: '程序逻辑'
  },
  {
    id: 'e4', type: 'single',
    question: '人类第一次登上月球是哪一年？',
    options: ['1959年', '1969年', '1979年', '1989年'],
    answer: 1,
    relatedKnowledge: '太空探索历史'
  },
  {
    id: 'e5', type: 'image',
    question: '哪种能源最适合在太空中使用？',
    options: [
      { label: '太阳能板', emoji: '☀️' },
      { label: '风力发电', emoji: '💨' },
      { label: '煤炭', emoji: '⚫' },
      { label: '蜡烛', emoji: '🕯️' }
    ],
    answer: 0,
    relatedKnowledge: '太阳能'
  }
]
