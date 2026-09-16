# MASTER AI TASK — The Last Bastion

## 1. Роль

Ты — автономный senior game-development AI agent. Твоя задача — спроектировать и реализовать качественную браузерную Tower Defense игру уровня полноценного коммерческого indie-проекта, а не техническое демо.

Рабочее название: **The Last Bastion**.

Главный принцип проекта:

> Gameplay-first, data-driven, modular, maintainable, content-scalable.

Игра должна легко расширяться новыми регионами, уровнями, башнями, противниками, боссами, звуками, эффектами и сюжетными событиями без переписывания ядра.

---

# 2. Обязательные визуальные референсы

Перед началом реализации изучи все изображения:

- `assets/concepts/01_visual_style_guide.png`
- `assets/concepts/02_regions_and_locations.png`
- `assets/concepts/03_enemy_compendium.png`
- `assets/concepts/04_tower_compendium.png`
- `assets/concepts/05_props_and_objects.png`

Они задают визуальный язык проекта.

Не копируй изображения как игровые сцены целиком. Используй их как art direction для производства отдельных игровых ассетов.

Визуальный стиль:

- stylized dark fantasy;
- hand-painted / illustrated 2.5D feel;
- читаемые силуэты;
- немного мультяшные пропорции;
- камень, дерево, металл, ткань, магические кристаллы;
- синий цвет защитников;
- фиолетовый цвет Разлома;
- яркие VFX поверх умеренно насыщенного окружения;
- визуально близко к премиальному мобильному/браузерному Tower Defense, но без прямого копирования чужих IP.

---

# 3. Целевая платформа

Основная платформа:

- Desktop browser;
- Chrome / Edge / Firefox / Safari;
- адаптивная поддержка планшетов;
- мышь + touch;
- полноэкранный режим;
- установка как PWA допустима как дополнительная возможность.

Игровое поле должно масштабироваться без нарушения логики координат и коллизий.

---

# 4. Рекомендуемый стек

Используй архитектуру, подходящую для долгой поддержки:

- TypeScript;
- Vite;
- Phaser 3 как игровой runtime;
- React для меню, экранов кампании, настроек, энциклопедии и сложного UI;
- Zustand или аналогичный небольшой store для мета-состояния;
- Zod или аналог для валидации data-конфигов;
- i18next или аналогичная система локализации;
- Vitest для unit tests;
- Playwright для smoke/E2E;
- ESLint + Prettier;
- IndexedDB/localStorage abstraction для локального сохранения.

Не завязывай core gameplay на React-render cycle.

Phaser отвечает за:

- карту;
- юнитов;
- башни;
- projectiles;
- particles;
- VFX;
- pathing;
- animation loop;
- gameplay input.

React отвечает за:

- main menu;
- world map;
- settings;
- dialogs;
- codex;
- progression screens;
- overlay panels, когда это разумно.

---

# 5. Игровая концепция

Жанр:

**Fantasy Tower Defense + light hero control + tactical map interaction.**

Игрок защищает энергетические кристаллы/поселения от существ Разлома.

Основной цикл уровня:

1. загрузка карты;
2. короткий сюжетный intro;
3. фаза подготовки;
4. строительство башен;
5. запуск волны;
6. получение золота;
7. upgrades / sell / tactical abilities;
8. события карты;
9. boss/final wave;
10. подсчёт результата;
11. награды;
12. возврат на карту кампании.

---

# 6. Игровые ресурсы

## Во время уровня

### Gold
Используется для:

- строительства;
- улучшения башен;
- ремонта некоторых объектов;
- покупки временных боевых улучшений.

Получение:

- стартовый запас;
- убийства;
- wave bonus;
- optional objectives;
- destructible/treasure objects.

### Lives / Bastion Health

Противник, дошедший до выхода, уменьшает здоровье базы.

Цена пропуска зависит от enemy leak value.

### Hero Energy

Заполняется во время боя и расходуется на hero ability.

---

# 7. Мета-прогрессия

Использовать три понятных типа прогресса:

### Stars
За прохождение миссий.

Условия:

