const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const { token } = require("./config.json");

const checkEmpty = (param) => {
  return param ? param : "-";
};

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", async () => {
  console.log("Bot ONLINE. Siapa aja yang pake : ");

  client.guilds.cache.forEach((guild) => {
    console.log(`- ${guild.name}`);
  });

  const slashCommands = [
    {
      name: "garapan",
      description: "Garapan Baru (isi kolom yang perlu aja)",
      options: [
        {
          name: "nama",
          description: "namanya apa",
          type: 3,
          required: true,
        },
        {
          name: "wallet",
          description: "pharse wallet biar gk lupa",
          type: 3,
          required: false,
        },
        {
          name: "email",
          description: "email yang lu pake",
          type: 3,
          required: false,
        },
        {
          name: "username",
          description: "username yang lu pake",
          type: 3,
          required: false,
        },
        {
          name: "password",
          description: "password biar lu gk lupa",
          type: 3,
          required: false,
        },
        {
          name: "link-reff",
          description: "kalo ada link reff",
          type: 3,
          required: false,
        },
      ],
    },
  ];

  try {
    for (const slashCommand of slashCommands) {
      await client.application?.commands.create(slashCommand);
    }
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, guild, channel, member } = interaction;

  const usernameDiscord = member.user.username;

  const checkChannel = async (type, name) => {
    const ch = guild.channels.cache.find(
      (channel) => channel.type === type && channel.name === name
    );

    if (ch.size === 0) {
      console.log(`[${guild.name}] There are no channel in this guild.`);
      return await interaction.reply("There are no channel in this guild.");
    }

    return ch;
  };

  if (channel.name !== "command-tobrt") {
    let ch = await checkChannel(0, "command-tobrt");

    return await interaction.reply(
      `Perintah ini hanya bisa dilakukan di saluran <#${ch.id}>.`
    );
  }

  if (commandName === "garapan") {
    const nama = checkEmpty(options.getString("nama"));
    const wallet = checkEmpty(options.getString("wallet"));
    const email = checkEmpty(options.getString("email"));
    const username = checkEmpty(options.getString("username"));
    const password = checkEmpty(options.getString("password"));
    const linkReff = checkEmpty(options.getString("link-reff"));

    const category = await checkChannel(4, `garapan-${usernameDiscord}`);

    if (!category) {
      await guild.channels.create({
        name: `garapan-${usernameDiscord}`,
        type: ChannelType.GuildCategory,
      });

      console.log(`[${guild.name}] Generate #garapan-${usernameDiscord}.`);

      return await interaction.reply(
        `Kategori **garapan-${usernameDiscord}** gk ada, tapi sekarang udah ada 😮‍💨 isi ulang garapan yang mau lu catet`
      );
    }

    try {
      const newChannel = await guild.channels.create({
        name: nama,
        type: ChannelType.GuildText,
        parent: category.id,
      });

      console.log(`[${guild.name}] Generate #${nama}.`);

      await newChannel.send(
        `# ${nama}\n\n > wallet : ||${wallet}||\n > email : ${email}\n > username : ${username}\n > password : ||${password}||\n > link reff : ${linkReff}`
      );

      await interaction.reply(`Udah ku catet garapan **${nama}** mu`);
    } catch (error) {
      console.error("Error creating channel:", error);
      await interaction.reply("There was an error creating the channel.");
    }
  }
});

client.on("guildCreate", async (guild) => {
  try {
    await guild.channels.create({
      name: "command-tobrt",
      type: ChannelType.GuildText,
    });

    console.log(`[${guild.name}] Generate #command-tobrt.`);
  } catch (error) {
    console.error("Error", error);
  }
});

client.login(token);
