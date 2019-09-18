import {DataPacket} from "./DataPacket";
import {ProtocolInfo} from "./ProtocolInfo";
import {Vector3} from "../../../math/Vector3";
import {GameRule} from "../../../level/GameRule";
import * as block_ids from "../../../resources/runtimeid_table.json";
import {NetworkBinaryStream} from "../NetworkBinaryStream";

export class StartGamePacket extends DataPacket{

    static getId(): any {
        return ProtocolInfo.START_GAME_PACKET;
    }

    public entityUniqueId: number;
    public entityRuntimeId: number;
    public playerGamemode: number;

    public playerPosition: Vector3;

    public pitch: number;
    public yaw: number;

    public seed: number;
    public dimension: number;
    public generator: number = 1;
    public worldGamemode: number;
    public difficulty: number;
    public spawnX: number;
    public spawnY: number;
    public spawnZ: number;
    public hasAchievementsDisabled: boolean = true;
    public time: number = -1;
    public eduMode: boolean = false;
    public hasEduFeaturesEnabled: boolean = false;
    public rainLevel: number;
    public lightningLevel: number;
    public hasConfirmedPlatformLockedContent: boolean = false;
    public isMultiplayerGame: boolean = true;
    public hasLANBroadcast: boolean = true;
    public xboxLiveBroadcastMode: number = 0;
    public platformBroadcastMode: number = 0;
    public commandsEnabled: boolean;
    public isTexturePacksRequired: boolean = true;
    public gameRules: GameRule[] = [
        new GameRule(GameRule.NATURAL_REGENERATION, {1: false})
    ];
    public hasBonusChestEnabled: boolean = false;
    public hasStartWithMapEnabled: boolean = false;
    public defaultPlayerPermission: number = 1; //TODO

    public serverChunkTickRadius: number = 4;
    public hasLockedBehaviorPack: boolean = false;
    public hasLockedResourcePack: boolean = false;
    public isFromLockedWorldTemplate: boolean = false;
    public useMsaGamertagsOnly: boolean = false;
    public isFromWorldTemplate: boolean = false;
    public isWorldTemplateOptionLocked: boolean = false;
    public onlySpawnV1Villagers: boolean = false;

    public levelId: string = "";
    public worldName: string;
    public premiumWorldTemplateId: string = "";
    public isTrial: boolean = false;
    public currentTick: number = 0;
    public enchantmentSeed: number = 0;
    public multiplayerCorrelationId: string = "";

    _decodePayload() {
        this.entityUniqueId = this.getEntityUniqueId();
        this.entityRuntimeId = this.getEntityRuntimeId();
        this.playerGamemode = this.getVarInt();

        this.playerPosition = this.getVector3();

        this.pitch = this.getLFloat();
        this.yaw = this.getLFloat();

        //Level settings
        this.seed = this.getVarInt();
        this.dimension = this.getVarInt();
        this.generator = this.getVarInt();
        this.worldGamemode = this.getVarInt();
        this.difficulty = this.getVarInt();
        this.getBlockPosition(this.spawnX, this.spawnY, this.spawnZ);
        this.hasAchievementsDisabled = this.getBool();
        this.time = this.getVarInt();
        this.eduMode = this.getBool();
        this.hasEduFeaturesEnabled = this.getBool();
        this.rainLevel = this.getLFloat();
        this.lightningLevel = this.getLFloat();
        this.hasConfirmedPlatformLockedContent = this.getBool();
        this.isMultiplayerGame = this.getBool();
        this.hasLANBroadcast = this.getBool();
        this.xboxLiveBroadcastMode = this.getVarInt();
        this.platformBroadcastMode = this.getVarInt();
        this.commandsEnabled = this.getBool();
        this.isTexturePacksRequired = this.getBool();
        this.gameRules = this.getGameRules();
        this.hasBonusChestEnabled = this.getBool();
        this.hasStartWithMapEnabled = this.getBool();
        this.defaultPlayerPermission = this.getVarInt();
        this.serverChunkTickRadius = this.getLInt();
        this.hasLockedBehaviorPack = this.getBool();
        this.hasLockedResourcePack = this.getBool();
        this.isFromLockedWorldTemplate = this.getBool();
        this.useMsaGamertagsOnly = this.getBool();
        this.isFromWorldTemplate = this.getBool();
        this.isWorldTemplateOptionLocked = this.getBool();
        this.onlySpawnV1Villagers = this.getBool();

        this.levelId = this.getString();
        this.worldName = this.getString();
        this.premiumWorldTemplateId = this.getString();
        this.isTrial = this.getBool();
        this.currentTick = this.getLLong();

        this.enchantmentSeed = this.getVarInt();

        //TODO: BLOCK TABLE

        this.multiplayerCorrelationId = this.getString();
    }

    _encodePayload() {
        this.putEntityUniqueId(this.entityUniqueId);
        this.putEntityRuntimeId(this.entityRuntimeId);
        this.putVarInt(this.playerGamemode);

        this.putVector3(this.playerPosition);

        this.putLFloat(this.pitch);
        this.putLFloat(this.yaw);

        //Level settings
        this.putVarInt(this.seed);
        this.putVarInt(this.dimension);
        this.putVarInt(this.generator);
        this.putVarInt(this.worldGamemode);
        this.putVarInt(this.difficulty);
        this.putBlockPosition(this.spawnX, this.spawnY, this.spawnZ);
        this.putBool(this.hasAchievementsDisabled);
        this.putVarInt(this.time);
        this.putBool(this.eduMode);
        this.putBool(this.hasEduFeaturesEnabled);
        this.putLFloat(this.rainLevel);
        this.putLFloat(this.lightningLevel);
        this.putBool(this.hasConfirmedPlatformLockedContent);
        this.putBool(this.isMultiplayerGame);
        this.putBool(this.hasLANBroadcast);
        this.putVarInt(this.xboxLiveBroadcastMode);
        this.putVarInt(this.platformBroadcastMode);
        this.putBool(this.commandsEnabled);
        this.putBool(this.isTexturePacksRequired);
        this.putGameRules(this.gameRules);
        this.putBool(this.hasBonusChestEnabled);
        this.putBool(this.hasStartWithMapEnabled);
        this.putVarInt(this.defaultPlayerPermission);
        this.putLInt(this.serverChunkTickRadius);
        this.putBool(this.hasLockedBehaviorPack);
        this.putBool(this.hasLockedResourcePack);
        this.putBool(this.isFromLockedWorldTemplate);
        this.putBool(this.useMsaGamertagsOnly);
        this.putBool(this.isFromWorldTemplate);
        this.putBool(this.isWorldTemplateOptionLocked);
        this.putBool(this.onlySpawnV1Villagers);

        this.putString(this.levelId);
        this.putString(this.worldName);
        this.putString(this.premiumWorldTemplateId);
        this.putBool(this.isTrial);
        this.putLLong(this.currentTick);

        this.putVarInt(this.enchantmentSeed);

        //this.append(this.blockPalette());

        this.putString(this.multiplayerCorrelationId);
    }

    blockPalette(): Buffer{
        let stream = new NetworkBinaryStream();

        stream.putUnsignedVarInt(Object.values(block_ids).length);
        Object.values(block_ids).forEach(entry => {
            if (entry.name !== null && entry.data !== null && entry.id !== null) {
                stream.putString(entry.name);
                stream.putLShort(entry.data);
                stream.putLShort(entry.id);
            }
        });

        return stream.getBuffer();
    }

    handle(session): boolean {
        return session.handleStartGame(this);
    }
}