declare module 'utilcord' {
    import {
        ApplicationCommandData,
        ApplicationCommandPermissionData,
        Client,
        ClientOptions,
        Collection,
        CommandInteraction,
        CommandInteractionOptionResolver,
        Interaction,
        Snowflake
    } from 'discord.js';

    export interface CommandProperties {
        data: ApplicationCommandData;
        permissions: ApplicationCommandPermissionData;
        cooldown: number;
        execute(
            client: UtilsClient,
            interaction: CommandInteraction,
            options: CommandInteractionOptionResolver
        ): unknown;
    }

    export class UtilsClient extends Client {
        public constructor(options: ClientOptions);

        private commands: Collection<string, Command>;
        private cooldowns: Collection<string, Collection<Snowflake, number>>;

        public loadCommands(commandsDir: string): void;
        public deployCommands(
            token: string,
            clientId: string,
            guildId?: string
        ): Promise<void>;
        public handleCommand(interation: Interaction): unknown;
    }

    export class Command {
        public constructor(properties: CommandProperties);

        public data: ApplicationCommandData;
        public permissions: ApplicationCommandPermissionData;
        public cooldown: number;
    }
}