- 1 звезда — миссия пройдена;
- 2 — хорошее состояние базы;
- 3 — почти идеальная защита.

Stars открывают permanent tower upgrades.

### Rift Crystals
Редкая валюта кампании.

Получается:

- boss missions;
- achievements;
- challenges.

Используется для:

- hero upgrades;
- special research;
- cosmetics в будущем.

### Codex progression

За первое убийство/встречу открывается информация о врагах и мире.

Никаких pay-to-win механик в базовой версии.

---

# 8. Базовые башни

Все башни имеют минимум 3 базовых уровня и затем выбор специализации.

## Archer Tower

Роль:

- cheap;
- fast attack;
- ground + air;
- стабильный single-target DPS.

Специализации:

### Sniper Tower
- огромная дальность;
- высокий damage;
- низкая attack speed;
- armor piercing;
- priority elite targeting.

### Ranger Tower
- высокая attack speed;
- poison/bleed;
- tracking;
- бонус против быстрых целей.

---

## Mage Tower

Роль:

- magic damage;
- anti-armor;
- средняя скорость.

### Archmage
- chain lightning;
- splash magic;
- teleport/arcane burst special.

### Frost Mage
- slow;
- freeze chance;
- area control.

---

## Cannon Tower

Роль:

- физический splash;
- медленная атака;
- эффективна против групп.

### Mortar
- высокий arc;
- большой radius;
- minimum range.

### Rocket Tower
- дальность;
- burst;
- fire DoT;
- возможность anti-air upgrade.

---

## Barracks

Создают melee units, способных блокировать врагов.

### Knight Barracks
- armor;
- shield;
- high survivability;
- максимальное удержание линии.

### Berserker Barracks
- высокий DPS;
- attack speed;
- lifesteal/rage;
- меньше защиты.

---

## Alchemy Tower

Support/debuff tower.

### Plague Doctor
- poison;
- armor reduction;
- infection spread.

### Engineer Trap Tower
- mines;
- snares;
- mechanical traps;
- crowd control.

---

# 9. Враги

Каждый противник обязан менять tactical decision игрока.

Базовый roster:

1. Goblin Runner — быстрый, слабый.
2. Orc Brute — высокий HP.
3. Rift Knight — тяжелая armor.
4. Shaman Healer — лечит союзников.
5. Necromancer — поднимает павших/призывает skeletons.
6. Rift Ghost — ethereal, высокая physical resistance.
7. Web Spider — slowing/web attacks.
8. Flying Beast — air unit.
9. Sapper — атакует/отключает defensive structures.
10. Troll Regenerator — massive HP + regen.

Дополнительные классы для дальнейшего расширения:

- stealth;
- shield bearer;
- summoner;
- splitter;
- teleporter;
- tower silencer;
- enrager;
- carrier;
- mini-boss.

Все способности реализовывать через компоненты/данные, а не отдельные hard-coded классы на каждый enemy type.

---

# 10. Регионы кампании

Смотри `assets/concepts/02_regions_and_locations.png`.

## Region 1 — Green Lands

Темы:

- леса;
- деревни;
- реки;
- деревянные укрепления;
- каменные мосты.

Назначение: onboarding.

Boss: Troll King.

---

## Region 2 — Iron Mountains

Темы:

- горные крепости;
- шахты;
- мосты;
- подъемники;
- siege machinery.

Механики:

- armor;
- choke points;
- mine carts;
- destructible bridges.

Boss: Iron Colossus.

---

## Region 3 — Dead Marshes

Темы:

- кладбища;
- болота;
- затопленные руины;
- зеленое проклятое свечение.

Механики:

- poison;
- undead;
- resurrection;
- temporary blocked building spots.

Boss: Plague Queen.

---

## Region 4 — Ash Wasteland

Темы:

- lava;
- volcano;
- black stone;
- ruined fortresses.

Механики:

- periodic lava hazards;
- fire resistance;
- burning ground.

Boss: Ash Dragon.

---

## Region 5 — Northern Reach

Темы:

- snow;
- frozen rivers;
- ice fortresses;
- mountains.

