"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Location_1 = require("../level/Location");
class Entity extends Location_1.Location {
    constructor() {
        super();
        this.hasSpawned = [];
        this.lastDamageCause = null;
        this.blocksAround = [];
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
        this.forceMovementUpdate = false;
        this.eyeHeight = null;
        this.baseOffset = 0.0;
        this.health = 20.0;
        this.maxHealth = 20;
        this.closed = false;
        this.id = Entity.entityCount++;
        // this.server = level.getServer();
    }
}
exports.Entity = Entity;
Entity.MOTION_THRESHOLD = 0.00001;
Entity.NETWORK_ID = -1;
Entity.DATA_TYPE_BYTE = 0;
Entity.DATA_TYPE_SHORT = 1;
Entity.DATA_TYPE_INT = 2;
Entity.DATA_TYPE_FLOAT = 3;
Entity.DATA_TYPE_STRING = 4;
Entity.DATA_TYPE_SLOT = 5;
Entity.DATA_TYPE_POS = 6;
Entity.DATA_TYPE_LONG = 7;
Entity.DATA_TYPE_VECTOR3F = 8;
/*
 * Readers beware: this isn't a nice list. Some of the properties have different types for different entities, and
 * are used for entirely different things.
 */
Entity.DATA_FLAGS = 0;
Entity.DATA_HEALTH = 1; //int (minecart/boat)
Entity.DATA_VARIANT = 2; //int
Entity.DATA_COLOR = 3;
Entity.DATA_COLOUR = 3; //byte
Entity.DATA_NAMETAG = 4; //string
Entity.DATA_OWNER_EID = 5; //long
Entity.DATA_TARGET_EID = 6; //long
Entity.DATA_AIR = 7; //short
Entity.DATA_POTION_COLOR = 8; //int (ARGB!)
Entity.DATA_POTION_AMBIENT = 9; //byte
/* 10 (byte) */
Entity.DATA_HURT_TIME = 11; //int (minecart/boat)
Entity.DATA_HURT_DIRECTION = 12; //int (minecart/boat)
Entity.DATA_PADDLE_TIME_LEFT = 13; //float
Entity.DATA_PADDLE_TIME_RIGHT = 14; //float
Entity.DATA_EXPERIENCE_VALUE = 15; //int (xp orb)
Entity.DATA_MINECART_DISPLAY_BLOCK = 16; //int (id | (data << 16))
Entity.DATA_HORSE_FLAGS = 16; //int
/* 16 (byte) used by wither skull */
Entity.DATA_MINECART_DISPLAY_OFFSET = 17; //int
Entity.DATA_SHOOTER_ID = 17; //long (used by arrows)
Entity.DATA_MINECART_HAS_DISPLAY = 18; //byte (must be 1 for minecart to show block inside)
Entity.DATA_HORSE_TYPE = 19; //byte
/* 20 (unknown)
 * 21 (unknown) */
Entity.DATA_CHARGE_AMOUNT = 22; //int8, used for ghasts and also crossbow charging
Entity.DATA_ENDERMAN_HELD_ITEM_ID = 23; //short
Entity.DATA_ENTITY_AGE = 24; //short
/* 25 (int) used by horse, (byte) used by witch */
Entity.DATA_PLAYER_FLAGS = 26; //byte
Entity.DATA_PLAYER_INDEX = 27; //int, used for marker colours and agent nametag colours
Entity.DATA_PLAYER_BED_POSITION = 28; //blockpos
Entity.DATA_FIREBALL_POWER_X = 29; //float
Entity.DATA_FIREBALL_POWER_Y = 30;
Entity.DATA_FIREBALL_POWER_Z = 31;
/* 32 (unknown)
 * 33 (float) fishing bobber
 * 34 (float) fishing bobber
 * 35 (float) fishing bobber */
