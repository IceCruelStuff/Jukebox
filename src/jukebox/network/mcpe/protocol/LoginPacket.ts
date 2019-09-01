import {DataPacket} from "./DataPacket";
import {BinaryStream} from "../../../../binarystream/BinaryStream";
import {Base64} from "../../../utils/Base64";
import {ProtocolInfo} from "./ProtocolInfo";

export class LoginPacket extends DataPacket{

    public username: string;
    public protocol: number;
    public clientUUID: string;
    public clientId: number;
    public xuid: string;
    public identityPublicKey: string;
    public serverAddress: string;
    public locale: string;
    public skipVerification: boolean;

    public chainData = [];
    public clientDataJwt = "";
    public clientData = [];

    static getId(): any {
        return ProtocolInfo.LOGIN_PACKET;
    }

    canBeSentBeforeLogin(): boolean {
        return true;
    }

    mayHaveUnreadBytes(): boolean {
        return this.protocol !== null && this.protocol !== 361;
    }

    _decodePayload() {
        this.protocol = this.getInt();

        try{
            this.decodeConnectionRequest();
        }catch (e) {

            if (this.protocol === 361) {
                //throw e;
                console.log("LoginPacket => same protocol: [CLIENT: => " + this.protocol + " / SERVER => " + 361 + " ]");
            }

            console.log(this.constructor.name + " was thrown while decoding connection request in login (protocol version " + (this.protocol));
        }
    }

    decodeConnectionRequest(){
        let buffer = new BinaryStream(this.get(this.getUnsignedVarInt()));
        this.chainData = JSON.parse(buffer.get(buffer.getLInt()).toString());

        let hasExtraData = false;
        this.chainData["chain"].forEach(chain => {
            let webToken = LoginPacket.decodeJWT(chain);

            // @ts-ignore
            if(isset(webToken["extraData"])){

                if (hasExtraData){
                    // error to handle
                    console.log("Found 'extraData' multiple times in key chain");
                }

                hasExtraData = true;

                // @ts-ignore
                if(isset(webToken["extraData"]["displayName"])){
                    this.username = webToken["extraData"]["displayName"];
                }
                // @ts-ignore
                if(isset(webToken["extraData"]["identity"])){
                    this.clientUUID = webToken["extraData"]["identity"];
                }
                // @ts-ignore
                if(isset(webToken["extraData"]["XUID"])){
                    this.xuid = webToken["extraData"]["XUID"];
                }
            }

            // @ts-ignore
            if(isset(webToken["identityPublicKey"])){
                this.identityPublicKey = webToken["identityPublicKey"];
            }

        });

        this.clientDataJwt = buffer.get(buffer.getLInt()).toString();
        this.clientData = LoginPacket.decodeJWT(this.clientDataJwt);

        // @ts-ignore
        this.clientId = isset(this.clientData["ClientRandomId"]) ? this.clientData["ClientRandomId"] : null;
        // @ts-ignore
        this.serverAddress = isset(this.clientData["ServerAddress"]) ? this.clientData["ServerAddress"] : null;

        // @ts-ignore
        this.locale = isset(this.clientData["LanguageCode"] ? this.clientData["LanguageCode"] : null);
    }


    static decodeJWT(token){
        let [headB64, payloadB64, sigB64] = token.split(".");

        // @ts-ignore
        return JSON.parse(Base64.decode(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), true));
    }

    handle(session): boolean {
        return session.player.handleLogin(this);
    }
}