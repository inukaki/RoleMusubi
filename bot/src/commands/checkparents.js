const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkparents')
    .setDescription('子ロールに紐づく親ロール一覧を表示します')
    .addRoleOption(option =>
      option.setName('childid')
        .setDescription('子ロール')
        .setRequired(true)),

  async execute(interaction) {
    try {
      const childRole = interaction.options.getRole('childid');

      const response = await axios.get(`${process.env.API_BASE_URL}/roles/${childRole.id}/direct-parents`);
      const parentRoles = response.data;

      const embed = new EmbedBuilder()
        .setTitle(`${childRole.name}の親ロール一覧`)
        .setColor('#0099ff')
        .setTimestamp();

      let description = `**${childRole.name}**\n`;

      if (parentRoles.length === 0) {
        description += '親ロール: なし\n';
      } else {
        const parentRoleNames = parentRoles.map(role => {
          const discordRole = interaction.guild.roles.cache.get(role.roleId);
          return discordRole ? `\`${discordRole.name}\`` : '不明なロール';
        });
        description += '親ロール: ' + parentRoleNames.join(' → ') + '\n';
      }

      embed.setDescription(description);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        await interaction.reply('指定された子ロールは存在しません。');
      } else {
        await interaction.reply('エラーが発生しました。');
      }
    }
  },
}; 