Механики:

- tower freeze;
- slippery/frozen routes;
- blizzard events.

Boss: Ice Giant.

---

## Region 6 — Rift Lands

Темы:

- floating islands;
- purple crystals;
- broken reality;
- ancient portal.

Механики:

- route changes;
- teleporting enemies;
- unstable tower slots;
- reality events.

Final Boss: Lord of the Rift.

---

# 11. Кампания

Целевая структура полной версии:

- 6 регионов;
- по 6 основных миссий = 36;
- 1 boss mission на регион входит в число шести;
- optional challenge variants;
- 3 сложности.

Для первой production milestone реализовать полностью **Region 1**:

- 6 карт;
- все 5 базовых башен;
- минимум 8 типов enemies;
- Troll King boss;
- герой;
- world map;
- upgrades;
- audio;
- effects;
- save system.

После этого масштабировать через данные.

---

# 12. Карты

Каждая карта описывается data-конфигом.

Карта содержит:

- background layers;
- decoration layers;
- path spline/polyline;
- spawn points;
- exit points;
- tower slots;
- interactive objects;
- ambience emitters;
- scripted triggers;
- camera bounds;
- optional alternate paths.

Не создавать отдельный кодовый Scene-класс под каждую карту.

Один универсальный `BattleScene` загружает `MapDefinition`.

---

# 13. Tactical map interactions

Добавить интерактивные объекты:

- barricade;
- bridge;
- healing shrine;
- mana crystal;
- ancient portal;
- signal brazier;
- explosive mine;
- spike trap;
- treasure chest;
- upgrade anvil;
- supply wagon.

Визуальный референс:

`assets/concepts/05_props_and_objects.png`.

Объекты должны поддерживать reusable interaction actions:

- activate;
- repair;
- destroy;
- open;
- capture;
- toggle path;
- apply aura;
- spawn unit;
- grant resource.

---

# 14. Hero system

На карте один герой.

MVP hero: **Bastion Commander**.

Навыки:

- Rally — временный buff nearby soldiers;
- Shield Slam — stun area;
- Last Stand — временная повышенная защита и taunt.

Hero:

- выбирается кликом;
- получает move command;
- вступает в melee;
- может погибнуть и respawn через cooldown;
- имеет cooldown abilities.

Позднее можно добавить Archer, Mage, Engineer.

---

# 15. Wave system

Wave должна описываться конфигом.

Поддержать:

- groups;
- spawn interval;
- delays;
- multiple spawn points;
- parallel subwaves;
- enemy modifiers;
- elite units;
- scripted events;
- boss phase triggers.

Игрок может вызвать следующую волну раньше и получить бонус gold.

---

# 16. Boss design

Boss — не просто большой HP bar.

Каждый boss использует фазы и изменяет правила боя.

### Troll King

- regeneration;
- roar buffs nearby trolls;
- throws boulder at soldiers;
- summons runners;
- enrage below 30% HP.

### Iron Colossus

- extreme armor;
- weak magical core;
- destroys barricades;
- armor plates break between phases.

### Plague Queen

- summons plague swarms;
- infects towers;
- resurrects corpses.

### Ash Dragon

- flying + ground phases;
- breath creates burning ground.

### Ice Giant

- freezes towers;
- destroys ice obstacles and changes path.

### Lord of the Rift

- 4 phases;
- opens portals;
- teleports enemies;
- disables random tower slots;
- changes route;
- final desperation phase.

---

# 17. Combat model

Damage types:

- physical;
- magic;
- fire;
- poison;
- pure/true only for rare abilities.

Enemy defenses:

- armor;
- magicResistance;
- elemental resistances;
- status immunities.

Statuses:

- slow;
- freeze;
- stun;
- poison;
- burn;
- bleed;
- armorBreak;
- silence;
- fear (optional).

Один reusable status-effect engine.

---

# 18. Targeting

Башня должна поддерживать targeting mode:

- first;
- last;
- strongest;
- weakest;
- fastest;
- closest;
- flying priority;
- armored priority.

Игрок может менять режим у advanced towers.

---

# 19. Экономический баланс

