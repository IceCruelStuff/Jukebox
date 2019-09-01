import {JukeboxServer} from "../JukeboxServer";
import {Player} from "../Player";
import {Vector3} from "../math/Vector3";
import {Location} from "../level/Location";

export abstract class Entity extends Location{

    static readonly MOTION_THRESHOLD = 0.00001;

    static readonly NETWORK_ID = -1;

    static readonly DATA_TYPE_BYTE = 0;
    static readonly DATA_TYPE_SHORT = 1;
    static readonly DATA_TYPE_INT = 2;
    static readonly DATA_TYPE_FLOAT = 3;
    static readonly DATA_TYPE_STRING = 4;
    static readonly DATA_TYPE_SLOT = 5;
    static readonly DATA_TYPE_POS = 6;
    static readonly DATA_TYPE_LONG = 7;
    static readonly DATA_TYPE_VECTOR3F = 8;

    /*
     * Readers beware: this isn't a nice list. Some of the properties have different types for different entities, and
     * are used for entirely different things.
     */
    static readonly DATA_FLAGS = 0;
    static readonly DATA_HEALTH = 1; //int (minecart/boat)
    static readonly DATA_VARIANT = 2; //int
    static readonly DATA_COLOR = 3;
    static readonly DATA_COLOUR = 3; //byte
    static readonly DATA_NAMETAG = 4; //string
    static readonly DATA_OWNER_EID = 5; //long
    static readonly DATA_TARGET_EID = 6; //long
    static readonly DATA_AIR = 7; //short
    static readonly DATA_POTION_COLOR = 8; //int (ARGB!)
    static readonly DATA_POTION_AMBIENT = 9; //byte
    /* 10 (byte) */
    static readonly DATA_HURT_TIME = 11; //int (minecart/boat)
    static readonly DATA_HURT_DIRECTION = 12; //int (minecart/boat)
    static readonly DATA_PADDLE_TIME_LEFT = 13; //float
    static readonly DATA_PADDLE_TIME_RIGHT = 14; //float
    static readonly DATA_EXPERIENCE_VALUE = 15; //int (xp orb)
    static readonly DATA_MINECART_DISPLAY_BLOCK = 16; //int (id | (data << 16))
    static readonly DATA_HORSE_FLAGS = 16; //int
    /* 16 (byte) used by wither skull */
    static readonly DATA_MINECART_DISPLAY_OFFSET = 17; //int
    static readonly DATA_SHOOTER_ID = 17; //long (used by arrows)
    static readonly DATA_MINECART_HAS_DISPLAY = 18; //byte (must be 1 for minecart to show block inside)
    static readonly DATA_HORSE_TYPE = 19; //byte
    /* 20 (unknown)
     * 21 (unknown) */
    static readonly DATA_CHARGE_AMOUNT = 22; //int8, used for ghasts and also crossbow charging
    static readonly DATA_ENDERMAN_HELD_ITEM_ID = 23; //short
    static readonly DATA_ENTITY_AGE = 24; //short
    /* 25 (int) used by horse, (byte) used by witch */
    static readonly DATA_PLAYER_FLAGS = 26; //byte
    static readonly DATA_PLAYER_INDEX = 27; //int, used for marker colours and agent nametag colours
    static readonly DATA_PLAYER_BED_POSITION = 28; //blockpos
    static readonly DATA_FIREBALL_POWER_X = 29; //float
    static readonly DATA_FIREBALL_POWER_Y = 30;
    static readonly DATA_FIREBALL_POWER_Z = 31;
    /* 32 (unknown)
     * 33 (float) fishing bobber
     * 34 (float) fishing bobber
     * 35 (float) fishing bobber */
    static readonly DATA_POTION_AUX_VALUE = 36; //short
    static readonly DATA_LEAD_HOLDER_EID = 37; //long
    static readonly DATA_SCALE = 38; //float
    static readonly DATA_HAS_NPC_COMPONENT = 39; //byte (???)
    static readonly DATA_NPC_SKIN_INDEX = 40; //string
    static readonly DATA_NPC_ACTIONS = 41; //string (maybe JSON blob?)
    static readonly DATA_MAX_AIR = 42; //short
    static readonly DATA_MARK_VARIANT = 43; //int
    static readonly DATA_CONTAINER_TYPE = 44; //byte (ContainerComponent)
    static readonly DATA_CONTAINER_BASE_SIZE = 45; //int (ContainerComponent)
    static readonly DATA_CONTAINER_EXTRA_SLOTS_PER_STRENGTH = 46; //int (used for llamas, inventory size is baseSize + thisProp * strength)
    static readonly DATA_BLOCK_TARGET = 47; //block coords (ender crystal)
    static readonly DATA_WITHER_INVULNERABLE_TICKS = 48; //int
    static readonly DATA_WITHER_TARGET_1 = 49; //long
    static readonly DATA_WITHER_TARGET_2 = 50; //long
    static readonly DATA_WITHER_TARGET_3 = 51; //long
    /* 52 (short) */
    static readonly DATA_BOUNDING_BOX_WIDTH = 53; //float
    static readonly DATA_BOUNDING_BOX_HEIGHT = 54; //float
    static readonly DATA_FUSE_LENGTH = 55; //int
    static readonly DATA_RIDER_SEAT_POSITION = 56; //vector3f
    static readonly DATA_RIDER_ROTATION_LOCKED = 57; //byte
    static readonly DATA_RIDER_MAX_ROTATION = 58; //float
    static readonly DATA_RIDER_MIN_ROTATION = 59; //float
    static readonly DATA_AREA_EFFECT_CLOUD_RADIUS = 60; //float
    static readonly DATA_AREA_EFFECT_CLOUD_WAITING = 61; //int
    static readonly DATA_AREA_EFFECT_CLOUD_PARTICLE_ID = 62; //int
    /* 63 (int) shulker-related */
    static readonly DATA_SHULKER_ATTACH_FACE = 64; //byte
    /* 65 (short) shulker-related */
    static readonly DATA_SHULKER_ATTACH_POS = 66; //block coords
    static readonly DATA_TRADING_PLAYER_EID = 67; //long

