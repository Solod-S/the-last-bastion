# Technical Architecture

## Goal

Проект должен переживать десятки новых уровней без накопления архитектурного долга.

## Main rule

**Gameplay rules are data-driven. Rendering is replaceable. Content does not own engine logic.**

## Layers

### Core
Чистые TypeScript entities/value objects/calculations:

- damage;
- targeting;
- status effects;
- economy;
- upgrades;
- scoring;
- wave state.

Core не импортирует Phaser, DOM или React.

### Runtime
Phaser adapters:

- scene lifecycle;
- sprites;
- camera;
- input;
- particles;
- tweens;
- sound hooks;
- path visualization.

### Content
Definitions + schemas.

### Services

- AssetService;
- AudioService;
- SaveService;
- LocalizationService;
- AnalyticsService;
- SettingsService.

### UI
React meta UI и bridge к gameplay state.

## Entity architecture

Предпочитать composition.

Enemy runtime entity собирается из capabilities:

- MovementComponent;
- HealthComponent;
- DefenseComponent;
- StatusComponent;
- AttackComponent;
- AbilityComponent;
- RewardComponent.

Не создавать классы `Goblin.ts`, `Orc.ts`, `Troll.ts`, если различия можно выразить definitions.

## Systems

- EnemyMovementSystem;
- TargetingSystem;
- AttackSystem;
- ProjectileSystem;
- StatusEffectSystem;
- DamageSystem;
- TowerBuildSystem;
- TowerUpgradeSystem;
- BarracksSystem;
- WaveSystem;
- BossSystem;
- EconomySystem;
- ObjectiveSystem;
- MissionStateSystem.

## Spatial optimization

Для большого числа enemies использовать spatial hash/grid/quadtree-like index для запросов "враги в радиусе".

Башни не должны каждый frame сканировать весь enemy array.

## Timing

Gameplay simulation использует controlled delta time.

Game speed multipliers:

- 0 pause;
- 1 normal;
- 2 fast;
- optional 4 dev only.

Cooldowns, statuses и spawning должны корректно работать на x2.

## Asset manager

API по ID:

```ts
asset.getTexture('tower.archer.level1')
audio.play('sfx.archer.fire.01')
```

Никаких scattered relative paths по проекту.

## Content validation

Все definitions проходят runtime schema validation при development boot.

Production может использовать prevalidated/generated registry.

## Save service

Пример envelope:

```json
{
  "schemaVersion": 1,
  "updatedAt": "ISO_DATE",
  "profile": {},
  "campaign": {},
  "settings": {}
}
```

Каждая новая несовместимая структура получает migration.

## Determinism

Не требуется полный deterministic lockstep, но random должен проходить через `RandomService` с seed support для воспроизводимых test scenarios.

## Scene design

- BootScene;
- PreloadScene;
- BattleScene;
- optional transition scenes.

Не создавать отдельную Phaser Scene на каждый уровень.

## Map loading

`BattleScene` получает `missionId`, затем через registries загружает mission, map, waves, assets и ambience.

## UI communication

UI получает serializable snapshots/selectors, а команды отправляет через command API:

```ts
buildTower(slotId, towerId)
upgradeTower(entityId, upgradeId)
sellTower(entityId)
activateHeroAbility(abilityId)
startNextWave()
```

## Error handling

Development errors должны содержать:

- definition id;
- offending field;
- expected type/value;
- source config.

## CI baseline

На каждый merge:

- lint;
- typecheck;
- unit tests;
- build;
- Playwright smoke.

## Browser persistence

Обёртка должна позволить позже заменить local storage на cloud profile/backend без изменений gameplay code.

## Security

- не хранить секреты в frontend;
- не доверять клиентским score для будущих competitive features;
- external links через allowlist;
- CSP-friendly build;
- dependencies регулярно обновлять.
