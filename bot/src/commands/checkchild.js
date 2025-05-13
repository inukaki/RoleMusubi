const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkchild')
    .setDescription('親ロールに紐づく子ロール一覧を表示します')
    .addRoleOption(option =>
      option.setName('parentid')
        .setDescription('親ロール')
        .setRequired(true)),

  async execute(interaction) {
    try {
      const parentRole = interaction.options.getRole('parentid');

      const response = await axios.get(`${process.env.API_BASE_URL}/roles/${parentRole.id}/direct-children`);
      const childRoles = response.data;

      const embed = new EmbedBuilder()
        .setTitle(`${parentRole.name}の子ロール一覧`)
        .setColor('#0099ff')
        .setTimestamp();

      let description = `**${parentRole.name}**\n`;

      if (childRoles.length === 0) {
        description += '子ロール: なし\n';
      } else {
        const childRoleNames = childRoles.map(role => {
          const discordRole = interaction.guild.roles.cache.get(role.roleId);
          return discordRole ? discordRole.name : '不明なロール';
        });
        description += '子ロール: ' + childRoleNames.join(', ') + '\n';
      }

      embed.setDescription(description);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        await interaction.reply('指定された親ロールは存在しません。');
      } else {
        await interaction.reply('エラーが発生しました。');
      }
    }
  },
}; 