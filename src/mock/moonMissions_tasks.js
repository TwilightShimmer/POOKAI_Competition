// 月球行动 Luna Mission — 10个赛场任务 + 营救规则
// 来源：POOK教育机器人赛项任务手册

export const moonTasks = [
  {
    id: 'M01', name: '人员轮换', emoji: '🚀', maxScore: 15,
    summary: '调整载人火箭至直立发射状态',
    description: '比赛开始前，载人火箭与场地膜保持水平以方便乘员登舱；比赛开始后，设备需要调整载人火箭至直立发射状态。',
    scoring: [
      { condition: '设备调整载人火箭至直立发射状态', points: 15 }
    ],
    skills: ['机械结构', '力矩控制'],
    difficulty: 1
  },
  {
    id: 'M02', name: '勘探矿藏', emoji: '⛏️', maxScore: 40,
    summary: '将配重块放置在升降平台上',
    description: '比赛开始前，升降平台处于高位；比赛开始后，设备搭载放置在任意启动区的配重块出发，并将配重块放置在升降平台上。',
    scoring: [
      { condition: '配重块放置在升降平台上，且配重块和矿藏勘探升降装置没有接触任何团队器材', points: 40 }
    ],
    skills: ['运输', '精准放置', '重力机制'],
    difficulty: 3
  },
  {
    id: 'M03', name: '运送补给', emoji: '📦', maxScore: 20,
    summary: '拨动连杆，将补给箱运送至旋转餐厅下方',
    description: '比赛开始前，补给箱与旋转餐厅白色支柱保持最大间距。比赛开始后，设备需要拨动输入连杆，将补给箱运送至旋转餐厅的下方。',
    scoring: [
      { condition: '输出连杆产生的位移使补给箱端超越了白色支柱的基准位置', points: 20 }
    ],
    skills: ['连杆机构', '力传递'],
    difficulty: 2
  },
  {
    id: 'M04', name: '月车驰援', emoji: '🏎️', maxScore: 20,
    summary: '将已修复的月球车运送至目标工作区域',
    description: '比赛前，已修复的月球车放置于维修厂区域；比赛开始后，设备需将该月球车运送至目标工作区域，执行途中可临时将月球车转运至任意启动区。',
    scoring: [
      { condition: '月球车一个或两个车轮触及目标工作区域，且没有接触任何团队器材', points: 10 },
      { condition: '月球车三个车轮均触及目标工作区域，且没有接触任何团队器材', points: 20 }
    ],
    skills: ['路径规划', '运输', '精准控制'],
    difficulty: 2
  },
  {
    id: 'M05', name: '资源回收', emoji: '♻️', maxScore: 40,
    summary: '收集废弃车轮装载到月球车上并运送至指定区域',
    description: '比赛开始前，废弃月球车与遗弃的四个车轮将被放置在场地膜上的五个指定位置。设备须收集上述物品，将车轮放置在月球车上，最终一同运送至指定区域。',
    scoring: [
      { condition: '月球车每成功装载一个已收集的车轮，且车轮没有接触任何团队器材', points: 5, note: '每个5分' },
      { condition: '月球车垂直投影完全在指定区域内，且没有接触任何团队器材', points: 20 }
    ],
    skills: ['多目标收集', '装载', '运输'],
    difficulty: 3
  },
  {
    id: 'M06', name: '投篮训练', emoji: '🏀', maxScore: 25,
    summary: '触发篮球发射装置并投篮入框',
    description: '比赛正式开始前，参赛队员可对篮球支架位置进行调整；比赛开始后，由设备拨动投篮装置的锁止杆，触发篮球发射。',
    scoring: [
      { condition: '设备拨动投篮装置的锁止杆，触发篮球发射', points: 15 },
      { condition: '篮球被发射后，成功投入球篮', points: 10, note: '额外+10' }
    ],
    skills: ['弹射机构', '角度调整', '能量转换'],
    difficulty: 2
  },
  {
    id: 'M07', name: '投送卫星', emoji: '🛰️', maxScore: 30,
    summary: '将两枚中继卫星投送至轨道区域',
    description: '比赛开始前，两枚中继卫星置于场地膜上的两个指定位置；比赛开始后，设备需将中继卫星投送至轨道区域。',
    scoring: [
      { condition: '中继卫星完全离开初始标定位置，却未被投送至轨道区域', points: 5, note: '每个5分' },
      { condition: '中继卫星垂直投影完全在轨道区域内，且没有接触任何团队器材', points: 15, note: '每个15分' }
    ],
    skills: ['抛射', '精准投放', '轨道理解'],
    difficulty: 3
  },
  {
    id: 'M08', name: '建立连接', emoji: '📡', maxScore: 20,
    summary: '推动通讯站齿条横杆，驱动天线转动搜索信号',
    description: '设备需要推动通讯站中安装有齿条的横杆，驱动天线转动并搜索中继卫星信号，直至横杆抵达限位位置。',
    scoring: [
      { condition: '齿条横梁上的金色单孔梁与通讯站内部限位圆砖保持物理贴合', points: 20 }
    ],
    skills: ['齿轮齿条', '推力控制', '机械传动'],
    difficulty: 2
  },
  {
    id: 'M09', name: '弹射运输', emoji: '💥', maxScore: 15,
    summary: '触发动力摆臂将月球车弹射出标定区域',
    description: '比赛开始前，弹射装置的支撑立柱垂直向上，托举挂载有配重块的动力摆臂处于高位蓄能状态。设备需拨动支撑立柱，通过重力势能将月球车弹出。',
    scoring: [
      { condition: '设备拨动支撑立柱后，触发动力摆臂下落', points: 5 },
      { condition: '月球车被弹射后，其投影完全超出初始标定位置', points: 10 }
    ],
    skills: ['势能转换', '触发机构', '弹射原理'],
    difficulty: 2
  },
  {
    id: 'M10', name: '登顶高峰', emoji: '⛰️', maxScore: 35,
    summary: '沿亚平宁山脉坡面行驶至平台顶端',
    description: '场地膜中心设置有"亚平宁山脉"道具，设备需沿该道具坡面行驶至平台道具顶端；比赛结束时，设备所有车轮须全部触及平台道具顶端，且设备未触碰弧形框架。',
    scoring: [
      { condition: '设备所有车轮均触及平台道具顶端，且未触碰弧形框架', points: 35 }
    ],
    skills: ['爬坡能力', '重心控制', '驱动力'],
    difficulty: 3
  }
]

export const rescueRules = {
  totalBonus: 40,
  penaltyPerRescue: 8,
  description: '每轮比赛营救奖励总分40分，每次营救扣8分。营救过程中计时不停止。'
}

export const competitionInfo = {
  name: '月球行动 · Luna Mission',
  season: '2026 赛季 · 星际源力',
  timeLimit: 150, // seconds
  rounds: 2,
  fieldSize: '2360 × 1140 mm',
  totalMaxScore: 300, // 所有任务满分 + 营救奖励
  fpse: [
    { key: 'F', name: '功能', desc: '明确机器人所需实现的目标功能' },
    { key: 'P', name: '原理', desc: '配合目标功能所需运用的原理' },
    { key: 'S', name: '标准', desc: '在实践中建立统一的标准' },
    { key: 'E', name: '效率', desc: '通过实践过程提高综合效率' }
  ]
}
