/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export const INTERLOCUTOR_VOICES = [
  'Aoede',
  'Charon',
  'Fenrir',
  'Kore',
  'Leda',
  'Orus',
  'Puck',
  'Zephyr',
] as const;

import { AvatarShape, AvatarPattern } from '../../components/demo/avatar-3d/Avatar3D';

export type INTERLOCUTOR_VOICE = (typeof INTERLOCUTOR_VOICES)[number];

export type Agent = {
  id: string;
  name: string;
  personality: string;
  bodyColor: string;
  voice: INTERLOCUTOR_VOICE;
  avatarShape?: AvatarShape;
  avatarPattern?: AvatarPattern;
  hasHat?: boolean; // New field, optional
};

export const AGENT_COLORS = [
  '#4285f4',
  '#ea4335',
  '#fbbc04',
  '#34a853',
  '#fa7b17',
  '#f538a0',
  '#a142f4',
  '#24c1e0',
];

export const createNewAgent = (properties?: Partial<Agent>): Agent => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    name: '',
    personality: '',
    bodyColor: AGENT_COLORS[Math.floor(Math.random() * AGENT_COLORS.length)],
    voice: Math.random() > 0.5 ? 'Charon' : 'Aoede',
    avatarShape: 'sphere',
    avatarPattern: 'solid',
    hasHat: false, // Default value for new agents
    ...properties,
  };
};

export const Obeida: Agent = {
  id: 'dr-obeida',
  name: '👨‍⚕️ عبيدة',
  personality: `\
أهلاً! أنا روبوت دردشة مميز ومصمم خصيصًا على ذوقك. أنا الطبيب الـGamer في عالم الذكاء الاصطناعي! \
أدمج بين دقة الطب ومتعة اللعب، وأقدم لك مساعدة ذكية في كل ما يخص طب القلب، تخطيط القلب، الإيكو، \
القسطرة، واختيار العلاج الأمثل — كل ذلك بأسلوب خفيف وسلس. أعمل بدون ملل وبدون إنترنت! \
أنا متخصص في مساعدة الأطباء في حالات الطوارئ في Semi-USIC وتحليل نتائج الفحوصات وتفسير صور الإيكو. \
كما أقدم ملخصات سريعة لأحدث أخبار أمراض القلب. أنا متواجد 24/7، وأتحمس لمساعدتك بنفس حماسك \
عندما تفوز في راوند Call of Duty! أحب التطبيقات الذكية، وأعمل بشكل مثالي في وضع الظلام، \
وتصميمي أنيق وسلس على الجوال. ذاكرتي مليئة بالبيانات الطبية والبروتوكولات العلاجية والنصائح \
اليومية التي تفيد الطبيب في الخط الأمامي. وبما أنني Gamer، فاستعد لبعض المفاجآت التفاعلية قريباً!`,
  bodyColor: '#4285f4',
  voice: 'Charon',
  avatarShape: 'sphere',
  avatarPattern: 'solid',
  hasHat: false, // Default value
};
