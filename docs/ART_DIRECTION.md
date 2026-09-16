# Art Direction

## Primary references

- `../assets/concepts/01_visual_style_guide.png`
- `../assets/concepts/02_regions_and_locations.png`
- `../assets/concepts/03_enemy_compendium.png`
- `../assets/concepts/04_tower_compendium.png`
- `../assets/concepts/05_props_and_objects.png`

## Style

Stylized fantasy / dark fantasy с яркой читаемой формой.

### Friendly faction

- blue cloth;
- pale stone;
- warm wood;
- gold/brass accents;
- cyan/blue crystals;
- tree/snowflake-like heraldic symbol.

### Rift faction

- violet;
- black steel;
- unnatural magenta glow;
- fractured crystal motifs;
- broken geometry.

### Undead / marsh

- desaturated teal/green;
- rotten wood;
- sickly green magic.

## Camera

2.5D / isometric-like 3/4 top-down view.

Все tower/enemy assets должны быть визуально совместимы с выбранным camera angle.

## Silhouette rules

На gameplay zoom игрок должен различать:

- class of tower;
- enemy size;
- flying vs ground;
- elite state;
- main status effect.

## Runtime asset strategy

Master artwork хранится в high resolution.

Runtime:

- WebP/AVIF для больших backgrounds где поддерживается pipeline;
- PNG/WebP alpha для отдельных sprites;
- atlases для небольших sprites;
- resolutions 1x/2x при необходимости.

## Enemy scale classes

- Small: goblin/sapper;
- Medium: knight/shaman;
- Large: orc/troll;
- Boss: 2–4× medium silhouette.

## Tower progression

Каждый upgrade визуально заметен:

- больше этажей;
- новая крыша/оружие;
- больше магической энергии;
- banners;
- specialization-specific silhouette.

Игрок должен определить уровень башни без открытия панели.

## Map readability

Road имеет максимальную визуальную читаемость.

Tower slots:

- слегка выделенные foundation areas;
- не кричащие круги постоянно;
- усиливаются при режиме строительства.

## VFX readability

- frost = blue/cyan;
- poison = sick green;
- fire = orange/red;
- magic/rift = purple;
- healing = green/gold;
- friendly generic magic = blue.

## UI

UI использует мотивы parchment + stone + wood + blue banner.

Не делать тяжёлые рамки вокруг каждого элемента.

Functional readability важнее декоративности.

## Asset naming

```text
region_greenlands_bg_m01.webp
tower_archer_l1_idle.png
tower_archer_sniper_l4.png
enemy_goblin_runner_walk.png
vfx_magic_hit_blue.png
ui_icon_gold.svg
```