Entity.DATA_POTION_AUX_VALUE = 36; //short
Entity.DATA_LEAD_HOLDER_EID = 37; //long
Entity.DATA_SCALE = 38; //float
Entity.DATA_HAS_NPC_COMPONENT = 39; //byte (???)
Entity.DATA_NPC_SKIN_INDEX = 40; //string
Entity.DATA_NPC_ACTIONS = 41; //string (maybe JSON blob?)
Entity.DATA_MAX_AIR = 42; //short
Entity.DATA_MARK_VARIANT = 43; //int
Entity.DATA_CONTAINER_TYPE = 44; //byte (ContainerComponent)
Entity.DATA_CONTAINER_BASE_SIZE = 45; //int (ContainerComponent)
Entity.DATA_CONTAINER_EXTRA_SLOTS_PER_STRENGTH = 46; //int (used for llamas, inventory size is baseSize + thisProp * strength)
Entity.DATA_BLOCK_TARGET = 47; //block coords (ender crystal)
Entity.DATA_WITHER_INVULNERABLE_TICKS = 48; //int
Entity.DATA_WITHER_TARGET_1 = 49; //long
Entity.DATA_WITHER_TARGET_2 = 50; //long
Entity.DATA_WITHER_TARGET_3 = 51; //long
/* 52 (short) */
Entity.DATA_BOUNDING_BOX_WIDTH = 53; //float
Entity.DATA_BOUNDING_BOX_HEIGHT = 54; //float
Entity.DATA_FUSE_LENGTH = 55; //int
Entity.DATA_RIDER_SEAT_POSITION = 56; //vector3f
Entity.DATA_RIDER_ROTATION_LOCKED = 57; //byte
Entity.DATA_RIDER_MAX_ROTATION = 58; //float
Entity.DATA_RIDER_MIN_ROTATION = 59; //float
Entity.DATA_AREA_EFFECT_CLOUD_RADIUS = 60; //float
Entity.DATA_AREA_EFFECT_CLOUD_WAITING = 61; //int
Entity.DATA_AREA_EFFECT_CLOUD_PARTICLE_ID = 62; //int
/* 63 (int) shulker-related */
Entity.DATA_SHULKER_ATTACH_FACE = 64; //byte
/* 65 (short) shulker-related */
Entity.DATA_SHULKER_ATTACH_POS = 66; //block coords
Entity.DATA_TRADING_PLAYER_EID = 67; //long
/* 69 (byte) command-block */
Entity.DATA_COMMAND_BLOCK_COMMAND = 70; //string
Entity.DATA_COMMAND_BLOCK_LAST_OUTPUT = 71; //string
Entity.DATA_COMMAND_BLOCK_TRACK_OUTPUT = 72; //byte
Entity.DATA_CONTROLLING_RIDER_SEAT_NUMBER = 73; //byte
Entity.DATA_STRENGTH = 74; //int
Entity.DATA_MAX_STRENGTH = 75; //int
/* 76 (int) */
Entity.DATA_LIMITED_LIFE = 77;
Entity.DATA_ARMOR_STAND_POSE_INDEX = 78; //int
Entity.DATA_ENDER_CRYSTAL_TIME_OFFSET = 79; //int
Entity.DATA_ALWAYS_SHOW_NAMETAG = 80; //byte: -1 = default, 0 = only when looked at, 1 = always
Entity.DATA_COLOR_2 = 81; //byte
/* 82 (unknown) */
Entity.DATA_SCORE_TAG = 83; //string
Entity.DATA_BALLOON_ATTACHED_ENTITY = 84; //int64, entity unique ID of owner
Entity.DATA_PUFFERFISH_SIZE = 85; //byte
Entity.DATA_BOAT_BUBBLE_TIME = 86; //int (time in bubble column)
Entity.DATA_PLAYER_AGENT_EID = 87; //long
/* 88 (float) related to panda sitting
 * 89 (float) related to panda sitting */
Entity.DATA_EAT_COUNTER = 90; //int (used by pandas)
Entity.DATA_FLAGS2 = 91; //long (extended data flags)
/* 92 (float) related to panda lying down
 * 93 (float) related to panda lying down */