Не хардкодить числа.

Все числа вынести в balance configs.

Для первоначального прототипа использовать ориентиры:

- cheap tower: 70–100 gold;
- medium: 110–160;
- expensive: 170–250;
- upgrade stage: примерно 60–140% предыдущей стоимости;
- продажа возвращает 70% вложенного gold;
- early enemy reward: 5–12;
- elite: 20–50;
- boss: special mission reward.

После vertical slice провести balancing pass на основе telemetry/dev metrics.

---

# 20. Difficulty

Три уровня:

### Story
- +base health;
- slower enemies;
- lower enemy HP.

### Veteran
- intended balance.

### Riftborn
- enemy stat multipliers;
- stronger compositions;
- reduced economy;
- optional extra elite waves.

Difficulty modifiers должны быть конфигурационными.

---

# 21. UI / UX

Основные экраны:

1. loading;
2. title/main menu;
3. campaign world map;
4. level briefing;
5. battle HUD;
6. pause;
7. victory/defeat;
8. tower upgrades;
9. hero screen;
10. codex;
11. settings;
12. credits.

Battle HUD:

- lives;
- gold;
- wave counter;
- speed x1/x2;
- pause;
- next-wave button;
- selected tower panel;
- hero portrait + abilities;
- objective indicators.

UI должен быть читаемым и визуально согласованным с concept-art: parchment/stone/blue banners, но без перегруженности.

---

# 22. Анимации

Обязательны:

### Enemies
- idle;
- walk/run;
- attack;
- hit;
- death;
- special ability;
- status variations где нужно.

### Towers
- idle environmental motion;
- aim;
- fire/cast;
- upgrade build animation;
- destruction/disable state.

### Projectiles
- arrow;
- magic bolt;
- cannonball;
- rocket;
- potion;
- chain lightning.

### Environment
- flags;
- trees;
- water;
- fire;
- smoke;
- portal;
- magic crystals;
- snow/ash/fog.

Поддерживать sprite sheets или Spine-подобный pipeline через abstraction, не связывая gameplay с конкретным art format.

---

# 23. VFX

Создать систему эффектов:

- hit impacts;
- explosions;
- poison clouds;
- frost;
- fire;
- healing;
- buffs;
- portal energy;
- deaths;
- level-up/build effects.

VFX должны иметь quality tiers для слабых устройств.

---

# 24. Music

Каждый регион получает музыкальную тему.

Минимум:

- Main Menu Theme;
- Green Lands ambient/battle;
- Iron Mountains;
- Dead Marshes;
- Ash Wasteland;
- Northern Reach;
- Rift Lands;
- Boss Theme;
- Victory;
- Defeat.

Музыка loopable.

Предпочтительно dynamic music layers:

- ambient layer;
- combat layer;
- boss/intensity layer.

Переходы не должны резко обрывать композицию.

---

# 25. Sound effects

Категории:

- bow;
- arrows;
- swords;
- impacts;
- cannon;
- explosions;
- spells;
- ice;
- fire;
- poison;
- monsters;
- footsteps;
- UI;
- building;
- coins;
- wave horn;
- victory;
- defeat;
- ambience.

Использовать variations/pitch randomization, чтобы частые звуки не повторялись идентично.

В settings раздельные sliders:

- master;
- music;
- SFX;
- ambience.

---

# 26. Story presentation

Не делать длинные катсцены для MVP.

Использовать:

- illustrated panels;
- short dialogue boxes;
- map events;
- boss introductions;
- environmental storytelling.

Игрок должен понимать сюжет даже при пропуске диалогов.

Подробно: `docs/STORY_AND_WORLD.md`.

---

# 27. Save system

Сохранять:

- campaign progress;
- stars;
- currencies;
- upgrades;
- unlocked heroes;
- achievements;
- settings;
- codex;
- best scores.

Save format должен иметь:

- schema version;
- migrations;
- validation;
- backup slot;
- reset option.

Никогда не читать необработанный localStorage напрямую в gameplay-коде.

---

# 28. Localization

Архитектура сразу должна поддерживать минимум:

