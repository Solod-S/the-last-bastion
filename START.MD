Ты работаешь над браузерной Tower Defense игрой **The Last Bastion**.

В корне проекта уже находятся подготовленные мной документы, спецификации, концепт-арты и другие материалы проекта.

Твоя задача — выступать не просто как программист, а как **Lead Game Developer / Game Architect / Technical Game Designer**, последовательно реализующий проект по существующей документации.

## 1. Сначала изучи проект

Перед написанием кода обязательно:

1. Просканируй структуру текущего репозитория.
2. Найди и полностью прочитай:
   - `README.md`
   - `MASTER_AI_TASK.md`
   - `GAME_DESIGN_DOCUMENT.md`
   - `TECHNICAL_ARCHITECTURE.md`
   - `ART_DIRECTION.md`
   - `AUDIO_AND_ANIMATION.md`
   - `STORY_AND_WORLD.md`
   - `CONTENT_PIPELINE.md`
   - `QA_AND_RELEASE.md`
   - `ASSET_MANIFEST.md`

3. Изучи все JSON-примеры и описания data models.
4. Найди папку с concept art / reference images и изучи все изображения.
5. Используй изображения как основной визуальный референс для:
   - окружения;
   - башен;
   - врагов;
   - UI;
   - цветовой палитры;
   - масштаба объектов;
   - общего fantasy art direction.

Не игнорируй документацию и не заменяй описанную концепцию своим вариантом игры.

Если между документами есть противоречие, приоритет:

`MASTER_AI_TASK.md`
→ `GAME_DESIGN_DOCUMENT.md`
→ специализированные документы.

---

# 2. Основная цель

Нужно создать полноценную браузерную Tower Defense игру уровня качественного indie-проекта.

Это НЕ должен быть простой учебный прототип.

В итоговой игре должны быть:

- полноценный игровой цикл;
- кампания;
- сюжет;
- разные регионы;
- карты;
- башни;
- улучшения башен;
- враги разных классов;
- боссы;
- волны;
- экономика;
- способности;
- герои;
- мета-прогрессия;
- сохранения;
- настройки;
- музыка;
- звуковые эффекты;
- VFX;
- анимации;
- хороший UI/UX;
- локализация;
- responsive browser layout;
- оптимизация;
- тестирование.

Но разрабатывать это нужно **итерационно**, а не пытаться создать всё одновременно.

---

# 3. Критическое требование к архитектуре

Проект должен быть максимально **data-driven и modular**.

НЕ делай архитектуру вида:

```ts
if (enemy === "goblin") {
}
if (enemy === "orc") {
}
if (tower === "archer") {
}
```

Контент должен преимущественно описываться конфигурациями.

Например:

```text
src/
  game/
    core/
    systems/
    entities/
    components/
    scenes/
    managers/

  content/
    towers/
    enemies/
    heroes/
    missions/
    waves/
    regions/
    statuses/
    abilities/

  ui/

  audio/

  assets/

  localization/

  save/

  debug/
```

Добавление нового врага, башни или уровня должно в идеале требовать:

1. добавления JSON/TS-конфига;
2. добавления ассетов;
3. при необходимости подключения существующих ability/components;

а не переписывания ядра игры.

---

# 4. Предпочтительный стек

Ориентируйся на архитектуру из документации.

Базовый вариант:

- TypeScript
- Vite
- Phaser 3
- React

Phaser отвечает за:

- battlefield;
- entities;
- towers;
- enemies;
- projectiles;
- path following;
- combat;
- particles;
- game animations;
- camera;
- gameplay scenes.

React отвечает за:

- main menu;
- campaign screen;
- mission selection;
- upgrades;
- Codex;
- settings;
- pause screens;
- dialogs;
- meta progression;
- интерфейсы вне непосредственно battlefield.

Если в документации указаны дополнительные библиотеки — учитывай их.

Не добавляй тяжёлые зависимости без необходимости.

---

# 5. Сейчас НЕ делай всю игру

Первая задача — создать **production-quality Vertical Slice**.

Он должен доказать, что выбранная архитектура подходит для всей будущей игры.

Vertical Slice должен содержать:

## Один регион

Используй первый регион:

**Green Lands**

Визуально максимально ориентируйся на соответствующий concept art.

---

## Одну полноценную карту

Создай первую игровую карту Green Lands.

На ней должны быть:

- красивый environment;
- дорога;
- spawn point;
- player base;
- tower build spots;
- декоративные объекты;
- минимум один интерактивный объект;
- корректная камера;
- визуальное разделение игрового поля и UI.

Используй существующие concept/reference assets.

Если какого-то runtime asset пока нет, сделай временный placeholder, но:

- не используй примитивные разноцветные прямоугольники там, где можно сделать нормальный placeholder;
- структура должна позволять потом заменить placeholder на production asset одной заменой файла/конфига.

---

# 6. Реализуй первый набор башен

Для vertical slice нужны:

### Archer Tower

Функции:

- поиск цели;
- дальность;
- стрельба;
- projectile;
- damage;
- attack speed;
- target priority;
- upgrade.

### Mage Tower

Функции:

