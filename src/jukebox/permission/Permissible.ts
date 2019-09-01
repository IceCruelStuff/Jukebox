import {ServerOperator} from "./ServerOperator";

export interface Permissible extends ServerOperator{

    /**
     * Checks if this instance has a permission overridden
     *
     * @param name {string}
     *
     * @return {boolean}
     */
    isPermissionSet(name: string): boolean;

    /**
     * Returns the permission value if overridden, or the default value if not
     *
     * @param name {string
     *
     * @return {boolean}
     */
    hasPermission(name: string): boolean;

    addAttachment()
}