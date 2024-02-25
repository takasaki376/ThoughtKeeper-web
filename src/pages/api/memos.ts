import { NextApiRequest, NextApiResponse } from "next";

import { Memo } from "@/types/memo";

const pageSize = 10;

export const memos = [
  {
    id: "1",
    title: "仕事",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "今日のタスク",
  },
  {
    id: "2",
    title: "仕事",
    createdAt: "2023/01/02",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "今日やらないこと",
  },
  {
    id: "3",
    title: "仕事",
    createdAt: "2023/01/03",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "理想の仕事内容は？",
  },
  {
    id: "4",
    title: "仕事",
    createdAt: "2023/01/04",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事を選ぶ時の基準",
  },
  {
    id: "5",
    title: "仕事",
    createdAt: "2023/01/05",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "今の仕事を選んだ理由",
  },
  {
    id: "6",
    title: "仕事",
    createdAt: "2023/01/06",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事が楽しいと思うのはどんな時？",
  },
  {
    id: "7",
    title: "仕事",
    createdAt: "2023/01/07",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事がイヤだと思うのはどんな時？",
  },
  {
    id: "8",
    title: "仕事",
    createdAt: "2023/01/08",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "何が改善されればイヤじゃなくなるか？",
  },
  {
    id: "9",
    title: "仕事",
    createdAt: "2023/01/09",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事のどこにやりがいを感じる？",
  },
  {
    id: "10",
    title: "仕事",
    createdAt: "2023/01/10",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "理想の働き方は？",
  },
  {
    id: "11",
    title: "仕事",
    createdAt: "2023/01/11",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "理想の働き方を叶えるには？",
  },
  {
    id: "12",
    title: "仕事",
    createdAt: "2023/01/12",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "どんな時に仕事が進まないのか？",
  },
  {
    id: "13",
    title: "仕事",
    createdAt: "2023/01/13",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "時間がかかってしまうポイントはどこか？",
  },
  {
    id: "14",
    title: "仕事",
    createdAt: "2023/01/14",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "どうやったら仕事が進むようになるか？",
  },
  {
    id: "15",
    title: "仕事",
    createdAt: "2023/01/15",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "効率的な仕事の進め方とは？",
  },
  {
    id: "16",
    title: "仕事",
    createdAt: "2023/01/16",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事の手ごたえを感じるのはどんな時？",
  },
  {
    id: "17",
    title: "仕事",
    createdAt: "2023/01/17",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事の手ごたえを感じるとどうなる？",
  },
  {
    id: "18",
    title: "仕事",
    createdAt: "2023/01/18",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事が遅い人の特徴は？",
  },
  {
    id: "19",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事が早い人の特徴は？",
  },
  {
    id: "20",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事を早く終わらせるには？",
  },
  {
    id: "21",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事を続けるモチベーションになっているものは？",
  },
  {
    id: "22",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事を続けるメリット",
  },
  {
    id: "23",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "仕事を続けることでのデメリット",
  },
  {
    id: "24",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "どんな時に仕事を辞めたいと思う？",
  },
  {
    id: "25",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "論理的に話せるようになるには？",
  },
  {
    id: "26",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "なぜ論理的に話せなくなるのか？",
  },
  {
    id: "27",
    title: "仕事",
    createdAt: "2023/02/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus esse error atque necessitatibus, sed quasi officia iure rerum, praesentium accusantium. Exercitationem atque consectetur eum!",
    theme: "どんな時論理的に話すことを求められるか？",
  },
  {
    id: "28",
    title: "仕事",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "5年後どうなっていたいか？",
  },
  {
    id: "29",
    title: "気持ち",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "10年後どうなっていたいか？",
  },
  {
    id: "30",
    title: "気持ち",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "今日良かったこと",
  },
  {
    id: "31",
    title: "気持ち",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "日々本音に従って生きるには？",
  },
  {
    id: "32",
    title: "生活",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "覚悟するってどんな感覚？",
  },
  {
    id: "33",
    title: "生活",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "習慣になっていることは何か？",
  },
  {
    id: "1",
    title: "恋愛・パートナーシップ",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "頭がやわらかい人の特徴は？",
  },
  {
    id: "34",
    title: "恋愛・パートナーシップ",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "恋愛をしたくなるのはどんな時？",
  },
  {
    id: "35",
    title: "恋愛・パートナーシップ",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "恋愛をするとどうなる？",
  },
  {
    id: "36",
    title: "恋愛・パートナーシップ",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "なぜ恋愛したくなるのか？",
  },
  {
    id: "37",
    title: "恋愛・パートナーシップ",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "恋愛を楽しむには？",
  },
  {
    id: "38",
    title: "恋愛・パートナーシップ",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "好きな男性・女性のタイプは？",
  },
  {
    id: "40",
    title: "恋愛・パートナーシップ",
    createdAt: "2023/01/01",
    memo: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quas nostrum dolore animi quibusdam natus!",
    theme: "なぜそういう男性・女性が好きなのか？",
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Memo[]>
) {
  const { page = 1 } = req.query; // クエリパラメータからページ番号を取得

  const startIndex = (Number(page) - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const pageMemos = memos.slice(startIndex, endIndex);

  res.status(200).json(pageMemos);
}
