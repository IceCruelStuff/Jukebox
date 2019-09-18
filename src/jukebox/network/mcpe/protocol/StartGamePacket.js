"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataPacket_1 = require("./DataPacket");
const ProtocolInfo_1 = require("./ProtocolInfo");
const GameRule_1 = require("../../../level/GameRule");
const block_ids = require("../../../resources/runtimeid_table.json");
const NetworkBinaryStream_1 = require("../NetworkBinaryStream");
class StartGamePacket extends DataPacket_1.DataPacket {
    constructor() {
        super(...arguments);
        this.generator = 1;
        this.hasAchievementsDisabled = true;
        this.time = -1;
        this.eduMode = false;
        this.hasEduFeaturesEnabled = false;
        this.hasConfirmedPlatformLockedContent = false;
        this.isMultiplayerGame = true;
        this.hasLANBroadcast = true;
        this.xboxLiveBroadcastMode = 0;
        this.platformBroadcastMode = 0;
        this.isTexturePacksRequired = true;
        this.gameRules = [
            new GameRule_1.GameRule(GameRule_1.GameRule.NATURAL_REGENERATION, { 1: false })
        ];
        this.hasBonusChestEnabled = false;
        this.hasStartWithMapEnabled = false;
        this.defaultPlayerPermission = 1; //TODO
        this.serverChunkTickRadius = 4;
        this.hasLockedBehaviorPack = false;
        this.hasLockedResourcePack = false;
        this.isFromLockedWorldTemplate = false;
        this.useMsaGamertagsOnly = false;
        this.isFromWorldTemplate = false;
        this.isWorldTemplateOptionLocked = false;
        this.onlySpawnV1Villagers = false;
        this.levelId = "";
        this.premiumWorldTemplateId = "";
        this.isTrial = false;
        this.currentTick = 0;
        this.enchantmentSeed = 0;
        this.multiplayerCorrelationId = "";
    }
    static getId() {
        return ProtocolInfo_1.ProtocolInfo.START_GAME_PACKET;
    }
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
    blockPalette() {
        let stream = new NetworkBinaryStream_1.NetworkBinaryStream();
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
    handle(session) {
        return session.handleStartGame(this);
    }
}
exports.StartGamePacket = StartGamePacket;
//# sourceMappingURL=StartGamePacket.js.map