- магический урон;
- другая projectile/VFX логика;
- эффективна против брони.

### Cannon Tower

Функции:

- медленная атака;
- splash/AOE damage;
- визуальный взрыв.

### Barracks

Функции:

- создаёт юнитов;
- солдаты выходят на дорогу;
- блокируют врагов;
- атакуют их;
- имеют HP;
- возвращаются/respawn после смерти.

Не хардкодь механики непосредственно под эти четыре башни.

Создай общую Tower architecture.

---

# 7. Реализуй первый набор врагов

Для vertical slice нужны минимум:

### Goblin Runner

- низкое HP;
- высокая скорость;
- простой melee enemy.

### Orc Brute

- высокое HP;
- низкая скорость.

### Rift Knight

- armour;
- сопротивление части physical damage.

### Shaman Healer

- идёт вместе с группой;
- лечит союзников поблизости.

Враги должны строиться через:

- базовый Enemy entity;
- stats;
- modifiers;
- abilities/components;
- data config.

---

# 8. Система боя

Создай универсальные системы:

- target acquisition;
- target priority;
- attack cooldown;
- projectiles;
- damage;
- armour;
- magic resistance;
- AOE;
- status effects;
- healing;
- death;
- rewards.

Минимальные damage types:

```text
physical
magic
true
```

Архитектура должна позволять позже добавить:

- fire;
- frost;
- poison;
- bleed;
- lightning.

---

# 9. Waves

Волны не должны быть зашиты в сцену.

Создай Wave System.

Пример структуры:

```json
{
  "id": "greenlands_01_wave_03",
  "groups": [
    {
      "enemy": "goblin_runner",
      "count": 8,
      "interval": 0.8
    },
    {
      "delay": 4
    },
    {
      "enemy": "orc_brute",
      "count": 3,
      "interval": 1.5
    }
  ]
}
```

Нужны:

- countdown;
- start wave;
- early wave start bonus;
- wave progress;
- last wave indication;
- victory;
- defeat.

---

# 10. Экономика

Для первой версии:

### Gold

Игрок получает золото:

- за убийство врагов;
- за завершение волн;
- за досрочный запуск следующей волны.

Тратит:

- строительство;
- upgrades.

Нужны:

- tower cost;
- upgrade cost;
- sell/refund;
- UI feedback.

Все значения должны находиться в balance/config файлах.

---

# 11. Base Lives

Враги, дошедшие до конца маршрута, уменьшают HP/жизни базы.

Разные враги в дальнейшем могут отнимать разное количество lives.

При:

```text
lives <= 0
```

миссия проиграна.

---

# 12. UI

Vertical Slice должен уже выглядеть как игра, а не developer prototype.

Нужны:

### HUD

- lives;
- gold;
- current wave;
- total waves;
- pause;
- speed;
- selected tower panel.

### Tower build menu

При выборе build spot:

- башни;
- icon;
- стоимость;
- короткое описание.

### Tower panel

При выборе башни:

- название;
- level;
- damage;
- attack speed;
- range;
- upgrade;
- sell.

### Enemy information

Минимальная информация при выборе/hover:

- name;
- HP;
- armour;
- special property.

Визуальный стиль должен соответствовать concept art мира The Last Bastion.

---

# 13. Игровые скорости

Реализуй:

```text
1x
2x
3x
```

И pause.

Gameplay simulation должна корректно учитывать изменение скорости.

Не делай скорость путём хаотичных отдельных multiplier по всему коду.

Создай централизованный GameTime/TimeScale механизм.

---

# 14. Audio architecture

Даже если production-звуков ещё нет, архитектуру сделай сразу.

Нужны категории:

```text
master
music
sfx
ui
ambient
voice
```

Настройки громкости должны сохраняться.

Подготовь AudioManager.

Для Green Lands предусмотрены:

- ambient forest;
- battle music;
- calm music;
- wave start;
- victory;
- defeat;
- arrow;
- magic shot;
- cannon fire;
- cannon explosion;
- enemy hit;
- enemy death;
- build tower;
- upgrade tower;
- UI click.

Используй имеющиеся аудиофайлы, если они уже есть.

Если нет — пока подключи placeholders аккуратно, не блокируя разработку.

---

# 15. Animation/VFX architecture

Подготовь систему для:

- idle;
- walk;
- attack;
- death;
- hit reaction;
- projectile;
- explosion;
- magic impact;
- heal;
- spawn;
- tower construction;
- tower upgrade.

Даже временные эффекты должны иметь централизованную структуру.

---

# 16. Save System

Сразу заложи versioned save.

Например:

```ts
{
  version: 1,
  settings: {},
  campaign: {},
  upgrades: {},
  achievements: {}
}
```

На первом этапе достаточно:

- settings;
- прогресс tutorial/first mission;
- best result.

Используй local persistence.

Архитектура должна позволять миграции save schema.

---

# 17. Localization

Минимум подготовь:

```text
en
uk
ru
```

Не вставляй UI-тексты непосредственно в компоненты.

Используй translation keys.

Например:

```text
tower.archer.name
tower.archer.description

enemy.goblin.name

ui.wave
ui.gold
ui.lives

mission.victory
mission.defeat
```

