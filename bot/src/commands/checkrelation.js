const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkrelation')
    .setDescription('サーバーの全ロールとその関連情報を表示します'),

  async execute(interaction) {
    try {
      const guild = interaction.guild;
      const roles = guild.roles.cache;

      const embed = new EmbedBuilder()
        .setTitle('サーバーのロール関連情報')
        .setColor('#0099ff')
        .setTimestamp();

      let description = '';

      for (const [_, role] of roles) {
        if (role.name === '@everyone') continue;

        // 直接的な親ロールの取得
        const parentResponse = await axios.get(`${process.env.API_BASE_URL}/roles/${role.id}/direct-parents`);
        const parentRoles = parentResponse.data;
        
        // 直接的な子ロールの取得
        const childResponse = await axios.get(`${process.env.API_BASE_URL}/roles/${role.id}/direct-children`);
        const childRoles = childResponse.data;
        
        // 関係性がある場合のみ表示
        if (parentRoles.length > 0 || childRoles.length > 0) {
          description += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          description += `**${role.name}**\n`;
          
          if (parentRoles.length > 0) {
            const parentRoleNames = parentRoles.map(r => {
              const discordRole = guild.roles.cache.get(r.roleId);
              return discordRole ? `\`${discordRole.name}\`` : '不明なロール';
            });
            description += '親ロール: ' + parentRoleNames.join(' → ') + '\n';
          }

          if (childRoles.length > 0) {
            const childRoleNames = childRoles.map(r => {
              const discordRole = guild.roles.cache.get(r.roleId);
              return discordRole ? `\`${discordRole.name}\`` : '不明なロール';
            });
            description += '子ロール: ' + childRoleNames.join(' → ') + '\n';
          }
        }
      }

      if (description === '') {
        description = 'ロール間の関連はありません。';
      }

      embed.setDescription(description);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('エラーが発生しました。');
    }
  },
}; 