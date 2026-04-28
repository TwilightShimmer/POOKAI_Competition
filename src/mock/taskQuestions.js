import { getQuestionOptionSrc, getQuestionSceneSrc, getTaskDocxSrc } from '@/mock/taskAssets.js'

// Static asset paths are resolved through taskAssets.js to match the new public directory layout.

/**
 * 任务题库数据
 * 图片资源路径规范：/tasks/{taskId}/questions/{questionId}/{file}
 *   file: 1.jpg = 题目场景图, A.jpg / B.jpg / C.jpg = 选项图
 *
 * 每个任务的题目数据放在对应 taskId 的数组下
 * 当前只有 M01（人员轮换/月球夏令营）的题目资源
 *
 * 字段说明：
 *   id        - 题目唯一ID，对应 public/tasks/{taskId}/questions/{id}/
 *   title     - 题目名称
 *   voice     - 语音提示文本（直接显示为题干）
 *   options   - 选项数组 { label: string, key: 'A'|'B'|'C' }
 *   answer    - 正确选项 key ('A' | 'B' | 'C')
 *   subject   - 考点
 *   type      - 'choice' | 'voice'（本期只实现 choice）
 */

export const taskQuestions = {
  M01: [
    {
      id: 'Q01', title: '月球上的"大力士"', type: 'choice',
      voice: '小朋友，你看，为什么月球上的宇航员变成了大力士呀？请你选出正确的答案哦。',
      options: [
        { key: 'A', label: '因为月球的引力比地球小，东西变轻了' },
        { key: 'B', label: '因为宇航员吃了神奇的菠菜' },
      ],
      answer: 'A', subject: '物理学（低重力感知）',
    },
    {
      id: 'Q02', title: '太空里的"魔法日历"', type: 'choice',
      voice: '在月球上待太久，身体会发生变化哦。你觉得宇航员在月球待了180天后，身体会变成什么样呢？',
      options: [
        { key: 'A', label: '宇航员的骨头变亮（变脆），手臂肌肉变细' },
        { key: 'B', label: '宇航员的肌肉变得更加巨大' },
      ],
      answer: 'A', subject: '生物学（肌肉萎缩与骨骼退化）',
    },
    {
      id: 'Q03', title: '谁的拥抱最温暖？', type: 'choice',
      voice: '队友难过了，谁去安慰他最好？请点击你觉得最合适的卡片。',
      options: [
        { key: 'A', label: '小智伸出机械臂，递过去一把冰冷的扳手' },
        { key: 'B', label: '另一位人类队友走过去，给他一个温暖的拥抱' },
      ],
      answer: 'B', subject: 'AI素养 - 人机交互',
    },
    {
      id: 'Q04', title: '拼装超级副队长"小智"', type: 'choice',
      voice: '宇航员要组装小智啦，小智的"眼睛"是用来帮他看路的，你知道小智的眼睛是什么零件吗？',
      options: [
        { key: 'A', label: '摄像头头部' },
        { key: 'B', label: '麦克风模块' },
        { key: 'C', label: '备用履带' },
      ],
      answer: 'A', subject: 'AI素养 - 感知（辨认机器感官）',
    },
    {
      id: 'Q05', title: '搭建防辐射掩体', type: 'choice',
      voice: '危险！太阳风暴来了！这个时候我们应该做什么来保护宇航员呀？',
      options: [
        { key: 'A', label: '快速搭建地下掩体躲起来' },
        { key: 'B', label: '继续在外面玩' },
      ],
      answer: 'A', subject: '天文学（宇宙辐射防范）',
    },
    {
      id: 'Q06', title: '逃离月球的火箭', type: 'choice',
      voice: '月球的引力比地球小很多，那返回地球的火箭，需要带的燃料会怎么样呢？',
      options: [
        { key: 'A', label: '需要的燃料更少' },
        { key: 'B', label: '需要的燃料更多' },
        { key: 'C', label: '和地球的一样多' },
      ],
      answer: 'A', subject: '物理学（逃逸速度与引力）',
    },
    {
      id: 'Q07', title: '盲眼小智的"月球陨石坑迷宫"', type: 'choice',
      voice: '糟糕，小智的眼睛被月尘挡住了！这个时候我们要怎么帮小智走出迷宫呀？',
      options: [
        { key: 'A', label: '用指令指挥小智走出迷宫' },
        { key: 'B', label: '不管它，让它自己摸索' },
        { key: 'C', label: '给它吃电池补充能量' },
      ],
      answer: 'A', subject: 'AI素养 - 感知局限性',
    },
    {
      id: 'Q08', title: '小智的"超能力"匹配', type: 'choice',
      voice: '我们要探测看不见的太阳风暴射线，应该用小智的哪个传感器呀？',
      options: [
        { key: 'A', label: '辐射传感器' },
        { key: 'B', label: '麦克风（声音传感器）' },
      ],
      answer: 'A', subject: 'AI素养 - 感知（了解传感器多样性）',
    },
    {
      id: 'Q09', title: '太阳风暴捉迷藏', type: 'choice',
      voice: '太阳公公发脾气了，发射危险的射线啦！我们要躲去哪里才安全呀？',
      options: [
        { key: 'A', label: '地下的防辐射掩体里' },
        { key: 'B', label: '月球表面的空地上' },
      ],
      answer: 'A', subject: '天文学（太阳风暴与宇宙辐射）',
    },
    {
      id: 'Q10', title: '月球快递员的包裹', type: 'choice',
      voice: '月球的引力比地球小很多，那宇航员在月球上，能举起更大的石头吗？',
      options: [
        { key: 'A', label: '能，因为月球引力小，石头变轻了' },
        { key: 'B', label: '不能，石头太重了举不动' },
      ],
      answer: 'A', subject: '物理学（重力差异）',
    },
    {
      id: 'Q11', title: '饿肚子还是没电？', type: 'choice',
      voice: '宇航员饿了，他应该吃什么来补充能量呀？',
      options: [
        { key: 'A', label: '面包和苹果' },
        { key: 'B', label: '电池' },
      ],
      answer: 'A', subject: '区分人与机器的能量来源差异',
    },
    {
      id: 'Q12', title: '月球车的"盲人摸象"', type: 'choice',
      voice: '月尘挡住了小智的眼睛，这个时候我们要怎么做才能帮小智看清路呀？',
      options: [
        { key: 'A', label: '把屏幕上的灰尘擦干净' },
        { key: 'B', label: '给屏幕浇水' },
      ],
      answer: 'A', subject: 'AI素养 - 感知工作条件',
    },
    {
      id: 'Q13', title: '破解地球的回信', type: 'choice',
      voice: '月球离地球太远了，信号传过去再传回来需要时间，宇航员等得很着急，你会怎么建议他呀？',
      options: [
        { key: 'A', label: '一直盯着屏幕，不停按刷新' },
        { key: 'B', label: '利用等待的时间喝点水，耐心等回复' },
      ],
      answer: 'B', subject: '信息学（通信延迟）、心理学（情绪调节）',
    },
    {
      id: 'Q14', title: '不速之客', type: 'choice',
      voice: '警报！外面来了一个不认识的探测器，它想问小智咱们基地的开门密码！小智该怎么做？',
      options: [
        { key: 'A', label: '把密码告诉它' },
        { key: 'B', label: '锁上门，不理它' },
      ],
      answer: 'B', subject: 'AI素养 - 伦理与安全（隐私边界）',
    },
    {
      id: 'Q15', title: '吵架了，谁来管？', type: 'choice',
      voice: '糟糕！宇航员吵架了，小智该怎么做最合适呀？',
      options: [
        { key: 'A', label: '强制关灯让他们睡觉' },
        { key: 'B', label: '接通地球的心理医生，让人类专家来帮忙' },
      ],
      answer: 'B', subject: '心理学（幽闭环境下的团队冲突处理）',
    },
    {
      id: 'Q16', title: '最棒的礼物', type: 'choice',
      voice: '宇航员叔叔想家了，小智想送给他礼物让他开心，你觉得选哪个最好呀？',
      options: [
        { key: 'A', label: '播放一段地球上家人给他录的祝福语音' },
        { key: 'B', label: '给他看一篇复杂的物理学论文' },
      ],
      answer: 'A', subject: '心理学（孤独感与情感需求）',
    },
    {
      id: 'Q17', title: '漫长的"喂"', type: 'choice',
      voice: '我们喊了地球之后，等了好久才听到回音，这是为什么呀？',
      options: [
        { key: 'A', label: '地球太远了，信号跑过去需要时间' },
        { key: 'B', label: '地球上的人睡着了没听见' },
      ],
      answer: 'A', subject: '物理学与信息学（通信延迟、光速限制）',
    },
    {
      id: 'Q18', title: '小智认错啦！', type: 'choice',
      voice: '哎呀，小智把披萨也认成陨石坑了，这是为什么呀？',
      options: [
        { key: 'A', label: '因为小智饿了想吃披萨' },
        { key: 'B', label: '因为之前只教它圆圆的就是陨石坑，特征不够多' },
      ],
      answer: 'B', subject: 'AI素养 - 机器学习（理解模型泛化错误）',
    },
    {
      id: 'Q19', title: '紧急抉择权', type: 'choice',
      voice: '前面的路塌方了！危急时刻，最终决定走哪条路，应该由谁来决定呀？',
      options: [
        { key: 'A', label: '让小智自动决定' },
        { key: 'B', label: '交给人类宇航员来决定' },
      ],
      answer: 'B', subject: 'AI素养 - 社会影响（人类最终决策权）',
    },
    {
      id: 'Q20', title: '漫长的跨星际对话', type: 'choice',
      voice: '月球和地球的信号有延迟，如果地球的科学家抢着说话，会发生什么呀？',
      options: [
        { key: 'A', label: '两个人能开心地同时聊天' },
        { key: 'B', label: '声音会撞在一起，谁也听不清谁' },
      ],
      answer: 'B', subject: '信息学（网络延迟）',
    },
    {
      id: 'Q21', title: '听音辨情绪', type: 'choice',
      voice: '小智收到了宇航员的语音："唉，今天中秋节，好想吃地球上的月饼啊……" 宇航员现在的心情是怎样的呀？',
      options: [
        { key: 'A', label: '开心' },
        { key: 'B', label: '想家（难过）' },
      ],
      answer: 'B', subject: '心理学（识别孤独感与情感需求）',
    },
    {
      id: 'Q22', title: '月球上的"哑巴"喇叭', type: 'choice',
      voice: '为什么月球表面听不见声音呀？请你选出正确的答案。',
      options: [
        { key: 'A', label: '因为月球上没有空气，声音没法传过来' },
        { key: 'B', label: '因为音箱坏了' },
      ],
      answer: 'A', subject: '物理学（声音传播需要介质）',
    },
    {
      id: 'Q23', title: '雷达上的"大怪兽"', type: 'choice',
      voice: '雷达屏幕显示有大障碍物，打开摄像头后发现是锡箔纸。那你决定，是听雷达的绕路，还是直接开过去呀？',
      options: [
        { key: 'A', label: '听雷达的，绕路走' },
        { key: 'B', label: '直接开过去' },
      ],
      answer: 'B', subject: 'AI素养 - 传感器认知与局限性',
    },
    {
      id: 'Q24', title: '拯救失控的机械臂', type: 'choice',
      voice: '小智的程序出错了，我们要把错误的指令换掉，你觉得换哪个才对呀？',
      options: [
        { key: 'A', label: '杯子满了就停止' },
        { key: 'B', label: '把水杯扔掉' },
      ],
      answer: 'A', subject: 'AI素养 - 算法终止条件与Debug',
    },
    {
      id: 'Q25', title: '汗水与微笑', type: 'choice',
      voice: '小智只看心跳会觉得宇航员危险，但只看脸觉得他很开心，综合来看，宇航员到底怎么了呀？',
      options: [
        { key: 'A', label: '他生了重病，需要立刻抢救' },
        { key: 'B', label: '他只是刚运动完，需要一杯水和毛巾' },
      ],
      answer: 'B', subject: '生物学（运动生理反应）、AI多模态感知',
    },
    {
      id: 'Q26', title: '紧急避险的优先级', type: 'choice',
      voice: '陨石雨来了，危机时刻，小智会先选保护什么呢？',
      options: [
        { key: 'A', label: '保护宇航员' },
        { key: 'B', label: '保护月球车' },
      ],
      answer: 'A', subject: 'AI素养 - 伦理与安全（价值对齐策略）',
    },
    {
      id: 'Q27', title: '小智的自画像', type: 'choice',
      voice: '小智要画未来的月球城市，你觉得哪个关键词能帮它画出能保护大家的罩子呀？',
      options: [
        { key: 'A', label: '透明的玻璃罩' },
        { key: 'B', label: '会飞的公共汽车' },
      ],
      answer: 'A', subject: 'AI素养 - 生成式AI（理解提示词）',
    },
    {
      id: 'Q28', title: '月球交通总调度', type: 'choice',
      voice: '路口相遇了，谁的优先级最高呀？第一个应该让谁先走？',
      options: [
        { key: 'A', label: '运送急救包的急救车' },
        { key: 'B', label: '维护治安的警车' },
        { key: 'C', label: '运矿石的货车' },
      ],
      answer: 'A', subject: 'AI素养 - 社会影响与系统逻辑',
    },
    // Q29-Q46: 以下为语音交互题，目前以选择题形式展示
    {
      id: 'Q29', title: '芝麻开门，小智！', type: 'choice',
      voice: '宇航员抱着石头没法用手开门，你能帮宇航员想想，该用什么方式让小智开门？',
      options: [
        { key: 'A', label: '对小智说："小智，请开门！"' },
        { key: 'B', label: '一直等着，什么也不做' },
      ],
      answer: 'A', subject: 'AI素养 - 感知（多模态理解、语音指令）',
    },
    {
      id: 'Q30', title: '守护日记大作战', type: 'choice',
      voice: '陌生外星飞船想要小智的日记密码，小智应该怎么做？',
      options: [
        { key: 'A', label: '保护日记，拒绝告诉陌生飞船密码' },
        { key: 'B', label: '把密码告诉它，这样显得友好' },
      ],
      answer: 'A', subject: 'AI素养 - 伦理与安全（数据隐私保护）',
    },
    {
      id: 'Q31', title: '月球基地的早报', type: 'choice',
      voice: '小智每天早上要向宇航员汇报天气，它应该从哪里获取数据？',
      options: [
        { key: 'A', label: '从气象传感器采集实时数据' },
        { key: 'B', label: '随便猜一个告诉宇航员' },
      ],
      answer: 'A', subject: 'AI素养 - 数据采集与可靠性',
    },
    {
      id: 'Q32', title: '月球食物配给', type: 'choice',
      voice: '月球基地的食物有限，小智要帮大家分配午餐，应该怎么最公平？',
      options: [
        { key: 'A', label: '根据每个人的体重和工作量平均分配' },
        { key: 'B', label: '小智自己多吃一点' },
      ],
      answer: 'A', subject: 'AI素养 - 公平性与算法设计',
    },
    {
      id: 'Q33', title: '紧急医疗助手', type: 'choice',
      voice: '宇航员受伤了，小智能直接做手术吗？',
      options: [
        { key: 'A', label: '不能，应该立刻联系地球的医疗专家来指导' },
        { key: 'B', label: '能，小智什么都会' },
      ],
      answer: 'A', subject: 'AI素养 - 人机协作与边界',
    },
    {
      id: 'Q34', title: '月球植物实验', type: 'choice',
      voice: '小智观察植物生长了30天，记录了很多数据。这些数据有什么用？',
      options: [
        { key: 'A', label: '可以帮助科学家发现月球种植的规律' },
        { key: 'B', label: '没有用，只是好玩的记录' },
      ],
      answer: 'A', subject: '科学思维 - 数据分析与发现规律',
    },
    {
      id: 'Q35', title: '失联的小智', type: 'choice',
      voice: '小智突然停止响应了，宇航员应该怎么做？',
      options: [
        { key: 'A', label: '检查小智的电量和信号连接，尝试重启' },
        { key: 'B', label: '把小智扔到月球表面' },
      ],
      answer: 'A', subject: 'AI素养 - 故障诊断与处理',
    },
    {
      id: 'Q36', title: '月球地图绘制员', type: 'choice',
      voice: '小智要帮大家绘制月球地图，它应该怎么收集地图信息？',
      options: [
        { key: 'A', label: '用摄像头和激光雷达扫描地形' },
        { key: 'B', label: '凭记忆画一张大概的地图' },
      ],
      answer: 'A', subject: 'AI素养 - 感知与数据收集',
    },
    {
      id: 'Q37', title: '月球上的垃圾分类', type: 'choice',
      voice: '月球基地产生了垃圾，小智要帮忙分类，哪类垃圾最需要特别处理？',
      options: [
        { key: 'A', label: '危险化学废料，需要密封保存' },
        { key: 'B', label: '空水瓶，直接丢在外面就好' },
      ],
      answer: 'A', subject: '环境科学 - 月球环境保护',
    },
    {
      id: 'Q38', title: '星际语言翻译官', type: 'choice',
      voice: '小智收到了来自另一个星球的奇怪信号，它应该怎么处理？',
      options: [
        { key: 'A', label: '记录信号并汇报给科学家分析' },
        { key: 'B', label: '直接回复"你好"，建立联系' },
      ],
      answer: 'A', subject: 'AI素养 - 数据记录与科学决策',
    },
    {
      id: 'Q39', title: '月球能量危机', type: 'choice',
      voice: '基地的太阳能电池板被月尘覆盖，能源快用完了，最紧急的事是什么？',
      options: [
        { key: 'A', label: '马上派机器人清洁电池板，恢复发电' },
        { key: 'B', label: '继续用电，等等看' },
      ],
      answer: 'A', subject: '工程学 - 能源管理与应急处理',
    },
    {
      id: 'Q40', title: '小智的学习日记', type: 'choice',
      voice: '小智每次犯错后都会记录下来，这样做有什么好处？',
      options: [
        { key: 'A', label: '可以帮助小智下次避免同样的错误' },
        { key: 'B', label: '没什么用，记录只是浪费存储空间' },
      ],
      answer: 'A', subject: 'AI素养 - 机器学习（从错误中学习）',
    },
    {
      id: 'Q41', title: '月球新年晚会', type: 'choice',
      voice: '宇航员们想在月球上开新年晚会，小智可以帮什么忙？',
      options: [
        { key: 'A', label: '播放音乐、控制灯光、帮大家拍照留念' },
        { key: 'B', label: '小智是机器人，不应该参与这种活动' },
      ],
      answer: 'A', subject: 'AI素养 - 人机协作（AI辅助情感活动）',
    },
    {
      id: 'Q42', title: '神秘的月球声音', type: 'choice',
      voice: '小智的振动传感器检测到异常振动，可能是地震，宇航员应该怎么做？',
      options: [
        { key: 'A', label: '立刻进入安全舱，等待进一步检测' },
        { key: 'B', label: '继续工作，振动不严重就没关系' },
      ],
      answer: 'A', subject: '地质科学 - 月震应急处理',
    },
    {
      id: 'Q43', title: '月球温室大棚', type: 'choice',
      voice: '在月球上种植物，最需要小智帮忙解决的问题是什么？',
      options: [
        { key: 'A', label: '精确控制温度、光照和水分' },
        { key: 'B', label: '给植物唱歌让它们高兴' },
      ],
      answer: 'A', subject: '生物学 - 月球农业与环境控制',
    },
    {
      id: 'Q44', title: '月球快递无人机', type: 'choice',
      voice: '小智要驾驶无人机从A点飞到B点送货，最重要的是提前规划什么？',
      options: [
        { key: 'A', label: '规划安全路径，避开障碍物和危险区域' },
        { key: 'B', label: '飞得越快越好，不需要规划' },
      ],
      answer: 'A', subject: 'AI素养 - 路径规划与自动驾驶',
    },
    {
      id: 'Q45', title: '月球考古新发现', type: 'choice',
      voice: '小智发现了疑似古代陨石的岩石，下一步应该怎么做？',
      options: [
        { key: 'A', label: '拍照记录、采集样本，带回给科学家分析' },
        { key: 'B', label: '把它踢走，让路更好走' },
      ],
      answer: 'A', subject: '科学探索 - 月球地质研究方法',
    },
    {
      id: 'Q46', title: '月球大使的问候', type: 'choice',
      voice: '小智要代表月球基地向全世界的孩子们发出邀请，它应该说什么呢？',
      options: [
        { key: 'A', label: '欢迎大家一起来探索月球，我们是最好的伙伴！' },
        { key: 'B', label: '月球很危险，你们不要来！' },
      ],
      answer: 'A', subject: 'AI素养 - 人机协作与未来展望',
    },
  ],
}

