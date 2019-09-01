export interface ServerOperator {

    /**
     * Checks if the current object has operator permissions
     *
     * @return {boolean}
     */
    isOp(): boolean;

    /**
     * Sets the operator permission for the current object
     *
     * @param value {boolean}
     */
    setOp(value: boolean);
}