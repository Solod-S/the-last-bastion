import { TowerDefinition } from '../core/types/towers';
import { EnemyDefinition } from '../core/types/enemies';
import { MapDefinition } from '../core/types/map';
import { WaveSetDefinition } from '../core/types/waves';
import { MissionDefinition } from '../core/types/mission';

import { archerTower } from './towers/archer';
import { mageTower } from './towers/mage';
import { cannonTower } from './towers/cannon';
import { barracksTower } from './towers/barracks';
import { alchemyTower } from './towers/alchemy';

import {
  goblinRunner,
  orcBrute,
  riftKnight,
  shamanHealer,
  sapper,
  troll,
  trollKing
} from './enemies/enemies';

import { forestRoadMap } from './maps/forestRoad';
import { villageCrossingMap } from './maps/villageCrossing';
import { stoneBridgeMap } from './maps/stoneBridge';
import { crystalGroveMap } from './maps/crystalGrove';
import { brokenMillMap } from './maps/brokenMill';
import { trollPassMap } from './maps/trollPass';

import { wavesGreenlands01 } from './waves/wavesGreenlands01';
import { wavesGreenlands02 } from './waves/wavesGreenlands02';
import { wavesGreenlands03 } from './waves/wavesGreenlands03';
import { wavesGreenlands04 } from './waves/wavesGreenlands04';
import { wavesGreenlands05 } from './waves/wavesGreenlands05';
import { wavesGreenlands06 } from './waves/wavesGreenlands06';

import { missionGreenlands01 } from './missions/missionGreenlands01';
import { missionGreenlands02 } from './missions/missionGreenlands02';
import { missionGreenlands03 } from './missions/missionGreenlands03';
import { missionGreenlands04 } from './missions/missionGreenlands04';
import { missionGreenlands05 } from './missions/missionGreenlands05';
import { missionGreenlands06 } from './missions/missionGreenlands06';

export class ContentRegistry {
  private static towers = new Map<string, TowerDefinition>();
  private static enemies = new Map<string, EnemyDefinition>();
  private static maps = new Map<string, MapDefinition>();
  private static waveSets = new Map<string, WaveSetDefinition>();
  private static missions = new Map<string, MissionDefinition>();

  private static initialized = false;

  public static init(): void {
    if (this.initialized) return;

    // Register Towers
    this.registerTower(archerTower);
    this.registerTower(mageTower);
    this.registerTower(cannonTower);
    this.registerTower(barracksTower);
    this.registerTower(alchemyTower);

    // Register Enemies
    this.registerEnemy(goblinRunner);
    this.registerEnemy(orcBrute);
    this.registerEnemy(riftKnight);
    this.registerEnemy(shamanHealer);
    this.registerEnemy(sapper);
    this.registerEnemy(troll);
    this.registerEnemy(trollKing);

    // Register Maps
    this.registerMap(forestRoadMap);
    this.registerMap(villageCrossingMap);
    this.registerMap(stoneBridgeMap);
    this.registerMap(crystalGroveMap);
    this.registerMap(brokenMillMap);
    this.registerMap(trollPassMap);

    // Register WaveSets
    this.registerWaveSet(wavesGreenlands01);
    this.registerWaveSet(wavesGreenlands02);
    this.registerWaveSet(wavesGreenlands03);
    this.registerWaveSet(wavesGreenlands04);
    this.registerWaveSet(wavesGreenlands05);
    this.registerWaveSet(wavesGreenlands06);

    // Register Missions
    this.registerMission(missionGreenlands01);
    this.registerMission(missionGreenlands02);
    this.registerMission(missionGreenlands03);
    this.registerMission(missionGreenlands04);
    this.registerMission(missionGreenlands05);
    this.registerMission(missionGreenlands06);

    this.initialized = true;
    this.validate();
  }

  public static registerTower(tower: TowerDefinition): void {
    this.towers.set(tower.id, tower);
  }

  public static registerEnemy(enemy: EnemyDefinition): void {
    this.enemies.set(enemy.id, enemy);
  }

  public static registerMap(map: MapDefinition): void {
    this.maps.set(map.id, map);
  }

  public static registerWaveSet(waveSet: WaveSetDefinition): void {
    this.waveSets.set(waveSet.id, waveSet);
  }

  public static registerMission(mission: MissionDefinition): void {
    this.missions.set(mission.id, mission);
  }

  public static getTower(id: string): TowerDefinition {
    const t = this.towers.get(id);
    if (!t) throw new Error(`[ContentRegistry] Tower definition not found for id: "${id}"`);
    return t;
  }

  public static getAllTowers(): TowerDefinition[] {
    return Array.from(this.towers.values());
  }

  public static getEnemy(id: string): EnemyDefinition {
    const e = this.enemies.get(id);
    if (!e) throw new Error(`[ContentRegistry] Enemy definition not found for id: "${id}"`);
    return e;
  }

  public static getAllEnemies(): EnemyDefinition[] {
    return Array.from(this.enemies.values());
  }

  public static getMap(id: string): MapDefinition {
    const m = this.maps.get(id);
    if (!m) throw new Error(`[ContentRegistry] Map definition not found for id: "${id}"`);
    return m;
  }

  public static getWaveSet(id: string): WaveSetDefinition {
    const w = this.waveSets.get(id);
    if (!w) throw new Error(`[ContentRegistry] WaveSet definition not found for id: "${id}"`);
    return w;
  }

  public static getMission(id: string): MissionDefinition {
    const m = this.missions.get(id);
    if (!m) throw new Error(`[ContentRegistry] Mission definition not found for id: "${id}"`);
    return m;
  }

  public static getAllMissions(): MissionDefinition[] {
    return Array.from(this.missions.values());
  }

  public static validate(): void {
    // Validate that missions reference valid maps and wavesets
    for (const mission of this.missions.values()) {
      if (!this.maps.has(mission.mapId)) {
        throw new Error(`[ContentRegistry] Mission "${mission.id}" references missing map: "${mission.mapId}"`);
      }
      if (!this.waveSets.has(mission.waveSetId)) {
        throw new Error(`[ContentRegistry] Mission "${mission.id}" references missing waveSet: "${mission.waveSetId}"`);
      }
    }

    // Validate that wavesets reference valid enemies
    for (const waveSet of this.waveSets.values()) {
      for (const wave of waveSet.waves) {
        for (const group of wave.groups) {
          if (!this.enemies.has(group.enemyId)) {
            throw new Error(`[ContentRegistry] Wave "${wave.id}" references missing enemy: "${group.enemyId}"`);
          }
        }
      }
    }
  }
}

// Auto-initialize registry
ContentRegistry.init();
