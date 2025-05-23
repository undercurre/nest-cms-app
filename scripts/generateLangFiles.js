const fs = require('fs');
const path = require('path');

// 定义文件路径
const langJsonPath = path.join(__dirname, '../src/lang/lang.json');
const outputDir = path.join(__dirname, '../src/lang/files/');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取 lang.json 文件
const langData = JSON.parse(fs.readFileSync(langJsonPath, 'utf-8'));

// 遍历 lang.json 中的每一项
langData.forEach(({ languageCode }) => {
  const filePath = path.join(outputDir, `${languageCode}.ts`);
  const fileContent = `// filepath: ${filePath}\n// zh-CN.ts (简体中文)
const zh_CN = {
  common: {
    equipmentList: '设备列表',
    smartKitchenAssistant: '智能厨房助手',
    operationInstructions: '操作指引',
    productDescription: '产品说明',
    completeRecipeCollection: '食谱大全',
    smartAnalysis: '智能分析',
    all: '全部',
    noData: '暂无数据',
  },
  product: {
    successfullyAdded: '添加成功',
    addToMyDevices: '添加到我的设备',
    downloadInstructionManual: '下载说明书',
  },
  guide: {},
  diet: {
    introduction: '简介',
    ingredients: '食材',
    steps: '步骤',
    searchForRecipes: '搜索食谱',
  },
  device: {
    deviceName: '设备名称',
    deviceModel: '设备型号',
  },
  cookbook: {
    CantoneseCuisine: '粤菜',
    Snacks: '小食',
    SichuanCuisine: '川菜',
    all: '全部',
    AppropriateAmount: '适量',
    strip: '条',
    piece: '片',
    root: '根',
    g: '克',
    MainDishes: "主食",
    Soups: "汤",
    Salads: "沙拉",
    BakedGoods: "烘焙",
    "Appetizers/Snacks": "开胃/小吃",
    VegetarianDishes: "素食",
    Seafood: "海鲜",
    MeatDishes: "肉类",
    Breakfast: "早餐",
    "Noodles/Pasta": "面条/意大利面",
    RiceDishes: "米饭",
    HotPot: "火锅",
    Desserts: "甜点",
    Beverages: "饮料",
    "Sauces/Dips": "酱汁/蘸料",
    "FastFood/QuickMeals": "快餐/快速餐",
    Sweet: "甜",
    "Savory/Salty": "咸",
    Sour: "酸",
    Spicy: "辣",
    Bitter: "苦",
    Umami: "鲜",
    "Numbing(Sichuan)": "麻",
    "Sweet&Sour": "酸甜",
    FragrantSpicy: "香辣",
    Garlicky: "蒜香",
    Creamy: "奶油",
    Smoky: "烟熏",
    "Light/Mild": "清淡",
    "Rich/Heavy": "浓郁",
    Fruity: "果香",
    Herbal: "香草/草本",
    ComplexSeasoning: "复合调味",
  },
}
export default zh_CN
`;

  // 创建 .ts 文件
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Created: ${filePath}`);
});

console.log('All language files have been generated.');