const parsedDocxQuestionCache = new Map()

function normalizeDocxText(rawText) {
  return rawText
    .replace(/\u00A0/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function parseDocxQuestions(rawText) {
  const cleanedText = normalizeDocxText(rawText).replace(/\n\s+/g, '\n')
  const blocks = cleanedText
    .split(/\n(?=(?:\d+\.)?\s*题目名称\s*[:：])/)
    .filter(Boolean)

  const parsedQuestions = blocks.map((block) => {
    const title = (block.match(/题目名称\s*[:：]\s*(.+)/) || [, ''])[1].trim()
    const voice = ((block.match(/语音提示\s*[:：]\s*[“"]?([\s\S]*?)[”"]?(?=\n\s*选项描述\s*[:：]|\n\s*考点对齐\s*[:：]|\n\s*自动评分逻辑\s*[:：]|$)/) || [, ''])[1])
      .trim()
    const optionsText = ((block.match(/选项描述\s*[:：]\s*([\s\S]*?)(?=\n\s*考点对齐\s*[:：]|\n\s*自动评分逻辑\s*[:：]|$)/) || [, ''])[1])
      .trim()

    const options = [...optionsText.matchAll(/([A-C])[\.．、]\s*([\s\S]*?)(?=(?:[A-C][\.．、]\s*)|$)/g)].map((match) => ({
      key: match[1],
      label: match[2].replace(/\s+/g, ' ').trim(),
    }))

    const answer = ((block.match(/(?:选择(?:选项)?|选)\s*([A-C])\s*(?:则判定为正确|判定为正确|正确)/i) || [, ''])[1] || '').toUpperCase()
    const subject = ((block.match(/考点对齐\s*[:：]\s*([\s\S]*?)(?=\n\s*自动评分逻辑\s*[:：]|$)/) || [, ''])[1])
      .replace(/\s+/g, ' ')
      .trim()

    return {
      title,
      voice,
      options,
      answer,
      subject,
      type: 'choice',
    }
  })

  return parsedQuestions
    .filter((question) => question.title && question.options.length > 0 && question.answer)
    .map((question, index) => ({
      id: `题目${index + 1}`,
      ...question,
    }))
}

async function loadQuestionsFromDocx(taskId) {
  if (parsedDocxQuestionCache.has(taskId)) {
    return parsedDocxQuestionCache.get(taskId)
  }

  const docxSrc = getTaskDocxSrc(taskId)
  if (!docxSrc) {
    parsedDocxQuestionCache.set(taskId, [])
    return []
  }

  const response = await fetch(docxSrc)
  if (!response.ok) {
    throw new Error(`Failed to load question docx for ${taskId}: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const mammoth = (await import('mammoth')).default
  const result = await mammoth.extractRawText({ arrayBuffer })
  const parsedQuestions = parseDocxQuestions(result.value)
  parsedDocxQuestionCache.set(taskId, parsedQuestions)
  return parsedQuestions
}

function sampleFromPool(pool, count = 10) {
  if (pool.length <= count) return [...pool]

  const arr = [...pool]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}

function withQuestionAssets(taskId, question) {
  return {
    ...question,
    sceneSrc: getQuestionSceneSrc(taskId, question.id),
    options: question.options.map((option) => ({
      ...option,
      imageSrc: getQuestionOptionSrc(taskId, question.id, option.key),
    })),
  }
}

/**
 * 从某个任务的题库中随机抽取 count 道题
 * 使用用户ID做种子确保同一用户每次看到相同的题目（可按需调整）
 */
export function sampleQuestions(taskId, count = 10, seed = null) {
  const pool = taskQuestions[taskId] || []
  if (pool.length <= count) return pool.map((question) => withQuestionAssets(taskId, question))

  // 简单随机洗牌
  const arr = [...pool]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count).map((question) => withQuestionAssets(taskId, question))
}

export async function loadTaskQuestions(taskId, count = 10) {
  const staticPool = taskQuestions[taskId]
  if (staticPool?.length) {
    return sampleQuestions(taskId, count)
  }

  const dynamicPool = await loadQuestionsFromDocx(taskId)
  return sampleFromPool(dynamicPool, count).map((question) => withQuestionAssets(taskId, question))
}