- English;
- Ukrainian;
- Russian.

Никаких UI-строк непосредственно в компонентах.

Все через translation keys.

Content configs используют text IDs, а не готовые строки.

---

# 29. Accessibility

Реализовать:

- UI scaling;
- reduced screen shake;
- reduced flashes;
- separate audio volumes;
- color-independent status icons;
- subtitles/text for spoken narrative;
- keyboard shortcuts для speed/pause/waves;
- readable font sizes.

---

# 30. Performance

Цель desktop:

- 60 FPS при нормальном количестве юнитов;
- graceful degradation;
- сотни визуальных объектов не должны создавать React DOM nodes.

Обязательно:

- object pooling для projectiles/VFX;
- texture atlas;
- lazy loading regions;
- audio preloading by scene;
- no allocations in hot update loops где возможно;
- spatial queries вместо полного перебора tower × enemy;
- performance debug overlay.

Поддержать quality presets:

- Low;
- Medium;
- High.

---

# 31. Data-driven architecture

Минимальные определения:

- `TowerDefinition`;
- `TowerUpgradeDefinition`;
- `EnemyDefinition`;
- `AbilityDefinition`;
- `StatusEffectDefinition`;
- `WaveDefinition`;
- `MapDefinition`;
- `RegionDefinition`;
- `MissionDefinition`;
- `HeroDefinition`;
- `AudioDefinition`;
- `Loot/RewardDefinition`.

Каждый definition валидируется при загрузке.

Ошибочный config должен выдавать понятную developer error, а не silent failure.

---

# 32. Слои архитектуры

Строго разделять:

## Core
Чистая игровая логика и модели.

## Runtime
Phaser objects, scenes, rendering, input.

## Content
JSON/TS definitions и assets.

## UI
React.

## Services
Save, audio, localization, analytics abstraction, asset loading.

Core не должен импортировать Phaser или React.

---

# 33. Event architecture

Использовать typed event bus.

Примеры:

- enemy:spawned;
- enemy:killed;
- enemy:leaked;
- tower:built;
- tower:upgraded;
- projectile:hit;
- wave:started;
- wave:completed;
- boss:phaseChanged;
- resource:changed;
- mission:completed.

UI подписывается на события/селекторы, а не лезет внутрь игровых объектов.

---

# 34. Debug / developer tools

Сделать dev panel:

- add gold;
- kill all enemies;
- spawn enemy;
- select wave;
- invulnerability;
- speed x1/x2/x4;
- visualize paths;
- visualize tower range;
- show FPS;
- entity count;
- active pools;
- inspect selected entity;
- reload content config where practical.

Development features полностью выключаются в production build.

---

# 35. Analytics abstraction

Даже если backend пока отсутствует, предусмотреть interface:

- mission start;
- mission win/loss;
- tower built;
- tower upgrade;
- leaked enemy;
- ability usage;
- session length;
- FPS/performance buckets.

В первой версии использовать local/dev logger adapter.

Не привязывать gameplay напрямую к стороннему analytics SDK.

---

# 36. Assets

Для каждого asset использовать стабильные IDs.

Не использовать пути к картинкам как gameplay identity.

Пример:

`tower.archer.level1`

а manifest уже сопоставляет ID с файлом.

Если production graphics ещё не готовы:

- использовать качественные placeholders в том же aspect ratio;
- не блокировать разработку логики;
- легко заменить asset через manifest.

---

# 37. Asset generation requirements

При генерации новых изображений AI должен придерживаться concept arts.

Для отдельных игровых объектов желательно:

- transparent background;
- единый изометрический/3/4 угол;
- consistent light direction;
- readable silhouette at small scale;
- no baked text;
- no UI labels;
- sufficient padding;
- high-res master + optimized runtime copy.

Для environments:

- modular layers;
- paths отдельно;
- props отдельно;
- foreground/occlusion отдельно;
- декоративные элементы не должны мешать tower slots.

---

# 38. Repository structure

Использовать приблизительно:

