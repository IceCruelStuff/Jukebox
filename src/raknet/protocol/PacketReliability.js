"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketReliability = {
    /*
     * From https://github.com/OculusVR/RakNet/blob/master/Source/PacketPriority.h
     *
     * Default: 0b010 (2) or 0b011 (3)
     */
    UNRELIABLE: 0,
    UNRELIABLE_SEQUENCED: 1,
    RELIABLE: 2,
    RELIABLE_ORDERED: 3,
    RELIABLE_SEQUENCED: 4,
    UNRELIABLE_WITH_ACK_RECEIPT: 5,
    RELIABLE_WITH_ACK_RECEIPT: 6,
    RELIABLE_ORDERED_WITH_ACK_RECEIPT: 7,
    isReliable: function (reliability) {
        return (reliability === exports.PacketReliability.RELIABLE ||
            reliability === exports.PacketReliability.RELIABLE_ORDERED ||
            reliability === exports.PacketReliability.RELIABLE_SEQUENCED ||
            reliability === exports.PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT);
    },
    isSequenced(reliability) {
        return (reliability === exports.PacketReliability.UNRELIABLE_SEQUENCED ||
            reliability === exports.PacketReliability.RELIABLE_SEQUENCED);
    },
    isOrdered(reliability) {
        return (reliability === exports.PacketReliability.RELIABLE_ORDERED ||
            reliability === exports.PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT);
    },
    isSequencedOrOrdered(reliability) {
        return (reliability === exports.PacketReliability.UNRELIABLE_SEQUENCED ||
            reliability === exports.PacketReliability.RELIABLE_ORDERED ||
            reliability === exports.PacketReliability.RELIABLE_SEQUENCED ||
            reliability === exports.PacketReliability.RELIABLE_ORDERED_WITH_ACK_RECEIPT);
    }
};
//# sourceMappingURL=PacketReliability.js.map