    /* 69 (byte) command-block */
    static readonly DATA_COMMAND_BLOCK_COMMAND = 70; //string
    static readonly DATA_COMMAND_BLOCK_LAST_OUTPUT = 71; //string
    static readonly DATA_COMMAND_BLOCK_TRACK_OUTPUT = 72; //byte
    static readonly DATA_CONTROLLING_RIDER_SEAT_NUMBER = 73; //byte
    static readonly DATA_STRENGTH = 74; //int
    static readonly DATA_MAX_STRENGTH = 75; //int
    /* 76 (int) */
    static readonly DATA_LIMITED_LIFE = 77;
    static readonly DATA_ARMOR_STAND_POSE_INDEX = 78; //int
    static readonly DATA_ENDER_CRYSTAL_TIME_OFFSET = 79; //int
    static readonly DATA_ALWAYS_SHOW_NAMETAG = 80; //byte: -1 = default, 0 = only when looked at, 1 = always
    static readonly DATA_COLOR_2 = 81; //byte
    /* 82 (unknown) */
    static readonly DATA_SCORE_TAG = 83; //string
    static readonly DATA_BALLOON_ATTACHED_ENTITY = 84; //int64, entity unique ID of owner
    static readonly DATA_PUFFERFISH_SIZE = 85; //byte
    static readonly DATA_BOAT_BUBBLE_TIME = 86; //int (time in bubble column)
    static readonly DATA_PLAYER_AGENT_EID = 87; //long
    /* 88 (float) related to panda sitting
     * 89 (float) related to panda sitting */
    static readonly DATA_EAT_COUNTER = 90; //int (used by pandas)
    static readonly DATA_FLAGS2 = 91; //long (extended data flags)
    /* 92 (float) related to panda lying down
     * 93 (float) related to panda lying down */
    static readonly DATA_AREA_EFFECT_CLOUD_DURATION = 94; //int
    static readonly DATA_AREA_EFFECT_CLOUD_SPAWN_TIME = 95; //int
    static readonly DATA_AREA_EFFECT_CLOUD_RADIUS_PER_TICK = 96; //float, usually negative
    static readonly DATA_AREA_EFFECT_CLOUD_RADIUS_CHANGE_ON_PICKUP = 97; //float
    static readonly DATA_AREA_EFFECT_CLOUD_PICKUP_COUNT = 98; //int
    static readonly DATA_INTERACTIVE_TAG = 99; //string (button text)
    static readonly DATA_TRADE_TIER = 100; //int
    static readonly DATA_MAX_TRADE_TIER = 101; //int
    static readonly DATA_TRADE_XP = 102; //int
    static readonly DATA_SKIN_ID = 103; //int ???
    /* 104 (int) related to wither */
    static readonly DATA_COMMAND_BLOCK_TICK_DELAY = 105; //int
    static readonly DATA_COMMAND_BLOCK_EXECUTE_ON_FIRST_TICK = 106; //byte
    static readonly DATA_AMBIENT_SOUND_INTERVAL_MIN = 107; //float
    static readonly DATA_AMBIENT_SOUND_INTERVAL_RANGE = 108; //float
    static readonly DATA_AMBIENT_SOUND_EVENT = 109; //string