Entity.DATA_AREA_EFFECT_CLOUD_DURATION = 94; //int
Entity.DATA_AREA_EFFECT_CLOUD_SPAWN_TIME = 95; //int
Entity.DATA_AREA_EFFECT_CLOUD_RADIUS_PER_TICK = 96; //float, usually negative
Entity.DATA_AREA_EFFECT_CLOUD_RADIUS_CHANGE_ON_PICKUP = 97; //float
Entity.DATA_AREA_EFFECT_CLOUD_PICKUP_COUNT = 98; //int
Entity.DATA_INTERACTIVE_TAG = 99; //string (button text)
Entity.DATA_TRADE_TIER = 100; //int
Entity.DATA_MAX_TRADE_TIER = 101; //int
Entity.DATA_TRADE_XP = 102; //int
Entity.DATA_SKIN_ID = 103; //int ???
/* 104 (int) related to wither */
Entity.DATA_COMMAND_BLOCK_TICK_DELAY = 105; //int
Entity.DATA_COMMAND_BLOCK_EXECUTE_ON_FIRST_TICK = 106; //byte
Entity.DATA_AMBIENT_SOUND_INTERVAL_MIN = 107; //float
Entity.DATA_AMBIENT_SOUND_INTERVAL_RANGE = 108; //float
Entity.DATA_AMBIENT_SOUND_EVENT = 109; //string
Entity.DATA_FLAG_ONFIRE = 0;
Entity.DATA_FLAG_SNEAKING = 1;
Entity.DATA_FLAG_RIDING = 2;
Entity.DATA_FLAG_SPRINTING = 3;
Entity.DATA_FLAG_ACTION = 4;
Entity.DATA_FLAG_INVISIBLE = 5;
Entity.DATA_FLAG_TEMPTED = 6;
Entity.DATA_FLAG_INLOVE = 7;
Entity.DATA_FLAG_SADDLED = 8;
Entity.DATA_FLAG_POWERED = 9;
Entity.DATA_FLAG_IGNITED = 10;
Entity.DATA_FLAG_BABY = 11;
Entity.DATA_FLAG_CONVERTING = 12;
Entity.DATA_FLAG_CRITICAL = 13;
Entity.DATA_FLAG_CAN_SHOW_NAMETAG = 14;
Entity.DATA_FLAG_ALWAYS_SHOW_NAMETAG = 15;
Entity.DATA_FLAG_IMMOBILE = 16;
Entity.DATA_FLAG_NO_AI = 16;
Entity.DATA_FLAG_SILENT = 17;
Entity.DATA_FLAG_WALLCLIMBING = 18;
Entity.DATA_FLAG_CAN_CLIMB = 19;
Entity.DATA_FLAG_SWIMMER = 20;
Entity.DATA_FLAG_CAN_FLY = 21;
Entity.DATA_FLAG_WALKER = 22;
Entity.DATA_FLAG_RESTING = 23;
Entity.DATA_FLAG_SITTING = 24;
Entity.DATA_FLAG_ANGRY = 25;
Entity.DATA_FLAG_INTERESTED = 26;
Entity.DATA_FLAG_CHARGED = 27;
Entity.DATA_FLAG_TAMED = 28;
Entity.DATA_FLAG_ORPHANED = 29;
Entity.DATA_FLAG_LEASHED = 30;
Entity.DATA_FLAG_SHEARED = 31;
Entity.DATA_FLAG_GLIDING = 32;
Entity.DATA_FLAG_ELDER = 33;
Entity.DATA_FLAG_MOVING = 34;
Entity.DATA_FLAG_BREATHING = 35;
Entity.DATA_FLAG_CHESTED = 36;
Entity.DATA_FLAG_STACKABLE = 37;
Entity.DATA_FLAG_SHOWBASE = 38;
Entity.DATA_FLAG_REARING = 39;
Entity.DATA_FLAG_VIBRATING = 40;
Entity.DATA_FLAG_IDLING = 41;
Entity.DATA_FLAG_EVOKER_SPELL = 42;
Entity.DATA_FLAG_CHARGE_ATTACK = 43;
Entity.DATA_FLAG_WASD_CONTROLLED = 44;
Entity.DATA_FLAG_CAN_POWER_JUMP = 45;
Entity.DATA_FLAG_LINGER = 46;
Entity.DATA_FLAG_HAS_COLLISION = 47;
Entity.DATA_FLAG_AFFECTED_BY_GRAVITY = 48;
Entity.DATA_FLAG_FIRE_IMMUNE = 49;
Entity.DATA_FLAG_DANCING = 50;
Entity.DATA_FLAG_ENCHANTED = 51;
Entity.DATA_FLAG_SHOW_TRIDENT_ROPE = 52; // tridents show an animated rope when enchanted with loyalty after they are thrown and return to their owner. To be combined with DATA_OWNER_EID
Entity.DATA_FLAG_CONTAINER_PRIVATE = 53; //inventory is private, doesn't drop contents when killed if true
Entity.DATA_FLAG_TRANSFORMING = 54;
Entity.DATA_FLAG_SPIN_ATTACK = 55;
Entity.DATA_FLAG_SWIMMING = 56;
Entity.DATA_FLAG_BRIBED = 57; //dolphins have this set when they go to find treasure for the player
Entity.DATA_FLAG_PREGNANT = 58;
Entity.DATA_FLAG_LAYING_EGG = 59;
Entity.DATA_FLAG_RIDER_CAN_PICK = 60; //???
Entity.DATA_FLAG_TRANSITION_SITTING = 61;
Entity.DATA_FLAG_EATING = 62;
Entity.DATA_FLAG_LAYING_DOWN = 63;
Entity.DATA_FLAG_SNEEZING = 64;
Entity.DATA_FLAG_TRUSTING = 65;
Entity.DATA_FLAG_ROLLING = 66;
Entity.DATA_FLAG_SCARED = 67;
Entity.DATA_FLAG_IN_SCAFFOLDING = 68;
Entity.DATA_FLAG_OVER_SCAFFOLDING = 69;
Entity.DATA_FLAG_FALL_THROUGH_SCAFFOLDING = 70;
Entity.DATA_FLAG_BLOCKING = 71; //shield
Entity.DATA_FLAG_DISABLE_BLOCKING = 72;
//73 is set when a player is attacked while using shield, unclear on purpose
//74 related to shield usage, needs further investigation
Entity.DATA_FLAG_SLEEPING = 75;
//76 related to sleeping, unclear usage
Entity.DATA_FLAG_TRADE_INTEREST = 77;
Entity.DATA_FLAG_DOOR_BREAKER = 78; //...
Entity.DATA_FLAG_BREAKING_OBSTRUCTION = 79;
Entity.DATA_FLAG_DOOR_OPENER = 80; //...
Entity.DATA_FLAG_ILLAGER_CAPTAIN = 81;
Entity.DATA_FLAG_STUNNED = 82;
Entity.DATA_FLAG_ROARING = 83;
Entity.DATA_FLAG_DELAYED_ATTACKING = 84;
Entity.DATA_FLAG_AVOIDING_MOBS = 85;
//86 used by RangedAttackGoal
//87 used by NearestAttackableTargetGoal
Entity.entityCount = 1;
Entity.knownEntities = [];
Entity.saveNames = [];
//# sourceMappingURL=Entity.js.map