Основным fallback языком сделай English.

---

# 18. Debug инструменты

Обязательно создай development/debug mode.

Мне должны быть доступны функции вроде:

- +1000 gold;
- kill all enemies;
- spawn enemy;
- spawn specific wave;
- invincible base;
- change game speed;
- show paths;
- show tower ranges;
- show FPS;
- show entity counts.

Debug инструменты не должны попадать в обычный production UI.

---

# 19. Производительность

Игра должна нормально работать в современных desktop browser.

Сразу следи за:

- object pooling;
- projectile pooling;
- particle pooling;
- texture atlases;
- cleanup listeners;
- cleanup timers;
- memory leaks;
- unnecessary React rerenders.

Не создавай десятки тысяч transient JS objects каждый frame.

Gameplay loop должен быть независим от React render loop.

---

# 20. Код

Требования:

- понятные имена;
- небольшие модули;
- отсутствие god objects;
- separation of concerns;
- reusable systems;
- минимум magic numbers;
- конфиги вместо constants внутри gameplay code;
- комментарии только там, где они действительно нужны.

Не создавай файл на 1500 строк, отвечающий за половину игры.

---

# 21. Первый этап работы

Сейчас выполни следующие действия.

## Step 1 — Project Audit

Проанализируй текущий проект.

Опиши:

- что уже существует;
- какие документы найдены;
- какие assets найдены;
- какие директории существуют;
- какие зависимости уже установлены;
- есть ли существующий код.

---

## Step 2 — Implementation Plan

Создай или обнови файл:

```text
docs/IMPLEMENTATION_PLAN.md
```

В нём распиши реализацию vertical slice по этапам.

Используй чекбоксы:

```md
- [ ] ...
- [ ] ...
- [ ] ...
```

---

## Step 3 — Architecture

Создай production-ready skeleton проекта.

Не создавай бесполезные пустые абстракции.

Каждый созданный слой должен иметь понятное назначение.

---

## Step 4 — First Playable

После подготовки архитектуры переходи непосредственно к реализации.

Цель:

я запускаю:

```bash
npm install
npm run dev
```

открываю браузер и могу:

1. открыть игру;
2. начать Green Lands mission;
3. увидеть карту;
4. поставить башню;
5. запустить волну;
6. увидеть движение врагов;
7. увидеть работу башни;
8. получать золото;
9. строить новые башни;
10. улучшать башни;
11. пройти несколько волн;
12. победить или проиграть.

---

# 22. Не останавливайся только на плане

ВАЖНО:

После анализа и составления плана **продолжай реализацию самостоятельно**.

Не отвечай мне:

> Вот план, хотите, чтобы я начал?

Начинай.

Не спрашивай подтверждение для каждого файла.

Принимай разумные технические решения самостоятельно, если они не противоречат документации.

---

# 23. Не пытайся реализовать 36 карт прямо сейчас

Сейчас приоритет:

```text
качество архитектуры
        ↓
одна полноценная карта
        ↓
ядро gameplay
        ↓
4 башни
        ↓
4 врага
        ↓
waves
        ↓
economy
        ↓
UI
        ↓
audio/VFX foundations
        ↓
polish
```

После этого первая карта должна стать шаблоном для всей игры.

---

# 24. Concept art

Изображения из проекта являются **официальными visual references игры**.

Не воспринимай их просто как вдохновение.

Старайся сохранить:

- стилизацию;
- формы;
- материалы;
- архитектуру;
- пропорции;
- fantasy mood;
- цветовую палитру;
- характер башен;
- характер существ;
- оформление окружения.

Если runtime ассет существенно отличается от concept art, оставляй возможность легко заменить его позже.

---

# 25. Проверка после каждого крупного этапа

Запускай:

```bash
npm run build
```

и доступные:

```bash
npm run lint
npm run test
```

Исправляй ошибки сразу.

Не накапливай десятки TypeScript/build ошибок до конца работы.

---

# 26. Документация

По мере работы поддерживай актуальными:

```text
README.md
docs/IMPLEMENTATION_PLAN.md
docs/ARCHITECTURE.md
```

Если добавляется новый content schema — документируй его.

---

# 27. Главный принцип

Думай о проекте не как о разовой демке, а как об игре, которую в дальнейшем будут развивать годами.

Нужно иметь возможность без переписывания архитектуры добавлять:

- новый регион;
- 10 новых карт;
- новые башни;
- новые upgrade branches;
- десятки врагов;
- боссов;
- героев;
- status effects;
- способности;
- новые игровые механики;
- сезонный контент.

При этом старый контент не должен ломаться.

---

# Начинай работу

Сейчас:

1. изучи весь репозиторий;
2. прочитай документацию;
3. изучи concept art;
4. проведи audit;
5. создай `docs/IMPLEMENTATION_PLAN.md`;
6. подготовь архитектуру;
7. начни реализацию первого playable Vertical Slice Green Lands;
8. проверяй проект через build/lint/tests;
9. продолжай до рабочего состояния без ожидания дополнительных подтверждений от меня.

Не ограничивайся анализом — **работай непосредственно с файлами проекта и реализуй игру**.
