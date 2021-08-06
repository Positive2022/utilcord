class Command {
    constructor(properties) {
        this.data = properties.data;
        this.permissions = properties.permissions;

        this.cooldown = properties.cooldown;
        this.execute = properties.execute;
    }
}
