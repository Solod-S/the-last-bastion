import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../../services/audio/audioManager';
import {
  BookOpen,
  X,
  Skull,
  Shield,
  MapPin,
  Users,
  Castle,
  Target,
  Info
} from 'lucide-react';

type CodexCategory = 'enemies' | 'towers' | 'heroes' | 'regions' | 'bastion';

interface CodexEntry {
  id: string;
  category: CodexCategory;
  name: string;
  subtitle: string;
  image: string;
  isPixel?: boolean;
  role: string;
  stats?: { label: string; value: string }[];
  description: string;
  tactics?: string;
}

const CODEX_ENTRIES: CodexEntry[] = [
  // --- ENEMIES ---
  {
    id: 'goblin_runner',
    category: 'enemies',
    name: 'Гоблин-лазутчик',
    subtitle: 'Goblin Scout',
    image: '/assets/enemies/art_goblin_runner.png',
    role: 'Быстрый разведчик авангарда',
    stats: [
      { label: 'Здоровье', value: '75' },
      { label: 'Скорость', value: '1.4x (Очень высокая)' },
      { label: 'Броня', value: '0 (Легкая)' },
      { label: 'Награда', value: '10 золота' }
    ],
    description:
      'Первые твари, хлынувшие через Разлом. Гоблины-разведчики не отличаются выносливостью или крепкими доспехами, но их молниеносная скорость позволяет проскальзывать мимо медленных орудий.',
    tactics: 'Используйте лучников и замедляющие ядовитые пары алхимии, чтобы остановить их натиск до ворот.'
  },
  {
    id: 'goblin_spearman',
    category: 'enemies',
    name: 'Гоблин-копейщик',
    subtitle: 'Goblin Spearman',
    image: '/assets/enemies/enemy_goblin_spearman.png',
    role: 'Регулярная пехота Орды',
    stats: [
      { label: 'Здоровье', value: '140' },
      { label: 'Скорость', value: '1.0x' },
      { label: 'Броня', value: '15% (Физ.)' },
      { label: 'Награда', value: '14 золота' }
    ],
    description:
      'Вооруженные ржавыми пиками и щитами из сыромятной кожи, эти гоблины держат строй под криками полевых командиров. Опасны в плотных группах.',
    tactics: 'Отлично уничтожаются осколочными снарядами пушек и заклинаниями школы огня.'
  },
  {
    id: 'boar_raider',
    category: 'enemies',
    name: 'Наездник на кабане',
    subtitle: 'Boar Raider',
    image: '/assets/enemies/enemy_boar_raider.png',
    role: 'Тяжелая ударная кавалерия',
    stats: [
      { label: 'Здоровье', value: '320' },
      { label: 'Скорость', value: '1.25x' },
      { label: 'Броня', value: '25% (Физ.)' },
      { label: 'Награда', value: '28 золота' }
    ],
    description:
      'Свирепые клыкастые вепри, выращенные в токсичных ямах разлома, несут наездников напролом через любые заграждения пехоты.',
    tactics: 'Задерживайте их выставленными гарнизонными солдатами, пока маги пробивают их шкуру чародейскими стрелами.'
  },
  {
    id: 'mine_sapper',
    category: 'enemies',
    name: 'Гоблин-подрывник',
    subtitle: 'Mine Sapper',
    image: '/assets/enemies/enemy_mine_sapper.png',
    role: 'Осадный подрывник-камикадзе',
    stats: [
      { label: 'Здоровье', value: '110' },
      { label: 'Скорость', value: '1.15x' },
      { label: 'Особенность', value: 'Детонация при гибели' },
      { label: 'Награда', value: '22 золота' }
    ],
    description:
      'Одержимые взрывчаткой саперы несут на спине бочки с нестабильной пороховой смесью. Достигнув цели, они производят сокрушительный взрыв.',
    tactics: 'Ликвидируйте их на дальней дистанции с помощью снайперов до их сближения с вашими гарнизонами.'
  },
  {
    id: 'king_grukk',
    category: 'enemies',
    name: 'Король Грукк (Босс I Акта)',
    subtitle: 'Troll King Grukk',
    image: '/assets/enemies/enemy_king_grukk.png',
    role: 'Верховный вождь троллей',
    stats: [
      { label: 'Здоровье', value: '2,800' },
      { label: 'Регенерация', value: '+35 HP/сек' },
      { label: 'Ударная волна', value: 'Оглушает гарнизоны' },
      { label: 'Награда', value: '300 золота' }
    ],
    description:
      'Исполинский вождь горных троллей, подчинивший себе племена Зеленых Земель. В руках держит чудовищную шипастую дубину, способную крушить каменные бастионы одним взмахом.',
    tactics: 'Концентрируйте весь огонь башен, применяйте способность сэра Олдрена Bastion Strike и алхимический яд для сбивания регенерации!'
  },

  // --- TOWERS ---
  {
    id: 'tower_archer',
    category: 'towers',
    name: 'Башня лучников',
    subtitle: 'Archer Post → Fort → Sniper Spire',
    image: '/assets/towers/tower_archer_l3.png',
    role: 'Высокая скорострельность и дальность',
    stats: [
      { label: 'Дальность', value: '220 - 320 px' },
      { label: 'Скорость атаки', value: '0.6 - 0.4 сек' },
      { label: 'Тип урона', value: 'Физический (Колющий)' },
      { label: 'Специализация', value: 'Длинные луки / Тяжелые арбалеты' }
    ],
    description:
      'Меткие стрелки Бастиона занимают господствующие высоты. Эффективны против легких и средних врагов, сбивают летающих тварей и отстреливают саперов.',
    tactics: 'Размещайте на изгибах дорог для максимального сектора обстрела.'
  },
  {
    id: 'tower_mage',
    category: 'towers',
    name: 'Эфирный шпиль магов',
    subtitle: 'Arcane Spire → Archmage Citadel',
    image: '/assets/towers/tower_mage_l3.png',
    role: 'Бронебойный магический урон',
    stats: [
      { label: 'Дальность', value: '200 - 270 px' },
      { label: 'Скорость атаки', value: '1.2 - 0.9 сек' },
      { label: 'Тип урона', value: 'Чародейский (Игнор брони)' },
      { label: 'Специализация', value: 'Цепная молния / Разрывной луч' }
    ],
    description:
      'Боевые маги ордена Зари фокусируют энергию кристаллов в чистые разряды тайной магии. Броня противников бессильна против такой мощи.',
    tactics: 'Незаменимы против тяжелых рыцарей, големов и бронированных наездников.'
  },
  {
    id: 'tower_cannon',
    category: 'towers',
    name: 'Осадная мортира',
    subtitle: 'Bombard Battery → Dread Mortar',
    image: '/assets/towers/tower_cannon_l3.png',
    role: 'Массовый урон по площади (AoE)',
    stats: [
      { label: 'Радиус взрыва', value: '90 - 130 px' },
      { label: 'Скорость атаки', value: '2.4 - 1.8 сек' },
      { label: 'Тип урона', value: 'Осколочный фугасный' },
      { label: 'Специализация', value: 'Кассетные бомбы / Огненный напалм' }
    ],
    description:
      'Тяжелая артиллерия гильдии кузнецов Бастиона. Мечет чугунные бомбы, начиненные серой и дробью, превращая скопления врагов в прах.',
    tactics: 'Ставьте в местах, где гарнизон собирает плотную толпу монстров.'
  },
  {
    id: 'tower_barracks',
    category: 'towers',
    name: 'Королевские казармы',
    subtitle: 'Guard Garrison → Knights Citadel',
    image: '/assets/towers/tower_barracks_l3.png',
    role: 'Сдерживание врагов на тропе',
    stats: [
      { label: 'Бойцов в отряде', value: '3 паладина' },
      { label: 'Время подкрепления', value: '10 сек' },
      { label: 'Способность', value: 'Блок щитом, провокация' },
      { label: 'Специализация', value: 'Паладины Света / Берсерки Секиры' }
    ],
    description:
      'Отважные рыцари и мечники выходят на дорогу, перехватывая врагов и не давая им двигаться дальше к крепостным воротам.',
    tactics: 'Перемещайте точку сбора в зону перекрестного огня мортир и лучников.'
  },
  {
    id: 'tower_alchemy',
    category: 'towers',
    name: 'Алхимический тигель',
    subtitle: 'Poison Vat → Caustic Refinery',
    image: '/assets/towers/tower_alchemy_l3.png',
    role: 'Кислотные лужи, ядовитые облака и замедление',
    stats: [
      { label: 'Радиус облака', value: '110 px' },
      { label: 'Замедление', value: '-40% скорости' },
      { label: 'Эффект', value: 'Разъедание брони' },
      { label: 'Специализация', value: 'Трупный мор / Неугасимый фосфор' }
    ],
    description:
      'Изобретение алхимиков Бастиона, распыляющее едкие токсины. Ослабляет защитные покровы монстров и глушит регенерацию элитных тварей.',
    tactics: 'Идеально против боссов и высокоскоростных отрядов.'
  },

  // --- HEROES & ALLIES ---
  {
    id: 'hero_aldren',
    category: 'heroes',
    name: 'Сэр Олдрен, Клинок Бастиона',
    subtitle: 'Lord Commander of the Watch',
    image: '/assets/heroes/hero_aldren.png',
    role: 'Управляемый легендарный герой',
    stats: [
      { label: 'Здоровье', value: '850 HP' },
      { label: 'Атака', value: '65 урона (Меч правосудия)' },
      { label: 'Способность', value: 'Bastion Strike (AoE сокрушение)' },
      { label: 'Аура', value: '+15% брони солдатам рядом' }
    ],
    description:
      'Последний рыцарь Древней Стражи. Вооружен зачарованным мечом Солнечного Горна. Олдрен лично командует обороной крепостных подступов, вдохновляя бойцов.',
    tactics: 'Перемещайте Олдрена в критические точки прорыва и активируйте Bastion Strike в гуще врагов!'
  },
  {
    id: 'npc_elira',
    category: 'heroes',
    name: 'Командир Элира',
    subtitle: 'Commander Elira • Начальник гарнизона',
    image: '/assets/portraits/portrait_elira.png',
    role: 'Тактический советник и полевой маршал',
    stats: [
      { label: 'Фракция', value: 'Королевская Стража' },
      { label: 'Специальность', value: 'Осадная фортификация' }
    ],
    description:
      'Хладнокровная и непоколебимая воительница, координирующая возведение рубежей обороны и доставку ресурсов на передовые заставы.',
    tactics: 'Внимательно читайте ее тактические сводки перед началом каждой битвы.'
  },
  {
    id: 'npc_rowan',
    category: 'heroes',
    name: 'Архивариус Роуэн',
    subtitle: 'Archivist Rowan • Хранитель свитков',
    image: '/assets/portraits/portrait_rowan.png',
    role: 'Исследователь древней магии Разлома',
    stats: [
      { label: 'Фракция', value: 'Орден Звездных Врат' },
      { label: 'Специальность', value: 'Кристаллы Эфира' }
    ],
    description:
      'Изучает первопричину пробуждения Разлома. Помогает расшифровывать древние руны и открывать тайные технологии Древа Улучшений.',
    tactics: 'Тратьте кристаллы Разлома в Древе Технологий для постоянных бонусов.'
  },
  {
    id: 'npc_torren',
    category: 'heroes',
    name: 'Мастер-кузнец Торрен',
    subtitle: 'Master Smith Torren',
    image: '/assets/portraits/portrait_torren.png',
    role: 'Главный оружейник Цитадели',
    stats: [
      { label: 'Фракция', value: 'Гильдия Молотобойцев' },
      { label: 'Специальность', value: 'Тяжелая баллистика' }
    ],
    description:
      'Создатель осадных мортир и закаленных доспехов паладинов. Способен выковать несокрушимый щит из самого прочного рудного сплава.',
    tactics: 'Улучшения кузницы снижают стоимость башен и усиливают их пробивную силу.'
  },

  // --- REGIONS ---
  {
    id: 'region_greenlands',
    category: 'regions',
    name: 'Зеленые Земли (Greenlands)',
    subtitle: 'Акт I • Лесной тракт и перевал',
    image: '/assets/maps/map_greenlands_forest_road.png',
    role: 'Плодородные равнины королевства',
    stats: [
      { label: 'Миссий', value: '6 рубежей обороны' },
      { label: 'Угроза', value: 'Гоблины, разбойники, вождь Грукк' },
      { label: 'Окружение', value: 'Лесные тропы, реки, мосты' }
    ],
    description:
      'Некогда мирные предгорья Бастиона первыми приняли на себя удар разорванного пространства. Полчища орков и троллей пытаются прорваться по лесным трактам.',
    tactics: 'Используйте естественные изгибы рек и узкие перешейки для постройки смертоносных батарей.'
  },
  {
    id: 'region_swamp',
    category: 'regions',
    name: 'Древние Топи (Sunken Causeway)',
    subtitle: 'Акт II • Затопленные гати',
    image: '/assets/maps/map_swamp_causeway.png',
    role: 'Гнилостные хляби и туманные трясины',
    stats: [
      { label: 'Угроза', value: 'Чумные твари, споровики' },
      { label: 'Босс региона', value: 'Королева Чумного Роя' }
    ],
    description:
      'Коварные болота, скрывающие древние святилища. Враги здесь двигаются непредсказуемо, а ядовитые испарения требуют осторожности.',
    tactics: 'Шпили магов рассеивают туман и эффективно выжигают органических монстров.'
  },
  {
    id: 'region_volcano',
    category: 'regions',
    name: 'Пылающий Хребет (Molten Ridge)',
    subtitle: 'Акт III • Жерло вулкана',
    image: '/assets/maps/map_volcano_molten_ridge.png',
    role: 'Раскаленная лава и базальтовые скалы',
    stats: [
      { label: 'Угроза', value: 'Огненные саламандры, големы' },
      { label: 'Босс региона', value: 'Пепельный Дракон' }
    ],
    description:
      'Путь сквозь огненные недра гор, где реки лавы перекрывают дорогу. Башни на базальтовых возвышениях получают дополнительный радиус обстрела.',
    tactics: 'Используйте алхимический холод и тяжелую артиллерию.'
  },

  // --- BASTION FORTRESS ---
  {
    id: 'the_bastion',
    category: 'bastion',
    name: 'Оплот: Последний Бастион',
    subtitle: 'The Last Bastion • Сердце Королевства',
    image: '/assets/ui/castle_main.png',
    role: 'Главная цитадель человечества',
    stats: [
      { label: 'Статус', value: 'Осажден силами Разлома' },
      { label: 'Гарнизон', value: 'Элитные защитники и маги' },
      { label: 'Защитные врата', value: 'Солнечная сталь и рунный гранит' }
    ],
    description:
      'Величественная крепость, стоящая на перекрестке измерений. Если падет Бастион — весь мир погрузится в вечную тьму Разлома. Каждый отбитый напор врагов укрепляет надежду на спасение.',
    tactics: 'Не допускайте ни одного врага к крепостным вратам. Защищайте жизни бастиона ценой любых усилий!'
  }
];

