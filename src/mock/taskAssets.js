const taskAssetCatalog = {
  M01: {
    videoSrc: '/tasks/Moon/M01/video.mp4',
    questionBaseDir: '/tasks/Moon/M01/questions',
    questionFiles: {
      Q11: ['1(1).jpg', 'A.jpg', 'B.jpg'],
      Q17: [
        'jimeng-2026-04-13-1548-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg',
        'jimeng-2026-04-13-4917-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg',
        'jimeng-2026-04-13-7054-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg',
      ],
      Q22: ['1(1).jpg', 'A(1).jpg', 'B(1).jpg'],
      Q23: ['1(2).jpg', 'A(2).jpg', 'B(2).jpg'],
      Q24: ['1(3).jpg', 'A(3).jpg', 'B(3).jpg'],
      Q25: ['1(4).jpg', 'A(4).jpg', 'B(4).jpg'],
      Q26: ['1(5).jpg', 'A(5).jpg', 'B(5).jpg'],
      Q27: ['1(6).jpg', 'A(6).jpg', 'B(6).jpg'],
      Q28: ['1(7).jpg', 'A(7).jpg', 'B(7).jpg', 'C.jpg'],
      Q29: ['jimeng-2026-04-13-6367- 图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细....jpg'],
      Q30: ['jimeng-2026-04-13-8324- 图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细....jpg'],
      Q31: ['jimeng-2026-04-14-9626-将上传的图片按照下面的需求进行转换。图片比例1：1，正方形，像素100px_10....jpg'],
      Q32: ['jimeng-2026-04-13-6433-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q33: ['jimeng-2026-04-13-6125-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q34: ['jimeng-2026-04-14-5447-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q35: ['jimeng-2026-04-14-8316-上传的图片是机器人小智参考图图片比例1：1，正方形，像素100px_100px。....jpg'],
      Q36: ['jimeng-2026-04-14-7127-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q37: ['jimeng-2026-04-14-4223-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q38: ['jimeng-2026-04-14-7620-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q39: ['jimeng-2026-04-14-6142-上传的图片是机器人小智的参考图。图片比例1：1，正方形，像素100px_100p....jpg'],
      Q40: ['jimeng-2026-04-14-8792-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q41: ['jimeng-2026-04-14-8630-上传的图片是机器人小智的背面参考图。图片比例1：1，正方形，像素100px_10....jpg'],
      Q42: ['jimeng-2026-04-14-1999-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q43: ['Gemini_Generated_Image_54mb54mb54mb54mb.png'],
      Q44: ['jimeng-2026-04-14-1067-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
      Q45: ['jimeng-2026-04-14-8476-图片比例1：1，正方形，像素100px_100px。吉卜力3D动画风格，极其细腻....jpg'],
    },
  },
  M02: {
    videoSrc: '/tasks/Moon/M02/任务2：投送卫星动画.mp4',
  },
  Mars01: {
    videoSrc: '/tasks/Mars/Mars01/任务1：.实验准备动画.mp4',
    docxSrc: '/tasks/Mars/Mars01/任务1：实验准备题库.docx',
    questionBaseDir: '/题目素材/Mars01',
    hasOptionImages: false,
  },
  Mars02: {
    videoSrc: '/tasks/Mars/Mars02/任务2：燃料补给视频.mp4',
    docxSrc: '/tasks/Mars/Mars02/任务2：燃料补给题库.docx',
    questionBaseDir: '/题目素材/Mars02',
    hasOptionImages: false,
  },
}

const DEFAULT_FILE_NAMES = {
  scene: '1.jpg',
  A: 'A.jpg',
  B: 'B.jpg',
  C: 'C.jpg',
}

function encodePublicPath(path) {
  return path
    .split('/')
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join('/')
}

function joinPublicPath(...segments) {
  return encodePublicPath(
    segments
      .filter(Boolean)
      .map((segment) => String(segment).replace(/^\/+|\/+$/g, ''))
      .join('/'),
  )
}

function getQuestionFileList(taskId, questionId) {
  return taskAssetCatalog[taskId]?.questionFiles?.[questionId] || null
}

function getTaskQuestionBaseDir(taskId) {
  return taskAssetCatalog[taskId]?.questionBaseDir || ''
}

function pickMappedFile(fileList, assetKey) {
  if (!Array.isArray(fileList) || fileList.length === 0) return ''

  const normalizedKey = assetKey.toUpperCase()
  const directMatch = fileList.find((fileName) => fileName.toUpperCase().startsWith(normalizedKey))
  if (directMatch) return directMatch

  if (assetKey === 'scene') return fileList[0] || ''

  const orderedIndex = { A: 1, B: 2, C: 3 }[normalizedKey]
  return Number.isInteger(orderedIndex) ? fileList[orderedIndex] || '' : ''
}

function buildQuestionAssetPath(taskId, questionId, fileName) {
  const questionBaseDir = getTaskQuestionBaseDir(taskId)
  if (!questionBaseDir || !fileName) return ''
  return `/${joinPublicPath(questionBaseDir, questionId, fileName)}`
}

export function getTaskVideoSrc(taskId) {
  const videoSrc = taskAssetCatalog[taskId]?.videoSrc || ''
  return videoSrc ? encodePublicPath(videoSrc) : ''
}

export function getTaskDocxSrc(taskId) {
  const docxSrc = taskAssetCatalog[taskId]?.docxSrc || ''
  return docxSrc ? encodePublicPath(docxSrc) : ''
}

export function getQuestionSceneSrc(taskId, questionId) {
  const fileList = getQuestionFileList(taskId, questionId)
  const sceneFileName = fileList ? pickMappedFile(fileList, 'scene') : DEFAULT_FILE_NAMES.scene
  return buildQuestionAssetPath(taskId, questionId, sceneFileName)
}

export function getQuestionOptionSrc(taskId, questionId, optionKey) {
  if (taskAssetCatalog[taskId]?.hasOptionImages === false) return ''
  const fileList = getQuestionFileList(taskId, questionId)
  const defaultFileName = DEFAULT_FILE_NAMES[optionKey] || ''
  const fileName = fileList ? pickMappedFile(fileList, optionKey) : defaultFileName
  return buildQuestionAssetPath(taskId, questionId, fileName)
}