```text
src/
  app/
  game/
    core/
    runtime/
    scenes/
    systems/
    entities/
    components/
    events/
    debug/
  content/
    towers/
    enemies/
    heroes/
    regions/
    missions/
    waves/
    statuses/
  ui/
    screens/
    components/
    hud/
  services/
    audio/
    save/
    localization/
    assets/
    analytics/
  shared/
assets/
  runtime/
  audio/
  concepts/
public/
tests/
```

Не создавать гигантские файлы.

Желательно:

- до ~300 строк на обычный module;
- SRP;
- interfaces;
- композиция вместо наследования где возможно.

---

# 39. Testing

Unit tests:

- damage formulas;
- armor;
- rewards;
- upgrades;
- status durations;
- wave parsing;
- save migrations;
- mission scoring.

Integration tests:

- wave starts;
- enemy follows path;
- tower acquires target;
- projectile damages target;
- victory/defeat state.

E2E smoke:

- launch game;
- start mission;
- build tower;
- start wave;
- pause;
- settings;
- save/reload.

---

# 40. Definition of Done

Функция считается завершенной только если:

- работает;
- типизирована;
- не ломает save/schema;
- покрыта тестами там, где есть логика;
- не содержит hard-coded content-specific условий без причины;
- имеет понятные naming/comments только там, где логика неочевидна;
- не создаёт console errors;
- работает после reload;
- поддерживает desktop resize;
- проверена с production build.

---

# 41. Порядок разработки

Не пытайся сразу сделать 36 уровней.

## Phase 0 — Foundation

- repo;
- lint/format/test;
- Phaser + React integration;
- content loader;
- asset manager;
- event bus;
- save service;
- debug tools.

## Phase 1 — Combat prototype

- one greybox map;
- pathing;
- 2 enemies;
- archer tower;
- projectiles;
- waves;
- gold;
- victory/defeat.

## Phase 2 — Vertical slice

- polished Green Lands map;
- all 5 tower classes;
- 8 enemies;
- hero;
- audio;
- animation;
- upgrades;
- story intro;
- complete HUD.

## Phase 3 — Region 1

- all six Green Lands missions;
- Troll King;
- progression;
- world map;
- codex;
- difficulty.

## Phase 4 — Content scaling

Добавить остальные регионы почти исключительно через data + assets.

## Phase 5 — Polish

- optimization;
- accessibility;
- additional animations;
- balancing;
- QA;
- PWA/hosting.

---

# 42. Требование к работе AI-агента

Перед каждым крупным этапом:

1. изучи существующий код;
2. не ломай уже работающую архитектуру;
3. составь небольшой implementation plan;
4. выполни изменения;
5. запусти lint;
6. tests;
7. production build;
8. исправь ошибки;
9. обнови документацию.

Не заменяй рабочие системы полностью без необходимости.

Если требуется временный placeholder — пометь его явно через TODO с категорией.

---

# 43. Документация проекта

Поддерживать:

- `README.md`;
- architecture overview;
- content authoring guide;
- adding enemy guide;
- adding tower guide;
- adding mission guide;
- save schema version history;
- asset naming convention;
- controls.

Новый разработчик или AI-агент должен понять структуру проекта без чтения всего исходного кода.

---

# 44. Главная цель

Результат должен ощущаться как **настоящая законченная игра**:

- цельный визуальный стиль;
- музыка;
- звуки;
- анимации;
- VFX;
- сюжет;
- прогрессия;
- boss fights;
- меню;
- настройки;
- сохранения;
- баланс;
- responsive browser experience;
- стабильная архитектура.

Не превращать задачу в минимальную демонстрацию Tower Defense.

Но разрабатывать игру необходимо вертикальными срезами, сохраняя рабочее состояние проекта на каждом этапе.

---

# 45. Первое действие агента

Сначала:

1. изучи все документы в этом пакете;
2. изучи concept arts;
3. создай `IMPLEMENTATION_PLAN.md`;
4. предложи окончательную структуру репозитория;
5. создай foundation проекта;
6. реализуй минимальный greybox battle loop;
7. не переходи к массовому созданию контента, пока core loop не работает и не покрыт базовыми тестами.