    static readonly DATA_FLAG_ONFIRE = 0;
    static readonly DATA_FLAG_SNEAKING = 1;
    static readonly DATA_FLAG_RIDING = 2;
    static readonly DATA_FLAG_SPRINTING = 3;
    static readonly DATA_FLAG_ACTION = 4;
    static readonly DATA_FLAG_INVISIBLE = 5;
    static readonly DATA_FLAG_TEMPTED = 6;
    static readonly DATA_FLAG_INLOVE = 7;
    static readonly DATA_FLAG_SADDLED = 8;
    static readonly DATA_FLAG_POWERED = 9;
    static readonly DATA_FLAG_IGNITED = 10;
    static readonly DATA_FLAG_BABY = 11;
    static readonly DATA_FLAG_CONVERTING = 12;
    static readonly DATA_FLAG_CRITICAL = 13;
    static readonly DATA_FLAG_CAN_SHOW_NAMETAG = 14;
    static readonly DATA_FLAG_ALWAYS_SHOW_NAMETAG = 15;
    static readonly DATA_FLAG_IMMOBILE = 16;
    static readonly DATA_FLAG_NO_AI = 16;
    static readonly DATA_FLAG_SILENT = 17;
    static readonly DATA_FLAG_WALLCLIMBING = 18;
    static readonly DATA_FLAG_CAN_CLIMB = 19;
    static readonly DATA_FLAG_SWIMMER = 20;
    static readonly DATA_FLAG_CAN_FLY = 21;
    static readonly DATA_FLAG_WALKER = 22;
    static readonly DATA_FLAG_RESTING = 23;
    static readonly DATA_FLAG_SITTING = 24;
    static readonly DATA_FLAG_ANGRY = 25;
    static readonly DATA_FLAG_INTERESTED = 26;
    static readonly DATA_FLAG_CHARGED = 27;
    static readonly DATA_FLAG_TAMED = 28;
    static readonly DATA_FLAG_ORPHANED = 29;
    static readonly DATA_FLAG_LEASHED = 30;
    static readonly DATA_FLAG_SHEARED = 31;
    static readonly DATA_FLAG_GLIDING = 32;
    static readonly DATA_FLAG_ELDER = 33;
    static readonly DATA_FLAG_MOVING = 34;
    static readonly DATA_FLAG_BREATHING = 35;
    static readonly DATA_FLAG_CHESTED = 36;
    static readonly DATA_FLAG_STACKABLE = 37;
    static readonly DATA_FLAG_SHOWBASE = 38;
    static readonly DATA_FLAG_REARING = 39;
    static readonly DATA_FLAG_VIBRATING = 40;
    static readonly DATA_FLAG_IDLING = 41;
    static readonly DATA_FLAG_EVOKER_SPELL = 42;
    static readonly DATA_FLAG_CHARGE_ATTACK = 43;
    static readonly DATA_FLAG_WASD_CONTROLLED = 44;
    static readonly DATA_FLAG_CAN_POWER_JUMP = 45;
    static readonly DATA_FLAG_LINGER = 46;
    static readonly DATA_FLAG_HAS_COLLISION = 47;
    static readonly DATA_FLAG_AFFECTED_BY_GRAVITY = 48;
    static readonly DATA_FLAG_FIRE_IMMUNE = 49;
    static readonly DATA_FLAG_DANCING = 50;
    static readonly DATA_FLAG_ENCHANTED = 51;
    static readonly DATA_FLAG_SHOW_TRIDENT_ROPE = 52; // tridents show an animated rope when enchanted with loyalty after they are thrown and return to their owner. To be combined with DATA_OWNER_EID
    static readonly DATA_FLAG_CONTAINER_PRIVATE = 53; //inventory is private, doesn't drop contents when killed if true
    static readonly DATA_FLAG_TRANSFORMING = 54;
    static readonly DATA_FLAG_SPIN_ATTACK = 55;
    static readonly DATA_FLAG_SWIMMING = 56;
    static readonly DATA_FLAG_BRIBED = 57; //dolphins have this set when they go to find treasure for the player
    static readonly DATA_FLAG_PREGNANT = 58;
    static readonly DATA_FLAG_LAYING_EGG = 59;
    static readonly DATA_FLAG_RIDER_CAN_PICK = 60; //???
    static readonly DATA_FLAG_TRANSITION_SITTING = 61;
    static readonly DATA_FLAG_EATING = 62;
    static readonly DATA_FLAG_LAYING_DOWN = 63;
    static readonly DATA_FLAG_SNEEZING = 64;
    static readonly DATA_FLAG_TRUSTING = 65;
    static readonly DATA_FLAG_ROLLING = 66;
    static readonly DATA_FLAG_SCARED = 67;
    static readonly DATA_FLAG_IN_SCAFFOLDING = 68;
    static readonly DATA_FLAG_OVER_SCAFFOLDING = 69;
    static readonly DATA_FLAG_FALL_THROUGH_SCAFFOLDING = 70;
    static readonly DATA_FLAG_BLOCKING = 71; //shield
    static readonly DATA_FLAG_DISABLE_BLOCKING = 72;
    //73 is set when a player is attacked while using shield, unclear on purpose
    //74 related to shield usage, needs further investigation
    static readonly DATA_FLAG_SLEEPING = 75;
    //76 related to sleeping, unclear usage
    static readonly DATA_FLAG_TRADE_INTEREST = 77;
    static readonly DATA_FLAG_DOOR_BREAKER = 78; //...
    static readonly DATA_FLAG_BREAKING_OBSTRUCTION = 79;
    static readonly DATA_FLAG_DOOR_OPENER = 80; //...
    static readonly DATA_FLAG_ILLAGER_CAPTAIN = 81;
    static readonly DATA_FLAG_STUNNED = 82;
    static readonly DATA_FLAG_ROARING = 83;
    static readonly DATA_FLAG_DELAYED_ATTACKING = 84;
    static readonly DATA_FLAG_AVOIDING_MOBS = 85;
    //86 used by RangedAttackGoal
    //87 used by NearestAttackableTargetGoal

    public static entityCount: number = 1;
    private static knownEntities: Entity[] = [];
    private static saveNames: string[][] = [];


    protected hasSpawned: Player[] = [];

    protected id: number;
    protected propertyManager;

    public chunk;

    protected lastDamageCause = null;

    protected blocksAround = [];

    public lastX: number|null = null;
    public lastY: number|null = null;
    public lastZ: number|null = null;

    protected motion: Vector3;
    protected lastMotion: Vector3;
    protected forceMovementUpdate: boolean = false;

    public temporalVector: Vector3;

    public lastYaw: number;
    public lastPitch: number;

    public boundingBox; //TODO
    public onGround: boolean;

    public eyeHeight: number = null;

    public height: number;
    public width: number;

    protected baseOffset: number = 0.0;

    private health: number = 20.0;
    private maxHealth: number = 20;

    //TODO


    protected server: JukeboxServer;
    protected closed: boolean = false;

    constructor(){
        super();
        this.id = Entity.entityCount++;
        // this.server = level.getServer();
    }
}