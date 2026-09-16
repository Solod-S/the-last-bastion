# Core Content Model

## EnemyDefinition

Required conceptual fields:

```ts
type EnemyDefinition = {
  id: string
  nameKey: string
  class: 'small' | 'medium' | 'large' | 'boss'
  movement: MovementDefinition
  health: number
  defense: DefenseDefinition
  rewardGold: number
  leakDamage: number
  abilities: string[]
  tags: string[]
  assets: Record<string, string>
  audio?: Record<string, string | string[]>
}
```

## TowerDefinition

```ts
type TowerDefinition = {
  id: string
  nameKey: string
  buildCost: number
  targeting: TargetingDefinition
  attack?: AttackDefinition
  spawn?: SpawnDefinition
  support?: SupportDefinition
  upgradeGraphId: string
  assets: Record<string, string>
}
```

## MissionDefinition

```ts
type MissionDefinition = {
  id: string
  regionId: string
  mapId: string
  waveSetId: string
  startingGold: number
  baseHealth: number
  allowedTowers: string[]
  objectives: ObjectiveDefinition[]
  rewards: RewardDefinition
  scriptedEvents?: ScriptedEventDefinition[]
}
```

## Rule

IDs стабильны и не зависят от display name или filename.
