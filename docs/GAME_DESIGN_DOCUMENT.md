# Game Design Document

## High concept

**The Last Bastion** — браузерная fantasy Tower Defense игра, где игрок защищает остатки цивилизации от существ магических Разломов. Основа — классическая оборона маршрутов, усиленная героями, интерактивными объектами карты, специализациями башен и боссами, которые меняют правила боя.

## Design pillars

1. **Readable strategy** — игрок быстро понимает, почему проиграл и что можно изменить.
2. **Meaningful counters** — разные враги требуют разных башен и комбинаций.
3. **Satisfying impact** — визуально и звуково атаки должны ощущаться весомо.
4. **Low friction** — строительство, апгрейд и выбор целей требуют минимум кликов.
5. **Scalable content** — новый контент создаётся конфигами и ассетами.

## Session length

- обычная миссия: 8–15 минут;
- boss mission: 12–20 минут;
- challenge: 5–12 минут.

## Battle phases

### Briefing
Показывает цель, новую механику и возможных новых врагов.

### Build phase
Игрок получает короткое окно для начального строительства.

### Wave combat
Враги движутся по маршруту. Игрок строит, улучшает, продаёт и использует героя.

### Between-wave breathing space
Короткая пауза. Следующую волну можно запустить раньше за bonus.

### Results
Награды, звёзды, статистика и новые unlocks.

## Mission scoring

Три звезды:

- completion;
- base health threshold;
- high base health/perfect defense.

Дополнительные badges:

- no leaks;
- no tower sells;
- limited tower types;
- hero survived;
- speed clear.

## Tower combat roles

### Archer
Early universal DPS, anti-fast, anti-air.

### Mage
Anti-armor and control.

### Cannon
Crowd clear and splash.

### Barracks
Block and create kill zones.

### Alchemy
Debuffs and trap control.

## Synergies

Примеры:

- Barracks hold + Cannon splash.
- Frost Mage slow + Sniper long-range kill.
- Plague armor break + Archer sustained DPS.
- Trap snare + Rocket burn zone.

## Enemy roster rules

В любой wave желательно смешивать 2–4 функций, а не просто повышать HP.

Пример хорошей волны:

- Orcs создают frontline;
- Healer держит группу живой;
- Goblin Runners пытаются проскочить;
- Flying Beasts заставляют не уходить полностью в ground-only билд.

## Regional progression

### Green Lands
Обучает базовым контр-механикам.

### Iron Mountains
Сдвигает акцент в сторону armor, chokepoints и siege.

### Dead Marshes
Добавляет resurrection, poison, ethereal enemies.

### Ash Wasteland
Hazards и fire-related mechanics.

### Northern Reach
Crowd control, freeze и environmental timing.

### Rift Lands
Комбинирует механики и меняет pathing.

## First region mission outline

### Mission 1 — Forest Road
- tutorial build slot;
- Goblin Runner;
- Archer Tower;
- 8 waves.

### Mission 2 — Village Crossing
- Barracks;
- split road;
- Orc Brute;
- 10 waves.

### Mission 3 — Old Stone Bridge
- Cannon Tower;
- bridge interaction;
- dense groups.

### Mission 4 — Crystal Grove
- Mage Tower;
- Rift Knight;
- Mana Crystal objective.

### Mission 5 — Broken Mill
- Alchemy Tower;
- Shaman;
- Sapper;
- defend side objective.

### Mission 6 — Troll Pass
- full toolkit;
- Troll enemies;
- boss: Troll King.

## Boss health phases

Каждый boss definition хранит thresholds, например 70%, 40%, 20%, а фазовые действия реализуются reusable actions.

## Economy principles

Gold должен заставлять выбирать:

- больше дешёвых башен;
- ранний upgrade;
- сохранение под специализацию;
- ремонт интерактивного объекта;
- tactical sell/rebuild.

Не допускать единственной доминирующей стратегии на большинстве карт.

## Replayability

После прохождения региона открывать:

- Veteran difficulty;
- challenge modifiers;
- alternative hero;
- score targets.

## Challenge examples

- только Archer + Barracks;
- enemies +25% speed;
- half starting gold;
- permanent fog;
- one life;
- endless waves.
