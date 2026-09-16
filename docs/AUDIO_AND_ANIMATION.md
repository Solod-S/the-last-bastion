# Audio and Animation

## Audio philosophy

Игрок должен получать feedback даже без чтения HUD.

Звук сообщает:

- wave started;
- enemy leaked;
- tower upgraded;
- ability ready;
- boss phase;
- base critical.

## Music states

AudioService поддерживает musical states:

- menu;
- calm;
- combat-low;
- combat-high;
- boss;
- victory;
- defeat.

Переходы — crossfade или bar-aware transition если аудиоматериал позволяет.

## Regional ambience

### Green Lands
birds, river, wind, village life.

### Iron Mountains
wind, distant metal, machinery, mine ambience.

### Dead Marshes
insects, swamp bubbles, distant whispers.

### Ash Wasteland
lava rumble, ash wind, volcanic cracks.

### Northern Reach
cold wind, ice creaks, distant avalanche.

### Rift Lands
sub-bass hum, crystalline resonance, spatial anomalies.

## SFX variation

Частые events имеют 3–6 samples либо pitch/volume random range.

Запрещено бесконтрольно наслаивать десятки одинаковых explosions.

Audio limiter/voice limit обязателен.

## Animation state machine

Common enemy states:

- spawn;
- idle;
- move;
- attack;
- cast;
- hit;
- stunned;
- death.

Tower:

- construct;
- idle;
- acquire/aim;
- fire;
- cooldown visual;
- upgrade;
- disabled.

## Feedback polish

Разрешается умеренно:

- hit stop 20–50 ms на тяжёлых ударах;
- camera shake для boss/heavy artillery;
- damage flash;
- squash/stretch на мультяшных small enemies;
- particles.

Все screen shake/flashes учитывают accessibility settings.
