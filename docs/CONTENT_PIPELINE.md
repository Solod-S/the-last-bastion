# Content Pipeline

## Goal

Добавление контента не должно требовать изменения core systems.

## Adding an enemy

1. Добавить visual/audio assets.
2. Добавить manifest IDs.
3. Создать `EnemyDefinition`.
4. Выбрать существующие abilities/components.
5. При необходимости создать новую reusable ability, а не enemy-specific hack.
6. Добавить localization keys.
7. Добавить codex entry.
8. Добавить automated config validation test.

## Adding a tower

1. Create TowerDefinition.
2. Set targeting/attack behavior by reusable strategy IDs.
3. Add upgrade graph.
4. Add assets/audio/VFX IDs.
5. Add localization.
6. Add balancing tests/snapshot.

## Adding a mission

Mission references:

- region;
- map;
- waves;
- briefing;
- rewards;
- unlock conditions;
- objectives;
- modifiers.

## Adding a region

Region bundles:

- world map node styling;
- shared environment atlas;
- music;
- ambience;
- enemy roster additions;
- missions;
- boss;
- story chapter.

Lazy-load region bundles.

## Balance workflow

Хранить metrics:

- mission completion rate in dev sessions;
- tower spend share;
- damage share;
- leak causes;
- average unused gold;
- wave duration;
- boss kill duration.

Даже без server analytics их можно выводить в dev summary после миссии.
