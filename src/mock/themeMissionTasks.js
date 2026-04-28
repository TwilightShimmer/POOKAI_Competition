import { moonTasks } from '@/mock/moonMissions_tasks.js'

export const marsTasks = [
  {
    id: 'Mars01',
    name: '实验准备',
    emoji: '🌀',
    maxScore: 20,
    summary: '围绕火星风能、大气环境与 AI 感知完成实验准备学习。',
    description: '通过实验准备任务理解火星稀薄大气、风能利用、传感器感知与搜索决策等核心概念，再进入题目判断。',
    scoring: [
      { condition: '完成视频学习并完成随机题目作答', points: 20 },
    ],
    skills: ['火星环境认知', 'AI感知', '搜索决策'],
    difficulty: 2,
  },
  {
    id: 'Mars02',
    name: '燃料补给',
    emoji: '⛽',
    maxScore: 25,
    summary: '围绕火星基地轮换、补给协作与 AI 判断完成任务学习。',
    description: '结合火星基地补给与轮换素材，学习生存环境、团队协作、人机分工和 AI 判断逻辑，并完成随堂题目。',
    scoring: [
      { condition: '完成视频学习并完成随机题目作答', points: 25 },
    ],
    skills: ['火星基地生存', '任务协作', 'AI判断'],
    difficulty: 3,
  },
]

const missionTasksByTheme = {
  moon: moonTasks,
  mars: marsTasks,
}

const allMissionTasks = Object.values(missionTasksByTheme).flat()

export function getThemeMissionTasks(themeKey = 'moon') {
  return missionTasksByTheme[themeKey] || moonTasks
}

export function getMissionTaskById(taskId) {
  return allMissionTasks.find((task) => task.id === taskId) || null
}