export const CodexModal: React.FC = () => {
  const isCodexOpen = useGameStore((state) => state.isCodexOpen);
  const setCodexOpen = useGameStore((state) => state.setCodexOpen);

  const [activeCategory, setActiveCategory] = useState<CodexCategory>('enemies');
  const [selectedEntryId, setSelectedEntryId] = useState<string>('goblin_runner');

  if (!isCodexOpen) return null;

  const filteredEntries = CODEX_ENTRIES.filter((e) => e.category === activeCategory);
  const currentEntry =
    filteredEntries.find((e) => e.id === selectedEntryId) ||
    filteredEntries[0] ||
    CODEX_ENTRIES[0];

  const handleCategoryChange = (cat: CodexCategory) => {
    audioManager.playUi();
    setActiveCategory(cat);
    const firstInCat = CODEX_ENTRIES.find((e) => e.category === cat);
    if (firstInCat) {
      setSelectedEntryId(firstInCat.id);
    }
  };

  const handleSelectEntry = (id: string) => {
    audioManager.playUi();
    setSelectedEntryId(id);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 95,
        backdropFilter: 'blur(10px)',
        padding: 20
      }}
    >
      <div
        className="fantasy-panel"
        style={{
          width: 1140,
          height: 640,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #38bdf8',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95), 0 0 40px rgba(56, 189, 248, 0.25)',
          overflow: 'hidden',
          backgroundColor: '#0a0f1d'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            borderBottom: '2px solid #1e293b',
            backgroundColor: 'rgba(15, 23, 42, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #7dd3fc',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)'
              }}
            >
              <BookOpen size={20} color="#ffffff" />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-fantasy)',
                  fontSize: 22,
                  color: '#f0f9ff',
                  letterSpacing: 1.2
                }}
              >
                Кодекс Бастиона • The Codex
              </h2>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Летописи, бестиарий, оборонительные башни и хроники королевства
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              audioManager.playUi();
              setCodexOpen(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 6,
              borderRadius: 6
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '10px 24px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderBottom: '1px solid #1e293b'
          }}
        >
          <button
            className={`fantasy-btn ${activeCategory === 'enemies' ? 'fantasy-btn-primary' : ''}`}
            onClick={() => handleCategoryChange('enemies')}
            style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Skull size={16} />
            <span>Бестиарий Врагов</span>
          </button>

          <button
            className={`fantasy-btn ${activeCategory === 'towers' ? 'fantasy-btn-primary' : ''}`}
            onClick={() => handleCategoryChange('towers')}
            style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Shield size={16} />
            <span>Оборонительные Башни</span>
          </button>

          <button
            className={`fantasy-btn ${activeCategory === 'heroes' ? 'fantasy-btn-primary' : ''}`}
            onClick={() => handleCategoryChange('heroes')}
            style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Users size={16} />
            <span>Герои & Лидеры</span>
          </button>

          <button
            className={`fantasy-btn ${activeCategory === 'regions' ? 'fantasy-btn-primary' : ''}`}
            onClick={() => handleCategoryChange('regions')}
            style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <MapPin size={16} />
            <span>Регионы Королевства</span>
          </button>

          <button
            className={`fantasy-btn ${activeCategory === 'bastion' ? 'fantasy-btn-primary' : ''}`}
            onClick={() => handleCategoryChange('bastion')}
            style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Castle size={16} />
            <span>Цитадель Бастион</span>
          </button>
        </div>

        {/* Content Body: Left List + Right Details Card */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: Scrollable Entry List */}
          <div
            style={{
              width: 320,
              borderRight: '1px solid #1e293b',
              backgroundColor: 'rgba(10, 15, 29, 0.7)',
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            {filteredEntries.map((entry) => {
              const isSelected = entry.id === currentEntry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => handleSelectEntry(entry.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.3)',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(51, 65, 85, 0.5)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 6,
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={entry.image}
                      alt={entry.name}
                      style={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                      }}
                    />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: isSelected ? '#38bdf8' : '#e2e8f0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {entry.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#94a3b8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {entry.role}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Card View */}
          <div
            style={{
              flex: 1,
              padding: '24px 32px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              backgroundColor: 'rgba(12, 19, 36, 0.9)'
            }}
          >
            {/* Top Showcase: Big Art + Title */}
            <div
              style={{
                display: 'flex',
                gap: 24,
                alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                padding: '20px',
                borderRadius: 10,
                border: '1px solid #334155'
              }}
            >
              {/* Art Frame */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 10,
                  background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  border: '2px solid #38bdf8',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                <img
                  src={currentEntry.image}
                  alt={currentEntry.name}
                  style={{
                    maxWidth: '85%',
                    maxHeight: '85%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.8))'
                  }}
                />
              </div>

              {/* Title & Role */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>
                  {currentEntry.subtitle}
                </div>
                <h1
                  style={{
                    margin: '4px 0 8px',
                    fontFamily: 'var(--font-fantasy)',
                    fontSize: 26,
                    color: '#f8fafc',
                    fontWeight: 800
                  }}
                >
                  {currentEntry.name}
                </h1>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    fontSize: 12,
                    color: '#bae6fd',
                    fontWeight: 600
                  }}
                >
                  {currentEntry.role}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            {currentEntry.stats && currentEntry.stats.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12
                }}
              >
                {currentEntry.stats.map((st, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #1e293b'
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>
                      {st.label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginTop: 2 }}>
                      {st.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Lore & Description */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                padding: '16px 20px',
                borderRadius: 8,
                border: '1px solid #1e293b',
                lineHeight: 1.6,
                color: '#cbd5e1',
                fontSize: 14
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Info size={15} color="#38bdf8" />
                <span>Летопись и происхождение:</span>
              </div>
              <div>{currentEntry.description}</div>
            </div>

            {/* Tactical Advice */}
            {currentEntry.tactics && (
              <div
                style={{
                  backgroundColor: 'rgba(30, 58, 138, 0.2)',
                  padding: '14px 18px',
                  borderRadius: 8,
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  lineHeight: 1.5,
                  color: '#e0f2fe',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10
                }}
              >
                <Target size={18} color="#38bdf8" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#38bdf8' }}>Тактический совет: </strong>
                  {currentEntry.tactics}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
